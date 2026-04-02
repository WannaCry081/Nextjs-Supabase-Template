# AGENTS.md

Developer guide for working with your cloned Next.js + Supabase project. This guide outlines the project structure, conventions, patterns, and workflows to help you understand and extend the starter template.

## Project Overview

### What You Have

You've cloned a full-stack starter built on Next.js + Supabase + Drizzle ORM, with a separate VitePress docs site:

- **Included features:** Authentication flows, protected routes, dashboard shell, API routes, and CI pipeline for lint/unit/e2e/build
- **Key directories:** `app/(auth)/*`, `app/(protected)/*`, `app/api/*`, `.github/workflows/*`
- **Documentation:** `README.md`, `docs/index.md`, `docs/overview.md`

### Where Things Live

The starter uses a specific folder structure. Understand these key locations:

**App Router:**

- Public pages: `app/(public)/*` — marketing landing page
- Auth pages: `app/(auth)/*` — login, register, password reset flows
- Protected pages: `app/(protected)/*` — dashboard and auth-gated content

**Core Services:**

- Supabase auth: `lib/supabase/client.ts`, `lib/supabase/server.ts`
- Route protection: `proxy.ts`, `lib/supabase/middleware.ts`
- Database layer: `lib/drizzle/db.ts`, `drizzle/schemas/*`, `drizzle/migrations/*`
- Data fetching: `services/*` (API wrappers), `queries/*` (React Query options)
- UI: `components/ui/*` (Shadcn/Radix), `components/shared/*` (reusable), `components/app-sidebar/*` (sidebar shell)
- Global setup: `components/providers/*` (React Query, theme, toast/loading)

### Folder Reference

| Folder        | Purpose                                              |
| ------------- | ---------------------------------------------------- |
| `app/`        | Next.js App Router: pages, layouts, API endpoints    |
| `components/` | React components (UI primitives, providers, sidebar) |
| `lib/`        | Utilities, Supabase helpers, Drizzle setup           |
| `services/`   | API client wrappers and fetch logic                  |
| `queries/`    | React Query option factories                         |
| `drizzle/`    | Database schema and migrations                       |
| `tests/`      | Vitest unit tests and Playwright e2e tests           |
| `types/`      | TypeScript types and interfaces                      |
| `constants/`  | App-wide constants (routes, SEO, sidebar items)      |
| `docs/`       | VitePress documentation site                         |
| `schemas/`    | Zod validation schemas (auth forms, etc.)            |

## Setup & Prerequisites

### Requirements

To develop with this template, ensure you have:

- Node.js 20+ (CI runs Node 20; see `.github/workflows/`)
- `pnpm` package manager (required in `package.json`)
- Docker and Docker Compose (optional, for containerized deployment — see `Dockerfile`)

### Environment Configuration

Before running the project, configure these environment variables in `.env.local` or `.env`:

```bash
DATABASE_URL                           # Supabase PostgreSQL connection string
NEXT_PUBLIC_SUPABASE_URL               # Supabase project URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY   # Supabase publishable key
NEXT_PUBLIC_SITE_URL                   # Your app URL (e.g., http://localhost:3000)
RESEND_API_KEY                         # Email API key (Resend)
RESEND_EMAIL_FROM                      # Sender email address
```

Copy `.env.example` to `.env.local` and fill in your values. See:

- Database: `lib/drizzle/db.ts`, `config/drizzle.config.ts`
- Auth: `lib/supabase/client.ts`, `lib/supabase/server.ts`
- SEO: `constants/seo.constant.ts`
- Email: `app/api/mail/send/route.ts`

### Quick Start

```bash
pnpm install
cp .env.example .env.local
# Fill in your environment variables
pnpm start:development
```

The app will start at `http://localhost:3000`.

**Run everything in parallel** (app + docs + database studio):

```bash
pnpm start:all
```

### Database Setup

The initial migration creates a `profiles` table. To set up your database:

1. Connect your Supabase PostgreSQL URL in `.env.local`
2. Run `pnpm db:push` to apply migrations
3. (Optional) Add seed data via SQL, Drizzle Studio, or a custom script

Note: The `/api/users/me` endpoint expects a `profiles` record matching the Supabase user ID.

## Run/Test/Lint/Build Commands

Use these exact scripts (`package.json`):

```bash
# App
pnpm start:development
pnpm build
pnpm start

# Docs
pnpm docs:development
pnpm docs:build
pnpm docs:preview

# Quality
pnpm lint
pnpm lint:fix
pnpm format

# Tests
pnpm test:unit
pnpm test:e2e
pnpm test:e2e:ui
pnpm test:e2e:debug

# Database
pnpm db:push
pnpm db:migrate
pnpm db:update
pnpm db:pull
pnpm db:studio
```

Notes:

- Unit tests use Vitest + jsdom (`config/vitest.config.mts`, `tests/unit/utils.test.ts`).
- E2E tests run Chromium/Firefox/WebKit and auto-start `pnpm start:development` (`config/playwright.config.ts`, `tests/e2e/homepage.spec.ts`).

## CI/CD Overview

### Workflows

The template includes three GitHub Actions workflows:

