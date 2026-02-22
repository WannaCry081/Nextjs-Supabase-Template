---
outline: deep
---

# Architecture Patterns

This template follows industry-standard patterns for scalable, maintainable full-stack development. Each pattern solves a specific problem and works in harmony with the others.

## Quick Reference

| Pattern                                       | Purpose                            | When to Use                    |
| --------------------------------------------- | ---------------------------------- | ------------------------------ |
| [API Response](#api-response--error-handling) | Consistent API response formatting | Every API route                |
| [Auth Guard](#auth-guard-protection)          | Route protection & authentication  | Protected API endpoints        |
| [Form Validation](#form-validation)           | Type-safe form schemas             | Auth forms & user inputs       |
| [Route Definitions](#route-definitions)       | Centralized URL management         | Navigation & redirects         |
| [Query Keys](#query-keys--caching)            | Cache strategies & keys            | Data fetching with React Query |
| [HTTP Status Codes](#http-status-codes)       | Centralized status handling        | API responses                  |

## API Response & Error Handling

**Purpose:** Standardize all API responses and error handling across endpoints.

**Key Principles:**

- Single response format for success and error states
- Automatic HTTP status text detection
- Type-safe data handling

**When to use:**

- Creating new API routes (`app/api/**`)
- Returning responses from any endpoint
- Handling both success and error cases consistently

**Example:**

```typescript
// app/api/users/me/route.ts
return apiResponse({
  data: user,
  status: HttpStatus.OK,
});
```

✨ **Benefits:**

- Every API in the app responds the same way
- Clients always know the response shape
- Errors are properly formatted

[Read Full Guide →](./api-response.md)

## Auth Guard Protection

**Purpose:** Centralize authentication verification for all protected API routes.

**Key Principles:**

- Single `requireAuth()` function for all auth checks
- Returns user + error tuple
- No code duplication across endpoints

**When to use:**

- Protecting API routes that require authentication
- Verifying Supabase session validity
- Preventing unauthenticated access

**Example:**

```typescript
export async function POST(request: NextRequest) {
  const { user, error } = await requireAuth();
  if (error) return error; // Already formatted as response

  // user is guaranteed here
  const result = await db.insert(profile).values({...});
}
```

✨ **Benefits:**

- Consistent authentication logic
- Automatic error handling
- Eliminates boilerplate in endpoints

[Read Full Guide →](./auth-guard.md)

## Form Validation

**Purpose:** Define reusable, type-safe schemas for all forms.

**Key Principles:**

- Zod schemas = both runtime validation + TypeScript types
- Single source of truth for form constraints
- Reusable field schemas to prevent duplication

**When to use:**

- Building any form component
- Validating user input before submission
- Auth flows (login, register, password reset)

**Example:**

```typescript
const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Too short"),
});

type LoginForm = z.infer<typeof loginSchema>;

const form = useForm<LoginForm>({
  resolver: zodResolver(loginSchema),
});
```

✨ **Benefits:**

- Type inference automatically
- Validation happens both client & server
- Consistent error messages
- Reusable field schemas

[Read Full Guide →](./form-validation.md)

## Route Definitions

**Purpose:** Centralize all route paths as constants to prevent hardcoded URLs.

**Key Principles:**

- Routes defined in one place (`constants/routes.constant.ts`)
- Organized by type: public, auth, protected, API
- Eliminates string duplication across codebase

**When to use:**

- Navigating between pages (`Link`, `router.push()`)
- Fetching from API endpoints
- Middleware route patterns
- Building navigation items

**Example:**

```typescript
import { AUTH_ROUTES, PROTECTED_ROUTES, API_ROUTES } from "@/constants/routes.constant";

// In components
<Link href={AUTH_ROUTES.LOGIN}>Sign In</Link>

// In services
const response = await fetch(API_ROUTES.USERS_ME);

// In middleware
const patterns = Object.values(PROTECTED_ROUTES).map(r => `${r}/*`);
```

✨ **Benefits:**

- No hardcoded URL strings scattered throughout project
- Easy refactoring: change once, updates everywhere
- Type-safe route references
- Self-documenting navigation

[Read Full Guide →](./routes.md)

## Query Keys & Caching

**Purpose:** Define hierarchical cache keys for React Query with automatic invalidation support.

**Key Principles:**

- Factory pattern for type-safe key generation
- Hierarchical structure for smart invalidation
- Co-located with query options

**When to use:**

- Fetching data with React Query (`useQuery`)
- Invalidating cache after mutations
- Sharing queries across components
- Implementing pagination or filtering

**Example:**

```typescript
// Define cache keys
export const queryKeys = {
  profile: {
    all: ["profile"] as const,
    me: () => [...queryKeys.profile.all, "me"] as const,
  },
};

// Use in queries
const { data } = useQuery(
  queryOptions({
    queryKey: queryKeys.profile.me(),
    queryFn: () => profileService.me(),
  })
);

// Invalidate after mutation
queryClient.invalidateQueries({
  queryKey: queryKeys.profile.all,
});
```

✨ **Benefits:**

- Type-safe cache keys
- Hierarchical invalidation (invalidate all profile queries at once)
- Single source of truth for cache structure
- Prevents cache inconsistencies

[Read Full Guide →](./query-keys.md)

## HTTP Status Codes

**Purpose:** Centralize HTTP status codes and automatic status text mapping.

**Key Principles:**

- Named constants instead of magic numbers
- Automatic status-to-text conversion
- Grouped by status family (2xx, 4xx, 5xx)

**When to use:**

- Returning API responses
- Reading response status codes
- Error handling based on status
- Building human-readable error messages

**Example:**

```typescript
import { HttpStatus } from "@/constants/http-status.constant";

if (response.status === HttpStatus.UNAUTHORIZED) {
  // Handle 401
}

return apiResponse({
  data: null,
  status: HttpStatus.NOT_FOUND,
});
```

✨ **Benefits:**

- No magic numbers (401, 500) in code
- Self-documenting intent
- Easy to test (compare named constants)
- Centralized status text mapping

[Read Full Guide →](./http-status.md)

## Pattern Relationships

These patterns work together in a cohesive system:

```text
┌─────────────────────────────────────────┐
│        User Makes Request               │
└──────────────────┬──────────────────────┘
                   │
        ┌──────────▼──────────┐
        │  Route Definition   │
        │  (routes.constant)  │
        └──────────┬──────────┘
                   │
        ┌──────────▼──────────┐
        │   Auth Guard        │
        │ (requireAuth check) │
        └──────────┬──────────┘
                   │
        ┌──────────▼──────────┐
        │  API Endpoint       │
        │  (business logic)   │
        └──────────┬──────────┘
                   │
        ┌──────────▼──────────┐
        │  API Response       │
        │  (apiResponse fn)   │
        └──────────┬──────────┘
                   │
        ┌──────────▼──────────┐
        │  HTTP Status Code   │
        │  (HttpStatus const) │
        └──────────┬──────────┘
                   │
┌──────────────────▼──────────────────────┐
│  Response sent to client with           │
│  { success, data, error } shape         │
└─────────────────────────────────────────┘
```

## Getting Started with Patterns

### For New Developers

1. **Read the overview** of each pattern on this page
2. **Deep-dive** into the pattern guide that matches your task
3. **Look at examples** in the `app/` and `lib/` directories
4. **Reference** the AGENTS.md file for comprehensive architectural details

### For Daily Development

- **Adding a new API endpoint?** → Start with [Auth Guard](#auth-guard-protection)
- **Building a form?** → Use [Form Validation](#form-validation)
- **Fetching data?** → Leverage [Query Keys](#query-keys--caching)
- **Navigating pages?** → Reference [Route Definitions](#route-definitions)

## See Also

- [Overview](../overview.md) - Getting started guide
- [AGENTS.md](../../AGENTS.md) - Comprehensive architectural documentation
