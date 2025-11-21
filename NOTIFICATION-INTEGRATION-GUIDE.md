# 🔔 Notification System - Frontend Integration Guide

## Overview

Backend đã implement hệ thống notification real-time kết hợp Socket.IO và database persistence. Mỗi khi có ai đó react vào photo của user, hệ thống sẽ:

1. **Lưu notification vào database** (để xem lại sau)
2. **Gửi real-time notification qua Socket.IO** (nhận ngay lập tức)

---

## 📊 Database Schema

### Notification Model

```prisma
model Notification {
  id             String           // UUID
  userId         String           // User nhận notification
  type           NotificationType // "reaction", "friend_request", etc.
  title          String           // Notification title
  message        String?          // Message content
  data           Json?            // Flexible data (emoji, reactor info, etc.)
  relatedUserId  String?          // User gây ra notification
  relatedItemId  String?          // Photo ID, Friend Request ID, etc.
  imageUrl       String?          // Optional image
  actionUrl      String?          // Deep link URL
  isRead         Boolean          // Read status
  readAt         DateTime?        // When read
  createdAt      DateTime         // When created
  updatedAt      DateTime         // Last update
}
```

### Notification Types

```typescript
enum NotificationType {
  'friend_request'   // Lời mời kết bạn
  'friend_accepted'  // Chấp nhận kết bạn
  'photo_uploaded'   // Bạn bè upload photo mới
  'reaction'         // Ai đó react vào photo của bạn
  'photo_view'       // Ai đó xem photo của bạn
  'message'          // Tin nhắn mới
}
```

---

## 🎯 Photo Reaction Notification

### Backend Behavior

Khi User B react vào photo của User A:

```
User B → POST /api/photos/{photoId}/reactions { emoji: "❤️" }
   ↓
Backend:
1. Save reaction to database
2. Create notification record for User A
3. Emit real-time socket event to User A
   ↓
User A receives notification (both database + real-time)
```

### Notification Data Structure

**Database notification:**
```json
{
  "id": "notif-uuid-123",
  "userId": "user-a-id",
  "type": "reaction",
  "title": "",
  "message": "",
  "data": {
    "message": "reacted ❤️ to your photo",
    "emoji": "❤️",
    "reactor": {
      "id": "user-b-id",
      "name": "John Doe",
      "username": "johndoe",
      "avatar": "https://..."
    }
  },
  "relatedUserId": "user-b-id",
  "relatedItemId": "photo-uuid-123",
  "isRead": false,
  "readAt": null,
  "createdAt": "2025-01-20T10:30:00Z",
  "updatedAt": "2025-01-20T10:30:00Z"
}
```

**Socket.IO real-time event:**
```javascript
// Event name: 'photo:reaction'
{
  "type": "photo:reaction",
  "data": {
    "photo_id": "photo-uuid-123",
    "reaction": {
      "id": "reaction-uuid",
      "photo_id": "photo-uuid-123",
      "user_id": "user-b-id",
      "emoji": "❤️",
      "created_at": "2025-01-20T10:30:00Z",
      "user": {
        "id": "user-b-id",
        "name": "John Doe",
        "username": "johndoe",
        "avatar": "https://..."
      }
    }
  },
  "timestamp": "2025-01-20T10:30:00.123Z"
}
```

---

## 📱 Frontend Implementation

### 1. Setup Notification State

```typescript
// src/store/notificationStore.ts (Zustand example)

interface Notification {
  id: string;
  type: 'reaction' | 'friend_request' | 'photo_uploaded' | 'friend_accepted' | 'photo_view' | 'message';
  data: {
    message: string;
    emoji?: string;
    reactor?: {
      id: string;
      name: string;
      username: string;
      avatar: string;
    };
  };
  relatedUserId?: string;
  relatedItemId?: string; // Photo ID
  isRead: boolean;
  readAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;

  addNotification: (notification: Notification) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  fetchNotifications: () => Promise<void>;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  unreadCount: 0,

  addNotification: (notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));
  },

  markAsRead: async (notificationId) => {
    await api.patch(`/notifications/${notificationId}/read`);
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === notificationId ? { ...n, isRead: true, readAt: new Date().toISOString() } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    }));
  },

  markAllAsRead: async () => {
    await api.patch('/notifications/read-all');
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true, readAt: new Date().toISOString() })),
      unreadCount: 0,
    }));
  },

  fetchNotifications: async () => {
    const response = await api.get('/notifications');
    set({
      notifications: response.data.notifications,
      unreadCount: response.data.unread_count,
    });
  },
}));
```

### 2. Listen for Real-time Notifications

