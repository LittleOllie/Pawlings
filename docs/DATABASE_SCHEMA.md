# Database Schema

## Tables

### applications
Primary application submissions with wallet, social details, response, signature, and review status.

### admin_profiles
Linked to `auth.users`. Roles: owner, admin, reviewer, read_only.

### application_tags / application_tag_assignments
Flexible tagging system (OG, Artist, Builder, etc.) with many-to-many assignments.

### application_notes
Internal admin notes per application.

### approved_wallets
Whitelist entries for the public checker. Unique on normalized wallet address.

### site_settings
Singleton configuration for applications, form fields, checker, project identity.

### content_blocks
Editable content (hero, FAQ, about, etc.) keyed by string identifier.

### admin_audit_log
Audit trail for admin actions.

### application_status_history
Tracks status changes with timestamps and admin attribution.

## Enums

- `application_status`: pending, reviewing, approved, waitlisted, rejected, archived
- `admin_role`: owner, admin, reviewer, read_only
- `referral_source`: x, discord, friend, community, other

## Security

All tables have RLS enabled. Public users cannot read applications. Submissions go through server-side API using service role key.

See migration files for full schema definitions.
