-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enums
CREATE TYPE application_status AS ENUM (
  'pending', 'reviewing', 'approved', 'waitlisted', 'rejected', 'archived'
);

CREATE TYPE admin_role AS ENUM (
  'owner', 'admin', 'reviewer', 'read_only'
);

CREATE TYPE referral_source AS ENUM (
  'x', 'discord', 'friend', 'community', 'other'
);

-- Admin profiles (linked to auth.users)
CREATE TABLE admin_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  role admin_role NOT NULL DEFAULT 'reviewer',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Applications
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reference_code TEXT UNIQUE NOT NULL,
  wallet_address TEXT NOT NULL,
  wallet_address_normalized TEXT NOT NULL,
  x_handle TEXT,
  x_handle_normalized TEXT,
  discord_username TEXT,
  email TEXT,
  referral_source referral_source,
  application_answer TEXT NOT NULL,
  signature_path TEXT,
  signature_data TEXT,
  status application_status NOT NULL DEFAULT 'pending',
  review_notes TEXT,
  reviewed_by UUID REFERENCES admin_profiles(id),
  reviewed_at TIMESTAMPTZ,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  archived_at TIMESTAMPTZ,
  consent_wallet_owner BOOLEAN NOT NULL DEFAULT false,
  consent_no_guarantee BOOLEAN NOT NULL DEFAULT false,
  privacy_consent BOOLEAN NOT NULL DEFAULT false,
  submission_source TEXT,
  submission_ip_hash TEXT
);

CREATE UNIQUE INDEX idx_applications_wallet_active
  ON applications (wallet_address_normalized)
  WHERE archived_at IS NULL AND status != 'archived';

CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_submitted_at ON applications(submitted_at DESC);
CREATE INDEX idx_applications_x_handle ON applications(x_handle_normalized);
CREATE INDEX idx_applications_reference ON applications(reference_code);

-- Application tags
CREATE TABLE application_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  color TEXT NOT NULL DEFAULT '#c4785a',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE application_tag_assignments (
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES application_tags(id) ON DELETE CASCADE,
  assigned_by UUID REFERENCES admin_profiles(id),
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (application_id, tag_id)
);

-- Application notes
CREATE TABLE application_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  admin_id UUID NOT NULL REFERENCES admin_profiles(id),
  note TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Approved wallets
CREATE TABLE approved_wallets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_address TEXT NOT NULL,
  wallet_address_normalized TEXT UNIQUE NOT NULL,
  source TEXT NOT NULL DEFAULT 'manual',
  application_id UUID REFERENCES applications(id),
  allocation_type TEXT,
  allocation_amount INTEGER,
  notes TEXT,
  added_by UUID REFERENCES admin_profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_approved_wallets_normalized ON approved_wallets(wallet_address_normalized);

-- Site settings (singleton)
CREATE TABLE site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  applications_open BOOLEAN NOT NULL DEFAULT true,
  applications_paused BOOLEAN NOT NULL DEFAULT false,
  opening_date TIMESTAMPTZ,
  closing_date TIMESTAMPTZ,
  max_submissions INTEGER,
  allow_duplicate_wallets BOOLEAN NOT NULL DEFAULT false,
  signature_required BOOLEAN NOT NULL DEFAULT false,
  signature_fallback_enabled BOOLEAN NOT NULL DEFAULT false,
  x_field_enabled BOOLEAN NOT NULL DEFAULT true,
  x_field_required BOOLEAN NOT NULL DEFAULT false,
  discord_field_enabled BOOLEAN NOT NULL DEFAULT true,
  discord_field_required BOOLEAN NOT NULL DEFAULT false,
  email_field_enabled BOOLEAN NOT NULL DEFAULT false,
  email_field_required BOOLEAN NOT NULL DEFAULT false,
  referral_field_enabled BOOLEAN NOT NULL DEFAULT true,
  checker_enabled BOOLEAN NOT NULL DEFAULT false,
  checker_heading TEXT NOT NULL DEFAULT 'Whitelist Checker',
  checker_approved_message TEXT NOT NULL DEFAULT 'Your wallet is on the approved list.',
  checker_not_approved_message TEXT NOT NULL DEFAULT 'This wallet was not found on the approved list.',
  checker_closed_message TEXT NOT NULL DEFAULT 'The whitelist checker is not yet available.',
  project_name TEXT NOT NULL DEFAULT 'The Adoption Project',
  project_short_name TEXT NOT NULL DEFAULT 'TAP',
  project_tagline TEXT NOT NULL DEFAULT 'Find your place. Join the family.',
  project_description TEXT NOT NULL DEFAULT 'A mysterious new Web3 collection is looking for its earliest adopters.',
  support_email TEXT NOT NULL DEFAULT 'hello@example.com',
  x_url TEXT NOT NULL DEFAULT 'https://x.com/example',
  discord_url TEXT NOT NULL DEFAULT '',
  website_url TEXT NOT NULL DEFAULT '',
  announcement_message TEXT,
  public_status_wording TEXT NOT NULL DEFAULT 'Applications are now open.',
  display_timezone TEXT NOT NULL DEFAULT 'UTC',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Content blocks
