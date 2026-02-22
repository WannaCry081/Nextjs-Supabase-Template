---
outline: deep
---

# Getting Started

Welcome to the **Next.js + Supabase Template**! This is a production-ready starter for building modern full-stack applications with Next.js 16, Supabase authentication, Drizzle ORM, and TanStack Query.

## What's Included

✨ **Frontend**

- Next.js 16 with App Router and route groups
- Beautifully designed authentication UI with OAuth support
- Protected routes with proxy-based session management
- Sidebar navigation with responsive design
- Modern component library (Shadcn/ui + Radix)

🔐 **Backend & Database**

- Supabase authentication (email/password + OAuth)
- Drizzle ORM for type-safe database operations
- Database migrations and Drizzle Studio support
- Centralized API response handling

🚀 **Developer Experience**

- Type-safe patterns for routes, forms, API responses
- TanStack Query for data fetching and caching
- Consistent error handling across the app
- Comprehensive documentation with examples
- Docker support for deployment

## Quick Start

### Installation

```bash
# Install dependencies
pnpm install

# Create environment file
cp .env.example .env.local

# Start development server
pnpm start:development
```

Visit `http://localhost:3000` and explore the template!

### Environment Setup

Required environment variables (see `.env.example`):

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_anon_key
DATABASE_URL=your_database_url

# Email (optional)
RESEND_API_KEY=your_resend_key
RESEND_EMAIL_FROM=noreply@yourdomain.com

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Template Structure

### Route Groups

The app is organized into three main sections:

| Route Group   | Purpose                 | Path Pattern                                    |
| ------------- | ----------------------- | ----------------------------------------------- |
| `(public)`    | Marketing landing page  | `/`                                             |
| `(auth)`      | Authentication flows    | `/login`, `/register`, `/forgot-password`, etc. |
| `(protected)` | Authenticated app shell | `/dashboard`, `/settings`, etc.                 |

Each group has its own layout, styling, and logic.

### Key Directories

```text
app/                 # Next.js App Router
├── (auth)/         # Auth pages & forms
├── (protected)/    # Dashboard & protected routes
├── (public)/       # Marketing pages
└── api/            # API endpoints

components/         # React components
├── providers/      # Context providers (React Query, theme, etc.)
├── app-sidebar/    # Sidebar navigation shell
├── shared/         # Reusable components
└── ui/             # Shadcn/ui primitives (don't modify)

lib/               # Utilities & helpers
├── supabase/      # Supabase client setup
├── drizzle/       # Database connection
├── query/         # React Query setup
└── api-response.ts # Response formatting

drizzle/           # Database schema & migrations
├── schemas/       # Table definitions
└── migrations/    # SQL migrations

common/            # Shared domain logic
├── guards/        # Auth guards
└── schemas/       # Zod validation schemas

constants/         # App-wide constants
├── routes.constant.ts      # URL definitions
├── http-status.constant.ts # HTTP status codes
└── app-sidebar-items.constant.ts # Navigation items
```

## Core Features

### 🔐 Authentication

The template includes a complete auth system:

**Available Pages:**

- **Login** (`/login`) - Email/password + GitHub/Google OAuth
- **Register** (`/register`) - Create account with email verification
- **Forgot Password** (`/forgot-password`) - Request password reset
- **Reset Password** (`/reset-password`) - Complete the reset flow

All forms use Zod schemas (defined in `common/schemas/auth.schema.ts`) for validation.

**Example:**

```typescript
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/common/schemas/auth.schema";

export function LoginForm() {
  const form = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      toast.error("Login failed");
      return;
    }

    router.replace("/dashboard");
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* form fields */}
    </form>
  );
}
```

### 🔒 Protected Routes

Routes require authentication via the proxy middleware:

**Define Protected Routes** (`proxy.ts`):

```typescript
const PROTECTED_ROUTES: string[] = ["/dashboard/*", "/settings/*", "/admin/*"];
```

Unauthenticated users are redirected to `/login` automatically.

### 🗂️ Navigation & Sidebar

Edit `constants/app-sidebar-items.constant.ts` to customize sidebar navigation:

```typescript
import { Home, Settings, BarChart3 } from "lucide-react";

export const APP_SIDEBAR_ITEMS = {
  platform: {
    title: "Platform",
    items: [
      { name: "Dashboard", url: "/dashboard", icon: Home },
      { name: "Analytics", url: "/analytics", icon: BarChart3 },
      { name: "Settings", url: "/settings", icon: Settings },
    ],
  },
};
```

### 📡 API Development

Create type-safe API endpoints with consistent response formatting:

**Example Endpoint:**

```typescript
// app/api/users/me/route.ts
import { apiResponse } from "@/lib/api-response";
import { requireAuth } from "@/common/guards/auth.guard";
import { HttpStatus } from "@/constants/http-status.constant";

export async function GET() {
  const { user, error } = await requireAuth();
  if (error) return error;

  const profile = await db.select().from(profiles).where(eq(profiles.id, user.id)).limit(1);

  return apiResponse({
    data: profile[0] ?? null,
    status: HttpStatus.OK,
  });
}
```

All endpoints return a consistent shape:

```json
{
  "success": true,
  "data": {
    /* your data */
  },
  "error": null
}
```

## 📊 Data Management

### TanStack React Query

Handle data fetching, caching, and synchronization:

**1. Define Query Options:**

```typescript
// queries/profile.query.ts
import { queryOptions } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query/query-keys";
import { profileService } from "@/services/profile.service";

export const getProfileQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.profile.me(),
    queryFn: () => profileService.me(),
  });
```

**2. Use in Components:**

