# Authentication & Authorization Data Flow

## Overview

This document outlines the data flow for authentication and authorization processes in the Safe Journey transport management system, including user login, invitation-based registration, role-based access control, and session management.

## Authentication Data Flows

### 1. User Login Flow

```mermaid
sequenceDiagram
    participant User
    participant LoginForm
    participant AuthStore
    participant API
    participant Database
    participant Router

    User->>LoginForm: Enter credentials
    LoginForm->>LoginForm: Validate form data
    LoginForm->>API: POST /auth/login
    API->>Database: Verify credentials
    Database-->>API: User data + roles
    API-->>LoginForm: JWT token + user info
    LoginForm->>AuthStore: Store auth state
    AuthStore->>Router: Redirect to role dashboard
    Router-->>User: Navigate to appropriate dashboard
```

**Data Elements:**

- **Input**: Username/email, password
- **Processing**: Credential verification, token generation
- **Output**: JWT token, user profile, role information
- **Storage**: Auth store, secure cookies

### 2. Token Refresh Flow

```mermaid
sequenceDiagram
    participant Component
    participant AuthStore
    participant API
    participant Database

    Component->>AuthStore: Check token validity
    AuthStore->>AuthStore: Token expired?
    AuthStore->>API: POST /auth/refresh
    API->>Database: Validate refresh token
    Database-->>API: User session valid
    API-->>AuthStore: New JWT token
    AuthStore->>Component: Continue with request
```

**Data Elements:**

- **Input**: Refresh token
- **Processing**: Token validation, new token generation
- **Output**: New JWT token
- **Storage**: Updated auth store

## Invitation-Based Registration Flows

### 3. Create Invitation Flow

```mermaid
sequenceDiagram
    participant Admin
    participant InviteForm
    participant API
    participant Database
    participant EmailService

    Admin->>InviteForm: Enter invitee details
    InviteForm->>API: POST /invitations/create
    API->>Database: Store invitation record
    API->>Database: Generate secure token
    Database-->>API: Invitation created
    API->>EmailService: Send invitation email
    EmailService-->>Admin: Confirmation sent
    API-->>InviteForm: Success response
```

**Data Elements:**

- **Input**: Email, role, school_id (if applicable)
- **Processing**: Token generation, invitation record creation
- **Output**: Invitation token, email notification
- **Storage**: Invitation table, email queue

### 4. Accept Invitation Flow

```mermaid
sequenceDiagram
    participant User
    participant InvitePage
    participant API
    participant Database
    participant AuthStore
    participant Router

    User->>InvitePage: Click invitation link
    InvitePage->>API: GET /invitations/validate/{token}
    API->>Database: Verify token validity
    Database-->>API: Invitation details
    API-->>InvitePage: Valid invitation data
    User->>InvitePage: Complete registration form
    InvitePage->>API: POST /invitations/accept
    API->>Database: Create user account
    API->>Database: Assign roles
    API->>Database: Mark invitation as used
    Database-->>API: User created
    API-->>InvitePage: Registration success + auth tokens
    InvitePage->>AuthStore: Store auth state
    AuthStore->>Router: Redirect to dashboard
```

**Data Elements:**

- **Input**: Invitation token, user registration data
- **Processing**: Token validation, user creation, role assignment
- **Output**: User account, JWT tokens, role assignments
- **Storage**: User table, auth store

### 5. School Admin Onboarding Flow

```mermaid
sequenceDiagram
    participant NewAdmin
    participant OnboardingForm
    parameter API
    participant Database
    participant SchoolStore
    participant AuthStore

    NewAdmin->>OnboardingForm: Complete school + user info
    OnboardingForm->>API: POST /onboarding/school-admin
    API->>Database: Create school record
    API->>Database: Create admin user
    API->>Database: Link user to school
    API->>Database: Mark invitation as used
    Database-->>API: Complete setup
    API-->>OnboardingForm: Success + auth tokens
    OnboardingForm->>SchoolStore: Store school data
    OnboardingForm->>AuthStore: Store auth state
    AuthStore->>Router: Redirect to admin dashboard
```

**Data Elements:**

- **Input**: School information, admin user details
- **Processing**: School creation, user creation, role assignment
- **Output**: School record, admin user, JWT tokens
- **Storage**: School table, user table, auth store

## Authorization Data Flows

### 6. Role-Based Route Protection

