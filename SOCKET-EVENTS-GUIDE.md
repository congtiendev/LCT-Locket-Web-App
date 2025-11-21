# 🔌 Socket.IO Real-time Events Guide

## Overview

Hệ thống sử dụng Socket.IO để cung cấp các tính năng real-time. Tất cả events đều được emit tới các rooms cụ thể để đảm bảo chỉ người dùng liên quan mới nhận được thông báo.

---

## 📡 Socket Rooms

### User Rooms

- **Format**: `user:{userId}`
- **Purpose**: Nhận các events liên quan đến user cụ thể
- **Auto-join**: User tự động join vào room của mình khi connect

### Photo Rooms

- **Format**: `photo:{photoId}`
- **Purpose**: Nhận real-time updates khi đang xem một photo cụ thể
- **Manual-join**: Frontend join khi user xem photo, leave khi rời khỏi photo

---

## 🎯 Photo Events

### 1. Photo Uploaded (`photo:uploaded`)

**Mô tả**: Được emit khi user upload photo mới. Tất cả friends của user sẽ nhận được event này.

**Emit to**: `user:{friendId}` (tất cả friends)

**Event data structure**:

```javascript
{
  type: 'photo:uploaded',
  data: {
    photo: {
      id: 'photo-uuid-123',
      user_id: 'user-uuid-456',
      image_url: 'https://...',
      caption: 'Hello world!',
      created_at: '2025-01-20T10:30:00Z',
      // ... other photo fields
    },
    uploaded_by: 'user-uuid-456'
  },
  timestamp: '2025-01-20T10:30:00.123Z'
}
```

**Frontend usage**:

```typescript
socket.on('photo:uploaded', (event) => {
  const { photo, uploaded_by } = event.data;

  // Add photo to feed
  addPhotoToFeed(photo);

  // Show toast notification
  toast.success(`${photo.user.name} uploaded a new photo!`);
});
```

---

### 2. Photo Deleted (`photo:deleted`)

**Mô tả**: Được emit khi user xóa photo. Tất cả friends và người đang xem photo sẽ nhận được event này.

**Emit to**:

- `user:{friendId}` (tất cả friends)
- `photo:{photoId}` (ai đang xem photo)

**Event data structure**:

```javascript
{
  type: 'photo:deleted',
  data: {
    photo_id: 'photo-uuid-123',
    deleted_by: 'user-uuid-456'
  },
  timestamp: '2025-01-20T10:35:00.456Z'
}
```

**Frontend usage**:

```typescript
socket.on('photo:deleted', (event) => {
  const { photo_id, deleted_by } = event.data;

  // Remove photo from feed
  removePhotoFromFeed(photo_id);

  // If viewing this photo, redirect/close
  if (currentPhotoId === photo_id) {
    router.push('/feed');
    toast.info('This photo has been deleted');
  }

  // Update UI
  refreshFeed();
});
```

---

### 3. Photo Reaction (`photo:reaction`)

**Mô tả**: Được emit khi có user react vào photo. Photo owner sẽ nhận được notification.

**Emit to**: `user:{photoOwnerId}` (chủ photo)

**Event data structure**:

```javascript
{
  type: 'photo:reaction',
  data: {
    photo_id: 'photo-uuid-123',
    reaction: {
      id: 'reaction-uuid-789',
      photo_id: 'photo-uuid-123',
      user_id: 'reactor-uuid-456',
      emoji: '❤️',
      created_at: '2025-01-20T10:30:00Z',
      user: {
        id: 'reactor-uuid-456',
        name: 'John Doe',
        username: 'johndoe',
        avatar: 'https://...'
      }
    }
  },
  timestamp: '2025-01-20T10:30:00.789Z'
}
```

**Frontend usage**:

```typescript
socket.on('photo:reaction', (event) => {
  const { photo_id, reaction } = event.data;

  // Add reaction to photo
  addReactionToPhoto(photo_id, reaction);

  // Show notification
  showNotification({
    title: 'New Reaction',
    message: `${reaction.user.name} reacted ${reaction.emoji} to your photo`,
    avatar: reaction.user.avatar,
    onClick: () => router.push(`/photos/${photo_id}`),
  });
});
```

---

### 4. Photo Reaction Updated (`photo:reaction:updated`)

