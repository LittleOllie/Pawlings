import { createServiceClient } from "./supabase/admin";
import { createClient } from "./supabase/server";
import type { SiteSettings, ContentBlock } from "@/types/database";
import { projectConfig } from "@/config/project";

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .limit(1)
      .single();

    if (error || !data) {
      return getDefaultSettings();
    }

    return data as SiteSettings;
  } catch {
    return getDefaultSettings();
  }
}

export async function getSiteSettingsAdmin(): Promise<SiteSettings> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .limit(1)
    .single();

  if (error || !data) {
    return getDefaultSettings();
  }

  return data as SiteSettings;
}

export async function getContentBlocks(): Promise<Record<string, ContentBlock>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("content_blocks").select("*");

    if (error || !data) {
      return getDefaultContentBlocks();
    }

    const map: Record<string, ContentBlock> = {};
    for (const block of (data ?? []) as ContentBlock[]) {
      map[block.key] = block;
    }
    return map;
  } catch {
    return getDefaultContentBlocks();
  }
}

export async function getContentBlock(key: string): Promise<string> {
  const blocks = await getContentBlocks();
  return blocks[key]?.content ?? "";
}

export function parseJsonContent<T>(content: string, fallback: T): T {
  try {
    return JSON.parse(content) as T;
  } catch {
    return fallback;
  }
}

function getDefaultSettings(): SiteSettings {
  return {
    id: "default",
    applications_open: true,
    applications_paused: false,
    opening_date: null,
    closing_date: null,
    max_submissions: null,
    allow_duplicate_wallets: false,
    signature_required: false,
    signature_fallback_enabled: false,
    x_field_enabled: true,
    x_field_required: false,
    discord_field_enabled: true,
    discord_field_required: false,
    email_field_enabled: false,
    email_field_required: false,
    referral_field_enabled: true,
    checker_enabled: false,
    checker_heading: "Adoption Status Checker",
    checker_approved_message: "Your wallet is on the approved guardian list.",
    checker_not_approved_message:
      "This wallet was not found on the approved guardian list.",
    checker_closed_message: "The adoption status checker is not yet available.",
    project_name: projectConfig.name,
    project_short_name: projectConfig.shortName,
    project_tagline: projectConfig.tagline,
    project_description: projectConfig.description,
    support_email: projectConfig.supportEmail,
    x_url: projectConfig.xUrl,
    discord_url: projectConfig.discordUrl,
    website_url: projectConfig.websiteUrl,
    announcement_message: null,
    public_status_wording: "Applications are now open.",
    display_timezone: process.env.APP_TIMEZONE ?? "UTC",
    updated_at: new Date().toISOString(),
  };
}

function getDefaultContentBlocks(): Record<string, ContentBlock> {
  const now = new Date().toISOString();
  const blocks: Record<string, ContentBlock> = {};
  const defaults: [string, string, string][] = [
    [
      "hero_title",
      "Hero Title",
      "Every collection needs a beginning. Every story needs its first believers.",
    ],
    [
      "hero_body",
      "Hero Body",
      "Submit your adoption application for the chance to become part of an upcoming Web3 collection from day one.",
    ],
    ["hero_eyebrow", "Hero Eyebrow", "Applications now open"],
    [
      "about_copy",
      "About",
      "This is not simply another application form. We are looking for people who genuinely connect with the world we are building.",
    ],
    [
      "success_message",
      "Success Message",
      "Your application has been received.",
    ],
    [
      "closed_message",
      "Applications Closed",
      "Applications are currently closed.",
    ],
    ["final_cta_title", "Final CTA", "Ready to leave your mark?"],
  ];

  for (const [key, title, content] of defaults) {
    blocks[key] = {
      id: key,
      key,
      title,
      content,
      updated_at: now,
    };
  }

  return blocks;
}
