"use client";

import { useEffect, useState } from "react";
import { WlShell } from "@/components/wl/wl-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { projectConfig } from "@/config/project";
import { CheckCircle } from "lucide-react";

export default function SuccessPage() {
  const [referenceCode, setReferenceCode] = useState<string | null>(null);
  const copy = projectConfig.whitelistPage;

  useEffect(() => {
    const stored = sessionStorage.getItem("application_success");
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setReferenceCode(data.referenceCode);
        sessionStorage.removeItem("application_success");
      } catch {
        // ignore
      }
    }
  }, []);

  return (
    <WlShell>
      <main className="flex flex-1 items-center justify-center px-4 py-16 sm:px-6">
        <Card className="max-w-md w-full text-center p-8 sm:p-10 space-y-6 border-accent/20 bg-surface/70 glow-highlight">
          <CheckCircle className="h-14 w-14 text-success mx-auto" />

          <div className="space-y-2">
            <h1 className="font-display text-2xl sm:text-3xl font-bold">
              {copy.successTitle}
            </h1>
            {referenceCode && (
              <p className="text-sm text-foreground-muted">
                Reference{" "}
                <span className="font-mono text-accent font-medium">{referenceCode}</span>
              </p>
            )}
          </div>

          <p className="text-sm text-foreground-muted leading-relaxed">
            {copy.successBody}
          </p>

          {projectConfig.xUrl && (
            <a
              href={projectConfig.xUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block pt-1"
            >
              <Button className="w-full">Follow on X</Button>
            </a>
          )}
        </Card>
      </main>
    </WlShell>
  );
}