**Mô tả**: Được emit khi reaction được thêm/xóa. Tất cả người đang xem photo sẽ thấy update real-time.

**Emit to**: `photo:{photoId}` (ai đang xem photo)

**Event data structure**:

```javascript
// When reaction added
{
  type: 'photo:reaction:updated',
  data: {
    photo_id: 'photo-uuid-123',
    reaction: {
      id: 'reaction-uuid-789',
      user_id: 'reactor-uuid-456',
      emoji: '❤️',
      // ... reaction data
    }
  },
  timestamp: '2025-01-20T10:30:00.789Z'
}

// When reaction removed
{
  type: 'photo:reaction:updated',
  data: {
    photo_id: 'photo-uuid-123',
    user_id: 'reactor-uuid-456',
    removed: true
  },
  timestamp: '2025-01-20T10:31:00.123Z'
}
```

**Frontend usage**:

```typescript
socket.on('photo:reaction:updated', (event) => {
  const { photo_id, reaction, user_id, removed } = event.data;

  if (removed) {
    // Remove reaction from UI
    removeReactionFromPhoto(photo_id, user_id);
  } else {
    // Add/update reaction
    updatePhotoReaction(photo_id, reaction);
  }

  // Update reaction count
  refreshReactionCount(photo_id);
});
```

---

### 5. Photo Reaction Removed (`photo:reaction:removed`)

**Mô tả**: Được emit khi user xóa reaction. Photo owner nhận event này.

**Emit to**: `user:{photoOwnerId}` (chủ photo)

**Event data structure**:

```javascript
{
  type: 'photo:reaction:removed',
  data: {
    photo_id: 'photo-uuid-123',
    user_id: 'reactor-uuid-456'
  },
  timestamp: '2025-01-20T10:32:00.456Z'
}
```

---

### 6. Photo Viewed (`photo:viewed`)

**Mô tả**: Được emit khi có user xem photo. Chỉ photo owner nhận được.

**Emit to**: `user:{photoOwnerId}` (chủ photo)

**Event data structure**:

```javascript
{
  type: 'photo:viewed',
  data: {
    photo_id: 'photo-uuid-123',
    view: {
      id: 'view-uuid-999',
      photo_id: 'photo-uuid-123',
      user_id: 'viewer-uuid-456',
      viewed_at: '2025-01-20T10:25:00Z',
      user: {
        id: 'viewer-uuid-456',
        name: 'Jane Smith',
        username: 'janesmith',
        avatar: 'https://...'
      }
    }
  },
  timestamp: '2025-01-20T10:25:00.111Z'
}
```

**Frontend usage**:

```typescript
socket.on('photo:viewed', (event) => {
  const { photo_id, view } = event.data;

  // Update view count
  incrementPhotoViewCount(photo_id);

  // Add viewer to list
  addViewerToPhoto(photo_id, view.user);

  // Optional: Show subtle notification
  console.log(`${view.user.name} viewed your photo`);
});
```

---

## 👥 Friend Request Events

### 1. Friend Request Received (`friend:request:received`)

**Mô tả**: Được emit khi có user gửi lời mời kết bạn. Receiver nhận event này.

**Emit to**: `user:{receiverId}` (người nhận lời mời)

**Event data structure**:

```javascript
{
  type: 'friend:request:received',
  data: {
    request: {
      id: 'request-uuid-123',
      sender: {
        id: 'sender-uuid-456',
        name: 'John Doe',
        username: 'johndoe',
        avatar: 'https://...'
      },
      message: 'Hi! Let\'s be friends',
      status: 'pending',
      created_at: '2025-01-20T10:30:00Z'
    }
  },
  timestamp: '2025-01-20T10:30:00.456Z'
}
```

**Frontend usage**:

```typescript
socket.on('friend:request:received', (event) => {
  const { request } = event.data;

  // Add to friend request list
  addFriendRequest(request);

  // Update badge count
  incrementFriendRequestCount();

  // Show notification
  showNotification({
    title: 'New Friend Request',
    message: `${request.sender.name} sent you a friend request`,
    avatar: request.sender.avatar,
    onClick: () => router.push('/friends/requests')
  });

  // Play sound
  playNotificationSound();
});
```

---

### 2. Friend Request Accepted (`friend:request:accepted`)

**Mô tả**: Được emit khi lời mời kết bạn được chấp nhận. Sender nhận event này.

