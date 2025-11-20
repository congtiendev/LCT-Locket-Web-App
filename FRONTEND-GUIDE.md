# Frontend Integration Guide - Real-time Features

## 📋 Table of Contents
1. [Installation](#installation)
2. [Socket Connection Setup](#socket-connection-setup)
3. [Real-time Events](#real-time-events)
4. [Implementation Examples](#implementation-examples)
5. [API Updates](#api-updates)
6. [Testing Guide](#testing-guide)

---

## 1. Installation

```bash
npm install socket.io-client
# or
yarn add socket.io-client
```

---

## 2. Socket Connection Setup

### Step 1: Create Socket Hook

Create `src/hooks/useSocket.ts`:

```typescript
import { useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

export const useSocket = (accessToken: string | null) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!accessToken) return;

    const newSocket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000', {
      auth: { token: accessToken },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    newSocket.on('connect', () => {
      console.log('✅ Socket connected');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('🔴 Connection error:', error.message);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [accessToken]);

  const joinPhotoRoom = useCallback((photoId: string) => {
    socket?.emit('photo:join', photoId);
  }, [socket]);

  const leavePhotoRoom = useCallback((photoId: string) => {
    socket?.emit('photo:leave', photoId);
  }, [socket]);

  return { socket, isConnected, joinPhotoRoom, leavePhotoRoom };
};
```

### Step 2: Create Socket Context

Create `src/contexts/SocketContext.tsx`:

```typescript
import React, { createContext, useContext, ReactNode } from 'react';
import { Socket } from 'socket.io-client';
import { useSocket } from '@/hooks/useSocket';
import { useAuth } from '@/hooks/useAuth';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  joinPhotoRoom: (photoId: string) => void;
  leavePhotoRoom: (photoId: string) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { accessToken } = useAuth();
  const socketData = useSocket(accessToken);

  return (
    <SocketContext.Provider value={socketData}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocketContext must be used within SocketProvider');
  }
  return context;
};
```

### Step 3: Wrap Your App

In `src/App.tsx`:

```typescript
import { SocketProvider } from './contexts/SocketContext';

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <YourAppRoutes />
      </SocketProvider>
    </AuthProvider>
  );
}
```

---

## 3. Real-time Events

### Event Types

```typescript
// src/types/socket-events.ts

export interface PhotoUploadedEvent {
  type: 'photo:uploaded';
  data: {
    photo: Photo;
    uploaded_by: string;
  };
  timestamp: string;
}

export interface PhotoReactionEvent {
  type: 'photo:reaction';
  data: {
    photo_id: string;
    reaction: {
      id: string;
      photo_id: string;
      user_id: string;
      emoji: string;
      created_at: string;
    };
  };
  timestamp: string;
}

export interface PhotoReactionUpdatedEvent {
  type: 'photo:reaction:updated';
  data: {
    photo_id: string;
    reaction?: {
      id: string;
      user_id: string;
      emoji: string;
      created_at: string;
    };
    removed?: boolean;
    user_id?: string;
  };
  timestamp: string;
}

export interface PhotoViewedEvent {
  type: 'photo:viewed';
  data: {
    photo_id: string;
    view: {
      id: string;
      photo_id: string;
      user_id: string;
      created_at: string;
    };
  };
  timestamp: string;
}
```

---

## 4. Implementation Examples

### A. Feed Page - Receive New Photos

```typescript
// src/pages/FeedPage.tsx

import { useEffect } from 'react';
import { useSocketContext } from '@/contexts/SocketContext';
import { useFeedStore } from '@/stores/feedStore';
import { toast } from 'sonner'; // or your notification library

export const FeedPage = () => {
  const { socket, isConnected } = useSocketContext();
  const { photos, addPhotoToFeed } = useFeedStore();

  useEffect(() => {
    if (!socket) return;

    const handlePhotoUploaded = (event: any) => {
      console.log('🆕 New photo from friend:', event);

      // Add to top of feed
      addPhotoToFeed(event.data.photo);

      // Show toast notification
      toast.success('New photo from your friend!', {
        description: event.data.photo.caption || 'Check it out!',
        action: {
          label: 'View',
          onClick: () => navigateToPhoto(event.data.photo.id),
        },
      });
    };

    socket.on('photo:uploaded', handlePhotoUploaded);

    return () => {
      socket.off('photo:uploaded', handlePhotoUploaded);
    };
  }, [socket, addPhotoToFeed]);

  return (
    <div className="feed-page">
      <div className="header">
        <h1>Feed</h1>
        <ConnectionStatus isConnected={isConnected} />
      </div>

      <div className="photos-grid">
        {photos.map((photo) => (
          <PhotoCard key={photo.id} photo={photo} />
        ))}
      </div>
    </div>
  );
};
```

### B. Photo Detail Page - Real-time Reactions

```typescript
// src/pages/PhotoDetailPage.tsx

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSocketContext } from '@/contexts/SocketContext';
import { getPhotoById } from '@/api/photos';

export const PhotoDetailPage = () => {
  const { photoId } = useParams<{ photoId: string }>();
  const { socket, joinPhotoRoom, leavePhotoRoom } = useSocketContext();
  const [photo, setPhoto] = useState<any>(null);

  // Fetch initial data
  useEffect(() => {
    if (photoId) {
      getPhotoById(photoId).then(setPhoto);
    }
  }, [photoId]);

  // Join/leave photo room
  useEffect(() => {
    if (photoId) {
      joinPhotoRoom(photoId);
      return () => leavePhotoRoom(photoId);
    }
  }, [photoId, joinPhotoRoom, leavePhotoRoom]);

  // Listen for real-time reaction updates
  useEffect(() => {
    if (!socket || !photoId) return;

    const handleReactionUpdated = (event: any) => {
      if (event.data.photo_id !== photoId) return;

      console.log('⚡ Reaction updated:', event);

      setPhoto((prev: any) => {
        if (!prev) return prev;

        if (event.data.removed) {
          // Remove reaction
          return {
            ...prev,
            reactions_count: Math.max(0, prev.reactions_count - 1),
          };
        } else {
          // Add/update reaction
          return {
            ...prev,
            reactions_count: prev.reactions_count + 1,
          };
        }
      });

      // Show animation or toast
      if (!event.data.removed) {
        showReactionAnimation(event.data.reaction.emoji);
      }
    };

    socket.on('photo:reaction:updated', handleReactionUpdated);

    return () => {
      socket.off('photo:reaction:updated', handleReactionUpdated);
    };
  }, [socket, photoId]);

  if (!photo) return <div>Loading...</div>;

  return (
    <div className="photo-detail">
      <img src={photo.image_url} alt={photo.caption} />

      <div className="stats">
        <span>❤️ {photo.reactions_count}</span>
        <span>👁️ {photo.views_count}</span>
      </div>

      <ReactionPicker photoId={photoId} />
    </div>
  );
};
```

### C. Notifications System

```typescript
// src/hooks/usePhotoNotifications.ts

import { useEffect } from 'react';
import { useSocketContext } from '@/contexts/SocketContext';
import { useNotificationStore } from '@/stores/notificationStore';
import { toast } from 'sonner';

export const usePhotoNotifications = () => {
  const { socket } = useSocketContext();
  const { addNotification } = useNotificationStore();

  useEffect(() => {
    if (!socket) return;

    // Someone reacted to your photo
    const handlePhotoReaction = (event: any) => {
      console.log('💖 Someone reacted to your photo:', event);

      addNotification({
        id: Date.now().toString(),
        type: 'reaction',
        photoId: event.data.photo_id,
        emoji: event.data.reaction.emoji,
        timestamp: event.timestamp,
        read: false,
      });

      toast.success(`${event.data.reaction.emoji} Someone reacted to your photo!`);

      // Play notification sound
      new Audio('/sounds/notification.mp3').play();
    };

    // Someone viewed your photo
    const handlePhotoViewed = (event: any) => {
      console.log('👁️ Someone viewed your photo:', event);

      addNotification({
        id: Date.now().toString(),
        type: 'view',
        photoId: event.data.photo_id,
        timestamp: event.timestamp,
        read: false,
      });
    };

    // Reaction removed
    const handleReactionRemoved = (event: any) => {
      console.log('❌ Reaction removed:', event);

      // Update notification or remove it
      // Implementation depends on your notification system
    };

    socket.on('photo:reaction', handlePhotoReaction);
    socket.on('photo:viewed', handlePhotoViewed);
    socket.on('photo:reaction:removed', handleReactionRemoved);

    return () => {
      socket.off('photo:reaction', handlePhotoReaction);
      socket.off('photo:viewed', handlePhotoViewed);
      socket.off('photo:reaction:removed', handleReactionRemoved);
    };
  }, [socket, addNotification]);
};
```

Use in your app:

```typescript
// src/App.tsx or layout component

function App() {
  usePhotoNotifications(); // Auto-listen for notifications

  return (
    <SocketProvider>
      {/* ... */}
    </SocketProvider>
  );
}
```

### D. Connection Status Indicator

```typescript
// src/components/ConnectionStatus.tsx

import { useSocketContext } from '@/contexts/SocketContext';

export const ConnectionStatus = () => {
  const { isConnected } = useSocketContext();

  return (
    <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
      <span className="dot" />
      <span className="text">
        {isConnected ? 'Live' : 'Offline'}
      </span>
    </div>
  );
};
```

CSS:

```css
.connection-status {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 500;
}

.connection-status.connected {
  background: #e8f5e9;
  color: #2e7d32;
}

.connection-status.disconnected {
  background: #ffebee;
  color: #c62828;
}

.connection-status .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.connection-status.connected .dot {
  background: #4caf50;
}

.connection-status.disconnected .dot {
  background: #f44336;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

---

## 5. API Updates

### New Response Fields

All photo endpoints now return additional fields:

```typescript
interface Photo {
  // ... existing fields ...
  views_count: number;      // ← NEW: Total view count
  has_viewed: boolean;      // ← NEW: Current user viewed?
  reactions_count: number;  // existing
  my_reaction: string | null;
}
```

### New Viewers API

**Get photo viewers (owner only):**

```typescript
// GET /api/photos/:photoId/views?limit=50&offset=0

interface ViewersResponse {
  success: true;
  data: {
    viewers: Array<{
      user_id: string;
      user: {
        id: string;
        name: string;
        username: string;
        avatar: string;
      };
      viewed_at: string;
      reaction: string | null;  // ← NEW: Viewer's reaction emoji
    }>;
    pagination: {
      total: number;
      limit: number;
      offset: number;
      has_more: boolean;
    };
  };
}
```

Example usage:

```typescript
// src/api/photos.ts

export const getPhotoViewers = async (
  photoId: string,
  limit = 50,
  offset = 0
) => {
  const response = await api.get(`/photos/${photoId}/views`, {
    params: { limit, offset },
  });
  return response.data.data;
};
```

### Record Photo View

**POST** `/api/photos/:photoId/views`

Call this when user opens photo detail page:

```typescript
// src/pages/PhotoDetailPage.tsx

useEffect(() => {
  if (photoId) {
    // Record view
    api.post(`/photos/${photoId}/views`).catch(console.error);
  }
}, [photoId]);
```

---

## 6. Testing Guide

### Manual Testing Checklist

**Socket Connection:**
- [ ] Open browser console, verify "Socket connected" message
- [ ] Check connection status indicator shows "Live"
- [ ] Disconnect internet, verify shows "Offline"
- [ ] Reconnect, verify auto-reconnects

**Photo Upload:**
- [ ] Login with 2 accounts (User A & User B, make them friends)
- [ ] User A uploads photo
- [ ] User B should see toast notification instantly
- [ ] User B's feed should update without refresh

**Photo Reactions:**
- [ ] User B opens photo detail
- [ ] User B adds reaction (heart)
- [ ] User A should get notification
- [ ] User B should see reaction count update
- [ ] User C (another friend viewing same photo) should see reaction update instantly

**Photo Views:**
- [ ] User B views User A's photo
- [ ] User A should get notification (if implemented)
- [ ] View count should increment

**Edge Cases:**
- [ ] Test with slow/unstable network
- [ ] Test socket reconnection after disconnect
- [ ] Test with expired JWT token (should fail gracefully)
- [ ] Test with multiple tabs open (same user)

### Automated Testing

```typescript
// src/__tests__/socket.test.ts

import { renderHook, waitFor } from '@testing-library/react';
import { useSocket } from '@/hooks/useSocket';
import { io } from 'socket.io-client';

jest.mock('socket.io-client');

describe('useSocket', () => {
  it('should connect with valid token', async () => {
    const mockSocket = {
      on: jest.fn(),
      close: jest.fn(),
    };

    (io as jest.Mock).mockReturnValue(mockSocket);

    const { result } = renderHook(() => useSocket('valid-token'));

    await waitFor(() => {
      expect(io).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          auth: { token: 'valid-token' },
        })
      );
    });
  });

  it('should not connect without token', () => {
    const { result } = renderHook(() => useSocket(null));
    expect(io).not.toHaveBeenCalled();
  });
});
```

---

## 7. Environment Variables

Add to `.env`:

```bash
# Development
REACT_APP_API_URL=http://localhost:5000

# Production
REACT_APP_API_URL=https://your-api-domain.com
```

---

## 8. Performance Best Practices

### Optimization Tips

1. **Debounce View Tracking:**
```typescript
import { useEffect, useRef } from 'react';

const useTrackPhotoView = (photoId: string) => {
  const tracked = useRef(false);

  useEffect(() => {
    if (!tracked.current && photoId) {
      api.post(`/photos/${photoId}/views`);
      tracked.current = true;
    }
  }, [photoId]);
};
```

2. **Lazy Join Photo Rooms:**
Only join when photo detail is actually visible:

```typescript
useEffect(() => {
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      joinPhotoRoom(photoId);
    } else {
      leavePhotoRoom(photoId);
    }
  });

  observer.observe(photoRef.current);

  return () => observer.disconnect();
}, [photoId]);
```

3. **Memoize Socket Handlers:**
```typescript
const handlePhotoUploaded = useCallback((event) => {
  // handler logic
}, [dependencies]);