- **Build/Lint** (`.github/workflows/build.yaml`) — Runs linting and build checks on PRs and pushes to main branches
- **Unit Tests** (`.github/workflows/vitest.yaml`) — Executes Vitest unit tests
- **E2E Tests** (`.github/workflows/playwright.yml`) — Runs Playwright e2e tests in multiple browsers and uploads test reports

These workflows require environment secrets for build steps:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `DATABASE_URL`

### Release/Deployment Process

No deployment automation is currently configured. The CI validates code quality only; release and deployment to production are manual unless you add new workflows.

## Coding Standards

### Simplicity First (No Overengineering)

- Prefer the simplest solution that works; avoid complex abstractions, patterns, or frameworks unless clearly necessary.
- Choose small, readable changes over clever or generalized refactors.
- If a change can be solved in one file or layer, do not split it across multiple layers without strong justification.
- Add only the minimum needed error handling or configuration to meet requirements.

### Formatting and Lint

- Prettier rules: semicolons, double quotes, trailing commas `es5`, width 100 (`.prettierrc`).
- ESLint uses flat config with Next.js core-web-vitals, TypeScript, TanStack Query, JSON, and Markdown linting (`eslint.config.mjs`).
- Excluded from linting: `.next/**`, `out/**`, `build/**`, `docs/.vitepress/**`, `components/ui/**`, `drizzle/migrations/**`.

### TypeScript and Imports

- Strict TypeScript is enabled (`tsconfig.json`).
- Path alias: `@/*` (`tsconfig.json`).
- Prefer explicit exported helpers (example: `lib/seo.ts`, `lib/utils.ts`).

### Naming/Structure Patterns in This Repo

- Route files use Next.js App Router conventions (`app/**/page.tsx`, `app/**/layout.tsx`).
- Interactive route logic is commonly split into `page.client.tsx` (`app/(auth)/*/page.client.tsx`).
- Domain suffixes:
  - `*.service.ts` for fetch/API client logic (`services/users.service.ts`)
  - `*.query.ts` for TanStack query options (`queries/user.query.ts`)
  - `*.constant.ts` for constants (`constants/*.constant.ts`)
  - `use-*.ts` hooks (`hooks/use-auth.ts`, `hooks/use-mobile.ts`)

### Error Handling Patterns

- Client actions: place try/catch inside `startTransition` async callbacks and show toast notifications (`app/(auth)/*/page.client.tsx`).
- API routes: return structured JSON with proper HTTP status and avoid leaking stack traces (`app/api/users/me/route.ts`, `app/api/mail/send/route.ts`).

## Repository Conventions

### Branching

- Active branches include `dev` and `main`; CI also targets `master` and `develop` (see `.github/workflows/*`)
- Recommended: branch from `dev` for feature work unless team policy changes

### Commit Messages

- Git history follows Conventional Commit style (`feat:`, `fix:`, `refactor:`, `chore:`, `build:`, `test:`).
- Keep this style for searchable history (see `git log --oneline`).

### Pull Requests and Reviews

- Before opening PR:
  - Run `pnpm lint`.
  - Run `pnpm test:unit`.
  - Run `pnpm test:e2e` for UI/routing-impacting changes.
  - Run `pnpm build`.
- PR description should include:
  - Scope and impacted paths.
  - DB migration notes when `drizzle/` changes.
  - Any new env vars/secrets.

## Security Practices

### Secret Handling

- Never commit secrets; `.env*` is gitignored except `.env.example` (`.gitignore`).
- Keep `.env.example` as placeholders only.
- Rotate secrets immediately if exposed outside local environment.

### Auth and Route Protection

- Protected route matching is configured centrally via `PROTECTED_ROUTE_PATTERNS` (derived from `PROTECTED_ROUTES` in `constants/routes.constant.ts`).
- Supabase session claims gate access in `lib/supabase/middleware.ts`.
- Add new protected routes to `PROTECTED_ROUTES` in `constants/routes.constant.ts`; patterns are derived automatically.

### API and Permission Hygiene

- `app/api/mail/send/route.ts` validates payload shape and requires Supabase authentication.
- Consider adding rate limiting before production use of email endpoints.

### Dependencies

- Dependencies are pinned in `package.json` with lockfile `pnpm-lock.yaml`.
- Use `pnpm install --frozen-lockfile` in CI-consistent environments.

## Common Workflows

### Add a New Feature

1. Add route/component in correct group (`app/(public)`, `app/(auth)`, `app/(protected)`).
2. If data is needed, add:
   - API route in `app/api/...`
   - service in `services/...`
   - query options in `queries/...`
3. If protected, add the route to `PROTECTED_ROUTES` in `constants/routes.constant.ts`.
4. If dashboard navigation changes, edit `constants/app-sidebar-items.constant.ts`.
5. Add/update tests in `tests/unit` or `tests/e2e`.

### Fix a Bug

1. Reproduce with an automated test where practical.
2. Patch the smallest layer first (UI, service/query, API, middleware, DB).
3. Verify with `pnpm lint && pnpm test:unit && pnpm build`.
4. Run `pnpm test:e2e` when routing/auth/UI behavior changed.

### Make Database Changes

