"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  collaborationApplicationSchema,
  type CollaborationApplicationFormValues,
} from "@/lib/validation";
import { pawlingsContent } from "@/config/pawlings-content";
import { GameButton } from "./game-button";
import { cn } from "@/lib/utils";

export function CollaborationForm() {
  const copy = pawlingsContent.collaborate;
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CollaborationApplicationFormValues>({
    resolver: zodResolver(collaborationApplicationSchema),
    defaultValues: {
      collectionName: "",
      website: "",
      xHandle: "",
      discord: "",
      collectionSize: "",
      blockchain: "",
      collaborationPitch: "",
      spotsRequested: undefined,
      dreamCollaborations: "",
      honeypot: "",
    },
  });

  const onSubmit = async (data: CollaborationApplicationFormValues) => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/collaborations/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) {
        setError(result.error ?? "Submission failed");
        return;
      }
      setSuccess(result.referenceCode);
      reset();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="collaboration-success text-center py-8 space-y-3">
        <span className="adoption-status-pill inline-block">{copy.successTitle}</span>
        <p className="text-pawlings-muted leading-relaxed">{copy.successBody}</p>
        <p className="text-sm text-pawlings-muted">
          {copy.referenceLabel}:{" "}
          <span className="font-mono text-pawlings-lime">{success}</span>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <input type="text" {...register("honeypot")} className="hidden" tabIndex={-1} aria-hidden />

      <Field label={copy.fields.collectionName} error={errors.collectionName?.message} required>
        <input className={fieldClass(errors.collectionName)} {...register("collectionName")} />
      </Field>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label={copy.fields.website} error={errors.website?.message}>
          <input className={fieldClass(errors.website)} placeholder="https://" {...register("website")} />
        </Field>
        <Field label={copy.fields.x} error={errors.xHandle?.message} required>
          <input className={fieldClass(errors.xHandle)} placeholder="@handle" {...register("xHandle")} />
        </Field>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label={copy.fields.discord} error={errors.discord?.message}>
          <input className={fieldClass(errors.discord)} {...register("discord")} />
        </Field>
        <Field label={copy.fields.collectionSize} error={errors.collectionSize?.message}>
          <input className={fieldClass(errors.collectionSize)} placeholder="e.g. 5,000" {...register("collectionSize")} />
        </Field>
      </div>

      <Field label={copy.fields.blockchain} error={errors.blockchain?.message}>
        <input className={fieldClass(errors.blockchain)} placeholder="e.g. Ethereum" {...register("blockchain")} />
      </Field>

      <Field label={copy.fields.pitch} error={errors.collaborationPitch?.message} required>
        <textarea rows={4} className={cn(fieldClass(errors.collaborationPitch), "resize-y min-h-[100px]")} {...register("collaborationPitch")} />
      </Field>

      <Field label={copy.fields.spots} error={errors.spotsRequested?.message}>
        <input type="number" min={1} className={fieldClass(errors.spotsRequested)} {...register("spotsRequested")} />
      </Field>

      <Field label={copy.fields.dream} error={errors.dreamCollaborations?.message}>
        <textarea rows={3} className={cn(fieldClass(errors.dreamCollaborations), "resize-y")} {...register("dreamCollaborations")} />
      </Field>

      {error && (
        <div className="rounded-xl border border-pawlings-coral/40 bg-pawlings-coral/10 px-4 py-3 text-sm text-pawlings-coral" role="alert">
          {error}
        </div>
      )}

      <GameButton type="submit" fullWidth loading={submitting}>
        {submitting ? copy.submitting : copy.submit}
      </GameButton>
    </form>
  );
}

function fieldClass(error?: { message?: string }) {
  return cn(
    "w-full rounded-xl border bg-white/5 px-4 py-3 text-pawlings-white placeholder:text-pawlings-muted/60",
    "focus:outline-none focus:ring-2 focus:ring-pawlings-lime/40",
    error ? "border-pawlings-coral" : "border-white/10"
  );
}

function Field({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-display font-bold text-pawlings-white mb-1.5">
        {label}
        {required && <span className="text-pawlings-lime ml-1">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-pawlings-coral mt-1">{error}</p>}
    </div>
  );
}
