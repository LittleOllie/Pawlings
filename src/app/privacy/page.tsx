import Link from "next/link";
import { PawlingsHeader } from "@/components/pawlings/pawlings-header";
import { PawlingsFooter } from "@/components/pawlings/pawlings-footer";
import { pawlingsContent } from "@/config/pawlings-content";
import { getSiteSettings } from "@/lib/settings";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default async function PrivacyPage() {
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
            Privacy Policy
          </h1>
          <p className="text-pawlings-muted mb-8">
            Last updated: {new Date().toLocaleDateString("en-GB")}
          </p>

          <section className="space-y-4 text-pawlings-muted leading-relaxed">
            <h2 className="text-xl font-semibold text-pawlings-white">
              Information We Collect
            </h2>
            <p>
              When you submit an adoption application to {pawlingsContent.brand.name},
              we may collect:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Ethereum wallet address (a public blockchain identifier)</li>
              <li>Optional X (Twitter) handle</li>
              <li>Optional Discord username</li>
            </ul>

            <h2 className="text-xl font-semibold text-pawlings-white pt-4">
              Why We Collect This Information
            </h2>
            <p>
              This information is collected solely for adoption application review and
              project communication. We will never request your seed phrase,
              private key, or initiate any blockchain transaction.
            </p>

            <h2 className="text-xl font-semibold text-pawlings-white pt-4">
              Data Retention
            </h2>
            <p>
              Application data is retained for the duration of the adoption programme
              and a reasonable period thereafter. You may request deletion by
              contacting{" "}
              <a
                href={`mailto:${settings.support_email}`}
                className="text-pawlings-pink hover:underline"
              >
                {settings.support_email}
              </a>
              .
            </p>

            <h2 className="text-xl font-semibold text-pawlings-white pt-4">
              Wallet Addresses
            </h2>
            <p>
              Ethereum wallet addresses are public identifiers on the blockchain.
              We use them only for adoption consideration and do not connect to
              your wallet or request any signatures or transactions.
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