1. Update schema in `drizzle/schemas/**`.
2. Generate migration with `pnpm db:migrate` and inspect SQL under `drizzle/migrations/`.
3. Apply migration via `pnpm db:update` (or `pnpm db:push` in development workflows).
4. Update affected types/services/routes (`types/drizzle.types.ts`, `services/*`, `app/api/*`).
5. Validate `/api/users/me` and related UI (`components/app-sidebar/*`, `hooks/use-auth.ts` via `useAuth`).

## Troubleshooting & FAQs

### “Why am I always redirected to `/login`?”

- Path is likely protected by `PROTECTED_ROUTE_PATTERNS` (from `constants/routes.constant.ts`), and session claims are missing (`lib/supabase/middleware.ts`).

### “Why is profile data null in the dashboard/sidebar?”

- `/api/users/me` looks up `profiles` row by Supabase user id (`app/api/users/me/route.ts`).
- Ensure a matching `profiles` record exists.

### “Build fails with env errors or runtime crashes”

- Verify required env vars in `.env.local`/`.env` and in CI secrets.
- Check usage points: `lib/supabase/*`, `lib/drizzle/db.ts`, `app/api/mail/send/route.ts`.

### “Playwright fails locally”

- Install browsers/deps: `pnpm exec playwright install --with-deps`.
- Confirm app can boot at `http://localhost:3000` (configured in `config/playwright.config.ts`).

### “Docs site won’t start”

- Ensure `docs/.vitepress/config.mts` exists and run `pnpm docs:development`.
- If stale cache issues occur, clear `docs/.vitepress/cache/`.

## Definition of Done Checklist

- [ ] Change scope is clear and limited to intended files.
- [ ] New/changed behavior is documented in code comments or docs when non-obvious.
- [ ] `pnpm lint` passes.
- [ ] `pnpm test:unit` passes.
- [ ] `pnpm test:e2e` passes for UI/routing/auth-impacting changes.
- [ ] `pnpm build` passes.
- [ ] DB migrations are generated/applied for schema changes (`drizzle/migrations/*`).
- [ ] New env vars are added to `.env.example` and typed in `types/globals/env.d.ts`.
- [ ] Security review completed for auth, API access, and secret usage.
- [ ] PR includes summary, testing evidence, and migration/env notes.

## File Naming Conventions

**Use kebab-case for ALL files:**

```text
✅ Correct:
- login-form.tsx
- user-profile-card.tsx
- use-auth.ts
- profile.service.ts
- seo.constant.ts

❌ Incorrect:
- LoginForm.tsx
- userProfileCard.tsx
- UseAuth.ts
```

### File Naming Patterns

| Category        | Pattern                                              | Example                                      |
| --------------- | ---------------------------------------------------- | -------------------------------------------- |
| Components      | `component-name.tsx`                                 | `password-input.tsx`                         |
| Pages           | `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx` | `app/(auth)/login/page.tsx`                  |
| Client pages    | `page.client.tsx`                                    | `app/(auth)/login/page.client.tsx`           |
| API routes      | `route.ts`                                           | `app/api/users/me/route.ts`                  |
| Hooks           | `use-hook-name.ts`                                   | `hooks/use-auth.ts`                          |
| Services        | `name.service.ts`                                    | `services/users.service.ts`                  |
| Query options   | `name.query.ts`                                      | `queries/user.query.ts`                      |
| Constants       | `name.constant.ts`                                   | `constants/seo.constant.ts`                  |
| Drizzle schemas | `name.schema.ts`                                     | `drizzle/schemas/profiles/profiles.schema.ts`|
| Zod schemas     | `name.schema.ts`                                     | `schemas/auth.schema.ts`                     |
| Types           | `name.types.ts`                                      | `types/drizzle.types.ts`                     |

## Project Structure