```mermaid
sequenceDiagram
    participant User
    participant Router
    participant RouteGuard
    participant AuthStore
    participant Component

    User->>Router: Navigate to protected route
    Router->>RouteGuard: Check access permissions
    RouteGuard->>AuthStore: Get user roles
    AuthStore-->>RouteGuard: User role data
    RouteGuard->>RouteGuard: Validate role permissions
    alt Authorized
        RouteGuard->>Component: Render protected component
        Component-->>User: Display page content
    else Unauthorized
        RouteGuard->>Router: Redirect to unauthorized
        Router-->>User: Show access denied
    end
```

**Data Elements:**

- **Input**: Route path, user roles
- **Processing**: Permission validation
- **Output**: Access granted/denied
- **Storage**: Route configuration

### 7. API Authorization Flow

```mermaid
sequenceDiagram
    participant Frontend
    participant API
    participant AuthMiddleware
    participant Database
    participant Endpoint

    Frontend->>API: Request with JWT token
    API->>AuthMiddleware: Validate token
    AuthMiddleware->>Database: Verify user session
    Database-->>AuthMiddleware: User + permissions
    AuthMiddleware->>AuthMiddleware: Check endpoint permissions
    alt Authorized
        AuthMiddleware->>Endpoint: Process request
        Endpoint-->>Frontend: Return data
    else Unauthorized
        AuthMiddleware-->>Frontend: 403 Forbidden
    end
```

**Data Elements:**

- **Input**: JWT token, endpoint path
- **Processing**: Token validation, permission checking
- **Output**: API response or error
- **Storage**: User sessions, permission cache

## State Management Data Flow

### 8. Auth Store State Updates

```mermaid
flowchart TD
    A[User Action] --> B{Action Type}
    B -->|Login| C[Store User + Token]
    B -->|Logout| D[Clear All State]
    B -->|Token Refresh| E[Update Token Only]
    B -->|Role Change| F[Update Permissions]

    C --> G[Update localStorage]
    D --> H[Clear localStorage]
    E --> G
    F --> G

    G --> I[Notify Subscribers]
    H --> I
    I --> J[Re-render Components]
```

**State Elements:**

- **user**: Current user information
- **token**: JWT authentication token
- **refreshToken**: Token refresh capability
- **permissions**: User role permissions
- **isAuthenticated**: Authentication status
- **isLoading**: Request processing state

## Error Handling Data Flow

### 9. Authentication Error Flow

```mermaid
sequenceDiagram
    participant User
    participant Component
    participant API
    participant ErrorHandler
    participant AuthStore
    participant Router

    User->>Component: Perform action
    Component->>API: Make authenticated request
    API-->>Component: 401 Unauthorized
    Component->>ErrorHandler: Handle auth error
    ErrorHandler->>AuthStore: Clear auth state
    AuthStore->>Router: Redirect to login
    ErrorHandler->>User: Show error message
    Router-->>User: Display login page
```

**Error Types:**

- **401 Unauthorized**: Invalid or expired token
- **403 Forbidden**: Insufficient permissions
- **422 Validation Error**: Invalid registration data
- **429 Rate Limited**: Too many requests

## Data Persistence

### 10. Session Persistence Flow

```mermaid
flowchart TD
    A[App Initialization] --> B[Check localStorage]
    B --> C{Token Exists?}
    C -->|Yes| D[Validate Token]
    C -->|No| E[Redirect to Login]

    D --> F{Token Valid?}
    F -->|Yes| G[Restore Auth State]
    F -->|No| H[Clear Storage]

    G --> I[Continue to App]
    H --> E
    E --> J[Show Login Form]
```

**Persistence Elements:**

- **localStorage**: JWT token, refresh token
- **sessionStorage**: Temporary session data
- **Cookies**: Secure authentication cookies
- **Memory**: Runtime auth state

## Security Considerations

### Data Protection

- **Token Encryption**: JWT tokens are signed and optionally encrypted
- **Secure Transport**: All authentication data transmitted over HTTPS
- **Storage Security**: Sensitive data stored securely in httpOnly cookies
- **Input Validation**: All user inputs validated on client and server

### Privacy Measures

- **Data Minimization**: Only necessary user data collected
- **Consent Management**: User consent tracked for data processing
- **Audit Logging**: Authentication events logged for security monitoring
- **Data Retention**: User data retained according to privacy policies

## Performance Optimizations

### Caching Strategy

- **Token Caching**: JWT tokens cached for quick validation
- **Permission Caching**: User permissions cached to reduce database queries
- **Session Caching**: User sessions cached for improved performance
- **Route Caching**: Protected route configurations cached

### Lazy Loading

- **Component Loading**: Role-specific components loaded on demand
- **Permission Loading**: User permissions loaded as needed
- **State Hydration**: Auth state hydrated progressively
