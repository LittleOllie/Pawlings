"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { WlShell } from "@/components/wl/wl-shell";
import { WlArtPanel } from "@/components/wl/wl-art-panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { AvailabilityBadge } from "@/components/ui/badge";
import {
  simpleApplicationSchema,
  type SimpleApplicationFormValues,
} from "@/lib/validation";
import { projectConfig } from "@/config/project";
import type { SiteSettings } from "@/types/database";
import { AlertCircle, ArrowRight } from "lucide-react";

interface ApplicationFormProps {
  settings: SiteSettings;
  closedMessage: string;
  canSubmit: boolean;
  availabilityMessage: string;
}

export function ApplicationForm({
  settings,
  closedMessage,
  canSubmit,
  availabilityMessage,
}: ApplicationFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const copy = projectConfig.whitelistPage;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SimpleApplicationFormValues>({
    resolver: zodResolver(simpleApplicationSchema),
    defaultValues: {
      walletAddress: "",
      xHandle: "",
      discordUsername: "",
      honeypot: "",
    },
  });

  const shellProps = {
    projectName: settings.project_name,
    xUrl: settings.x_url,
    discordUrl: settings.discord_url,
    supportEmail: settings.support_email,
  };

  if (!canSubmit) {
    return (
      <WlShell {...shellProps}>
        <main className="flex flex-1 items-center justify-center px-4 py-16 sm:px-6">
          <Card className="max-w-md w-full text-center p-8 space-y-4 border-border-subtle">
            <AlertCircle className="h-12 w-12 text-warning mx-auto" />
            <h1 className="font-display text-2xl font-bold">{copy.closedTitle}</h1>
            <p className="text-foreground-muted text-sm leading-relaxed">
              {closedMessage || availabilityMessage}
            </p>
          </Card>
        </main>
      </WlShell>
    );
  }

  const onSubmit = async (data: SimpleApplicationFormValues) => {
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/applications/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        if (result.error === "duplicate") {
          setError(result.message);
        } else {
          setError(result.error ?? "Submission failed");
        }
        return;
      }

      sessionStorage.setItem(
        "application_success",
        JSON.stringify({ referenceCode: result.referenceCode })
      );
      router.push("/application/success");
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <WlShell {...shellProps}>
      <main className="flex-1 px-4 py-8 sm:px-6 sm:py-10">
        <div className="mx-auto grid max-w-5xl lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <WlArtPanel
            headline={copy.headline}
            subheadline={copy.subheadline}
          />

          <div className="w-full max-w-md mx-auto lg:max-w-none lg:mx-0">
            <Card className="border-border/80 bg-surface/70 glow-accent">
              <CardContent className="pt-6 pb-6 space-y-5">
                <div className="space-y-2">
                  <AvailabilityBadge open />
                  <p className="text-sm text-foreground-muted">{copy.formIntro}</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
                  <input
                    type="text"
                    {...register("honeypot")}
                    className="hidden"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden
                  />

                  <Input
                    label="Wallet address"
                    placeholder="0x..."
                    hint="Paste only — never your seed phrase or private key."
                    error={errors.walletAddress?.message}
                    required
                    autoFocus
                    {...register("walletAddress")}
                  />

                  <Input
                    label="X handle"
                    placeholder="@username"
                    hint="Optional"
                    error={errors.xHandle?.message}
                    {...register("xHandle")}
                  />

                  <Input
                    label="Discord username"
                    placeholder="username"
                    hint="Optional"
                    error={errors.discordUsername?.message}
                    {...register("discordUsername")}
                  />

                  <p className="text-xs text-foreground-subtle leading-relaxed">
                    {copy.disclaimer}
                  </p>

                  {error && (
                    <div
                      className="rounded-lg border border-error/30 bg-error/10 px-4 py-3 text-sm text-error"
                      role="alert"
                    >
                      {error}
                    </div>
                  )}

                  <Button type="submit" loading={submitting} className="w-full" size="lg">
                    {projectConfig.primaryCta}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </WlShell>
  );
}
