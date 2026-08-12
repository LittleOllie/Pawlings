import Link from "next/link";
import { PawlingsLogo } from "./pawlings-logo";
import { pawlingsContent } from "@/config/pawlings-content";

interface PawlingsFooterProps {
  xUrl?: string;
}

export function PawlingsFooter({ xUrl }: PawlingsFooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 border-t border-pawlings-border/30 px-4 py-12 sm:px-6 bg-gradient-to-t from-pawlings-bg to-transparent">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 sm:flex-row sm:justify-between sm:items-start">
        <div className="flex flex-col items-center sm:items-start gap-3 text-center sm:text-left">
          <PawlingsLogo size="sm" />
          <p className="text-sm text-pawlings-muted italic max-w-xs">
            {pawlingsContent.brand.tagline}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-4 text-sm text-pawlings-muted">
          {xUrl && (
            <a
              href={xUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pawlings-pink transition-colors min-h-[44px] inline-flex items-center"
            >
              X
            </a>
          )}
          <Link
            href="/collaborate"
            className="hover:text-pawlings-white transition-colors min-h-[44px] inline-flex items-center"
          >
            {pawlingsContent.footer.collaborate}
          </Link>
          <Link
            href="/privacy"
            className="hover:text-pawlings-white transition-colors min-h-[44px] inline-flex items-center"
          >
            {pawlingsContent.footer.privacy}
          </Link>
          <Link
            href="/terms"
            className="hover:text-pawlings-white transition-colors min-h-[44px] inline-flex items-center"
          >
            {pawlingsContent.footer.terms}
          </Link>
        </div>
      </div>
      <p className="mx-auto mt-8 max-w-2xl text-center text-xs text-pawlings-muted/70 leading-relaxed">
        {pawlingsContent.footer.disclaimer}
      </p>
      <p className="mx-auto mt-3 max-w-6xl text-center text-xs text-pawlings-muted/50">
        {pawlingsContent.footer.poweredBy} · © {year} {pawlingsContent.brand.name}
      </p>
    </footer>
  );
}
