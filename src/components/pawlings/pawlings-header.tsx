"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { PawlingsLogo } from "./pawlings-logo";
import { NAV_LINKS, useActiveSection } from "./use-active-section";
import { useAdoptionOverlayOptional } from "./adoption-overlay-context";
import { GameButton } from "./game-button";
import { pawlingsContent } from "@/config/pawlings-content";
import { cn } from "@/lib/utils";

interface PawlingsHeaderProps {
  xUrl?: string;
  subpage?: boolean;
}

const navLinkClass =
  "rounded-xl px-2.5 xl:px-3 py-2 text-xs xl:text-sm font-display font-bold tracking-wide transition-colors";

export function PawlingsHeader({ xUrl, subpage }: PawlingsHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const activeSection = useActiveSection(!subpage);
  const adoptionOverlay = useAdoptionOverlayOptional();
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const sectionHref = (id: string) => (subpage ? `/#${id}` : `#${id}`);

  const handleSectionClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string
  ) => {
    setOpen(false);
    if (subpage) return;
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const linkIsActive = (link: (typeof NAV_LINKS)[number]) => {
    if (link.type === "route") {
      return pathname === link.href || pathname.startsWith(`${link.href}/`);
    }
    return !subpage && activeSection === link.id;
  };

  const renderNavLinks = (mobile = false) =>
    <>
      {NAV_LINKS.map((link) => {
      const isActive = linkIsActive(link);

      if (link.type === "route") {
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              navLinkClass,
              mobile && "min-h-[44px] flex items-center w-full",
              isActive
                ? "text-pawlings-lime bg-white/5"
                : "text-pawlings-muted hover:text-pawlings-white"
            )}
            onClick={() => setOpen(false)}
            aria-current={isActive ? "page" : undefined}
          >
            {link.label}
          </Link>
        );
      }

      return (
        <a
          key={link.id}
          href={sectionHref(link.id)}
          onClick={(e) => handleSectionClick(e, link.id)}
          className={cn(
            navLinkClass,
            mobile && "min-h-[44px] flex items-center w-full",
            isActive
              ? "text-pawlings-lime bg-white/5"
              : "text-pawlings-muted hover:text-pawlings-white"
          )}
          aria-current={isActive ? "true" : undefined}
        >
          {link.label}
        </a>
      );
    })}
    </>;

  const xLinkClass = cn(
    navLinkClass,
    "text-pawlings-muted hover:text-pawlings-pink"
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-3 sm:pt-4 sm:px-6">
      <div
        className={cn(
          "mx-auto flex max-w-6xl items-center justify-between gap-2 sm:gap-3 rounded-2xl border px-3 py-2 sm:px-5 sm:py-2.5 transition-all duration-300",
          scrolled
            ? "border-border-subtle-ui bg-surface-primary/95 backdrop-blur-md shadow-elevation-2"
            : "border-border-subtle-ui/60 bg-surface-primary/70 backdrop-blur-sm"
        )}
      >
        <PawlingsLogo size="sm" linked priority />

        <nav
          className="hidden lg:flex items-center gap-0.5 xl:gap-1 flex-1 justify-center min-w-0"
          aria-label="Main"
        >
          {renderNavLinks()}
          {xUrl && (
            <a
              href={xUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={xLinkClass}
            >
              {pawlingsContent.nav.x}
            </a>
          )}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          {adoptionOverlay && (
            <GameButton
              type="button"
              onClick={() => adoptionOverlay.openAdoption()}
              className="!py-2 !px-3 xl:!px-4 !text-xs xl:!text-sm hidden sm:inline-flex"
            >
              {pawlingsContent.nav.adoptCta}
            </GameButton>
          )}
          <button
            type="button"
            className="lg:hidden p-2 text-pawlings-muted hover:text-pawlings-white min-h-[44px] min-w-[44px] flex items-center justify-center"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          className="lg:hidden mx-auto mt-2 max-w-6xl surface-panel p-3 space-y-1"
          aria-label="Mobile"
        >
          {renderNavLinks(true)}
          {xUrl && (
            <a
              href={xUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(xLinkClass, "min-h-[44px] flex items-center w-full")}
              onClick={() => setOpen(false)}
            >
              {pawlingsContent.nav.x}
            </a>
          )}
          {adoptionOverlay && (
            <GameButton
              type="button"
              onClick={() => {
                adoptionOverlay.openAdoption();
                setOpen(false);
              }}
              className="w-full mt-2"
            >
              {pawlingsContent.nav.adoptCta}
            </GameButton>
          )}
        </nav>
      )}
    </header>
  );
}