**Emit to**: `user:{senderId}` (người gửi lời mời ban đầu)

**Event data structure**:

```javascript
{
  type: 'friend:request:accepted',
  data: {
    friend: {
      id: 'acceptor-uuid-789',
      name: 'Jane Smith',
      username: 'janesmith',
      avatar: 'https://...'
    }
  },
  timestamp: '2025-01-20T10:35:00.789Z'
}
```

**Frontend usage**:

```typescript
socket.on('friend:request:accepted', (event) => {
  const { friend } = event.data;

  // Add to friends list
  addFriend(friend);

  // Remove from pending requests
  removePendingRequest(friend.id);

  // Show notification
  showNotification({
    title: 'Friend Request Accepted',
    message: `${friend.name} accepted your friend request`,
    avatar: friend.avatar,
    onClick: () => router.push(`/profile/${friend.username}`)
  });

  // Play celebration sound
  playCelebrationSound();
});
```

---

### 3. Friend Request Rejected (`friend:request:rejected`)

**Mô tả**: Được emit khi lời mời kết bạn bị từ chối. Sender nhận event này (optional).

**Emit to**: `user:{senderId}` (người gửi lời mời)

**Event data structure**:

```javascript
{
  type: 'friend:request:rejected',
  data: {
    request_id: 'request-uuid-123'
  },
  timestamp: '2025-01-20T10:36:00.123Z'
}
```

**Frontend usage**:

```typescript
socket.on('friend:request:rejected', (event) => {
  const { request_id } = event.data;

  // Remove from pending requests
  removePendingRequest(request_id);

  // Update UI silently (don't show notification to avoid negative UX)
  updateRequestsList();
});
```

---

### 4. Friend Request Cancelled (`friend:request:cancelled`)

**Mô tả**: Được emit khi sender hủy lời mời kết bạn. Receiver nhận event này.

**Emit to**: `user:{receiverId}` (người nhận lời mời)

**Event data structure**:

```javascript
{
  type: 'friend:request:cancelled',
  data: {
    request_id: 'request-uuid-123'
  },
  timestamp: '2025-01-20T10:37:00.456Z'
}
```

**Frontend usage**:

```typescript
socket.on('friend:request:cancelled', (event) => {
  const { request_id } = event.data;

  // Remove from received requests list
  removeReceivedRequest(request_id);

  // Update badge count
  decrementFriendRequestCount();

  // Update UI
  refreshFriendRequestsList();
});
```

---

## 🔔 Notification Events

Chi tiết về notification events xem tại [NOTIFICATION-INTEGRATION-GUIDE.md](./NOTIFICATION-INTEGRATION-GUIDE.md)

---

## 🚀 Complete Frontend Integration Example

### Setup Socket Connection

```typescript
import io from 'socket.io-client';

const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
  auth: {
    token: accessToken, // JWT token
  },
  transports: ['websocket'],
});

// Connection events
socket.on('connect', () => {
  console.log('✅ Socket connected:', socket.id);
});

socket.on('disconnect', () => {
  console.log('❌ Socket disconnected');
});

socket.on('connect_error', (error) => {
  console.error('🔴 Socket connection error:', error.message);
});
```

### Join Photo Room (when viewing photo)

```typescript
const viewPhoto = (photoId: string) => {
  // Join photo room to receive real-time updates
  socket.emit('join-photo-room', photoId);

  // Load photo data
  loadPhotoDetails(photoId);
};

const leavePhoto = (photoId: string) => {
  // Leave photo room when done viewing
  socket.emit('leave-photo-room', photoId);
};
```

### Register All Event Listeners

