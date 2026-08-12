# Security

## Authentication

- Admin auth via Supabase Auth (email/password)
- No public sign-up — admins invited manually
- Middleware protects `/admin/*` routes (except login)
- Server-side `requireAdmin()` on all API routes

## Database Security

- Row Level Security (RLS) on all tables
- Public users cannot read/write applications
- Submissions via service role API only
- Admin operations require authenticated session + role check

## Application Safety

Phase 1 explicitly does NOT:
- Request seed phrases or private keys
- Connect wallets
- Initiate blockchain transactions
- Request message/transaction signatures

See `src/lib/wallet-safety.ts` and `docs/FUTURE_WALLET_FEATURES.md`.

## Spam Protection

- Honeypot field on application form
- Server-side rate limiting (IP hash, not raw IP)
- Optional Cloudflare Turnstile (env-controlled)
- Input length limits and signature size cap
- Client + server validation (Zod)

## Data Privacy

- Raw IP addresses not stored by default
- Privacy-conscious IP hashing for rate limiting
- Signatures stored for review only
- CSV exports logged in audit trail

## Secrets

| Variable | Exposure |
|----------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Public |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server only** |
| `TURNSTILE_SECRET_KEY` | **Server only** |

## Production Recommendations

1. Enable Turnstile for public forms
2. Set Supabase Auth rate limits
3. Use HTTPS only (Vercel default)
4. Review RLS policies after schema changes
5. Rotate service role key if compromised
6. Monitor audit logs for suspicious activity
