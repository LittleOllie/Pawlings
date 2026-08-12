# Deployment

## Vercel (Recommended)

1. Push code to GitHub
2. Import project in [vercel.com](https://vercel.com)
3. Set environment variables (see `.env.example`)
4. Deploy

### Environment Variables for Production

```
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
APP_TIMEZONE=UTC
```

Optional:
```
NEXT_PUBLIC_TURNSTILE_SITE_KEY=...
TURNSTILE_SECRET_KEY=...
```

### Build Settings

- Framework: Next.js
- Build command: `npm run build`
- Output: default

## Custom Domain

1. Vercel → Project → Settings → Domains
2. Add your domain and configure DNS
3. Update `NEXT_PUBLIC_SITE_URL`

## Post-Deployment Checklist

- [ ] Supabase migrations applied to production database
- [ ] Admin user created
- [ ] Environment variables set
- [ ] Branding replaced (see BRAND_REPLACEMENT_GUIDE.md)
- [ ] Legal pages reviewed
- [ ] Applications enabled in admin settings
- [ ] Turnstile enabled (recommended for production)
- [ ] Seed data removed from production
- [ ] Test application submission end-to-end
- [ ] Test admin login and review flow

## Supabase Production

- Use a dedicated Supabase project for production
- Enable RLS (included in migrations)
- Disable public sign-ups
- Review audit logs periodically
