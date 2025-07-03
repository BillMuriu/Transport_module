# Authentication & Authorization Components

## Overview

This document provides comprehensive documentation for all components related to authentication and authorization in the Safe Journey transport management system.

## Core Authentication Components

### 1. LoginForm Component

**Location:** `app/authentication/login/page.jsx`

**Purpose:** Handles user authentication with email/password

**Props:**

```typescript
interface LoginFormProps {
  redirectTo?: string;
  onSuccess?: (user: User) => void;
  showSignupLink?: boolean;
}
```

**Key Features:**

- Form validation with Zod schema
- Loading states during authentication
- Error handling and display
- Automatic redirection based on user role
- Remember me functionality

**Usage Example:**

```jsx
import LoginForm from "@/app/authentication/login/page";

function LoginPage() {
  const handleLoginSuccess = (user) => {
    console.log("User logged in:", user);
  };

  return (
    <LoginForm
      redirectTo="/dashboard"
      onSuccess={handleLoginSuccess}
      showSignupLink={true}
    />
  );
}
```

**State Management:**

```javascript
const [formData, setFormData] = useState({
  email: "",
  password: "",
  rememberMe: false,
});
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState("");
```

### 2. AcceptInvitationForm Component

**Location:** `app/authentication/accept-invite/[token]/_components/accept-invitation-form.jsx`

**Purpose:** Handles user registration via invitation token

**Props:**

```typescript
interface AcceptInvitationFormProps {
  token: string;
  invitationData: InvitationData;
  onSuccess?: (user: User) => void;
}
```

**Key Features:**

- Token validation on mount
- Password confirmation validation
- Real-time form validation
- Error handling for expired/invalid tokens
- Automatic login after successful registration

**Usage Example:**

```jsx
import AcceptInvitationForm from "./accept-invitation-form";

function AcceptInvitePage({ params }) {
  return (
    <AcceptInvitationForm
      token={params.token}
      onSuccess={(user) => router.push("/dashboard")}
    />
  );
}
```

### 3. SchoolAdminInviteForm Component

**Location:** `app/authentication/accept-invite/[token]/_components/school-admin-invite-form.jsx`

**Purpose:** Handles school administrator onboarding with school creation

**Props:**

```typescript
interface SchoolAdminInviteFormProps {
  token: string;
  onSuccess?: (school: School, user: User) => void;
}
```

**Key Features:**

- Combined school and user creation
- Multi-step form interface
- School information validation
- Administrator account setup
- Automatic login and school selection

**State Structure:**

```javascript
const [formData, setFormData] = useState({
  school: {
    name: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
    email: "",
  },
  admin: {
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
    phone: "",
  },
});
```

## Authorization Components

### 4. ProtectedRoute Component

**Location:** `components/auth/protected-route.jsx`

**Purpose:** Provides route-level authorization based on user roles

**Props:**

```typescript
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
  requiredPermissions?: string[];
  fallback?: React.ReactNode;
  redirectTo?: string;
}
```

**Key Features:**

- Role-based access control
- Permission-based access control
- Automatic redirection for unauthorized users
- Loading states during authentication check
- Customizable fallback components

**Usage Example:**

```jsx
import ProtectedRoute from "@/components/auth/protected-route";

function AdminDashboard() {
  return (
    <ProtectedRoute
      requiredRoles={["SCHOOL_ADMIN", "SUPER_ADMIN"]}
      redirectTo="/unauthorized"
    >
      <AdminContent />
    </ProtectedRoute>
  );
}
```

### 5. RoleGuard Component

**Location:** `components/auth/role-guard.jsx`

**Purpose:** Conditionally renders content based on user roles/permissions

**Props:**

```typescript
interface RoleGuardProps {
  children: React.ReactNode;
  roles?: UserRole[];
  permissions?: string[];
  fallback?: React.ReactNode;
  inverse?: boolean;
}
```

**Usage Example:**

```jsx
import RoleGuard from "@/components/auth/role-guard";

function AdminPanel() {
  return (
    <div>
      <h1>Dashboard</h1>
      <RoleGuard roles={["SCHOOL_ADMIN"]}>
        <AdminSettings />
      </RoleGuard>
      <RoleGuard permissions={["manage_teachers"]}>
        <TeacherManagement />
      </RoleGuard>
    </div>
  );
}
```

