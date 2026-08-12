# Brand Replacement Guide

This project uses **temporary placeholder branding**. Replace before public launch.

## 1. Project Configuration

Edit `src/config/project.ts`:

```typescript
export const projectConfig = {
  name: "Your Project Name",
  shortName: "YPN",
  tagline: "Your tagline here",
  // ... update all fields
  isPlaceholderBranding: false, // Set to false when done
};
```

## 2. Visual Assets

Replace files in `public/branding/`:

| File | Purpose |
|------|---------|
| `logo-placeholder.svg` | Header/footer logo |
| `hero-placeholder.svg` | Hero section artwork |
| `collection-placeholder-01.svg` | Collection preview card 1 |
| `collection-placeholder-02.svg` | Collection preview card 2 |
| `collection-placeholder-03.svg` | Collection preview card 3 |

Update image references if filenames change.

## 3. Colors & Typography

Edit `src/app/globals.css` `@theme` block:

- `--color-accent` — Primary accent color
- `--color-highlight` — Secondary highlight
- `--color-background` — Page background
- `--font-display` — Headline font

## 4. Admin-Managed Content

Via Admin → Settings → Content:
- Hero title and body
- About copy
- FAQ (edit via content_blocks in database)
- Success/closed messages

Or update via Supabase `content_blocks` table directly.

## 5. Social Links

Update in admin Settings → Project Identity, or `projectConfig`.

## 6. Legal Pages

Replace placeholder content in:
- `src/app/privacy/page.tsx`
- `src/app/terms/page.tsx`

Have legal counsel review before launch.

## 7. Terminology

If moving away from "adoption" theme, update:
- `applicationLabel`, `applicantLabel` in project config
- Form labels in `src/components/application/application-form.tsx`
- Landing page copy in content blocks

## Checklist

- [ ] Update `src/config/project.ts`
- [ ] Replace branding SVGs
- [ ] Update colors/fonts in globals.css
- [ ] Update admin content blocks
- [ ] Replace legal pages
- [ ] Set `isPlaceholderBranding: false`
- [ ] Update `.env.local` with production URLs
- [ ] Remove seed data from production database