useEffect(() => {
  socket?.on('photo:uploaded', handlePhotoUploaded);
  return () => socket?.off('photo:uploaded', handlePhotoUploaded);
}, [socket, handlePhotoUploaded]);
```

---

## 9. Error Handling

```typescript
// src/hooks/useSocket.ts

useEffect(() => {
  if (!socket) return;

  socket.on('connect_error', (error) => {
    console.error('Connection error:', error);

    if (error.message.includes('Authentication')) {
      // Token expired or invalid
      refreshAuthToken().then(() => {
        socket.connect();
      });
    } else {
      // Network error
      toast.error('Connection lost. Trying to reconnect...');
    }
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
    // Log to error tracking service
    Sentry.captureException(error);
  });
}, [socket]);
```

---

## 10. Troubleshooting

### Common Issues

**1. "Socket not connecting"**
- Check if `REACT_APP_API_URL` is correct
- Verify JWT token is valid
- Check browser console for CORS errors

**2. "Events not received"**
- Verify socket is connected: `socket.connected === true`
- Check if event handlers are registered
- Ensure you're in the correct room (for photo-specific events)

**3. "Multiple notifications for same event"**
- Check if you have duplicate event listeners
- Ensure cleanup in useEffect return function

**4. "Socket disconnects frequently"**
- Check network stability
- Verify server is running
- Check for token expiration

---

## 11. Production Deployment

### Nginx Configuration (if using reverse proxy)

```nginx
location /socket.io/ {
    proxy_pass http://backend:5000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```

### Environment-specific URLs

```typescript
// src/config/socket.ts

export const getSocketUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return process.env.REACT_APP_API_URL || 'https://api.yourdomain.com';
  }
  return 'http://localhost:5000';
};
```

---

## 12. Summary Checklist

**Setup:**
- [ ] Install `socket.io-client`
- [ ] Create `useSocket` hook
- [ ] Create `SocketContext` and provider
- [ ] Wrap app with `SocketProvider`
- [ ] Add environment variables

**Implementation:**
- [ ] Listen to `photo:uploaded` in feed page
- [ ] Join/leave photo rooms in detail page
- [ ] Listen to `photo:reaction:updated` for live updates
- [ ] Listen to `photo:reaction` and `photo:viewed` for notifications
- [ ] Add connection status indicator

**Testing:**
- [ ] Test with multiple users
- [ ] Test reconnection
- [ ] Test all real-time events
- [ ] Test error scenarios

---

## 📞 Support

If you encounter any issues:
1. Check browser console for errors
2. Verify backend is running and Socket.IO is initialized
3. Check network tab for WebSocket connection
4. Contact backend team with error logs

---

**Backend Socket.IO is ready to use! 🚀**

Just implement the frontend code above and you'll have real-time features working immediately.