```text
project/
├── app/                           # Next.js App Router
│   ├── (auth)/                    # Auth route group (no URL segment)
│   │   ├── error.tsx              # Auth error boundary (card-based)
│   │   ├── layout.tsx             # Centered card layout with branding
│   │   ├── login/
│   │   │   ├── page.tsx           # Server entry → renders PageClient
│   │   │   └── page.client.tsx    # Client: email/password + OAuth form
│   │   ├── register/
│   │   │   ├── page.tsx
│   │   │   └── page.client.tsx
│   │   ├── forgot-password/
│   │   │   ├── page.tsx
│   │   │   └── page.client.tsx
│   │   └── reset-password/
│   │       ├── page.tsx
│   │       └── page.client.tsx
│   ├── (protected)/               # Protected route group (auth-gated via proxy.ts)
│   │   ├── error.tsx              # Protected error boundary
│   │   ├── layout.tsx             # Sidebar shell (SidebarProvider + SiteHeader + AppSidebar)
│   │   ├── loading.tsx            # Protected loading skeleton
│   │   └── dashboard/
│   │       └── page.tsx           # Server component (static placeholder)
│   ├── (public)/                  # Public marketing route group
│   │   ├── error.tsx              # Public error boundary
│   │   ├── page.tsx               # Server entry → renders PageClient
│   │   └── page.client.tsx        # Landing page with nav, hero, features
│   ├── api/
│   │   ├── healthcheck/route.ts   # GET: service health check
│   │   ├── users/me/route.ts      # GET: profile by Supabase user ID
│   │   └── mail/send/route.ts     # POST: send email via Resend (auth-gated)
│   ├── styles/globals.css
│   └── layout.tsx                 # Root layout: fonts, providers
├── components/
│   ├── app-sidebar/               # Dashboard sidebar shell
│   │   ├── index.tsx              # AppSidebar (use client)
│   │   ├── nav-drawer.tsx         # Collapsible nested nav
│   │   ├── nav-items.tsx          # Sidebar nav items (links with icons)
│   │   ├── nav-user.tsx           # User avatar + dropdown (use client)
│   │   └── site-header.tsx        # Sticky header + breadcrumb (use client)
│   ├── providers/                 # React context providers
│   │   ├── app-provider.tsx       # Toaster + TopLoader + TooltipProvider
│   │   ├── react-query-provider.tsx  # QueryClientProvider + DevTools
│   │   └── theme-provider.tsx     # next-themes ThemeProvider
│   ├── shared/                    # Reusable components across features
│   │   └── password-input.tsx     # Password input with show/hide toggle
│   └── ui/                        # Shadcn/Radix primitives (DO NOT MODIFY)
│       ├── avatar.tsx
│       ├── breadcrumb.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── collapsible.tsx
│       ├── dropdown-menu.tsx
│       ├── field.tsx
│       ├── input-group.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── separator.tsx
│       ├── sheet.tsx
│       ├── sidebar.tsx
│       ├── skeleton.tsx
│       ├── sonner.tsx
│       ├── textarea.tsx
│       └── tooltip.tsx
├── config/                        # Tool configs
│   ├── axios.config.ts            # Axios instance with base URL and headers
│   ├── drizzle.config.ts
│   ├── playwright.config.ts
│   └── vitest.config.mts
├── constants/                     # App-wide constants
│   ├── app-sidebar-items.constant.ts # Sidebar navigation items
│   ├── http-status.constant.ts    # HTTP status codes and HttpStatus object
│   ├── routes.constant.ts         # Route definitions (PUBLIC, AUTH, PROTECTED, API)
│   └── seo.constant.ts            # SEO metadata constants
├── docs/                          # VitePress documentation site
│   ├── .vitepress/config.mts
│   ├── index.md
│   ├── logo.png
│   └── overview.md
├── drizzle/                       # Database schema & migrations
│   ├── schemas/
│   │   ├── base.ts                # Shared columns: id, createdAt, updatedAt, deletedAt
│   │   ├── index.ts               # Re-exports all schemas
│   │   └── profiles/
│   │       └── profiles.schema.ts # profiles table
│   └── migrations/
│       └── 0000_InitialCreate.sql
├── hooks/                         # Custom React hooks
│   ├── use-auth.ts                # Supabase auth session + profile fetching via React Query
│   └── use-mobile.ts              # Viewport breakpoint detection
├── lib/                           # Utilities and helpers
│   ├── drizzle/db.ts              # Drizzle client (postgres.js driver)
│   ├── guards/
│   │   └── auth.guard.ts          # requireAuth() — Supabase auth guard for API routes
│   ├── query/
│   │   ├── get-query-client.ts    # TanStack QueryClient factory (SSR-aware)
│   │   └── get-query-keys.ts      # Hierarchical query key definitions
│   ├── response.ts                # apiResponse() — structured JSON response helper
│   ├── seo.ts                     # buildMetadata() helper
│   ├── supabase/
│   │   ├── client.ts              # Browser client (singleton)
│   │   ├── server.ts              # Server client (async, cookie-based)
│   │   └── middleware.ts          # Session refresh + route protection
│   └── utils.ts                   # cn() — clsx + tailwind-merge
├── queries/                       # TanStack Query option factories
│   └── user.query.ts
├── schemas/                       # Zod validation schemas
│   └── auth.schema.ts             # Login, register, forgot/reset password schemas
├── services/                      # API client wrappers (axios-based)
│   └── users.service.ts
├── tests/
│   ├── unit/utils.test.ts         # Vitest + jsdom
│   └── e2e/homepage.spec.ts       # Playwright (Chromium/Firefox/WebKit)
├── types/
│   ├── drizzle.types.ts           # SelectProfile, InsertProfile
│   └── globals/
│       ├── env.d.ts               # ProcessEnv type declarations
│       └── style.d.ts
├── proxy.ts                       # Next.js middleware entry (route protection)
├── next.config.ts                 # reactCompiler: true, output: "standalone"
├── components.json                # Shadcn/ui config
├── Dockerfile                     # Multi-stage Node 22 Alpine build
└── docker-compose.yml
```

## Atomic Design Pattern

**MANDATORY: Follow the component hierarchy in this project.**

### UI (`components/ui/`)

- Shadcn/Radix generated primitives (button, input, card, sidebar, etc.)
- **DO NOT MODIFY** — these are generated components
- Import and use as-is; extend via props, variants, or wrappers

### Shared (`components/shared/`)

- Reusable components used across multiple features
- Built on top of `components/ui/` primitives
- Examples: `password-input.tsx` (wraps `Input` with show/hide toggle)
- New shared components go here when used by 2+ features

