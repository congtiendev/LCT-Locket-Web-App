# User API

## Get All Users (Admin Only)

**GET** `/api/users`

Get list of all users with pagination.

### Headers
```
Authorization: Bearer <admin-access-token>
```

### Query Parameters
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `search` (optional): Search by name or email
- `role` (optional): Filter by role (USER, ADMIN, MODERATOR)
- `status` (optional): Filter by status (ACTIVE, INACTIVE, SUSPENDED)

### Response
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": {
    "data": [
      {
        "id": "uuid",
        "email": "user@example.com",
        "name": "User Name",
        "role": "USER",
        "status": "ACTIVE"
      }
    ],
    "pagination": {
      "total": 100,
      "page": 1,
      "limit": 20,
      "totalPages": 5
    }
  }
}
```

## Get User Profile

**GET** `/api/users/profile`

Get current user's profile.

### Headers
```
Authorization: Bearer <access-token>
```

### Response
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "User Name",
    "role": "USER",
    "avatar": "/uploads/avatar.jpg"
  }
}
```

## Update Profile

**PUT** `/api/users/profile`

Update current user's profile.

### Headers
```
Authorization: Bearer <access-token>
```

### Request Body
```json
{
  "name": "New Name",
  "phone": "+84123456789"
}
```

### Response
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "New Name",
    "phone": "+84123456789"
  }
}
```

## Upload Avatar

**POST** `/api/users/profile/avatar`

Upload user avatar.

### Headers
```
Authorization: Bearer <access-token>
Content-Type: multipart/form-data
```

### Form Data
- `avatar`: Image file (max 5MB)

### Response
```json
{
  "success": true,
  "message": "Avatar uploaded successfully",
  "data": {
    "avatar": "/uploads/avatars/uuid.jpg"
  }
}
```
