"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { SiteSettings } from "@/types/database";

interface SettingsFormProps {
  settings: SiteSettings;
  canEdit: boolean;
}

function Toggle({
  label,
  checked,
  onChange,
  disabled,
  hint,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
  hint?: string;
}) {
  return (
    <label className="flex items-start gap-3 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="mt-1 rounded border-border"
      />
      <span>
        <span className="text-sm text-foreground">{label}</span>
        {hint && <p className="text-xs text-foreground-muted mt-0.5">{hint}</p>}
      </span>
    </label>
  );
}

export function SettingsForm({ settings: initial, canEdit }: SettingsFormProps) {
  const router = useRouter();
  const [settings, setSettings] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  function update<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canEdit) return;
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const json = await res.json();
      if (!res.ok) {
        setMessage(json.error ?? "Failed to save settings");
        return;
      }
      setSettings(json.settings);
      setMessage("Settings saved successfully.");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message && (
        <p
          className={`text-sm ${message.includes("success") ? "text-success" : "text-error"}`}
          role="status"
        >
          {message}
        </p>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Application Window</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Toggle
            label="Applications open"
            checked={settings.applications_open}
            onChange={(v) => update("applications_open", v)}
            disabled={!canEdit}
          />
          <Toggle
            label="Applications paused"
            checked={settings.applications_paused}
            onChange={(v) => update("applications_paused", v)}
            disabled={!canEdit}
          />
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Opening date"
              type="datetime-local"
              value={settings.opening_date?.slice(0, 16) ?? ""}
              onChange={(e) =>
                update("opening_date", e.target.value ? new Date(e.target.value).toISOString() : null)
              }
              disabled={!canEdit}
            />
            <Input
              label="Closing date"
              type="datetime-local"
              value={settings.closing_date?.slice(0, 16) ?? ""}
              onChange={(e) =>
                update("closing_date", e.target.value ? new Date(e.target.value).toISOString() : null)
              }
              disabled={!canEdit}
            />
          </div>
          <Input
            label="Max submissions"
            type="number"
            value={settings.max_submissions ?? ""}
            onChange={(e) =>
              update("max_submissions", e.target.value ? parseInt(e.target.value, 10) : null)
            }
            hint="Leave empty for unlimited"
            disabled={!canEdit}
          />
          <Input
            label="Public status wording"
            value={settings.public_status_wording}
            onChange={(e) => update("public_status_wording", e.target.value)}
            disabled={!canEdit}
          />
          <Textarea
            label="Announcement message"
            value={settings.announcement_message ?? ""}
            onChange={(e) => update("announcement_message", e.target.value || null)}
            disabled={!canEdit}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Form Fields</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Toggle
            label="Allow duplicate wallets"
            checked={settings.allow_duplicate_wallets}
            onChange={(v) => update("allow_duplicate_wallets", v)}
            disabled={!canEdit}
          />
          <Toggle
            label="Signature required"
            checked={settings.signature_required}
            onChange={(v) => update("signature_required", v)}
            disabled={!canEdit}
          />
          <Toggle
            label="Signature fallback (typed name)"
            checked={settings.signature_fallback_enabled}
            onChange={(v) => update("signature_fallback_enabled", v)}
            disabled={!canEdit}
          />
          <div className="grid sm:grid-cols-2 gap-4 pt-2">
            <Toggle
              label="X field enabled"
              checked={settings.x_field_enabled}
              onChange={(v) => update("x_field_enabled", v)}
              disabled={!canEdit}
            />
            <Toggle
              label="X field required"
              checked={settings.x_field_required}
              onChange={(v) => update("x_field_required", v)}
              disabled={!canEdit}
            />
            <Toggle
              label="Discord field enabled"
              checked={settings.discord_field_enabled}
              onChange={(v) => update("discord_field_enabled", v)}
              disabled={!canEdit}
            />
            <Toggle
              label="Discord field required"
              checked={settings.discord_field_required}
              onChange={(v) => update("discord_field_required", v)}
              disabled={!canEdit}
            />
            <Toggle
              label="Email field enabled"
              checked={settings.email_field_enabled}
              onChange={(v) => update("email_field_enabled", v)}
              disabled={!canEdit}
            />
            <Toggle
              label="Email field required"
              checked={settings.email_field_required}
              onChange={(v) => update("email_field_required", v)}
              disabled={!canEdit}
            />
            <Toggle
              label="Referral field enabled"
              checked={settings.referral_field_enabled}
              onChange={(v) => update("referral_field_enabled", v)}
              disabled={!canEdit}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Adoption Status Checker</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Toggle
            label="Checker enabled"
            checked={settings.checker_enabled}
            onChange={(v) => update("checker_enabled", v)}
            disabled={!canEdit}
          />
          <Input
            label="Checker heading"
            value={settings.checker_heading}
            onChange={(e) => update("checker_heading", e.target.value)}
            disabled={!canEdit}
          />
          <Textarea
            label="Approved message"
            value={settings.checker_approved_message}
            onChange={(e) => update("checker_approved_message", e.target.value)}
            disabled={!canEdit}
          />
          <Textarea
            label="Not approved message"
            value={settings.checker_not_approved_message}
            onChange={(e) => update("checker_not_approved_message", e.target.value)}
            disabled={!canEdit}
          />
          <Textarea
            label="Closed message"
            value={settings.checker_closed_message}
            onChange={(e) => update("checker_closed_message", e.target.value)}
            disabled={!canEdit}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Project Branding</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Project name"
              value={settings.project_name}
              onChange={(e) => update("project_name", e.target.value)}
              disabled={!canEdit}
            />
            <Input
              label="Short name"
              value={settings.project_short_name}
              onChange={(e) => update("project_short_name", e.target.value)}
              disabled={!canEdit}
            />
          </div>
          <Input
            label="Tagline"
            value={settings.project_tagline}
            onChange={(e) => update("project_tagline", e.target.value)}
            disabled={!canEdit}
          />
          <Textarea
            label="Description"
            value={settings.project_description}
            onChange={(e) => update("project_description", e.target.value)}
            disabled={!canEdit}
          />
          <Input
            label="Support email"
            type="email"
            value={settings.support_email}
            onChange={(e) => update("support_email", e.target.value)}
            disabled={!canEdit}
          />
          <div className="grid sm:grid-cols-3 gap-4">
            <Input
              label="X URL"
              value={settings.x_url}
              onChange={(e) => update("x_url", e.target.value)}
              disabled={!canEdit}
            />
            <Input
              label="Discord URL"
              value={settings.discord_url}
              onChange={(e) => update("discord_url", e.target.value)}
              disabled={!canEdit}
            />
            <Input
              label="Website URL"
              value={settings.website_url}
              onChange={(e) => update("website_url", e.target.value)}
              disabled={!canEdit}
            />
          </div>
          <Input
            label="Display timezone"
            value={settings.display_timezone}
            onChange={(e) => update("display_timezone", e.target.value)}
            hint="e.g. UTC, America/New_York, Europe/London"
            disabled={!canEdit}
          />
        </CardContent>
      </Card>

      {canEdit && (
        <Button type="submit" loading={loading}>
          Save settings
        </Button>
      )}
    </form>
  );
}
