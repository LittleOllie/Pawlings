-- Community collaboration applications (separate from adoption applications)

CREATE TABLE collaboration_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reference_code TEXT UNIQUE NOT NULL,
  collection_name TEXT NOT NULL,
  website TEXT,
  x_handle TEXT,
  x_handle_normalized TEXT,
  discord TEXT,
  collection_size TEXT,
  blockchain TEXT,
  collaboration_pitch TEXT NOT NULL,
  spots_requested INTEGER,
  additional_notes TEXT,
  dream_collaborations TEXT,
  status application_status NOT NULL DEFAULT 'pending',
  review_notes TEXT,
  reviewed_by UUID REFERENCES admin_profiles(id),
  reviewed_at TIMESTAMPTZ,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  submission_source TEXT DEFAULT 'web',
  submission_ip_hash TEXT
);

CREATE INDEX idx_collaboration_applications_status ON collaboration_applications(status);
CREATE INDEX idx_collaboration_applications_submitted_at ON collaboration_applications(submitted_at DESC);
CREATE INDEX idx_collaboration_applications_reference ON collaboration_applications(reference_code);

ALTER TABLE collaboration_applications ENABLE ROW LEVEL SECURITY;
