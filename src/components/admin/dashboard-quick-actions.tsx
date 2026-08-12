import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Wallet, Settings, Download } from "lucide-react";

export function DashboardQuickActions() {
  const actions = [
    {
      href: "/admin/applications?status=pending",
      label: "Review pending",
      icon: FileText,
      variant: "primary" as const,
    },
    {
      href: "/admin/approved-wallets",
      label: "Approved guardian wallets",
      icon: Wallet,
      variant: "secondary" as const,
    },
    {
      href: "/admin/settings",
      label: "Site settings",
      icon: Settings,
      variant: "secondary" as const,
    },
    {
      href: "/api/admin/applications/export",
      label: "Export CSV",
      icon: Download,
      variant: "outline" as const,
      external: true,
    },
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Quick actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {actions.map(({ href, label, icon: Icon, variant, external }) =>
            external ? (
              <a key={href} href={href} target="_blank" rel="noopener noreferrer">
                <Button variant={variant} size="sm" className="w-full justify-start gap-2">
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{label}</span>
                </Button>
              </a>
            ) : (
              <Link key={href} href={href}>
                <Button variant={variant} size="sm" className="w-full justify-start gap-2">
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{label}</span>
                </Button>
              </Link>
            )
          )}
        </div>
      </CardContent>
    </Card>
  );
}
