"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Wallet,
  Settings,
  Users,
  Menu,
  X,
  ArrowLeft,
  Handshake,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { canManageTeam } from "@/lib/permissions";
import type { AdminRole } from "@/types/database";
import { LogoutButton } from "./logout-button";
import { projectConfig } from "@/config/project";
import { useState } from "react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/applications", label: "Applications", icon: FileText },
  { href: "/admin/collaborations", label: "Collaborations", icon: Handshake },
  { href: "/admin/approved-wallets", label: "Approved Wallets", icon: Wallet },
  { href: "/admin/settings", label: "Settings", icon: Settings },
  { href: "/admin/team", label: "Team", icon: Users, ownerOnly: true },
];

interface AdminSidebarProps {
  role: AdminRole;
  displayName: string | null;
}

export function AdminSidebar({ role, displayName }: AdminSidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const visibleItems = navItems.filter(
    (item) => !item.ownerOnly || canManageTeam(role)
  );

  const navContent = (
    <>
      <div className="px-4 py-6 border-b border-border-subtle">
        <Link href="/admin" className="block">
          <p className="text-xs uppercase tracking-widest text-foreground-subtle">
            Admin
          </p>
          <p className="font-display text-lg text-foreground mt-1">
            {projectConfig.shortName}
          </p>
        </Link>
        {displayName && (
          <p className="text-sm text-foreground-muted mt-2 truncate">
            {displayName}
          </p>
        )}
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {visibleItems.map(({ href, label, icon: Icon, exact }) => {
          const active = exact
            ? pathname === href
            : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                active
                  ? "bg-accent/15 text-accent border border-accent/30"
                  : "text-foreground-muted hover:text-foreground hover:bg-surface"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border-subtle space-y-1">
        <Link
          href="/"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground-muted hover:text-foreground hover:bg-surface transition-colors"
        >
          <ArrowLeft className="h-4 w-4 shrink-0" />
          Back to Website
        </Link>
        <LogoutButton className="w-full" />
      </div>
    </>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 rounded-lg border border-border bg-surface p-2 text-foreground"
        aria-label="Open navigation"
      >
        <Menu className="h-5 w-5" />
      </button>

      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60"
          onClick={() => setMobileOpen(false)}
          aria-hidden
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border-subtle bg-background-elevated",
          "transition-transform duration-200 lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          className="lg:hidden absolute top-4 right-4 rounded-md p-1 text-foreground-muted hover:text-foreground"
          aria-label="Close navigation"
        >
          <X className="h-5 w-5" />
        </button>
        {navContent}
      </aside>
    </>
  );
}
