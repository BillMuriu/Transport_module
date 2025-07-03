# Authentication & Authorization API Endpoints

## Overview

This document details all API endpoints related to authentication, authorization, user management, and invitation handling in the Safe Journey transport management system.

## Base Configuration

```javascript
// API Base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Authentication Headers
const authHeaders = {
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
};
```

## Authentication Endpoints

### 1. User Login

**Endpoint:** `POST /auth/login`

**Description:** Authenticates a user with email/username and password

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (Success - 200):**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "SCHOOL_ADMIN",
    "school_id": 123,
    "is_active": true,
    "created_at": "2024-01-15T10:30:00Z"
  },
  "permissions": ["view_students", "manage_teachers", "create_trips"]
}
```

**Response (Error - 401):**

```json
{
  "error": "Invalid credentials",
  "message": "Email or password is incorrect"
}
```

**Frontend Usage:**

```javascript
const loginUser = async (credentials) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  return response.json();
};
```

### 2. Token Refresh

**Endpoint:** `POST /auth/refresh`

**Description:** Refreshes an expired JWT token using the refresh token

**Request Body:**

```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (Success - 200):**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 3600
}
```

**Frontend Usage:**

```javascript
const refreshToken = async (refreshToken) => {
  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
  return response.json();
};
```

### 3. User Logout

**Endpoint:** `POST /auth/logout`

**Description:** Invalidates the current user session and tokens

**Headers:** Authorization: Bearer {token}

**Response (Success - 200):**

```json
{
  "message": "Successfully logged out"
}
```

**Frontend Usage:**

```javascript
const logoutUser = async (token) => {
  const response = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.json();
};
```

### 4. Verify Token

**Endpoint:** `GET /auth/verify`

**Description:** Verifies if the current token is valid and returns user information

**Headers:** Authorization: Bearer {token}

**Response (Success - 200):**

```json
{
  "valid": true,
  "user": {
    "id": 1,
    "email": "user@example.com",
    "role": "SCHOOL_ADMIN",
    "school_id": 123
  }
}
```

## User Management Endpoints

### 5. Get Current User Profile

**Endpoint:** `GET /auth/me`

**Description:** Retrieves the current authenticated user's profile information

**Headers:** Authorization: Bearer {token}

**Response (Success - 200):**

```json
{
  "id": 1,
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "role": "SCHOOL_ADMIN",
  "school": {
    "id": 123,
    "name": "Springfield Elementary",
    "address": "123 School Street"
  },
  "permissions": ["view_students", "manage_teachers", "create_trips"],
  "last_login": "2024-01-15T09:30:00Z",
  "created_at": "2024-01-01T10:00:00Z"
}
```

### 6. Update User Profile

**Endpoint:** `PUT /auth/me`

**Description:** Updates the current user's profile information

**Headers:** Authorization: Bearer {token}

**Request Body:**

```json
{
  "first_name": "John",
  "last_name": "Smith",
  "phone": "+1234567890"
}
```

**Response (Success - 200):**

```json
{
  "id": 1,
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Smith",
  "phone": "+1234567890",
  "updated_at": "2024-01-15T10:45:00Z"
}
```

## Invitation Management Endpoints

### 7. Create Invitation

**Endpoint:** `POST /invitations/create`

**Description:** Creates a new invitation for a user to join the system

**Headers:** Authorization: Bearer {token}

**Request Body:**

```json
{
  "email": "newuser@example.com",
  "role": "TRIP_TEACHER",
  "school_id": 123,
  "first_name": "Jane",
  "last_name": "Doe",
  "message": "Welcome to Safe Journey!"
}
```

**Response (Success - 201):**

```json
{
  "id": 456,
  "email": "newuser@example.com",
  "role": "TRIP_TEACHER",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_at": "2024-01-22T10:30:00Z",
  "created_by": 1,
  "status": "pending",
  "invitation_url": "https://app.safejourney.com/accept-invite/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 8. Validate Invitation

**Endpoint:** `GET /invitations/validate/{token}`

**Description:** Validates an invitation token and returns invitation details

**Response (Success - 200):**

```json
{
  "valid": true,
  "invitation": {
    "id": 456,
    "email": "newuser@example.com",
    "role": "TRIP_TEACHER",
    "school": {
      "id": 123,
      "name": "Springfield Elementary"
    },
    "invited_by": {
      "name": "John Doe",
      "email": "admin@school.com"
    },
    "expires_at": "2024-01-22T10:30:00Z",
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

**Response (Error - 400):**

```json
{
  "valid": false,
  "error": "invitation_expired",
  "message": "This invitation has expired"
}
```

### 9. Accept Invitation

**Endpoint:** `POST /invitations/accept`

**Description:** Accepts an invitation and creates a new user account

**Request Body:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "password": "securePassword123",
  "password_confirm": "securePassword123",
  "first_name": "Jane",
  "last_name": "Doe",
  "phone": "+1234567890"
}
```

**Response (Success - 201):**

```json
{
  "user": {
    "id": 789,
    "email": "newuser@example.com",
    "first_name": "Jane",
    "last_name": "Doe",
    "role": "TRIP_TEACHER",
    "school_id": 123
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Account created successfully"
}
```

### 10. List Invitations

**Endpoint:** `GET /invitations`

**Description:** Lists all invitations created by the current user

**Headers:** Authorization: Bearer {token}

**Query Parameters:**

- `status`: Filter by invitation status (pending, accepted, expired)
- `role`: Filter by invited user role
- `limit`: Number of results per page (default: 10)
- `offset`: Pagination offset

**Response (Success - 200):**

```json
{
  "count": 25,
  "next": "http://localhost:8000/invitations?limit=10&offset=10",
  "previous": null,
  "results": [
    {
      "id": 456,
      "email": "newuser@example.com",
      "role": "TRIP_TEACHER",
      "status": "pending",
      "expires_at": "2024-01-22T10:30:00Z",
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

## School Admin Onboarding Endpoints

### 11. Create School Admin

**Endpoint:** `POST /onboarding/school-admin`

**Description:** Creates a new school and its first administrator

**Request Body:**

```json
{
  "invitation_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "school": {
    "name": "Springfield Elementary",
    "address": "123 School Street",
    "city": "Springfield",
    "state": "IL",
    "zip_code": "62701",
    "phone": "+1234567890",
    "email": "admin@springfieldelementary.edu"
  },
  "admin": {
    "first_name": "John",
    "last_name": "Doe",
    "password": "securePassword123",
    "password_confirm": "securePassword123",
    "phone": "+1234567890"
  }
}
```

**Response (Success - 201):**

```json
{
  "school": {
    "id": 123,
    "name": "Springfield Elementary",
    "address": "123 School Street",
    "city": "Springfield",
    "state": "IL",
    "zip_code": "62701",
    "created_at": "2024-01-15T10:30:00Z"
  },
  "admin": {
    "id": 1,
    "email": "admin@springfieldelementary.edu",
    "first_name": "John",
    "last_name": "Doe",
    "role": "SCHOOL_ADMIN",
    "school_id": 123
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Permission & Role Endpoints

### 12. Get User Permissions

**Endpoint:** `GET /auth/permissions`

**Description:** Retrieves the current user's permissions

**Headers:** Authorization: Bearer {token}

**Response (Success - 200):**

```json
{
  "permissions": [
    "view_students",
    "manage_teachers",
    "create_trips",
    "view_analytics",
    "manage_routes",
    "send_messages"
  ],
  "role": "SCHOOL_ADMIN",
  "school_permissions": {
    "can_manage_school_settings": true,
    "can_invite_users": true,
    "can_view_all_trips": true
  }
}
```

### 13. Check Specific Permission

**Endpoint:** `GET /auth/permissions/check`

**Description:** Checks if the current user has specific permissions

**Headers:** Authorization: Bearer {token}

**Query Parameters:**

- `permission`: The permission to check (e.g., "manage_teachers")

**Response (Success - 200):**

```json
{
  "has_permission": true,
  "permission": "manage_teachers"
}
```

## Password Management Endpoints

### 14. Request Password Reset

**Endpoint:** `POST /auth/password-reset`

**Description:** Initiates a password reset process

**Request Body:**

```json
{
  "email": "user@example.com"
}
```

**Response (Success - 200):**

```json
{
  "message": "Password reset email sent"
}
```

### 15. Reset Password

**Endpoint:** `POST /auth/password-reset/confirm`

**Description:** Resets the password using a reset token

**Request Body:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "password": "newSecurePassword123",
  "password_confirm": "newSecurePassword123"
}
```

**Response (Success - 200):**

```json
{
  "message": "Password reset successfully"
}
```

### 16. Change Password

**Endpoint:** `POST /auth/change-password`

**Description:** Changes the current user's password

**Headers:** Authorization: Bearer {token}

**Request Body:**

```json
{
  "current_password": "oldPassword123",
  "new_password": "newSecurePassword123",
  "password_confirm": "newSecurePassword123"
}
```

**Response (Success - 200):**

```json
{
  "message": "Password changed successfully"
}
```

## Error Responses

### Common Error Codes

**400 Bad Request:**

```json
{
  "error": "validation_error",
  "message": "Invalid input data",
  "details": {
    "email": ["This field is required"],
    "password": ["Password must be at least 8 characters"]
  }
}
```

**401 Unauthorized:**

```json
{
  "error": "unauthorized",
  "message": "Invalid or expired token"
}
```

**403 Forbidden:**

```json
{
  "error": "insufficient_permissions",
  "message": "You don't have permission to perform this action"
}
```

**404 Not Found:**

```json
{
  "error": "not_found",
  "message": "Resource not found"
}
```

**429 Rate Limited:**

```json
{
  "error": "rate_limited",
  "message": "Too many requests. Please try again later."
}
```

**500 Internal Server Error:**

```json
{
  "error": "server_error",
  "message": "An internal error occurred"
}
```

## Frontend Integration Examples

### Auth Store Integration

```javascript
// useAuthStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,

      login: async (credentials) => {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        });

        if (response.ok) {
          const data = await response.json();
          set({
            user: data.user,
            token: data.access_token,
            refreshToken: data.refresh_token,
            isAuthenticated: true,
          });
          return data;
        }
        throw new Error("Login failed");
      },

      logout: () => {
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        token: state.token,
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
```

### API Client with Auto-Refresh

```javascript
// apiClient.js
const createApiClient = () => {
  const client = axios.create({
    baseURL: API_BASE_URL,
  });

  client.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        const refreshToken = useAuthStore.getState().refreshToken;
        if (refreshToken) {
          try {
            const response = await axios.post("/auth/refresh", {
              refresh_token: refreshToken,
            });
            useAuthStore.getState().setToken(response.data.access_token);
            return client.request(error.config);
          } catch (refreshError) {
            useAuthStore.getState().logout();
            window.location.href = "/login";
          }
        }
      }
      return Promise.reject(error);
    }
  );

  return client;
};
```
