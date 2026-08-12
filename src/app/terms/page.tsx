import Link from "next/link";
import { PawlingsHeader } from "@/components/pawlings/pawlings-header";
import { PawlingsFooter } from "@/components/pawlings/pawlings-footer";
import { pawlingsContent } from "@/config/pawlings-content";
import { getSiteSettings } from "@/lib/settings";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use",
};

export default async function TermsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="pawlings-page pawlings-paw-bg relative min-h-screen flex flex-col">
      <PawlingsHeader xUrl={settings.x_url || undefined} subpage />
      <main className="relative z-10 flex-1 px-4 py-28 sm:px-6">
        <article className="mx-auto max-w-3xl game-card p-6 sm:p-10">
          <div className="rounded-xl border border-pawlings-orange/40 bg-pawlings-orange/10 px-4 py-3 text-sm text-pawlings-orange mb-8">
            Placeholder legal content. Must be reviewed by the project owner and
            qualified legal counsel before launch.
          </div>

          <h1 className="font-display text-4xl font-bold text-pawlings-white mb-6">
            Terms of Use
          </h1>
          <p className="text-pawlings-muted mb-8">
            Last updated: {new Date().toLocaleDateString("en-GB")}
          </p>

          <section className="space-y-4 text-pawlings-muted leading-relaxed">
            <h2 className="text-xl font-semibold text-pawlings-white">
              Adoption Programme Terms
            </h2>
            <p>
              By submitting an adoption application to {pawlingsContent.brand.name},
              you confirm that the information you provide is accurate to the best
              of your knowledge.
            </p>

            <h2 className="text-xl font-semibold text-pawlings-white pt-4">
              No Guarantee of Approval
            </h2>
            <p>
              Submitting an application does not guarantee an adoption opportunity.
              Applications may be reviewed at the discretion of the Pawlings team.
            </p>

            <h2 className="text-xl font-semibold text-pawlings-white pt-4">
              Wallet Safety
            </h2>
            <p>
              {pawlingsContent.adoption.securityNote} We only ask for a public
              wallet address for application purposes.
            </p>

            <h2 className="text-xl font-semibold text-pawlings-white pt-4">
              Contact
            </h2>
            <p>
              Questions about these terms? Contact{" "}
              <a
                href={`mailto:${settings.support_email}`}
                className="text-pawlings-pink hover:underline"
              >
                {settings.support_email}
              </a>
              .
            </p>

            <p className="pt-6">
              <Link href="/" className="text-pawlings-lime hover:underline">
                ← Back to home
              </Link>
            </p>
          </section>
        </article>
      </main>
      <PawlingsFooter xUrl={settings.x_url || undefined} />
    </div>
  );
}