### Feature Components (`components/app-sidebar/`, future `components/features/`)

- Domain-specific components organized by feature
- Can use shared components and UI primitives
- The sidebar shell lives in `components/app-sidebar/`
- New features should create their own directory: `components/features/<feature-name>/`

### Providers (`components/providers/`)

- React context providers and global wrappers
- Registered in root layout (`app/layout.tsx`) or route group layouts
- Provider nesting order (outermost → innermost):
  1. `ReactQueryProvider` — TanStack Query client + DevTools
  2. `AppProvider` — Toaster (sonner), TopLoader, TooltipProvider
  3. `ThemeProvider` — next-themes (dark/light/system)

### Component Hierarchy Rules

```text
ui/          → Base primitives (DO NOT MODIFY)
  ↑
shared/      → Reusable wrappers and compositions
  ↑
features/    → Domain-specific (sidebar, auth forms, etc.)
  ↑
providers/   → Context providers (wrap in layouts)
```

- `ui/` components must NOT import from `shared/` or `features/`
- `shared/` components can import from `ui/` only
- `features/` components can import from `ui/` and `shared/`
- `providers/` can import from any layer

## Next.js 16 App Router Patterns

### Route Groups

This project uses three route groups (parenthesized directories that don't create URL segments):

| Group         | Path                                                         | Purpose                | Layout                                 |
| ------------- | ------------------------------------------------------------ | ---------------------- | -------------------------------------- |
| `(public)`    | `/`                                                          | Marketing landing page | No layout (inherits root)              |
| `(auth)`      | `/login`, `/register`, `/forgot-password`, `/reset-password` | Auth flows             | Centered card with branding            |
| `(protected)` | `/dashboard/*`                                               | App shell (auth-gated) | Sidebar + header (SidebarProvider)     |

### Server/Client Split Pattern

**Every page uses the `page.tsx` → `page.client.tsx` split:**

```typescript
// app/(auth)/login/page.tsx — Server Component (thin entry)
import { PageClient } from "./page.client";

export default function Page() {
  return <PageClient />;
}
```

```typescript
// app/(auth)/login/page.client.tsx — Client Component (all interactivity)
"use client";

export const PageClient = () => {
  // hooks, forms, state, event handlers
};
```

**When to use this pattern:**

- Always for pages with forms, interactivity, or client state
- The server `page.tsx` can add `metadata`, fetch server data, or remain a thin wrapper
- Client logic stays in `page.client.tsx` — keeps the boundary explicit

### Root Layout Provider Chain

```typescript
// app/layout.tsx
<html lang="en" suppressHydrationWarning>
  <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
    <ReactQueryProvider>
      <AppProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </AppProvider>
    </ReactQueryProvider>
  </body>
</html>
```

### Protected Layout Shell

```typescript
// app/(protected)/layout.tsx
<div className="[--header-height:calc(--spacing(14))]">
  <SidebarProvider className="flex flex-col">
    <SiteHeader />
    <div className="flex flex-1">
      <AppSidebar />
      <SidebarInset>{children}</SidebarInset>
    </div>
  </SidebarProvider>
</div>
```

- Profile data is fetched via `useAuth()` hook (in `hooks/use-auth.ts`), not a dedicated provider
- CSS variable `--header-height` coordinates sticky header and sidebar offset
- Auth enforcement happens in `proxy.ts` middleware, not in the layout

### Middleware / Route Protection (`proxy.ts`)

```typescript
// proxy.ts — Next.js middleware entry
import { updateSession } from "@/lib/supabase/middleware";
import { PROTECTED_ROUTE_PATTERNS } from "@/constants/routes.constant";

export async function proxy(request: NextRequest) {
  return await updateSession(request, PROTECTED_ROUTE_PATTERNS);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/healthcheck|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```

- Uses `supabase.auth.getClaims()` (not `getUser()`) for performance — avoids a DB round-trip
- Supports wildcard patterns: `"/dashboard/*"` matches `/dashboard` and `/dashboard/**`
- Unauthenticated users are redirected to `/login?redirect=<original_path>`
- **Add new protected routes** to `PROTECTED_ROUTES` in `constants/routes.constant.ts`

### Metadata and SEO

```typescript
// In any page.tsx or layout.tsx
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Dashboard", // → "Dashboard | Next.js Supabase Template"
  description: "Your dashboard",
  path: "/dashboard", // canonical URL
  noIndex: false, // robots indexing
});
```

- `buildMetadata()` in `lib/seo.ts` generates `title`, `description`, `openGraph`, `twitter`, `robots`, and `alternates.canonical`
- SEO constants defined in `constants/seo.constant.ts` (`SITE_NAME`, `SITE_URL`, `DEFAULT_TITLE`, `DEFAULT_DESCRIPTION`)

### Adding a New Route

1. Choose the correct route group: `(public)`, `(auth)`, or `(protected)`
2. Create directory: `app/(<group>)/<route-name>/`
3. Add `page.tsx` (server entry) + `page.client.tsx` (client logic)
4. Add `metadata` export in `page.tsx` using `buildMetadata()`
5. If protected, ensure the path matches a pattern in `PROTECTED_ROUTES` in `constants/routes.constant.ts`
6. If it needs sidebar navigation, update `constants/app-sidebar-items.constant.ts`

## Supabase Integration Patterns

### Client-Side (Browser) — Singleton

```typescript
// lib/supabase/client.ts
import { createBrowserClient } from "@supabase/ssr";

let browserClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (!browserClient) {
    browserClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
    );
  }
  return browserClient;
}
```

- Singleton pattern — one client instance shared across all client components
- Use in `"use client"` components: `const supabase = getSupabaseClient()`

### Server-Side (API Routes, Server Components)

```typescript
// lib/supabase/server.ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function getSupabaseServer() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Silent catch: called from Server Component where cookies are read-only
            // Session refresh is handled by middleware instead
          }
        },
      },
    }
  );
}
```

- `async` because `cookies()` is awaited in Next.js 15+
- `setAll` has a silent try/catch for Server Component usage (cookies are read-only there)
- Use in API routes: `const supabase = await getSupabaseServer()`

### Authentication in API Routes

```typescript
// Pattern used in app/api/users/me/route.ts and app/api/mail/send/route.ts
// Via the requireAuth() guard in lib/guards/auth.guard.ts:
const { user, error } = await requireAuth();
if (error) return error;

// user.id matches profiles.id in Drizzle schema
```

### OAuth Login

```typescript
// Used in login page for GitHub/Google OAuth
const supabase = getSupabaseClient();

await supabase.auth.signInWithOAuth({
  provider: "github", // or "google"
  options: {
    redirectTo: `${window.location.origin}/dashboard`,
  },
});
```

### Database Queries (Drizzle ORM)

```typescript
// Prefer Drizzle ORM for type-safe queries
import { db } from "@/lib/drizzle/db";
import { profiles } from "@/drizzle/schemas";
import { eq } from "drizzle-orm";

const result = await db.select().from(profiles).where(eq(profiles.id, user.id)).limit(1);
```

- Drizzle connection in `lib/drizzle/db.ts` uses `postgres` (Postgres.js) driver with `prepare: false` for Supabase Transaction pooling mode
- Schema base columns (`drizzle/schemas/base.ts`): `id` (UUID PK), `createdAt`, `updatedAt`, `deletedAt` (soft delete)
- Inferred types: `SelectProfile` and `InsertProfile` in `types/drizzle.types.ts`

### Service → Query → Component Pattern

The data-fetching pattern flows in three layers:

```text
Service (services/*.service.ts)
  → fetch wrapper for API routes
  → handles HTTP errors, returns typed data or null

Query Options (queries/*.query.ts)
  → TanStack React Query queryOptions factory
  → hierarchical query keys: ["users", "me"]

Component (via useQuery or useAuth hook)
  → consumes query options with useQuery()
  → or via useAuth() hook (which wraps useQuery internally)
```

```typescript
// 1. Service — services/users.service.ts
export const usersService = {
  me: async (): Promise<SelectProfile | null> => {
    const response = await axiosInstance.get(API_ROUTES.USERS.ME);
    return response.data;
  },
};

// 2. Query Options — queries/user.query.ts
export const getUserQueryOptions = () =>
  queryOptions({
    queryKey: getQueryKey.users.me(), // ["users", "me"]
    queryFn: () => usersService.me(),
  });

// 3. Component — via useAuth() hook or direct useQuery
const { profile, isLoading } = useAuth();
// or directly: const { data: profile, isLoading } = useQuery(getUserQueryOptions());
```

## Error Handling

### Client-Side: Two-Level Pattern with Toast

All auth forms use a consistent two-level error handling pattern with `useTransition`:

```typescript
"use client";

import { toast } from "sonner";
import { useTransition } from "react";

const [isPending, startTransition] = useTransition();

const onFormSubmit = (values: FormValues) => {
  startTransition(async () => {
    try {
      const { error } = await supabase.auth.signInWithPassword(values);

      // Level 1: Expected errors from Supabase (invalid credentials, etc.)
      if (error) {
        toast.error("Login Failed", {
          description: "Invalid email or password. Please try again.",
        });
        return;
      }

      // Success path
      toast.success("Welcome back!", { description: "Redirecting to dashboard..." });
      router.replace("/dashboard");
    } catch (error) {
      // Level 2: Unexpected errors (network, runtime)
      console.error(error);
      toast.error("Something went wrong", {
        description: "There was an issue processing your request. Please try again later.",
      });
    }
  });
};
```

**Key patterns:**

- `useTransition` provides `isPending` for disabling submit buttons during async work
- `toast.error()` / `toast.success()` from `sonner` — positioned `top-center` via `AppProvider`
- Level 1: Supabase `error` object check (expected auth failures like wrong password)
- Level 2: `catch` block for network/unexpected errors
- `aria-invalid={fieldState.invalid}` on inputs for accessibility

### API Routes: Structured JSON Responses

```typescript
// Consistent API response shapes:

// Success
return NextResponse.json({ data: result }, { status: 200 });

// Auth failure
return NextResponse.json({ data: null, error }, { status: 401 });

// Validation error
return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });

// Server error (with try/catch)
try {
  // ... logic
} catch (error) {
  console.error("Error description:", error);
  return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
}
```

**Rules:**

- Never leak stack traces or internal error details to clients
- Always `console.error()` the real error for server-side debugging
- Use descriptive human-readable error messages in responses
- Auth-gate sensitive endpoints by checking `supabase.auth.getUser()` first

### Service Layer

```typescript
// services/users.service.ts pattern
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

- Services use the shared `axiosInstance` from `config/axios.config.ts`
- Service wraps in try/catch and returns null on failure — isolates error handling from the query layer
- Consumed via `useQuery` which exposes `{ data, error, isLoading }` states

### Form Validation Errors

```typescript
// Inline validation using react-hook-form + Zod
<Controller
  control={form.control}
  name="email"
  render={({ field, fieldState }) => (
    <div>
      <Input {...field} aria-invalid={fieldState.invalid} />
      <Activity mode={fieldState.error ? "visible" : "hidden"}>
        <FieldError errors={[fieldState.error]} />
      </Activity>
    </div>
  )}
/>
```

- Zod schema validates on submit via `zodResolver`
- React 19 `<Activity>` component shows/hides validation messages
- `aria-invalid` attribute for accessibility

### Error Boundaries

Error boundaries (`error.tsx`) exist in all three route groups:

- `app/(auth)/error.tsx` — Card-based error boundary with "Back to login" link
- `app/(protected)/error.tsx` — Inline error boundary with "Try again" button
- `app/(public)/error.tsx` — Full-page error boundary with "Go home" link

Each error boundary is a `"use client"` component that receives `{ error, reset }` props. The `reset()` function re-renders the route segment.

## Documentation (VitePress)

### Structure

```text
docs/
├── .vitepress/
│   └── config.mts        # VitePress configuration
├── index.md               # Home page (hero layout)
├── logo.png               # Site logo
└── overview.md            # Getting Started guide
```

### Configuration (`docs/.vitepress/config.mts`)

The VitePress configuration includes:

- Navigation with dynamic app URL from `NEXT_PUBLIC_APP_URL` env var (defaults to `http://localhost:3000/`)
- Getting Started section with overview guide
- Architecture section with pattern documentation (API responses, auth guards, form validation, routes, query keys, HTTP status)
- GitHub social links

### Running the Docs Site

```bash
pnpm docs:development   # Start VitePress dev server
pnpm docs:build         # Build for production
pnpm docs:preview       # Preview production build
```

Or run everything concurrently:

```bash
pnpm start:all      # App + Docs + Drizzle Studio in parallel
```

### Adding New Documentation Pages

1. Create a new `.md` file in `docs/` (e.g., `docs/database.md`) or in `docs/patterns/` for architecture patterns
2. Add it to the sidebar in `docs/.vitepress/config.mts` under the appropriate section
3. Use VitePress markdown features:
   - Frontmatter for page metadata
   - Code blocks with syntax highlighting
   - Custom containers (`::: tip`, `::: warning`, `::: danger`)
   - Vue components in markdown (if needed)

Existing pattern pages are located in `docs/patterns/` and cover API responses, auth guards, form validation, routes, query keys, and HTTP status codes.

### Documentation Standards

- Keep `docs/overview.md` as the canonical "Getting Started" guide
- Document new features, API routes, and architectural decisions in dedicated pages
- Reference code paths relative to project root (e.g., `lib/supabase/client.ts`)
- Include code examples that match actual project patterns
- If `docs/.vitepress/cache/` causes issues, clear it: `rm -rf docs/.vitepress/cache/`

## Import Order

Follow this exact import order, separated by blank lines:

```typescript
// 1. React/Next.js core
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

// 2. Third-party libraries
import { useQuery } from "@tanstack/react-query";
import { z } from "zod/v4";
import { useForm } from "react-hook-form";

// 3. Internal utilities and lib
import { cn } from "@/lib/utils";
import { getSupabaseClient } from "@/lib/supabase/client";

// 4. Services, queries, hooks
import { profileService } from "@/services/profile.service";
import { profileQueryOptions } from "@/queries/profile.query";
import { useAuth } from "@/hooks/use-auth";

// 5. Components (ui → shared → feature-specific)
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/shared/password-input";

// 6. Types
import type { SelectProfile } from "@/types/drizzle.types";

// 7. Styles (if any)
import "./component.css";
```

## TypeScript Standards

### Strict Typing Required

```typescript
// ✅ Good: Explicit types, no 'any'
interface UserProfileProps {
  userId: string;
  onUpdate?: (profile: SelectProfile) => void;
  className?: string;
}

export function UserProfile({ userId, onUpdate, className }: UserProfileProps) {
  // Implementation
}

// ❌ Bad: Any types, implicit typing
function UserProfile(props: any) {
  // ...
}
```

### Utility Types

Use TypeScript utility types when appropriate:

- `Partial<T>` — Make all properties optional
- `Pick<T, K>` — Select specific properties
- `Omit<T, K>` — Exclude specific properties
- `Record<K, V>` — Object with specific key/value types

### Type Organization

- Drizzle-inferred types go in `types/drizzle.types.ts`
- Global type extensions go in `types/globals/`
- Feature-specific types can live alongside their feature

## Component Patterns

### Component Structure Template

```typescript
// components/shared/example-card.tsx
"use client" // Only if needed

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface ExampleCardProps {
  title: string
  onAction?: () => void
  className?: string
}

export function ExampleCard({ title, onAction, className }: ExampleCardProps) {
  return (
    <div className={cn("rounded-lg border p-4", className)}>
      <h3 className="text-lg font-semibold">{title}</h3>
      {onAction && <Button onClick={onAction}>Action</Button>}
    </div>
  )
}
```

### Key Rules

- Always define an explicit props interface
- Include `className?: string` for style overrides
- Use `"use client"` only when the component needs interactivity, hooks, or browser APIs
- Use `cn()` from `@/lib/utils` for conditional Tailwind classes
- **DO NOT modify** files in `components/ui/` — these are Shadcn/Radix generated components

## State Management Patterns

### Local State (useState)

```typescript
const [isLoading, setIsLoading] = useState<boolean>(false);
const [user, setUser] = useState<SelectProfile | null>(null);
```

### Server State (TanStack React Query)

```typescript
// queries/profile.query.ts — define query options
import { queryOptions } from "@tanstack/react-query";
import { profileService } from "@/services/profile.service";

export const profileQueryOptions = queryOptions({
  queryKey: ["profile"],
  queryFn: () => profileService.getProfile(),
});

// In components — consume with useQuery
const { data: profile, isLoading } = useQuery(profileQueryOptions);
```

### Form State (react-hook-form + Zod)

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";

const schema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

type FormValues = z.infer<typeof schema>;

const form = useForm<FormValues>({
  resolver: zodResolver(schema),
});
```

### Global Client State (Zustand)

Zustand is installed but not yet in active use. When needed:

```typescript
// stores/example.store.ts
import { create } from "zustand";

interface ExampleStore {
  count: number;
  increment: () => void;
}

export const useExampleStore = create<ExampleStore>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));
```

### Shared Context (React Context)

Used for cross-component data in route groups. Profile data is currently fetched via the `useAuth()` hook (`hooks/use-auth.ts`), not a dedicated context provider.

## Performance Best Practices

### Prefer Server Components for Data Fetching

```typescript
// ✅ Good: Fetch in Server Component, pass to client
// app/(protected)/dashboard/page.tsx
export default async function DashboardPage() {
  const data = await fetchData()
  return <DashboardClient initialData={data} />
}

