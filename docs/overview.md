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

Protect routes using the middleware in `middleware.ts`. All specified routes require authentication:

```typescript
// middleware.ts
const PROTECTED_ROUTES: string[] = ["/dashboard/*", "/settings/*", "/admin/*"];
```

Add any route pattern to `PROTECTED_ROUTES` to require authentication. The middleware automatically intercepts requests and redirects unauthenticated users to the login page.

## Using State Management

This template uses **Zustand** combined with **React Context** for optimal state management. This pattern provides the simplicity of Zustand with the dependency injection benefits of Context. Learn more about this approach in [this detailed guide](https://tkdodo.eu/blog/zustand-and-react-context).

### Zustand + React Context Pattern

**Create a Store Provider:**

```typescript
// components/providers/user-profile-provider.tsx
"use client";

import { createStore, type StoreApi } from "zustand";
import { createContext, useState, PropsWithChildren, useEffect } from "react";
import type { SelectProfile } from "@/types/drizzle.types";

type UserProfileState = {
  loading: boolean;
  error: string | null;
  data: SelectProfile | null;
  actions: {
    hydrate: () => Promise<void>;
    clear: () => void;
  };
};

export type UserProfileStore = StoreApi<UserProfileState>;
export const UserProfileContext = createContext<UserProfileStore | null>(null);

export const UserProfileProvider = ({ children }: PropsWithChildren) => {
  const [store] = useState(() =>
    createStore<UserProfileState>((set) => ({
      loading: true,
      error: null,
      data: null,
      actions: {
        hydrate: async () => {
          set({ loading: true, error: null });
          try {
            const response = await fetch("/api/users/me");

            if (response.status === 401) {
              set({ data: null, loading: false });
              return;
            }

            if (!response.ok) {
              throw new Error(await response.text());
            }

            const data = await response.json();
            set({ data: data.data ?? null, loading: false });
          } catch (error: unknown) {
            set({
              error: error instanceof Error ? error.message : "Failed to load profile",
              loading: false,
            });
          }
        },
        clear: () => {
          set({ data: null, loading: false, error: null });
        },
      },
    }))
  );

  useEffect(() => {
    store.getState().actions.hydrate();
  }, [store]);

  return (
    <UserProfileContext.Provider value={store}>
      {children}
    </UserProfileContext.Provider>
  );
};
```

**Create a Custom Hook:**

```typescript
// hooks/use-user-profile-store.ts
import { useContext } from "react";
import { useStore } from "zustand";
import {
  UserProfileContext,
  type UserProfileStore,
} from "@/components/providers/user-profile-provider";

export const useUserProfileStore = <T>(
  selector: (state: ReturnType<UserProfileStore["getState"]>) => T
) => {
  const store = useContext(UserProfileContext);

  if (!store) {
    throw new Error("`useUserProfileStore` must be used within a UserProfileProvider");
  }

  return useStore(store, selector);
};
```

**Usage in Components:**

```typescript
"use client";

import { useUserProfileStore } from "@/hooks/use-user-profile-store";

export function UserProfile() {
  const { data, loading, error } = useUserProfileStore(
    (state) => ({
      data: state.data,
      loading: state.loading,
      error: state.error,
    })
  );

  const { clear } = useUserProfileStore((state) => state.actions);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>{data?.name}</h1>
      <button onClick={clear}>Clear Profile</button>
    </div>
  );
}
```

### Why This Pattern?

- **Zustand Benefits**: Minimal boilerplate, zero dependencies, excellent performance with selectors
- **React Context Benefits**: Scoped state, easy dependency injection, type-safe
- **Combined**: Each provider instance has its own store, enabling fine-grained control and testing

### Setting Up New Providers

1. Create a store type and provider component
2. Create a custom hook for accessing the store
3. Wrap your app with the provider at the appropriate level

## Using SEO helper function

I've created a helper function to make building SEO-friendly pages effortless.

### Using it in the root layout

Set your global defaults once in the App Router layout. All pages will inherit this metadata.

```typescript
// app/layout.tsx
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata();
```

### Using it in Per-page metadata

Static page:

```typescript
// app/pricing/page.tsx
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Pricing",
  description: "Simple, transparent pricing.",
  path: "/pricing",
});
```

Dynamic route (when you need params or data):

```typescript
// app/blog/[slug]/page.tsx
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  return buildMetadata({
    title: `Post: ${slug}`,
    description: `Read ${slug}`,
    path: `/blog/${slug}`,
    image: "/og.png",
  });
}
```

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
