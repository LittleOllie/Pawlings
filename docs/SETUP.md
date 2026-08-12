# Setup Guide

## Prerequisites

- Node.js 20+
- npm 10+
- A Supabase project (free tier works for development)

## Local Development

1. **Clone and install**
   ```bash
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env.local
   ```

   Fill in:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

3. **Apply database migrations**
   
   See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for detailed instructions.

4. **Create first admin user**
   
   In Supabase Dashboard → Authentication → Users → Add user.
   
   Then in SQL Editor:
   ```sql
   INSERT INTO admin_profiles (id, display_name, role)
   VALUES ('YOUR-USER-UUID', 'Admin', 'owner');
   ```

5. **Seed development data (optional)**
   ```bash
   npm run db:seed
   ```

6. **Start dev server**
   ```bash
   npm run dev
   ```

## Enable Applications

1. Sign in to `/admin/login`
2. Go to Settings → Applications
3. Toggle "Applications open"
4. Optionally set opening/closing dates

## Enable Whitelist Checker

1. Admin → Settings → Whitelist Checker
2. Toggle "Enable checker"
3. Add approved wallets via Approved Wallets page
4. Public `/check` route becomes active