// ❌ Bad: useEffect fetch in client component
"use client"
export default function DashboardPage() {
  const [data, setData] = useState([])
  useEffect(() => { fetchData().then(setData) }, [])
}
```

### Image Optimization

```typescript
import Image from "next/image"

<Image
  src="/product.jpg"
  alt="Descriptive alt text"
  width={500}
  height={300}
  priority // For above-fold images
/>
```

### Client/Server Split

- Heavy data fetching and DB access → server components or API routes
- Interactive UI (forms, modals, state) → `"use client"` components
- Split pattern: `page.tsx` (server) renders `page.client.tsx` (client)

## Code Quality Checklist

Before submitting code, ensure:

- [ ] All files use kebab-case naming
- [ ] `"use client"` only when necessary
- [ ] Strict TypeScript — no `any` types
- [ ] Proper import order followed
- [ ] Error handling implemented (try/catch + toast for client, structured JSON for API)
- [ ] Loading states handled
- [ ] Props interfaces defined for all components
- [ ] Shadcn components imported from `components/ui/` (not modified directly)
- [ ] Tailwind classes use `cn()` utility for conditionals
- [ ] Form validation uses Zod schemas
- [ ] New env vars added to `.env.example` and typed in `types/globals/env.d.ts`
- [ ] `pnpm lint && pnpm test:unit && pnpm build` passes

## Common Anti-Patterns to Avoid

**Don't use `any` type:**

```typescript
// ❌ Bad
function process(data: any) {}
// ✅ Good
function process(data: SelectProfile) {}
```

**Don't mix Server and Client Component patterns:**

```typescript
// ❌ Bad: hooks in Server Component
export default async function Page() {
  const [state, setState] = useState(); // ERROR
}
// ✅ Good: separate into page.tsx + page.client.tsx
```

**Don't modify Shadcn UI components directly:**

```typescript
// ❌ Bad: editing components/ui/button.tsx
// ✅ Good: extend with variants or create a wrapper in components/shared/
```

**Don't use PascalCase for file names:**

```typescript
// ❌ Bad: LoginForm.tsx
// ✅ Good: login-form.tsx
```

**Don't fetch in useEffect when a server component or React Query would work:**

```typescript
// ❌ Bad: manual useEffect + fetch
// ✅ Good: server component data fetching or useQuery with queryOptions
```

## Assumptions and Open Questions

- Assumption: `dev` is the primary integration branch; adjust based on your team's workflow
- Assumption: Manual release/deploy process is acceptable; add CI/CD automation as needed
- Consideration: Signup flow relies on a Supabase database trigger to auto-create a `profiles` row when a user is created
- Consideration: Review branch protection rules to align with your team's release process
