# Auth API

## Register

**POST** `/api/auth/register`

Register a new user account.

### Request Body
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Response
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid",
      "email": "john@example.com",
      "name": "John Doe"
    },
    "tokens": {
      "accessToken": "jwt-token",
      "refreshToken": "refresh-token"
    }
  }
}
```

## Login

**POST** `/api/auth/login`

Login with email and password.

### Request Body
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Response
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "email": "john@example.com",
      "name": "John Doe"
    },
    "tokens": {
      "accessToken": "jwt-token",
      "refreshToken": "refresh-token"
    }
  }
}
```

## Refresh Token

**POST** `/api/auth/refresh-token`

Refresh access token using refresh token.

### Request Body
```json
{
  "refreshToken": "refresh-token"
}
```

### Response
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "new-jwt-token"
  }
}
```

## Get Profile

**GET** `/api/auth/me`

Get current user profile (requires authentication).

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
    "email": "john@example.com",
    "name": "John Doe",
    "role": "USER",
    "status": "ACTIVE"
  }
}
```
