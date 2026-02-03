## Next.js + Supabase Template

A production-ready Next.js template with Supabase auth, Drizzle ORM, and a documentation site built with VitePress.

## Features

- App Router (Next.js 16)
- Supabase auth and session middleware
- Drizzle ORM with migrations
- React Query with optional devtools in development
- Tailwind CSS and a prebuilt UI kit
- VitePress docs in the docs/ folder
- Docker-ready with standalone output

## Requirements

- Node.js 20+
- pnpm

## Quick Start

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000

Edit the landing page at app/(public)/page.tsx.

## Environment Variables

Create a .env.local file (or use your own approach for secrets) with at least:

- DATABASE_URL
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

Optional for email:

- RESEND_API_KEY
- RESEND_EMAIL_FROM

## Scripts

- pnpm dev — Next.js dev server
- pnpm docs:dev — VitePress dev server
- pnpm db:push — Push schema changes
- pnpm db:migrate — Generate migrations
- pnpm db:update — Apply migrations
- pnpm db:studio — Drizzle Studio
- pnpm start:all — Run app, docs, and Drizzle Studio together

## Documentation

The documentation site lives in docs/. Run it with pnpm docs:dev.

## Docker

This template uses Next.js standalone output for smaller images. Build and run using Docker or docker-compose.
