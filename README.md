# The Adoption Project — Whitelist Application Platform

A production-ready Web3 whitelist / adoption application platform built with Next.js 15, TypeScript, Tailwind CSS, and Supabase.

> **Note:** This project uses **placeholder branding** (`The Adoption Project` / `TAP`). Replace branding via `src/config/project.ts` and the admin settings panel before launch. See [docs/BRAND_REPLACEMENT_GUIDE.md](docs/BRAND_REPLACEMENT_GUIDE.md).

## Features

- Public landing page with configurable content
- Multi-step adoption application form with signature pad
- Admin dashboard with application review, CSV export/import
- Approved wallet management and future-ready whitelist checker
- Role-based admin access (owner, admin, reviewer, read_only)
- Supabase RLS security, rate limiting, honeypot spam protection
- Optional Cloudflare Turnstile integration

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Fill in Supabase credentials

# Run Supabase migrations (see docs/SUPABASE_SETUP.md)
# Apply migrations in supabase/migrations/

# Seed development data (optional)
npm run db:seed

# Start development server
npm run dev
```

Open [http://localhost:3010](http://localhost:3010).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | TypeScript check |
| `npm run test` | Run unit tests (Vitest) |
| `npm run test:e2e` | Run E2E tests (Playwright) |
| `npm run db:seed` | Seed development data |
| `npm run db:seed:clean` | Remove seed data |

## Documentation

- [Project Overview](docs/PROJECT_OVERVIEW.md)
- [Setup Guide](docs/SETUP.md)
- [Supabase Setup](docs/SUPABASE_SETUP.md)
- [Database Schema](docs/DATABASE_SCHEMA.md)
- [Admin Guide](docs/ADMIN_GUIDE.md)
- [Brand Replacement](docs/BRAND_REPLACEMENT_GUIDE.md)
- [Deployment](docs/DEPLOYMENT.md)
- [Security](docs/SECURITY.md)
- [Future Wallet Features](docs/FUTURE_WALLET_FEATURES.md)

## Routes

### Public
- `/` — Landing page
- `/apply` — Application form
- `/application/success` — Submission confirmation
- `/check` — Whitelist checker (placeholder until enabled)
- `/privacy` — Privacy policy
- `/terms` — Terms of use

### Admin
- `/admin/login` — Admin authentication
- `/admin` — Dashboard
- `/admin/applications` — Application management
- `/admin/applications/[id]` — Application review
- `/admin/approved-wallets` — Approved wallet management
- `/admin/settings` — Site settings
- `/admin/team` — Team management (owner only)

## Safety

This application **never** requests seed phrases, private keys, wallet connections, or blockchain transactions. The drawn signature is ceremonial only. See [docs/FUTURE_WALLET_FEATURES.md](docs/FUTURE_WALLET_FEATURES.md) for Phase 2 wallet functionality guidelines.

## License

Private — All rights reserved.
