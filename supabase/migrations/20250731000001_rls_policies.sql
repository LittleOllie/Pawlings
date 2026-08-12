-- Row Level Security policies

ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_tag_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE approved_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_status_history ENABLE ROW LEVEL SECURITY;

-- Helper: check if current user is an active admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_profiles
    WHERE id = auth.uid() AND is_active = true
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION admin_role()
RETURNS admin_role AS $$
  SELECT role FROM admin_profiles
  WHERE id = auth.uid() AND is_active = true;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Admin profiles: admins can read all, owners manage
CREATE POLICY admin_profiles_select ON admin_profiles
  FOR SELECT TO authenticated
  USING (is_admin());

CREATE POLICY admin_profiles_update ON admin_profiles
  FOR UPDATE TO authenticated
  USING (admin_role() = 'owner')
  WITH CHECK (admin_role() = 'owner');

-- Applications: admins only
CREATE POLICY applications_admin_all ON applications
  FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- No public read/write on applications (submissions via service role API)

-- Application tags: admins read, admin+ write
CREATE POLICY tags_select ON application_tags
  FOR SELECT TO authenticated
  USING (is_admin());

CREATE POLICY tags_write ON application_tags
  FOR ALL TO authenticated
  USING (admin_role() IN ('owner', 'admin'))
  WITH CHECK (admin_role() IN ('owner', 'admin'));

-- Tag assignments: admins
CREATE POLICY tag_assignments_admin ON application_tag_assignments
  FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Notes: admins
CREATE POLICY notes_admin ON application_notes
  FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Approved wallets: admins manage, public can check when enabled (via API only)
CREATE POLICY approved_wallets_admin ON approved_wallets
  FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Site settings: public read (limited fields via view), admin write
CREATE POLICY settings_public_read ON site_settings
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY settings_admin_write ON site_settings
  FOR UPDATE TO authenticated
  USING (admin_role() IN ('owner', 'admin'))
  WITH CHECK (admin_role() IN ('owner', 'admin'));

-- Content blocks: public read, admin write
CREATE POLICY content_public_read ON content_blocks
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY content_admin_write ON content_blocks
  FOR UPDATE TO authenticated
  USING (admin_role() IN ('owner', 'admin'))
  WITH CHECK (admin_role() IN ('owner', 'admin'));

-- Audit log: admins read, insert via service
CREATE POLICY audit_admin_read ON admin_audit_log
  FOR SELECT TO authenticated
  USING (is_admin());

CREATE POLICY audit_admin_insert ON admin_audit_log
  FOR INSERT TO authenticated
  WITH CHECK (is_admin());

-- Status history: admins
CREATE POLICY status_history_admin ON application_status_history
  FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Storage bucket for signatures (run separately in Supabase dashboard or via API)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('signatures', 'signatures', false);

-- Public settings view (excludes sensitive fields)
CREATE OR REPLACE VIEW public_site_settings AS
SELECT
  applications_open,
  applications_paused,
  opening_date,
  closing_date,
  max_submissions,
  signature_required,
  x_field_enabled,
  x_field_required,
  discord_field_enabled,
  discord_field_required,
  email_field_enabled,
  email_field_required,
  referral_field_enabled,
  checker_enabled,
  checker_heading,
  checker_closed_message,
  project_name,
  project_short_name,
  project_tagline,
  project_description,
  support_email,
  x_url,
  discord_url,
  website_url,
  announcement_message,
  public_status_wording,
  display_timezone
FROM site_settings
LIMIT 1;
