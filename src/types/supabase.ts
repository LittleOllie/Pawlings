import type { ApplicationStatus, AdminRole, ReferralSource } from "./database";

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      applications: {
        Row: {
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
          submission_ip_hash: string | null;
        };
        Insert: {
          reference_code: string;
          wallet_address: string;
          wallet_address_normalized: string;
          x_handle?: string | null;
          x_handle_normalized?: string | null;
          discord_username?: string | null;
          email?: string | null;
          referral_source?: ReferralSource | null;
          application_answer: string;
          signature_path?: string | null;
          signature_data?: string | null;
          status?: ApplicationStatus;
          review_notes?: string | null;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          archived_at?: string | null;
          consent_wallet_owner?: boolean;
          consent_no_guarantee?: boolean;
          privacy_consent?: boolean;
          submission_source?: string | null;
          submission_ip_hash?: string | null;
          id?: string;
          submitted_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["applications"]["Insert"]>;
        Relationships: [];
      };
      admin_profiles: {
        Row: {
          id: string;
          display_name: string | null;
          role: AdminRole;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          role?: AdminRole;
          is_active?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["admin_profiles"]["Insert"]>;
        Relationships: [];
      };
      application_tags: {
        Row: {
          id: string;
          name: string;
          color: string;
          created_at: string;
        };
        Insert: {
          name: string;
          color?: string;
        };
        Update: Partial<Database["public"]["Tables"]["application_tags"]["Insert"]>;
        Relationships: [];
      };
      application_tag_assignments: {
        Row: {
          application_id: string;
          tag_id: string;
          assigned_by: string | null;
          assigned_at: string;
        };
        Insert: {
          application_id: string;
          tag_id: string;
          assigned_by?: string | null;
        };
        Update: Partial<
          Database["public"]["Tables"]["application_tag_assignments"]["Insert"]
        >;
        Relationships: [];
      };
      application_notes: {
        Row: {
          id: string;
          application_id: string;
          admin_id: string;
          note: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          application_id: string;
          admin_id: string;
          note: string;
        };
        Update: Partial<Database["public"]["Tables"]["application_notes"]["Insert"]>;
        Relationships: [];
      };
      approved_wallets: {
        Row: {
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
        };
        Insert: {
          wallet_address: string;
          wallet_address_normalized: string;
          source?: string;
          application_id?: string | null;
          allocation_type?: string | null;
          allocation_amount?: number | null;
          notes?: string | null;
          added_by?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["approved_wallets"]["Insert"]>;
        Relationships: [];
      };
      site_settings: {
        Row: {
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
        };
        Insert: never;
        Update: Partial<
          Omit<
            Database["public"]["Tables"]["site_settings"]["Row"],
            "id"
          >
        >;
        Relationships: [];
      };
      content_blocks: {
        Row: {
          id: string;
          key: string;
          title: string | null;
          content: string;
          updated_at: string;
        };
        Insert: {
          key: string;
          title?: string | null;
          content?: string;
        };
        Update: Partial<Database["public"]["Tables"]["content_blocks"]["Insert"]>;
        Relationships: [];
      };
      admin_audit_log: {
        Row: {
          id: string;
          admin_id: string | null;
          action: string;
          entity_type: string;
          entity_id: string | null;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          admin_id?: string | null;
          action: string;
          entity_type: string;
          entity_id?: string | null;
          metadata?: Json;
        };
        Update: never;
        Relationships: [];
      };
      application_status_history: {
        Row: {
          id: string;
          application_id: string;
          from_status: ApplicationStatus | null;
          to_status: ApplicationStatus;
          changed_by: string | null;
          note: string | null;
          created_at: string;
        };
        Insert: {
          application_id: string;
          from_status?: ApplicationStatus | null;
          to_status: ApplicationStatus;
          changed_by?: string | null;
          note?: string | null;
        };
        Update: never;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    CompositeTypes: Record<string, never>;
    Enums: {
      application_status: ApplicationStatus;
      admin_role: AdminRole;
      referral_source: ReferralSource;
    };
  };
}