```typescript
"use client";
import { useQuery } from "@tanstack/react-query";
import { getProfileQueryOptions } from "@/queries/profile.query";

export function UserProfile() {
  const { data: profile, isLoading, error } = useQuery(getProfileQueryOptions());

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading profile</div>;

  return <div>{profile?.email}</div>;
}
```

### Context Providers

Wrap your app with providers for global state:

```typescript
// components/providers/user-profile-provider.tsx
"use client";

import { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProfileQueryOptions } from "@/queries/profile.query";

const UserProfileContext = createContext(null);

export function UserProfileProvider({ children }) {
  const { data: profile } = useQuery(getProfileQueryOptions());

  return (
    <UserProfileContext.Provider value={{ profile }}>
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error("useUserProfile must be used within UserProfileProvider");
  }
  return context;
}
```

### Drizzle ORM

Type-safe database operations:

**Define Schema:**

```typescript
// drizzle/schemas/profiles/profile.schema.ts
import { pgTable, varchar, uuid } from "drizzle-orm/pg-core";
import { baseColumns } from "../base";

export const profiles = pgTable("profiles", {
  ...baseColumns,
  email: varchar("email", { length: 255 }).notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  imageUrl: varchar("image_url", { length: 255 }),
});
```

**Query Database:**

```typescript
import { db } from "@/lib/drizzle/db";
import { profiles } from "@/drizzle/schemas";
import { eq } from "drizzle-orm";

const user = await db.select().from(profiles).where(eq(profiles.id, userId)).limit(1);
```

**Database Commands:**

```bash
# Push schema changes to database
pnpm db:push

# Generate migrations
pnpm db:migrate <name>

# Apply migrations
pnpm db:update

# Open Drizzle Studio (visual editor)
pnpm db:studio
```

## 💌 Email & Notifications

### Resend Integration

Send transactional emails:

**API Endpoint:**

```typescript
// app/api/send/route.ts
export async function POST(request: NextRequest) {
  const { user, error } = await requireAuth();
  if (error) return error;

  const { to, subject, html } = await request.json();

  const result = await resend.emails.send({
    from: process.env.RESEND_EMAIL_FROM,
    to,
    subject,
    html,
  });

  return apiResponse({
    data: result,
    status: HttpStatus.OK,
  });
}
```

**Usage in Components:**

```typescript
const response = await fetch("/api/send", {
  method: "POST",
  body: JSON.stringify({
    to: user.email,
    subject: "Welcome!",
    html: "<h1>Welcome to our app!</h1>",
  }),
});
```

### Toast Notifications

Display feedback using `sonner`:

```typescript
import { toast } from "sonner";

// Success
toast.success("Profile updated!", {
  description: "Your changes have been saved.",
});

// Error
toast.error("Something went wrong", {
  description: "Please try again.",
});

// Info
toast.info("Please log in", {
  description: "You need to be authenticated.",
});
```

## 🎯 SEO & Metadata

Use the `buildMetadata()` helper for consistent SEO:

**Global Defaults** (root layout):

```typescript
// app/layout.tsx
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata();
```

**Per-Page Metadata:**

```typescript
// app/blog/[slug]/page.tsx
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({ params }) {
  const { slug } = await params;

  return buildMetadata({
    title: `Blog: ${slug}`,
    description: `Read ${slug}`,
    path: `/blog/${slug}`,
    image: "/og.png",
  });
}
```

Automatically generates Open Graph, Twitter, canonical URLs, and robots metadata.

## ✅ Code Quality

### Linting & Formatting

```bash
# Run ESLint
pnpm lint

# Fix linting issues
pnpm lint:fix

# Format code
pnpm format
```

### Testing

```bash
# Unit tests (Vitest)
pnpm test:unit

# E2E tests (Playwright)
pnpm test:e2e

# Watch mode
pnpm test:e2e:ui
```

### Building

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

## 🏗️ Architecture Patterns

This template uses standardized patterns for common tasks:

| Pattern               | Purpose                       | Link                                         |
| --------------------- | ----------------------------- | -------------------------------------------- |
| **Auth Guard**        | Protect API routes            | [Read more →](./patterns/auth-guard.md)      |
| **Form Validation**   | Type-safe forms with Zod      | [Read more →](./patterns/form-validation.md) |
| **API Response**      | Consistent endpoint responses | [Read more →](./patterns/api-response.md)    |
| **Route Definitions** | Centralized URL constants     | [Read more →](./patterns/routes.md)          |
| **Query Keys**        | React Query cache management  | [Read more →](./patterns/query-keys.md)      |
| **HTTP Status Codes** | Centralized status handling   | [Read more →](./patterns/http-status.md)     |

For deep dives into each pattern, see [Architecture Patterns →](./patterns/)

## 🚀 Next Steps

### Customize the Template

1. **Update environment variables** - Set up your Supabase project
2. **Modify sidebar items** - Edit `constants/app-sidebar-items.constant.ts`
3. **Update SEO constants** - Edit `constants/seo.constant.ts` with your domain
4. **Create your first page** - Add a new route in `app/(protected)/`
5. **Build your database schema** - Define tables in `drizzle/schemas/`

### Explore Examples

- **Auth flow:** Check `app/(auth)/login/page.client.tsx`
- **Protected API:** See `app/api/users/me/route.ts`
- **Data fetching:** Look at `queries/profile.query.ts` and `services/profile.service.ts`
- **Form handling:** Study `app/(auth)/register/page.client.tsx`

### Learn More

- [Architecture Patterns →](./patterns/index.md) - Deep dive into design patterns
- [AGENTS.md](../AGENTS.md) - Comprehensive technical documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Drizzle Documentation](https://orm.drizzle.team/)

## 💬 Support & Contributions

Found a bug or have a suggestion? Feel free to open an issue or contribute!

Happy building! 🚀