```typescript
useEffect(() => {
  if (!socket) return;

  // ========== Photo Events ==========

  // Photo uploaded
  const handlePhotoUploaded = (event: any) => {
    const { photo } = event.data;
    addPhotoToFeed(photo);
    toast.success(`${photo.user.name} uploaded a new photo!`);
  };

  // Photo deleted
  const handlePhotoDeleted = (event: any) => {
    const { photo_id } = event.data;
    removePhotoFromFeed(photo_id);

    if (currentPhotoId === photo_id) {
      router.push('/feed');
      toast.info('This photo has been deleted');
    }
  };

  // Photo reaction
  const handlePhotoReaction = (event: any) => {
    const { photo_id, reaction } = event.data;
    addReactionToPhoto(photo_id, reaction);

    showNotification({
      title: 'New Reaction',
      message: `${reaction.user.name} reacted ${reaction.emoji}`,
      avatar: reaction.user.avatar,
    });
  };

  // Photo reaction updated (real-time for viewers)
  const handleReactionUpdated = (event: any) => {
    const { photo_id, reaction, removed } = event.data;

    if (removed) {
      removeReactionFromPhoto(photo_id, reaction.user_id);
    } else {
      updatePhotoReaction(photo_id, reaction);
    }
  };

  // Photo viewed
  const handlePhotoViewed = (event: any) => {
    const { photo_id, view } = event.data;
    incrementPhotoViewCount(photo_id);
    addViewerToPhoto(photo_id, view.user);
  };

  // ========== Friend Request Events ==========

  // Friend request received
  const handleFriendRequestReceived = (event: any) => {
    const { request } = event.data;
    addFriendRequest(request);
    incrementFriendRequestCount();

    showNotification({
      title: 'New Friend Request',
      message: `${request.sender.name} sent you a friend request`,
      avatar: request.sender.avatar,
      onClick: () => router.push('/friends/requests'),
    });

    playNotificationSound();
  };

  // Friend request accepted
  const handleFriendRequestAccepted = (event: any) => {
    const { friend } = event.data;
    addFriend(friend);
    removePendingRequest(friend.id);

    showNotification({
      title: 'Friend Request Accepted',
      message: `${friend.name} accepted your friend request`,
      avatar: friend.avatar,
      onClick: () => router.push(`/profile/${friend.username}`),
    });

    playCelebrationSound();
  };

  // Friend request rejected
  const handleFriendRequestRejected = (event: any) => {
    const { request_id } = event.data;
    removePendingRequest(request_id);
    updateRequestsList();
  };

  // Friend request cancelled
  const handleFriendRequestCancelled = (event: any) => {
    const { request_id } = event.data;
    removeReceivedRequest(request_id);
    decrementFriendRequestCount();
    refreshFriendRequestsList();
  };

  // Register photo listeners
  socket.on('photo:uploaded', handlePhotoUploaded);
  socket.on('photo:deleted', handlePhotoDeleted);
  socket.on('photo:reaction', handlePhotoReaction);
  socket.on('photo:reaction:updated', handleReactionUpdated);
  socket.on('photo:viewed', handlePhotoViewed);

  // Register friend request listeners
  socket.on('friend:request:received', handleFriendRequestReceived);
  socket.on('friend:request:accepted', handleFriendRequestAccepted);
  socket.on('friend:request:rejected', handleFriendRequestRejected);
  socket.on('friend:request:cancelled', handleFriendRequestCancelled);

  // Cleanup
  return () => {
    // Remove photo listeners
    socket.off('photo:uploaded', handlePhotoUploaded);
    socket.off('photo:deleted', handlePhotoDeleted);
    socket.off('photo:reaction', handlePhotoReaction);
    socket.off('photo:reaction:updated', handleReactionUpdated);
    socket.off('photo:viewed', handlePhotoViewed);

    // Remove friend request listeners
    socket.off('friend:request:received', handleFriendRequestReceived);
    socket.off('friend:request:accepted', handleFriendRequestAccepted);
    socket.off('friend:request:rejected', handleFriendRequestRejected);
    socket.off('friend:request:cancelled', handleFriendRequestCancelled);
  };
}, [socket]);
```

---

## 🧪 Testing Socket Events

Use the test file at [test-socket.html](./test-socket.html) to test Socket.IO connectivity and view real-time events.

```bash
# Open in browser
open test-socket.html
```

---

## 📝 Notes

1. **Auto-reconnection**: Socket.IO automatically reconnects if connection is lost
2. **Room management**: Users auto-join their personal room (`user:{userId}`) on connect
3. **Photo rooms**: Must manually join/leave when viewing specific photos
4. **Error handling**: Always handle socket errors gracefully - don't break UI if socket fails
5. **Authentication**: Socket connection requires valid JWT token in auth header

---

## 🔗 Related Documentation

- [NOTIFICATION-INTEGRATION-GUIDE.md](./NOTIFICATION-INTEGRATION-GUIDE.md) - Chi tiết về notification system
- [test-socket.html](./test-socket.html) - Testing tool cho Socket.IO
