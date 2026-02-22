# HTTP Status Codes & Messages

Centralize HTTP status codes, error messages, and success messages for consistent API responses and user-facing communication.

## The Problem

Magic numbers scattered throughout your code create confusion:

```typescript
// ❌ Magic numbers everywhere
if (response.status === 401) {
  /* handle */
}
return NextResponse.json({}, { status: 500 });
toast.error("An error occurred"); // generic, unhelpful message
```

**Solution:** Centralize status codes and messages as constants.

## How It Works

All commonly-used HTTP status codes are defined in one place:

```typescript
// constants/http-status.constant.ts

// 2xx Success
export const HTTP_OK = 200;
export const HTTP_CREATED = 201;
export const HTTP_NO_CONTENT = 204;

// 4xx Client Errors
export const HTTP_BAD_REQUEST = 400;
export const HTTP_UNAUTHORIZED = 401;
export const HTTP_FORBIDDEN = 403;
export const HTTP_NOT_FOUND = 404;
export const HTTP_UNPROCESSABLE_ENTITY = 422;
export const HTTP_TOO_MANY_REQUESTS = 429;

// 5xx Server Errors
export const HTTP_INTERNAL_SERVER_ERROR = 500;
export const HTTP_BAD_GATEWAY = 502;
export const HTTP_SERVICE_UNAVAILABLE = 503;
```

## Status Code Groups

For convenience, use the `HttpStatus` object:

```typescript
import { HttpStatus } from "@/constants/http-status.constant";

// Same as using HTTP_UNAUTHORIZED directly
return apiResponse({
  data: "Unauthorized",
  status: HttpStatus.UNAUTHORIZED,
});
```

## Status Text Mapping

Automatic text mapping for every status code:

```typescript
export const STATUS_TEXT_MAP: Record<number, string> = {
  [HTTP_OK]: "OK",
  [HTTP_CREATED]: "Created",
  [HTTP_NO_CONTENT]: "No Content",
  [HTTP_BAD_REQUEST]: "Bad Request",
  [HTTP_UNAUTHORIZED]: "Unauthorized",
  [HTTP_FORBIDDEN]: "Forbidden",
  [HTTP_NOT_FOUND]: "Not Found",
  [HTTP_UNPROCESSABLE_ENTITY]: "Unprocessable Entity",
  [HTTP_TOO_MANY_REQUESTS]: "Too Many Requests",
  [HTTP_INTERNAL_SERVER_ERROR]: "Internal Server Error",
  [HTTP_BAD_GATEWAY]: "Bad Gateway",
  [HTTP_SERVICE_UNAVAILABLE]: "Service Unavailable",
};

/** @returns Status text for given status code */
export function getStatusText(status: number): string {
  return STATUS_TEXT_MAP[status] || "Unknown Status";
}
```

The `getStatusText()` function is used internally by `apiResponse()` to include proper HTTP status names in responses.

## Error Messages

User-facing error messages are centralized by category:

```typescript
// constants/http-error-messages.constant.ts

// Authentication Errors
export const AUTH_ERRORS = {
  UNAUTHORIZED: "Unauthorized",
  LOGIN_FAILED: "Login failed",
  LOGIN_FAILED_DESC: "Please check your credentials and try again.",
  REGISTER_FAILED: "Registration failed",
  REGISTER_FAILED_DESC: "Please check your information and try again.",
  OAUTH_FAILED: (provider: string) => `${provider} login failed`,
  OAUTH_FAILED_DESC: "An error occurred during OAuth login. Please try again.",
} as const;

// Authentication Success Messages
export const AUTH_SUCCESS = {
  LOGIN_SUCCESS: "Welcome back!",
  LOGIN_SUCCESS_DESC: "Redirecting to dashboard...",
  REGISTER_SUCCESS: "Registration successful",
  REGISTER_SUCCESS_DESC: "Please check your email to verify your account.",
} as const;

// API Errors
export const API_ERRORS = {
  GENERIC: "Something went wrong",
  GENERIC_DESC: "There was an issue processing your request. Please try again later.",
  MISSING_FIELDS: "Missing required fields",
} as const;

// Email/Service Errors
export const EMAIL_ERRORS = {
  NOT_CONFIGURED: "Email service is not configured",
  SEND_FAILED: "Failed to send email",
} as const;
```

## Usage in API Routes

```typescript
import { AuthStatus } from "@/constants/http-status.constant";
import { AUTH_ERRORS } from "@/constants/http-error-messages.constant";

export async function POST(request: NextRequest) {
  const { user, error } = await requireAuth();

  if (error) {
    return apiResponse({
      data: AUTH_ERRORS.UNAUTHORIZED,
      status: HttpStatus.UNAUTHORIZED,
    });
  }

  // Process request...
}
```

## Usage in Client Components

```typescript
import { toast } from "sonner";
import { AUTH_SUCCESS, AUTH_ERRORS } from "@/constants/http-error-messages.constant";

const onLogin = async (email: string, password: string) => {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    toast.error(AUTH_ERRORS.LOGIN_FAILED, {
      description: AUTH_ERRORS.LOGIN_FAILED_DESC,
    });
    return;
  }

  toast.success(AUTH_SUCCESS.LOGIN_SUCCESS, {
    description: AUTH_SUCCESS.LOGIN_SUCCESS_DESC,
  });
};
```

## Benefits

- **Single Source of Truth**: All status codes and messages defined in one place
- **Consistency**: Same error messaging across all routes and pages
- **Type Safety**: TypeScript guarantees valid status codes and messages
- **Maintainability**: Update messages in one place, everywhere updates automatically
- **User Experience**: Consistent, clear messaging improves trust

## Related

- [API Response & Error Handling](/patterns/api-response) - Response structure and usage
- [Auth Guard Pattern](/patterns/auth-guard) - Authentication verification
- [Form Validation](/patterns/form-validation) - Input validation
