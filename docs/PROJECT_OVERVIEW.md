# Project Overview

## Purpose

The Adoption Project (TAP) is a whitelist/adoption application platform for an upcoming Web3/NFT collection. It presents the whitelist process as an "adoption application" — a premium, experiential form rather than a generic corporate contact form.

## Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Public Website │────▶│  Next.js API     │────▶│  Supabase       │
│  (Landing,      │     │  Routes          │     │  (Postgres +    │
│   Apply, Check) │     │  (Server-side)   │     │   Auth + RLS)   │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                               │
                        ┌──────┴──────┐
                        │ Admin Panel │
                        │ (Protected) │
                        └─────────────┘
```

## Key Design Decisions

1. **No wallet connect in Phase 1** — Users manually enter wallet addresses
2. **Ceremonial signatures** — Canvas-drawn signatures, not blockchain signatures
3. **Centralized config** — `src/config/project.ts` for placeholder branding
4. **Admin-managed content** — Hero, FAQ, settings editable via admin panel
5. **Service role for submissions** — Public users cannot read/write applications directly
6. **RLS at database level** — Defense in depth beyond middleware

## Placeholder Branding

All placeholder identity is flagged in `src/config/project.ts` with `isPlaceholderBranding: true`. Replace before public launch.