```typescript
// src/hooks/useNotifications.ts

import { useEffect } from 'react';
import { useSocketContext } from '@/contexts/SocketContext';
import { useNotificationStore } from '@/store/notificationStore';
import { toast } from 'sonner'; // or your toast library

export const useNotifications = () => {
  const { socket } = useSocketContext();
  const { addNotification, fetchNotifications, unreadCount } = useNotificationStore();

  // Fetch initial notifications on mount
  useEffect(() => {
    fetchNotifications();
  }, []);

  // Listen for real-time photo reaction notifications
  useEffect(() => {
    if (!socket) return;

    const handlePhotoReaction = (event: any) => {
      console.log('🔔 Received photo reaction notification:', event);

      const { photo_id, reaction } = event.data;

      // Create notification object
      const notification = {
        id: Date.now().toString(), // Temporary ID, will be replaced when fetching from API
        type: 'reaction' as const,
        data: {
          message: `${reaction.user.name} reacted ${reaction.emoji} to your photo`,
          emoji: reaction.emoji,
          reactor: reaction.user,
        },
        relatedUserId: reaction.user_id,
        relatedItemId: photo_id,
        isRead: false,
        createdAt: event.timestamp,
        updatedAt: event.timestamp,
      };

      // Add to store
      addNotification(notification);

      // Show toast notification
      toast.success(
        <div className="flex items-center gap-3">
          <img
            src={reaction.user.avatar}
            alt={reaction.user.name}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="font-semibold">{reaction.user.name}</p>
            <p className="text-sm text-gray-600">
              Reacted {reaction.emoji} to your photo
            </p>
          </div>
        </div>,
        {
          duration: 4000,
          action: {
            label: 'View',
            onClick: () => {
              // Navigate to photo
              window.location.href = `/photos/${photo_id}`;
            },
          },
        }
      );

      // Play notification sound
      const audio = new Audio('/sounds/notification.mp3');
      audio.play().catch(console.error);

      // Show browser notification (if permission granted)
      if (Notification.permission === 'granted') {
        new Notification(`${reaction.user.name} reacted to your photo`, {
          body: `Reacted ${reaction.emoji} to your photo`,
          icon: reaction.user.avatar,
          badge: '/logo.png',
          tag: `reaction-${photo_id}`,
        });
      }
    };

    socket.on('photo:reaction', handlePhotoReaction);

    return () => {
      socket.off('photo:reaction', handlePhotoReaction);
    };
  }, [socket, addNotification]);

  return {
    unreadCount,
  };
};
```

### 3. Notification Bell Component

```typescript
// src/components/NotificationBell.tsx

import { Bell } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import { useNotificationStore } from '@/store/notificationStore';

export const NotificationBell = () => {
  const { unreadCount } = useNotifications();
  const { notifications, markAsRead, markAllAsRead } = useNotificationStore();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button className="relative">
          <Bell className="w-6 h-6" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-0">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-sm text-blue-600 hover:underline"
            >
              Mark all as read
            </button>
          )}
        </div>

        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No notifications yet</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onRead={() => markAsRead(notification.id)}
              />
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
```

### 4. Notification Item Component

```typescript
// src/components/NotificationItem.tsx

interface NotificationItemProps {
  notification: Notification;
  onRead: () => void;
}

export const NotificationItem = ({ notification, onRead }: NotificationItemProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!notification.isRead) {
      onRead();
    }

    // Navigate based on type
    if (notification.type === 'reaction' && notification.relatedItemId) {
      navigate(`/photos/${notification.relatedItemId}`);
    } else if (notification.type === 'friend_request' && notification.relatedItemId) {
      navigate(`/friends/requests`);
    }
  };

  const getNotificationIcon = () => {
    switch (notification.type) {
      case 'reaction':
        return <span className="text-2xl">{notification.data.emoji}</span>;
      case 'friend_request':
        return <UserPlus className="w-6 h-6 text-blue-500" />;
      case 'photo_uploaded':
        return <Camera className="w-6 h-6 text-green-500" />;
      default:
        return <Bell className="w-6 h-6 text-gray-500" />;
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`
        flex items-start gap-3 p-4 cursor-pointer hover:bg-gray-50 transition
        ${!notification.isRead ? 'bg-blue-50' : ''}
      `}
    >
      {/* Avatar or Icon */}
      {notification.data.reactor ? (
        <img
          src={notification.data.reactor.avatar}
          alt={notification.data.reactor.name}
          className="w-12 h-12 rounded-full object-cover"
        />
      ) : (
        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
          {getNotificationIcon()}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm">
          {notification.data.reactor && (
            <span className="font-semibold">{notification.data.reactor.name}</span>
          )}
          {' '}
          <span className="text-gray-700">{notification.data.message}</span>
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
        </p>
      </div>

      {/* Unread indicator */}
      {!notification.isRead && (
        <div className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0 mt-2" />
      )}
    </div>
  );
};
```

### 5. Request Notification Permission

```typescript
// src/utils/notifications.ts

export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

// Call this when user logs in or in App.tsx
export const initializeNotifications = async () => {
  const hasPermission = await requestNotificationPermission();
  if (hasPermission) {
    console.log('✅ Browser notifications enabled');
  }
};
```

### 6. Use in App

