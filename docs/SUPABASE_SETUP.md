# Supabase Setup

## 1. Create Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note your project URL and API keys from Settings → API

## 2. Apply Migrations

Migrations are in `supabase/migrations/`:

- `20250731000000_initial_schema.sql` — Tables, enums, triggers, seed data
- `20250731000001_rls_policies.sql` — Row Level Security policies

### Option A: Supabase CLI

```bash
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase db push
```

### Option B: SQL Editor

Copy and paste each migration file into the Supabase Dashboard SQL Editor and run.

## 3. Configure Auth

- Disable public sign-ups: Authentication → Settings → Disable "Enable email signups"
- Admin users are invited manually or created in the dashboard

## 4. Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

⚠️ **Never expose `SUPABASE_SERVICE_ROLE_KEY` to the browser.**

## 5. Create Admin User

```sql
-- After creating user in Auth dashboard:
INSERT INTO admin_profiles (id, display_name, role, is_active)
VALUES ('auth-user-uuid-here', 'Project Owner', 'owner', true);
```

## 6. Storage (Optional)

If using Supabase Storage for signature images instead of base64:

1. Create a `signatures` bucket (private)
2. Update submission API to upload to storage
3. Store `signature_path` instead of `signature_data`

Current implementation stores signatures as base64 in `signature_data` for simplicity.
