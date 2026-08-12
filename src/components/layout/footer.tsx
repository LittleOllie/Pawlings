import Link from "next/link";
import { projectConfig } from "@/config/project";

interface FooterProps {
  projectName?: string;
  xUrl?: string;
  discordUrl?: string;
  supportEmail?: string;
}

export function Footer({
  projectName,
  xUrl,
  discordUrl,
  supportEmail,
}: FooterProps) {
  const name = projectName ?? projectConfig.name;
  const twitter = xUrl ?? projectConfig.xUrl;
  const discord = discordUrl ?? projectConfig.discordUrl;
  const email = supportEmail ?? projectConfig.supportEmail;

  return (
    <footer className="border-t border-border-subtle bg-background-elevated/50">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-display text-lg font-semibold">{name}</p>
            <p className="mt-2 text-sm text-foreground-muted">
              Built for the community.
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-foreground mb-3">Connect</p>
            <ul className="space-y-2 text-sm text-foreground-muted">
              {twitter && (
                <li>
                  <a
                    href={twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-accent transition-colors"
                  >
                    X (Twitter)
                  </a>
                </li>
              )}
              <li>
                <span className="text-foreground-subtle">
                  Discord {discord ? "" : "(coming soon)"}
                </span>
                {discord && (
                  <a
                    href={discord}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-accent transition-colors ml-1"
                  >
                    Join
                  </a>
                )}
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-medium text-foreground mb-3">Legal</p>
            <ul className="space-y-2 text-sm text-foreground-muted">
              <li>
                <Link href="/privacy" className="hover:text-accent transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-accent transition-colors">
                  Terms of Use
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-medium text-foreground mb-3">Contact</p>
            <a
              href={`mailto:${email}`}
              className="text-sm text-foreground-muted hover:text-accent transition-colors"
            >
              {email}
            </a>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border-subtle flex flex-col sm:flex-row justify-between gap-4 text-xs text-foreground-subtle">
          <p>
            © {new Date().getFullYear()} {name}. All rights reserved.
          </p>
          {projectConfig.isPlaceholderBranding && (
            <p className="italic">Placeholder branding — replace before launch</p>
          )}
        </div>
      </div>
    </footer>
  );
}
