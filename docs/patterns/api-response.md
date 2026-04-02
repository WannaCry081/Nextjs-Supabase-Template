# API Response & Error Handling

Consistent, standardized API responses across all endpoints ensure predictable client-side handling and automatic error detection.

## The Problem

Without standardization, different endpoints return different response shapes:

```typescript
// ❌ Inconsistent responses - clients never know the shape
export async function GET() {
  return NextResponse.json(data); // sometimes success, sometimes error
}

export async function POST() {
  return NextResponse.json({ error: "...", success: false });
}
```

**Solution:** Use the `apiResponse()` helper for every endpoint.

## How It Works

The `apiResponse()` function:

- ✅ Automatically detects success/error from HTTP status code
- ✅ Returns consistent shape: `{ success, data, error }`
- ✅ Includes automatic status text mapping
- ✅ Fully type-safe with TypeScript inference

```typescript
// lib/response.ts
export function apiResponse<T = unknown>({
  data = null,
  status,
}: {
  data: T | null;
  status: number;
}): NextResponse {
  const success = status >= 200 && status < 300;
  const error = getStatusText(status);

  return NextResponse.json(
    {
      success,
      data,
      error,
    },
    { status }
  );
}
```

## Response Format

Every response follows this consistent structure:

**Success Response (2xx):**

```json
{
  "success": true,
  "data": {
    "id": "123",
    "email": "user@example.com"
  },
  "error": null
}
```

**Error Response (4xx/5xx):**

```json
{
  "success": false,
  "data": null,
  "error": "Unauthorized"
}
```

The `error` field automatically includes human-readable status text (e.g., "Bad Request", "Not Found").

## Usage Examples

### Getting User Profile

```typescript
// app/api/users/me/route.ts
import { apiResponse } from "@/lib/response";
import { requireAuth } from "@/lib/guards/auth.guard";
import { HttpStatus } from "@/constants/http-status.constant";

export async function GET() {
  // Auth guard returns error as NextResponse if unauthorized
  const { user, error } = await requireAuth();
  if (error) return error;

  const profile = await db.select().from(profiles).where(eq(profiles.id, user.id)).limit(1);

  return apiResponse({
    data: profile[0] ?? null,
    status: HttpStatus.OK,
  });
}
```

Response when authenticated:

```json
{
  "success": true,
  "data": {
    "id": "user-123",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "error": null
}
```

### Sending Email

```typescript
// app/api/send/route.ts
import { apiResponse } from "@/lib/response";
import { requireAuth } from "@/lib/guards/auth.guard";
import { HttpStatus } from "@/constants/http-status.constant";

export async function POST(request: NextRequest) {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    const body = await request.json();

    if (!body.email || !body.subject) {
      return apiResponse({
        data: "Missing email or subject",
        status: HttpStatus.BAD_REQUEST,
      });
    }

    const result = await resend.emails.send({
      from: process.env.RESEND_EMAIL_FROM,
      to: body.email,
      subject: body.subject,
      html: body.html,
    });

    return apiResponse({
      data: result,
      status: HttpStatus.OK,
    });
  } catch (error) {
    console.error("Email send failed:", error);
    return apiResponse({
      data: "Failed to send email",
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  }
}
```

Response when validation fails:

```json
{
  "success": false,
  "data": "Missing email or subject",
  "error": "Bad Request"
}
```

## Client-Side Error Handling

On the client, handle API responses with proper error messaging:

```typescript
// services/users.service.ts
export const usersService = {
  me: async (): Promise<SelectProfile | null> => {
    try {
      const response = await axiosInstance.get<{ data: SelectProfile | null }>(API_ROUTES.USERS.ME);
      return response.data.data ?? null;
    } catch {
      return null;
    }
  },
};
```

## ✨ Benefits

- **Consistency** - All API routes follow the same response structure
- **Simplicity** - Single function handles both success and error responses
- **Type-Safe** - Generic typing supports any data structure
- **Auto-Detection** - Success/error determined automatically from status code
- **Flexibility** - Works with any HTTP status code and custom error messages

## Related Patterns

- [HTTP Status & Messages →](./http-status.md) - Status codes and error messages
- [Auth Guard →](./auth-guard.md) - Authentication verification
