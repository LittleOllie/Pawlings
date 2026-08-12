"use client";

import { projectConfig } from "@/config/project";
import { WlLogo } from "./wl-logo";

interface WlHeaderProps {
  projectName?: string;
  xUrl?: string;
}

export function WlHeader({ xUrl }: WlHeaderProps) {
  const twitter = xUrl ?? projectConfig.xUrl;

  return (
    <header className="relative z-20 border-b border-border-subtle/60 bg-background/60 backdrop-blur-md">
      {twitter && (
        <a
          href={twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-4 right-4 sm:top-5 sm:right-6 z-10 rounded-lg border border-border-subtle bg-surface/70 px-3 py-2 text-sm text-foreground-muted hover:text-highlight hover:border-highlight/30 transition-colors"
        >
          Follow on X
        </a>
      )}

      <div className="mx-auto flex max-w-5xl flex-col items-center px-4 pt-8 pb-6 sm:px-6 sm:pt-10 sm:pb-8">
        <WlLogo size="xl" />

        <p className="mt-4 text-sm font-display font-semibold tracking-widest uppercase text-pawlings">
          Whitelist open
        </p>
      </div>
    </header>
  );
}