## Layout and Navigation Components

### 6. AuthLayout Component

**Location:** `app/authentication/layout.jsx`

**Purpose:** Provides consistent layout for authentication pages

**Features:**

- Responsive design for auth pages
- Consistent branding and styling
- Loading state management
- Error boundary implementation

**Structure:**

```jsx
function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Logo className="mx-auto h-12 w-auto" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Safe Journey
          </h2>
        </div>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
```

### 7. UserMenu Component

**Location:** `components/navigation/user-menu.jsx`

**Purpose:** Displays user information and logout functionality

**Features:**

- User avatar and name display
- Role indicator
- Logout functionality
- Profile link
- Responsive dropdown menu

**Usage Example:**

```jsx
import UserMenu from "@/components/navigation/user-menu";

function Header() {
  return (
    <header className="bg-white shadow">
      <div className="flex justify-between items-center px-4 py-2">
        <Logo />
        <UserMenu />
      </div>
    </header>
  );
}
```

## Form Components

### 8. PasswordInput Component

**Location:** `components/ui/password-input.jsx`

**Purpose:** Enhanced password input with visibility toggle

**Props:**

```typescript
interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  showStrengthIndicator?: boolean;
  autoComplete?: string;
}
```

**Features:**

- Password visibility toggle
- Strength indicator
- Real-time validation
- Accessibility compliance

### 9. FormField Component

**Location:** `components/forms/form-field.jsx`

**Purpose:** Reusable form field with validation and error display

**Props:**

```typescript
interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
}
```

**Features:**

- Consistent styling across forms
- Error state handling
- Label and input association
- Required field indicators

## Hook Components

### 10. useAuth Hook

**Location:** `hooks/use-auth.js`

**Purpose:** Provides authentication state and methods

**Return Value:**

```typescript
interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<User>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  hasRole: (role: UserRole) => boolean;
  hasPermission: (permission: string) => boolean;
}
```

**Usage Example:**

```jsx
import { useAuth } from "@/hooks/use-auth";

function Dashboard() {
  const { user, isAuthenticated, logout, hasRole } = useAuth();

  if (!isAuthenticated) {
    return <LoginPrompt />;
  }

  return (
    <div>
      <h1>Welcome, {user.firstName}!</h1>
      {hasRole("SCHOOL_ADMIN") && <AdminPanel />}
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### 11. usePermissions Hook

**Location:** `hooks/use-permissions.js`

**Purpose:** Provides permission checking utilities

**Return Value:**

```typescript
interface UsePermissionsReturn {
  permissions: string[];
  hasPermission: (permission: string) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  canAccess: (resource: string, action: string) => boolean;
}
```

## Validation Components

### 12. AuthValidation Schemas

**Location:** `lib/validations/auth.js`

**Purpose:** Zod schemas for authentication form validation

**Schemas:**

```javascript
// Login validation
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

// Registration validation
export const registrationSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
    phone: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// School creation validation
export const schoolSchema = z.object({
  name: z.string().min(2, "School name is required"),
  address: z.string().min(5, "Valid address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, "Invalid ZIP code"),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number"),
  email: z.string().email("Invalid email address"),
});
```

## Utility Components

### 13. TokenValidator Utility

**Location:** `lib/auth/token-validator.js`

**Purpose:** Client-side token validation and management

**Methods:**

```javascript
export const tokenValidator = {
  isTokenValid(token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp > Date.now() / 1000;
    } catch {
      return false;
    }
  },

  getTokenExpiry(token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return new Date(payload.exp * 1000);
    } catch {
      return null;
    }
  },

  shouldRefreshToken(token) {
    const expiry = this.getTokenExpiry(token);
    if (!expiry) return true;

    const now = new Date();
    const timeUntilExpiry = expiry.getTime() - now.getTime();
    return timeUntilExpiry < 5 * 60 * 1000; // Refresh if < 5 minutes
  },
};
```

### 14. RoleMapper Utility

**Location:** `lib/auth/role-mapper.js`

**Purpose:** Maps user roles to permissions and access levels

**Configuration:**

```javascript
export const rolePermissions = {
  SUPER_ADMIN: [
    "view_all_schools",
    "manage_all_schools",
    "create_school_admins",
    "view_system_analytics",
    "manage_system_settings",
  ],
  SCHOOL_ADMIN: [
    "view_school_data",
    "manage_school_settings",
    "invite_teachers",
    "invite_drivers",
    "manage_students",
    "manage_routes",
    "view_school_analytics",
  ],
  TRIP_TEACHER: [
    "create_trips",
    "manage_trips",
    "view_students",
    "send_parent_messages",
    "update_trip_status",
  ],
  DRIVER: ["view_assigned_routes", "update_trip_status", "view_trip_details"],
};

