import { requireAdminPage } from "@/lib/admin-page";
import { PageHeader } from "@/components/admin/page-header";
import { SettingsForm } from "@/components/admin/settings-form";
import { getSiteSettingsAdmin } from "@/lib/settings";
import { canManageSettings } from "@/lib/permissions";

export default async function SettingsPage() {
  const profile = await requireAdminPage("read_only");
  const settings = await getSiteSettingsAdmin();

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Configure application window, form fields, checker, and branding."
      />
      <SettingsForm settings={settings} canEdit={canManageSettings(profile.role)} />
    </div>
  );
}
