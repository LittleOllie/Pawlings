"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { AdminSidebar } from "./admin-sidebar";
import type { AdminRole } from "@/types/database";

interface AdminShellProps {
  children: ReactNode;
  role: AdminRole;
  displayName: string | null;
}

export function AdminShell({ children, role, displayName }: AdminShellProps) {
  const pathname = usePathname();
  const isLogin = pathname === "/admin/login";

  if (isLogin) {
    return (
      <div className="min-h-screen bg-background grain">{children}</div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar role={role} displayName={displayName} />
      <main className="lg:pl-64 min-h-screen bg-surface/20">
        <div className="px-4 py-6 sm:px-6 lg:px-10 lg:py-8 max-w-[1400px]">
          {children}
        </div>
      </main>
    </div>
  );
}
