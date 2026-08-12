import type { SiteSettings } from "@/types/database";

export type ApplicationAvailability =
  | "open"
  | "closed"
  | "not_yet_open"
  | "paused"
  | "max_reached";

export interface AvailabilityResult {
  status: ApplicationAvailability;
  message: string;
  canSubmit: boolean;
}

export function getApplicationAvailability(
  settings: SiteSettings,
  currentCount: number,
  now = new Date()
): AvailabilityResult {
  if (settings.applications_paused) {
    return {
      status: "paused",
      message: settings.public_status_wording || "Applications are temporarily paused.",
      canSubmit: false,
    };
  }

  if (!settings.applications_open) {
    return {
      status: "closed",
      message: settings.public_status_wording || "Applications are currently closed.",
      canSubmit: false,
    };
  }

  if (settings.opening_date) {
    const opening = new Date(settings.opening_date);
    if (now < opening) {
      return {
        status: "not_yet_open",
        message: `Applications open ${opening.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}.`,
        canSubmit: false,
      };
    }
  }

  if (settings.closing_date) {
    const closing = new Date(settings.closing_date);
    if (now > closing) {
      return {
        status: "closed",
        message: "The application window has closed.",
        canSubmit: false,
      };
    }
  }

  if (
    settings.max_submissions !== null &&
    currentCount >= settings.max_submissions
  ) {
    return {
      status: "max_reached",
      message: "The maximum number of applications has been reached.",
      canSubmit: false,
    };
  }

  return {
    status: "open",
    message: settings.public_status_wording || "Applications are now open.",
    canSubmit: true,
  };
}