export const getRolePermissions = (role) => rolePermissions[role] || [];

export const hasPermission = (userRoles, requiredPermission) => {
  const userPermissions = userRoles.flatMap((role) => getRolePermissions(role));
  return userPermissions.includes(requiredPermission);
};
```

## Error Handling Components

### 15. AuthErrorBoundary Component

**Location:** `components/auth/auth-error-boundary.jsx`

**Purpose:** Catches and handles authentication-related errors

**Features:**

- Graceful error recovery
- Automatic token refresh attempts
- Fallback UI for auth errors
- Error logging and reporting

**Usage Example:**

```jsx
import AuthErrorBoundary from "@/components/auth/auth-error-boundary";

function App() {
  return (
    <AuthErrorBoundary>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthErrorBoundary>
  );
}
```

## State Management Integration

### 16. Auth Store Connection

**Location:** `stores/useAuthStore.js`

**Purpose:** Central state management for authentication

**Store Structure:**

```javascript
const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      setUser: (user) => set({ user, isAuthenticated: true }),
      setTokens: (token, refreshToken) => set({ token, refreshToken }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      clearAuth: () =>
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          error: null,
        }),

      // Async actions
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.login(credentials);
          set({
            user: response.user,
            token: response.access_token,
            refreshToken: response.refresh_token,
            isAuthenticated: true,
            isLoading: false,
          });
          return response;
        } catch (error) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
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

## Testing Components

### 17. AuthTestUtils

**Location:** `lib/test-utils/auth-test-utils.js`

**Purpose:** Testing utilities for authentication components

**Utilities:**

```javascript
export const authTestUtils = {
  // Mock authenticated user
  mockAuthenticatedUser: (role = "SCHOOL_ADMIN") => ({
    id: 1,
    email: "test@example.com",
    firstName: "Test",
    lastName: "User",
    role,
    isAuthenticated: true,
  }),

  // Mock auth store state
  mockAuthStore: (user = null) => ({
    user,
    isAuthenticated: !!user,
    token: user ? "mock-token" : null,
    login: jest.fn(),
    logout: jest.fn(),
  }),

  // Render with auth context
  renderWithAuth: (component, authState = {}) => {
    const mockStore = { ...authTestUtils.mockAuthStore(), ...authState };
    return render(
      <AuthContext.Provider value={mockStore}>{component}</AuthContext.Provider>
    );
  },
};
```

## Performance Considerations

### Optimization Strategies

1. **Lazy Loading**: Authentication components are loaded only when needed
2. **Memoization**: Role and permission checks are memoized to prevent unnecessary re-renders
3. **Token Caching**: JWT tokens are cached and validated client-side
4. **State Persistence**: Auth state is persisted to prevent re-authentication on page refresh

### Bundle Size Optimization

```javascript
// Dynamic imports for large auth components
const SchoolAdminInviteForm = lazy(() => import("./school-admin-invite-form"));

// Code splitting by route
const AuthRoutes = lazy(() => import("./auth-routes"));
```

## Accessibility Features

### WCAG Compliance

1. **Keyboard Navigation**: All auth forms support full keyboard navigation
2. **Screen Reader Support**: Proper ARIA labels and descriptions
3. **Focus Management**: Focus is managed correctly during auth flows
4. **Error Announcements**: Validation errors are announced to screen readers

### Implementation Example

```jsx
function LoginForm() {
  const [errors, setErrors] = useState({});

  return (
    <form role="form" aria-labelledby="login-heading">
      <h1 id="login-heading">Sign In</h1>

      <div>
        <label htmlFor="email">Email Address</label>
        <input
          id="email"
          type="email"
          aria-describedby={errors.email ? "email-error" : undefined}
          aria-invalid={!!errors.email}
        />
        {errors.email && (
          <div id="email-error" role="alert" aria-live="polite">
            {errors.email}
          </div>
        )}
      </div>
    </form>
  );
}
```
