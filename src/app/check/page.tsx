import { getSiteSettings } from "@/lib/settings";
import { CheckerPage } from "@/components/checker/checker-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Adoption Status Checker",
};

export default async function CheckRoute() {
  const settings = await getSiteSettings();

  return (
    <CheckerPage
      checkerEnabled={settings.checker_enabled}
      heading={settings.checker_heading}
      closedMessage={settings.checker_closed_message}
      approvedMessage={settings.checker_approved_message}
      notApprovedMessage={settings.checker_not_approved_message}
    />
  );
}
