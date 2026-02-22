# Route Definitions

Centralize all routes as constants to eliminate hardcoded URL strings scattered throughout your codebase.

## The Problem

Hardcoded route strings make refactoring painful and error-prone:

```typescript
// ❌ Routes scattered everywhere
<Link href="/dashboard">Dashboard</Link>
<Link href="/dashboard/settings">Settings</Link>

const response = await fetch("/api/users/me");
const redirectUrl = "/login";
```

Change `/dashboard` to `/app`? You'll miss strings and create bugs.

**Solution:** Define all routes once, use everywhere via constants.

## How It Works

All routes are defined in one place with clear organization:

```typescript
// constants/routes.constant.ts

// Public routes that do not require authentication
export const PUBLIC_ROUTES = {
  HOME: "/",
} as const;

// Authentication-related routes
export const AUTH_ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
} as const;

// Protected routes that require authentication
export const PROTECTED_ROUTES = {
  DASHBOARD: "/dashboard",
} as const;

// API routes
export const API_ROUTES = {
  USERS_ME: "/api/users/me",
  SEND_EMAIL: "/api/send",
  HEALTH: "/api/health",
} as const;
```

## Default Redirects

Centralized redirect destinations:

```typescript
// When authenticated user tries to access auth pages
export const DEFAULT_AUTH_REDIRECT = PROTECTED_ROUTES.DASHBOARD; // "/dashboard"

// When unauthenticated user tries to access protected pages
export const DEFAULT_UNAUTH_REDIRECT = AUTH_ROUTES.LOGIN; // "/login"
```

## Real-World Usage

### In Middleware

```typescript
// proxy.ts
import { PROTECTED_ROUTE_PATTERNS } from "@/constants/routes.constant";

export async function proxy(request: NextRequest) {
  return await updateSession(request, PROTECTED_ROUTE_PATTERNS);
}
```

### In Services

```typescript
// services/profile.service.ts
import { API_ROUTES } from "@/constants/routes.constant";

export const profileService = {
  me: async (): Promise<SelectProfile | null> => {
    const response = await fetch(API_ROUTES.USERS_ME);

    if (response.status === 401) return null;
    const json = await response.json();
    if (!response.ok) throw new Error(json.error);
    return json.data ?? null;
  },
};
```

### In Navigation

```typescript
import { AUTH_ROUTES } from "@/constants/routes.constant";
import Link from "next/link";

export function LoginButton() {
  return <Link href={AUTH_ROUTES.LOGIN}>Sign In</Link>;
}
```

## ✨ Benefits

✅ **No hardcoded strings** - Routes only exist in one place  
✅ **Easy refactoring** - Change once, updates everywhere  
✅ **Type-safe** - TypeScript knows all available routes  
✅ **Auto-generated patterns** - Middleware patterns sync automatically  
✅ **Self-documenting** - Clear names like `AUTH_ROUTES.LOGIN`

## Related Patterns

- [API Response →](./api-response.md) - Response formatting
- [Auth Guard →](./auth-guard.md) - Authentication verification

### In Components

```typescript
import { AUTH_ROUTES } from "@/constants/routes.constant";
import Link from "next/link";

export function LoginButton() {
  return (
    <Link href={AUTH_ROUTES.LOGIN}>
Sign In
</Link>
);
}

```

## Usage in Client Redirects

```typescript
// app/(auth)/login/page.client.tsx
"use client";

import { useRouter } from "next/navigation";
import { PROTECTED_ROUTES } from "@/constants/routes.constant";

export const PageClient = () => {
  const router = useRouter();

  const onSuccess = () => {
    router.replace(PROTECTED_ROUTES.DASHBOARD);
  };

  // ...
};
```

## Adding New Routes

1. Add to appropriate constant object:

```typescript
// Adding a new protected route
export const PROTECTED_ROUTES = {
  DASHBOARD: "/dashboard",
  SETTINGS: "/settings", // New route
} as const;
```

2. Update middleware if needed:

```typescript
// proxy.ts
const PROTECTED_ROUTES = ["/dashboard/*", "/settings/*"];
```

The `PROTECTED_ROUTE_PATTERNS` will automatically include the new pattern.

3. Use in code:

```typescript
router.push(PROTECTED_ROUTES.SETTINGS);
```

## Benefits

- **No Magic Strings**: All routes defined as constants
- **Type Safety**: TypeScript prevents typos in route paths
- **Single Source of Truth**: Update a route once, everywhere updates
- **Auto-Sync Patterns**: Middleware patterns stay in sync automatically
- **Maintainability**: Clear organization by route type
- **Consistency**: Same routes used everywhere for redirects and navigation

## Related

- [Auth Guard Pattern](/patterns/auth-guard) - Route protection
- [HTTP Status & Messages](/patterns/http-status) - Redirect handling
