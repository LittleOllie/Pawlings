export type ApplicationStatus =
  | "pending"
  | "reviewing"
  | "approved"
  | "waitlisted"
  | "rejected"
  | "archived";

export type AdminRole = "owner" | "admin" | "reviewer" | "read_only";

export type ReferralSource =
  | "x"
  | "discord"
  | "friend"
  | "community"
  | "other";

export interface Application {
  id: string;
  reference_code: string;
  wallet_address: string;
  wallet_address_normalized: string;
  x_handle: string | null;
  x_handle_normalized: string | null;
  discord_username: string | null;
  email: string | null;
  referral_source: ReferralSource | null;
  application_answer: string;
  signature_path: string | null;
  signature_data: string | null;
  status: ApplicationStatus;
  review_notes: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  submitted_at: string;
  updated_at: string;
  archived_at: string | null;
  consent_wallet_owner: boolean;
  consent_no_guarantee: boolean;
  privacy_consent: boolean;
  submission_source: string | null;
}

export interface AdminProfile {
  id: string;
  display_name: string | null;
  role: AdminRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CollaborationApplication {
  id: string;
  reference_code: string;
  collection_name: string;
  website: string | null;
  x_handle: string | null;
  x_handle_normalized: string | null;
  discord: string | null;
  collection_size: string | null;
  blockchain: string | null;
  collaboration_pitch: string;
  spots_requested: number | null;
  additional_notes: string | null;
  dream_collaborations: string | null;
  status: ApplicationStatus;
  review_notes: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  submitted_at: string;
  updated_at: string;
  submission_source: string | null;
  submission_ip_hash: string | null;
}

export interface ApplicationNote {
  id: string;
  application_id: string;
  admin_id: string;
  note: string;
  created_at: string;
  updated_at: string;
}

export interface ApplicationTag {
  id: string;
  name: string;
  color: string;
  created_at: string;
}

export interface ApprovedWallet {
  id: string;
  wallet_address: string;
  wallet_address_normalized: string;
  source: string;
  application_id: string | null;
  allocation_type: string | null;
  allocation_amount: number | null;
  notes: string | null;
  added_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface SiteSettings {
  id: string;
  applications_open: boolean;
  applications_paused: boolean;
  opening_date: string | null;
  closing_date: string | null;
  max_submissions: number | null;
  allow_duplicate_wallets: boolean;
  signature_required: boolean;
  signature_fallback_enabled: boolean;
  x_field_enabled: boolean;
  x_field_required: boolean;
  discord_field_enabled: boolean;
  discord_field_required: boolean;
  email_field_enabled: boolean;
  email_field_required: boolean;
  referral_field_enabled: boolean;
  checker_enabled: boolean;
  checker_heading: string;
  checker_approved_message: string;
  checker_not_approved_message: string;
  checker_closed_message: string;
  project_name: string;
  project_short_name: string;
  project_tagline: string;
  project_description: string;
  support_email: string;
  x_url: string;
  discord_url: string;
  website_url: string;
  announcement_message: string | null;
  public_status_wording: string;
  display_timezone: string;
  updated_at: string;
}

export interface ContentBlock {
  id: string;
  key: string;
  title: string | null;
  content: string;
  updated_at: string;
}

export interface AdminAuditLog {
  id: string;
  admin_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface DashboardStats {
  total: number;
  pending: number;
  reviewing: number;
  approved: number;
  waitlisted: number;
  rejected: number;
  today: number;
  lastSevenDays: number;
  approvedWallets: number;
}

export interface ApplicationFormData {
  walletAddress: string;
  xHandle?: string;
  discordUsername?: string;
  email?: string;
  referralSource?: ReferralSource;
  applicationAnswer: string;
  signatureDataUrl?: string;
  signatureFallbackName?: string;
  consentWalletOwner: boolean;
  consentNoGuarantee: boolean;
  honeypot?: string;
}

export interface CheckerResult {
  status: "approved" | "not_found" | "invalid" | "closed" | "loading" | "rate_limited";
  message: string;
  allocationType?: string;
  allocationAmount?: number;
}
