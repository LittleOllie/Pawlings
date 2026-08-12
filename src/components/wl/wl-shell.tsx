import { type ReactNode } from "react";
import { PublicLayout } from "@/components/layout/public-layout";
import { WlHeader } from "./wl-header";
import { WlFooter } from "./wl-footer";

interface WlShellProps {
  children: ReactNode;
  projectName?: string;
  xUrl?: string;
  discordUrl?: string;
  supportEmail?: string;
}

export function WlShell({ children, projectName, xUrl }: WlShellProps) {
  return (
    <PublicLayout>
      <WlHeader projectName={projectName} xUrl={xUrl} />
      <div className="relative z-10 flex flex-1 flex-col">
        {children}
      </div>
      <WlFooter projectName={projectName} xUrl={xUrl} />
    </PublicLayout>
  );
}
