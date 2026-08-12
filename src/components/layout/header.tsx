"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { projectConfig } from "@/config/project";

interface HeaderProps {
  projectName?: string;
  xUrl?: string;
}

const navLinks = [
  { href: "/#about", label: "About" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#faq", label: "FAQ" },
  { href: "/apply", label: "Apply" },
];

export function Header({ projectName, xUrl }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const name = projectName ?? projectConfig.name;
  const twitter = xUrl ?? projectConfig.xUrl;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
        scrolled
          ? "bg-background/90 backdrop-blur-md border-b border-border-subtle shadow-lg shadow-black/10"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src={projectConfig.assets.logo}
            alt={name}
            width={120}
            height={120}
            className="h-10 sm:h-12 w-auto object-contain drop-shadow-[0_0_10px_rgba(240,192,48,0.12)] transition-opacity duration-200 group-hover:opacity-90"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-8" aria-label="Main">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-foreground-muted hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
          {twitter && (
            <a
              href={twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-foreground-muted hover:text-highlight transition-colors"
            >
              X
            </a>
          )}
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/apply" className="hidden sm:block">
            <Button size="sm">{projectConfig.primaryCta}</Button>
          </Link>
          <button
            className="md:hidden rounded-md p-2 text-foreground-muted hover:text-foreground hover:bg-surface transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav
          className="md:hidden border-t border-border-subtle bg-background/95 backdrop-blur-md px-4 py-4 space-y-3"
          aria-label="Mobile"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block py-2 text-foreground-muted hover:text-foreground transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/apply" onClick={() => setMobileOpen(false)}>
            <Button className="w-full">{projectConfig.primaryCta}</Button>
          </Link>
        </nav>
      )}
    </header>
  );
}
