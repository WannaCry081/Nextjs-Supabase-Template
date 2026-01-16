---
outline: deep
---

# Getting Started

This is a modern **Next.js + Supabase template** designed to accelerate full-stack development. It combines Next.js 16 for the frontend, Supabase for authentication and database, Drizzle ORM for type-safe database operations, TanStack Query for data fetching, and Resend for email functionality. The template includes pre-configured authentication pages, protected routes, sidebar navigation, and a robust API structure.

## Using boilerplate

### Authentication

The template provides a complete authentication system with pre-built pages for all auth flows:

**Available Auth Pages:**

- **Login** (`/login`) - Email/password sign-in with OAuth providers (GitHub, Google)
- **Register** (`/register`) - User account creation with email verification
- **Forgot Password** (`/forgot-password`) - Password recovery initiation
- **Reset Password** (`/reset-password`) - Complete password reset flow

**How it works:**

```typescript
// app/(auth)/login/page.tsx
const onFormSubmit = async (values: z.infer<typeof formSchema>) => {
  const { error } = await supabase.auth.signInWithPassword({
    email: values.email,
    password: values.password,
  });

  if (error) {
    toast.error("Login failed");
    return;
  }

  router.replace("/dashboard");
};

// OAuth Login
const { error } = await supabase.auth.signInWithOAuth({
  provider: "github", // or "google"
  options: {
    redirectTo: `${window.location.origin}/dashboard`,
  },
});
```

All forms use **React Hook Form** with **Zod validation** for type-safe form handling. Protected routes automatically redirect unauthenticated users to the login page via middleware.

### Sidebar

The sidebar navigation is managed through a centralized configuration file. Add or modify navigation items in `constants/app-sidebar-items.ts`:

```typescript
// constants/app-sidebar-items.ts
import { Frame, Map, PieChart } from "lucide-react";

export const APP_SIDEBAR_ITEMS = {
  platform: {
    title: "Platform",
    items: [
      {
        name: "Design Engineering",
        url: "/design-engineering",
        icon: Frame,
      },
      {
        name: "Sales & Marketing",
        url: "/sales-marketing",
        icon: PieChart,
      },
      {
        name: "Travel",
        url: "/travel",
        icon: Map,
      },
    ],
  },
};
```

The sidebar automatically renders all items with icons and handles navigation. To add new sections, simply extend the `APP_SIDEBAR_ITEMS` object with additional categories and items.

### Proxy & Protected Routes

Protect routes using the middleware proxy in `proxy.ts`. All specified routes require authentication:

```typescript
// proxy.ts
const PROTECTED_ROUTES: string[] = ["/dashboard/*", "/settings/*", "/admin/*"];
```

Add any route pattern to `PROTECTED_ROUTES` to require authentication. The middleware automatically intercepts requests and redirects unauthenticated users to the login page.

## Using Drizzle ORM

**Drizzle ORM** provides a type-safe, SQL-first ORM for database operations. It includes relation support, migrations, and a studio for database management.

**Schema Definition:**

```typescript
// drizzle/schemas/profiles/profile.schema.ts
import { pgTable, varchar } from "drizzle-orm/pg-core";
import { baseColumns } from "../base";

export const profiles = pgTable("profiles", {
  ...baseColumns, // includes id, createdAt, updatedAt
  email: varchar("email", { length: 255 }).notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  imageUrl: varchar("image_url", { length: 255 }),
});
```

**Database Commands:**

```bash
# Push schema changes to database
pnpm db:push

# Generate migrations
pnpm db:migrate <migration_name>

# Apply pending migrations
pnpm db:update

# Open Drizzle Studio (visual DB editor)
pnpm db:studio
```

For relationships, foreign keys, and advanced queries, refer to the [Drizzle Documentation](https://orm.drizzle.team/).

## Using TanStack Queries

**TanStack Query** handles data fetching, caching, and synchronization with query keys and options patterns.

**Setup Query Options:**

```typescript
const EXAMPLE = "exampleData";

const exampleKey = {
  all: [EXAMPLE],
  lists: (searchParams?: SearchQueries) => {
    const keys = [...exampleKey.all, "list"];
    if (searchParams) return [...keys, searchParams];
    return keys;
  },
  detail: (id: string) => [...exampleKey.all, "detail", id],
};

export const getExampleOptions = (searchParams?: SearchQueries) =>
  queryOptions({
    queryKey: exampleKey.lists(searchParams),
    queryFn: () => ExampleService.list(searchParams),
  });
```

**Using in Components:**

```typescript
import { useQuery } from "@tanstack/react-query";

export function ExampleList() {
  const { data, isLoading, isError } = useQuery(getExampleOptions());

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading data</div>;

  return (
    <ul>
      {data?.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}
```

This pattern ensures queries are cached, deduped across components, and easily refetchable. See [TanStack Query Documentation](https://tanstack.com/query/latest) for advanced features.

## Using Resend API

**Resend** is integrated for transactional emails. Configure it with environment variables and use the API endpoint:

**Environment Setup:**

```bash
RESEND_API_KEY=your_api_key_here
RESEND_EMAIL_FROM=noreply@yourdomain.com
```

**API Route:**

```typescript
// app/api/send/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs"; // Required for Resend

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { to, subject, html } = await req.json();

    if (!to || !subject || !html) {
      return NextResponse.json(
        { success: false, error: "Missing to/subject/html" },
        { status: 400 }
      );
    }

    const result = await resend.emails.send({
      from: process.env.RESEND_EMAIL_FROM!,
      to,
      subject,
      html,
    });

    return NextResponse.json({ success: true, data: result }, { status: 200 });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
  }
}
```

**Usage in Components:**

```typescript
async function sendWelcomeEmail(email: string, name: string) {
  const response = await fetch("/api/send", {
    method: "POST",
    body: JSON.stringify({
      to: email,
      subject: "Welcome!",
      html: `<h1>Welcome ${name}</h1><p>Thanks for signing up!</p>`,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to send email");
  }

  return response.json();
}
```

For email templates, see [Resend Documentation](https://resend.com/docs).
