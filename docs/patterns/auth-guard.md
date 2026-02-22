# Auth Guard Pattern

DRY up authentication checks across all protected API endpoints with a single, reusable `requireAuth()` guard.

## The Problem

Without a centralized guard, auth logic gets duplicated in every endpoint.

**Solution:** Use `requireAuth()` once for all protected routes.

## How It Works

The `requireAuth()` guard provides a consistent way to verify authentication in API routes:

```typescript
// common/guards/auth.guard.ts
export async function requireAuth(): Promise<{
  user: User | null;
  error: NextResponse | null;
}> {
  try {
    const supabase = await getSupabaseServer();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        user: null,
        error: apiResponse({
          data: authError?.message ?? AUTH_ERRORS.UNAUTHORIZED,
          status: HttpStatus.UNAUTHORIZED,
        }),
      };
    }

    return { user, error: null };
  } catch (error) {
    console.error("Auth verification failed:", error);
    return {
      user: null,
      error: apiResponse({
        data: AUTH_ERRORS.UNAUTHORIZED,
        status: HttpStatus.UNAUTHORIZED,
      }),
    };
  }
}
```

## Basic Usage

```typescript
// app/api/users/me/route.ts
import { requireAuth } from "@/common/guards/auth.guard";

export async function GET(request: NextRequest) {
  const { user, error } = await requireAuth();

  // Return error if not authenticated
  if (error) return error;

  // user is guaranteed to be defined here
  const profile = await db.select().from(profiles).where(eq(profiles.id, user.id)).limit(1);

  return apiResponse({
    data: profile[0] ?? null,
    status: HttpStatus.OK,
  });
}
```

## ✨ Key Features

✅ **Consistent error responses** - Always returns proper API response format  
✅ **Type-safe user** - User object guaranteed after check  
✅ **Error already formatted** - Return error directly without extra wrapping  
✅ **Single source of truth** - One place to update auth logic  
✅ **Automatic error handling** - Try/catch included

## Error Handling

The guard returns errors as properly formatted API responses:

```typescript
const { user, error } = await requireAuth();

if (error) {
  // error is already a NextResponse with 401 status
  // return it directly from the route handler
  return error;
}

// user is guaranteed to exist, no additional checks needed
```

## Multiple Route Protection

Use the guard consistently across all protected endpoints:

```typescript
// app/api/send/route.ts
export async function POST(request: NextRequest) {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    const body = await request.json();
    // Process authenticated request...
  } catch (error) {
    console.error("Process error:", error);
    return apiResponse({
      data: API_ERRORS.GENERIC,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  }
}
```

## Comparison: Before & After

### Before (Repetitive)

```typescript
export async function GET(request: NextRequest) {
  const supabase = await getSupabaseServer();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Route logic...
}
```

This pattern repeated in every protected route.

### After (DRY)

```typescript
export async function GET(request: NextRequest) {
  const { user, error } = await requireAuth();
  if (error) return error;

  // Route logic...
}
```

Clean, consistent, DRY.

## Benefits

- **DRY Principle**: Single source of truth for auth verification
- **Consistent Errors**: All routes return same error format and messages
- **Type Safety**: TypeScript guarantees proper types for `user` and `error`
- **Error Recovery**: Centralized error handling with proper status codes
- **Maintainability**: Update auth logic once, affects all routes

## Related

- [HTTP Status & Messages](/patterns/http-status) - Status codes and messages
- [API Response & Error Handling](/patterns/api-response) - Response format
- [Route Definitions](/patterns/routes) - Protected route configuration
