-- Pawlings Phase 2 — holder dashboard (pre-mint care state)
-- Security: RLS enabled with NO public/authenticated policies.
-- All access is via server-side API routes using SUPABASE_SERVICE_ROLE_KEY (bypasses RLS).

CREATE TABLE holder_profiles (
  wallet_address TEXT PRIMARY KEY,
  wallet_address_normalized TEXT UNIQUE NOT NULL,
  treats INTEGER NOT NULL DEFAULT 150 CHECK (treats >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_holder_profiles_normalized ON holder_profiles (wallet_address_normalized);

CREATE TABLE pawling_care_state (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address_normalized TEXT NOT NULL,
  pawling_token_id TEXT NOT NULL,
  hunger INTEGER NOT NULL DEFAULT 70 CHECK (hunger >= 0 AND hunger <= 100),
  happiness INTEGER NOT NULL DEFAULT 75 CHECK (happiness >= 0 AND happiness <= 100),
  bond INTEGER NOT NULL DEFAULT 40 CHECK (bond >= 0 AND bond <= 100),
  xp INTEGER NOT NULL DEFAULT 0 CHECK (xp >= 0),
  level INTEGER NOT NULL DEFAULT 1 CHECK (level >= 1),
  growth_stage INTEGER NOT NULL DEFAULT 1 CHECK (growth_stage >= 1 AND growth_stage <= 3),
  last_fed_at TIMESTAMPTZ,
  last_played_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (wallet_address_normalized, pawling_token_id)
);

CREATE INDEX idx_pawling_care_wallet ON pawling_care_state (wallet_address_normalized);

CREATE TABLE pawling_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address_normalized TEXT NOT NULL,
  pawling_token_id TEXT,
  activity_type TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_pawling_activity_wallet ON pawling_activity (wallet_address_normalized, created_at DESC);

CREATE TABLE social_mission_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address_normalized TEXT NOT NULL,
  mission_id TEXT NOT NULL,
  period_key TEXT NOT NULL,
  reward INTEGER NOT NULL DEFAULT 0 CHECK (reward >= 0),
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (wallet_address_normalized, mission_id, period_key)
);

CREATE INDEX idx_social_missions_wallet ON social_mission_completions (wallet_address_normalized);

CREATE TABLE daily_care_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address_normalized TEXT NOT NULL,
  task_id TEXT NOT NULL,
  period_key TEXT NOT NULL,
  reward_treats INTEGER NOT NULL DEFAULT 0 CHECK (reward_treats >= 0),
  reward_xp INTEGER NOT NULL DEFAULT 0 CHECK (reward_xp >= 0),
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (wallet_address_normalized, task_id, period_key)
);

CREATE INDEX idx_daily_care_wallet ON daily_care_completions (wallet_address_normalized, period_key);

-- Row Level Security: enabled, no permissive policies for anon/authenticated.
-- Browser clients must use /api/dashboard/* routes (service role server-side).

ALTER TABLE holder_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE pawling_care_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE pawling_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_mission_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_care_completions ENABLE ROW LEVEL SECURITY;
