import { type ReactNode } from "react";

interface PublicLayoutProps {
  children: ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="grain min-h-screen flex flex-col art-gradient">
      <div className="relative z-10 flex flex-col min-h-screen">{children}</div>
    </div>
  );
}
