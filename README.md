# Next.js + Supabase Template

A full-stack starter template with **Next.js 16**, **Supabase** authentication & database, and **Drizzle ORM**. Production-ready with pre-configured authentication, database migrations, testing, and deployment setup.

## 📦 What's Included

- **Frontend**: Next.js 16 (App Router) + React 19 + TypeScript
- **Authentication**: Supabase Auth (email/password + OAuth)
- **Database**: PostgreSQL via Supabase + Drizzle ORM
- **UI**: Shadcn/Radix components + Tailwind CSS v4
- **State Management**: TanStack React Query + Zustand
- **Forms**: react-hook-form + Zod validation
- **Testing**: Vitest (unit) + Playwright (E2E)
- **Code Quality**: ESLint, Prettier, TypeScript strict mode
- **Deployment**: Docker + Docker Compose
- **Documentation**: VitePress site included
- **CI/CD**: GitHub Actions workflows

## 🚀 Installation

### 1. Clone & Install

```bash
git clone https://github.com/WannaCry081/Nextjs-Supabase-Template.git
cd nextjs-supabase-template
pnpm install
```

### 2. Environment Setup

```bash
cp .env.example .env.local
```

Fill in `.env.local` with your Supabase credentials:

```bash
# Get from Supabase > Settings > API
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-anon-key

# Get from Supabase > Settings > Database > Connection String (URI)
DATABASE_URL=postgresql://postgres:password@db.your-project.supabase.co:5432/postgres

# Optional: Resend for emails
RESEND_API_KEY=your-resend-key
RESEND_EMAIL_FROM=noreply@example.com

# App URL (default: http://localhost:3000)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Initialize Database & Run

```bash
pnpm db:push                # Push migrations to Supabase
pnpm dev                    # Start dev server at http://localhost:3000
```

## 📚 Available Commands

```bash
# Development
pnpm dev                    # Dev server
pnpm start:all              # App + docs + DB studio in parallel
pnpm build                  # Production build
pnpm start                  # Run production build

# Database
pnpm db:push                # Apply migrations
pnpm db:migrate <name>      # Generate migration
pnpm db:studio              # Open Drizzle Studio

# Code Quality
pnpm lint                   # Check linting
pnpm lint:fix               # Fix lint errors
pnpm format                 # Format code

# Testing
pnpm test:unit              # Unit tests (Vitest)
pnpm test:e2e               # E2E tests (Playwright)
pnpm test:e2e:debug         # Debug E2E tests

# Documentation
pnpm docs:dev               # VitePress dev server
pnpm docs:build             # Build docs
```

## 📁 Project Structure

```text
app/                    # Next.js pages & API routes
  (auth)/              # Login, register, password reset
  (protected)/         # Dashboard (auth-gated)
  (public)/            # Landing page
  api/                 # API endpoints
components/            # React components
  ui/                  # Shadcn/Radix primitives
  shared/              # Reusable components
  providers/           # Context providers
lib/                   # Utilities
  supabase/           # Auth + database clients
  drizzle/            # ORM setup
hooks/                # Custom React hooks
drizzle/              # Database schemas & migrations
services/             # API wrappers
queries/              # React Query options
types/                # TypeScript definitions
constants/            # App constants
tests/                # Unit & E2E tests
docs/                 # VitePress documentation
```

Complete structure and patterns documented in **[AGENTS.md](./AGENTS.md)**.

## 🔐 Authentication

### Features

- Email/password login & signup
- OAuth (GitHub, Google)
- Password reset
- Protected routes

## 💾 Database

### Schema Management

```bash
# Generate drizzle migration
pnpm db:migrate AddMyColumn

# Updates a record in the database using Drizzle ORM.
pnpm db:update

# Apply changes
pnpm db:push
```

### Migrations

Auto-generated migrations live in `drizzle/migrations/` as SQL files. Use `pnpm db:studio` for visual DB management.

## 🧪 Testing

```bash
# Unit tests
pnpm test:unit

# E2E tests (Chromium, Firefox, WebKit)
pnpm test:e2e
pnpm test:e2e:ui          # With UI
```

Tests run on push/PR via GitHub Actions.

## 🐳 Docker Deployment

```bash
docker-compose up -d   # Start containerized app
docker-compose down    # Stop
```

Requires `.env` file with all variables. Multi-stage build uses Node 22 Alpine for a lean production image.

## 🔧 Configuration Files

| File                 | Purpose                          |
| -------------------- | -------------------------------- |
| `tsconfig.json`      | TypeScript (strict mode)         |
| `next.config.ts`     | Next.js (React Compiler enabled) |
| `tailwind.config.ts` | Tailwind CSS                     |
| `proxy.ts`           | Route protection middleware      |
| `components.json`    | Shadcn/ui config                 |

## 📚 Documentation

- **[AGENTS.md](./AGENTS.md)** — Full developer guide (architecture, patterns, conventions)
- **[Next.js Docs](https://nextjs.org/docs)** — Framework reference
- **[Supabase Docs](https://supabase.com/docs)** — Auth & database
- **[Drizzle ORM](https://orm.drizzle.team)** — Type-safe queries
- **[Tailwind CSS](https://tailwindcss.com)** — Styling

## 💬 Questions?

See [AGENTS.md](./AGENTS.md) for detailed setup, architecture, and workflow documentation.