CREATE TABLE content_blocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  title TEXT,
  content TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Admin audit log
CREATE TABLE admin_audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID REFERENCES admin_profiles(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_log_created ON admin_audit_log(created_at DESC);
CREATE INDEX idx_audit_log_admin ON admin_audit_log(admin_id);

-- Status history
CREATE TABLE application_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  from_status application_status,
  to_status application_status NOT NULL,
  changed_by UUID REFERENCES admin_profiles(id),
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_applications_updated_at
  BEFORE UPDATE ON applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_admin_profiles_updated_at
  BEFORE UPDATE ON admin_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_application_notes_updated_at
  BEFORE UPDATE ON application_notes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_approved_wallets_updated_at
  BEFORE UPDATE ON approved_wallets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_content_blocks_updated_at
  BEFORE UPDATE ON content_blocks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Insert default site settings
INSERT INTO site_settings (id) VALUES (uuid_generate_v4());

-- Insert default content blocks
INSERT INTO content_blocks (key, title, content) VALUES
  ('hero_title', 'Hero Title', 'Every collection needs a beginning. Every story needs its first believers.'),
  ('hero_body', 'Hero Body', 'Submit your adoption application for the chance to become part of an upcoming Web3 collection from day one.'),
  ('hero_eyebrow', 'Hero Eyebrow', 'Applications now open'),
  ('about_copy', 'About', 'This is not simply another whitelist form. We are looking for people who genuinely connect with the world we are building. Tell us who you are, leave your mark, and apply to become one of the project''s earliest adopters.'),
  ('success_message', 'Success Message', 'Your application has been received. This does not guarantee whitelist approval. The project team will review applications and publish or communicate the next steps when ready.'),
  ('closed_message', 'Applications Closed', 'Applications are currently closed. Follow us on X for updates on when they reopen.'),
  ('final_cta_title', 'Final CTA', 'Ready to leave your mark?'),
  ('why_apply_intro', 'Why Apply Intro', 'Join the earliest wave of adopters and help shape what comes next.');

-- Insert default tags
INSERT INTO application_tags (name, color) VALUES
  ('OG', '#c4785a'),
  ('Artist', '#7a9e7e'),
  ('Builder', '#6b8ec4'),
  ('Community', '#c4a35a'),
  ('Friend', '#9e7ac4'),
  ('High priority', '#c45a5a'),
  ('Review later', '#6b665e');

-- Insert FAQ content as JSON in content_blocks
INSERT INTO content_blocks (key, title, content) VALUES
  ('faq', 'FAQ', '[
    {"question":"What is an adoption application?","answer":"An adoption application is our way of finding early believers who connect with the project. You share your wallet, tell us about yourself, and leave a ceremonial signature — no blockchain transaction required."},
    {"question":"Is this a guaranteed whitelist spot?","answer":"No. Submitting an application does not guarantee approval. The team reviews each application individually."},
    {"question":"Do I need to connect my wallet?","answer":"No wallet connection is required. Simply enter your Ethereum wallet address manually."},
    {"question":"Why do you need my wallet address?","answer":"Your wallet address is used solely for whitelist consideration. We will never ask for your seed phrase, private key, or request any transaction."},
    {"question":"Is an X handle required?","answer":"X handle is optional but recommended. It helps the team reach you if needed."},
    {"question":"What is the signature used for?","answer":"The drawn signature is ceremonial — part of the adoption application experience. It is not a blockchain signature and does not authorise any transaction."},
    {"question":"Can I edit my application?","answer":"Once submitted, applications cannot be edited. If you need to make changes, contact the team via the support email."},
    {"question":"When will applications close?","answer":"Application closing dates will be announced on the homepage and social channels when confirmed."},
    {"question":"How will successful applicants be notified?","answer":"Approved applicants will be notified through project channels. Check back here or follow us on X for updates."},
    {"question":"Is this financial advice?","answer":"No. Nothing on this site constitutes financial advice. This is an application process for a creative Web3 project."}
  ]'),
  ('how_it_works', 'How It Works', '[
    {"step":1,"title":"Enter your wallet","description":"Paste the Ethereum address you want considered. No wallet connect or transaction."},
    {"step":2,"title":"Add socials (optional)","description":"Drop your X or Discord handle if you want the team to reach you."},
    {"step":3,"title":"Submit","description":"That''s it. The team reviews submissions and shares next steps when ready."}
  ]'),
  ('collection_preview', 'Collection Preview', '[
    {"title":"The World","description":"A place waiting to be discovered."},
    {"title":"The Characters","description":"Beings with stories yet untold."},
    {"title":"The Community","description":"The family that makes it all matter."},
    {"title":"The Adoption","description":"Your place in the beginning."}
  ]'),
  ('why_apply', 'Why Apply', '[
    {"title":"Early access consideration","description":"Be among the first considered for whitelist allocation when the project launches."},
    {"title":"Community participation","description":"Join a community of early believers and help shape the project from the start."},
    {"title":"Project updates","description":"Stay informed about development progress, reveals, and upcoming milestones."}
  ]');
