import { PawlingsHeader } from "@/components/pawlings/pawlings-header";
import { PawlingsFooter } from "@/components/pawlings/pawlings-footer";
import { WorldBackground } from "@/components/pawlings/world-background";
import { CollaborationForm } from "@/components/pawlings/collaboration-form";
import { PawlingsColoredHeading } from "@/components/pawlings/pawlings-colored-heading";
import { pawlingsContent } from "@/config/pawlings-content";
import { getSiteSettings } from "@/lib/settings";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community Collaboration",
};

export default async function CollaboratePage() {
  const settings = await getSiteSettings();
  const copy = pawlingsContent.collaborate;

  return (
    <div className="pawlings-page relative min-h-screen overflow-x-hidden">
      <WorldBackground />
      <PawlingsHeader xUrl={settings.x_url || undefined} subpage />

      <main className="relative z-10 pt-28 pb-16 px-4 sm:px-6">
        <div className="mx-auto max-w-2xl">
          <header className="text-center mb-8 space-y-3">
            <p className="section-eyebrow">{copy.eyebrow}</p>
            <PawlingsColoredHeading
              as="h1"
              highlight={copy.headingHighlight}
              className="font-display font-bold"
              style={{ fontSize: "var(--text-display-lg)" }}
            >
              {copy.heading}
            </PawlingsColoredHeading>
            <p className="text-pawlings-muted leading-relaxed">{copy.subheading}</p>
            <p className="text-sm text-pawlings-muted/90">{copy.intro}</p>
          </header>

          <div className="dashboard-glass rounded-[var(--radius-panel)] p-6 sm:p-8">
            <CollaborationForm />
          </div>
        </div>
      </main>

      <PawlingsFooter xUrl={settings.x_url || undefined} />
    </div>
  );
}