```typescript
// src/App.tsx

function App() {
  useNotifications(); // Auto-setup notification listeners

  useEffect(() => {
    initializeNotifications();
  }, []);

  return (
    <SocketProvider>
      <div className="app">
        <Header>
          <NotificationBell />
        </Header>
        <Routes>
          {/* ... */}
        </Routes>
      </div>
    </SocketProvider>
  );
}
```

---

## 🔌 REST API Endpoints

### Get Notifications

```typescript
GET /api/notifications?is_read=false&limit=20&offset=0

Response:
{
  "success": true,
  "data": {
    "notifications": [...],
    "unread_count": 5,
    "pagination": {
      "limit": 20,
      "offset": 0,
      "has_more": false
    }
  }
}
```

### Mark Notification as Read

```typescript
PATCH /api/notifications/:notificationId/read

Response:
{
  "success": true,
  "data": {
    "message": "Notification marked as read"
  }
}
```

### Mark All as Read

```typescript
PATCH /api/notifications/read-all

Response:
{
  "success": true,
  "data": {
    "message": "All notifications marked as read",
    "count": 5
  }
}
```

### Delete Notification

```typescript
DELETE /api/notifications/:notificationId

Response:
{
  "success": true,
  "data": {
    "message": "Notification deleted"
  }
}
```

---

## 🎨 UI/UX Recommendations

### Toast Notifications

**React Hot Toast:**
```typescript
toast.custom((t) => (
  <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} ...`}>
    <div className="flex items-center gap-3">
      <img src={reactor.avatar} className="w-10 h-10 rounded-full" />
      <div>
        <p className="font-semibold">{reactor.name}</p>
        <p className="text-sm">Reacted {emoji} to your photo</p>
      </div>
    </div>
  </div>
));
```

### Sound Effects

Place notification sound in `public/sounds/notification.mp3`

**Recommended sounds:**
- iOS notification sound
- Subtle "pop" or "ding"
- Duration: 0.5-1 second

### Badge Count

Show unread count on:
- Notification bell icon
- App icon (using PWA badge API)
- Browser tab title

```typescript
// Update tab title
useEffect(() => {
  if (unreadCount > 0) {
    document.title = `(${unreadCount}) Locket`;
  } else {
    document.title = 'Locket';
  }
}, [unreadCount]);

// PWA badge API
if ('setAppBadge' in navigator) {
  navigator.setAppBadge(unreadCount);
}
```

---

## 🧪 Testing

### Manual Test Flow

1. **Setup:**
   - Login với 2 accounts (User A & User B)
   - User A và User B phải là friends

2. **Test notification creation:**
   - User A upload 1 photo
   - User B react vào photo đó (POST `/photos/:id/reactions`)

3. **Verify:**
   - ✅ User A nhận real-time notification (socket event)
   - ✅ Toast notification hiện lên
   - ✅ Notification bell badge tăng lên
   - ✅ Sound được play
   - ✅ Browser notification hiện (nếu có permission)
   - ✅ GET `/notifications` trả về notification mới

4. **Test mark as read:**
   - Click vào notification
   - ✅ Navigate to photo detail
   - ✅ Notification được mark as read
   - ✅ Badge count giảm

### Automated Tests

```typescript
describe('Notification System', () => {
  it('should receive real-time notification when someone reacts', async () => {
    const socket = io(SERVER_URL, { auth: { token: accessToken } });

    const notificationPromise = new Promise((resolve) => {
      socket.on('photo:reaction', resolve);
    });

    // Trigger reaction from another user
    await api.post(`/photos/${photoId}/reactions`, { emoji: '❤️' });

    const notification = await notificationPromise;

    expect(notification.data.reaction.emoji).toBe('❤️');
  });
});
```

---

## 📊 Analytics Events

Track these events for analytics:

```typescript
// When notification received
analytics.track('notification_received', {
  type: 'reaction',
  photo_id: photoId,
  reactor_id: reactorId,
});

// When notification clicked
analytics.track('notification_clicked', {
  notification_id: notificationId,
  type: 'reaction',
});

// When marked as read
analytics.track('notification_read', {
  notification_id: notificationId,
});
```

---

## 🚀 Performance Tips

1. **Pagination:** Load notifications in batches of 20
2. **Cache:** Cache notifications in memory (Zustand/Redux)
3. **Debounce:** Debounce marking as read to avoid excessive API calls
4. **Lazy load:** Only fetch notifications when bell is clicked
5. **Optimize renders:** Use React.memo for NotificationItem

---

## 🎯 Summary

✅ **Backend ready:**
- Notification records saved to database
- Real-time events via Socket.IO
- REST API for CRUD operations

✅ **Frontend needs to:**
- Setup notification store (state management)
- Listen to `photo:reaction` socket event
- Fetch notifications from API
- Display toast + update badge
- Mark as read when clicked

---

**Backend is 100% ready! Just implement the frontend code above and notifications will work immediately.** 🚀
