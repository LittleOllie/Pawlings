"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  adoptionFlowSchema,
  type AdoptionFlowFormValues,
  type SimpleApplicationFormValues,
} from "@/lib/validation";
import { pawlingsContent } from "@/config/pawlings-content";
import { GameButton } from "./game-button";
import { AdoptionSignaturePad, type AdoptionSignaturePadRef } from "./adoption-signature-pad";
import { XVerificationStatus } from "./x-verification-status";
import {
  AdoptionSuccessScreen,
  type AdoptionSuccessData,
} from "./adoption-success-screen";
import { cn } from "@/lib/utils";

const STEPS = ["guardian", "wallet", "statement", "sign"] as const;
type Step = (typeof STEPS)[number];

type FlowValues = AdoptionFlowFormValues;

interface AdoptionApplicationFlowProps {
  canSubmit: boolean;
  closedMessage: string;
  onReturnHome?: () => void;
  onDismiss?: () => void;
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="text-xs text-pawlings-coral mt-1.5" role="alert">
      {message}
    </p>
  );
}

export function AdoptionApplicationFlow({
  canSubmit,
  closedMessage,
  onReturnHome,
  onDismiss,
}: AdoptionApplicationFlowProps) {
  const copy = pawlingsContent.adoption;
  const agreementId = useId();
  const liveRef = useRef<HTMLDivElement>(null);
  const walletRef = useRef<HTMLInputElement>(null);
  const signatureRef = useRef<AdoptionSignaturePadRef>(null);

  const [stepIndex, setStepIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDuplicateNotice, setIsDuplicateNotice] = useState(false);
  const [signatureError, setSignatureError] = useState<string | null>(null);
  const [success, setSuccess] = useState<AdoptionSuccessData | null>(null);

  const step = STEPS[stepIndex];

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FlowValues>({
    resolver: zodResolver(adoptionFlowSchema),
    defaultValues: {
      walletAddress: "",
      xHandle: "",
      discordUsername: "",
      applicationAnswer: "",
      signatureDataUrl: "",
      agreement: false,
      honeypot: "",
    },
    mode: "onTouched",
  });

  const xHandle = watch("xHandle");

  const { ref: walletRegisterRef, ...walletField } = register("walletAddress");

  useEffect(() => {
    if (!canSubmit || success) return;
    if (step === "wallet") {
      const t = window.setTimeout(() => walletRef.current?.focus(), 200);
      return () => window.clearTimeout(t);
    }
  }, [canSubmit, success, step]);

  useEffect(() => {
    liveRef.current?.focus();
  }, [step, success]);

  const validateStep = useCallback(async (s: Step) => {
    switch (s) {
      case "guardian":
        return trigger(["xHandle", "discordUsername"]);
      case "wallet":
        return trigger(["walletAddress"]);
      case "statement":
        return true;
      case "sign": {
        if (!getValues("agreement")) {
          setError("Please agree to the adoption terms before signing.");
          return false;
        }
        const sig = getValues("signatureDataUrl");
        if (!sig?.startsWith("data:image")) {
          setSignatureError("Please draw your signature");
          return false;
        }
        setSignatureError(null);
        return true;
      }
      default:
        return true;
    }
  }, [trigger, getValues]);

  const goNext = async () => {
    setError(null);
    setIsDuplicateNotice(false);
    const valid = await validateStep(step);
    if (!valid) return;

    if (step === "sign") {
      await handleSubmit(onSubmit)();
      return;
    }

    if (step === "statement" && !getValues("applicationAnswer")?.trim()) {
      setStepIndex((i) => i + 1);
      return;
    }

    setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  };

  const goBack = () => {
    setError(null);
    setIsDuplicateNotice(false);
    setStepIndex((i) => Math.max(i - 1, 0));
  };

  const onSubmit = async (data: FlowValues) => {
    if (!data.agreement) {
      setError("Please agree to the adoption terms before signing.");
      return;
    }

    setSubmitting(true);
    setError(null);
    setIsDuplicateNotice(false);

    const payload: SimpleApplicationFormValues = {
      walletAddress: data.walletAddress,
      xHandle: data.xHandle,
      discordUsername: data.discordUsername,
      honeypot: data.honeypot,
      applicationAnswer: data.applicationAnswer,
      signatureDataUrl: data.signatureDataUrl,
    };

    try {
      const res = await fetch("/api/applications/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (!res.ok) {
        const isDuplicate = result.error === "duplicate";
        setIsDuplicateNotice(isDuplicate);
        setError(
          isDuplicate
            ? result.message ?? copy.duplicateWalletMessage
            : result.error ?? "Submission failed"
        );
        return;
      }
      setIsDuplicateNotice(false);
      setSuccess({
        referenceCode: result.referenceCode,
        walletAddress: data.walletAddress,
        xHandle: data.xHandle,
        signatureDataUrl: data.signatureDataUrl ?? "",
        submittedAt: new Date(),
      });
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!canSubmit) {
    return (
      <div className="text-center py-8">
        <p className="font-display text-xl font-bold text-paper-text mb-2">
          {copy.closedTitle}
        </p>
        <p className="text-sm text-paper-text-muted">{closedMessage}</p>
      </div>
    );
  }

  if (success) {
    return (
      <AdoptionSuccessScreen
        data={success}
        onReturnHome={() => onReturnHome?.()}
      />
    );
  }

  return (
    <div>
      <div
        ref={liveRef}
        tabIndex={-1}
        className="sr-only"
        aria-live="polite"
        aria-atomic
      >
        Step {stepIndex + 1} of {STEPS.length}: {copy.steps[step]}
      </div>

      <AdoptionProgress current={stepIndex} total={STEPS.length} />

      {onDismiss && stepIndex === 0 && (
        <div className="flex justify-end -mt-1 mb-3">
          <button
            type="button"
            onClick={onDismiss}
            disabled={submitting}
            className="adoption-papers-dismiss"
          >
            {copy.close}
          </button>
        </div>
      )}

      {stepIndex > 0 && (
        <button
          type="button"
          onClick={goBack}
          disabled={submitting}
          className="adoption-papers-step-back"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden />
          {copy.back}
        </button>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void goNext();
        }}
        noValidate
        className="mt-5 space-y-4"
      >
        <input
          type="text"
          {...register("honeypot")}
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden
        />

        {step === "guardian" && (
          <div className="space-y-4">
            <p className="text-sm text-paper-text-muted">{copy.guardianIntro}</p>
            <div className="adoption-papers-field">
              <label htmlFor="adopt-x" className="adoption-paper-label">
                {copy.xLabel}{" "}
                <span className="text-pawlings-purple">*</span>
              </label>
              <p className="text-xs text-paper-text-muted mb-1.5">{copy.xHint}</p>
              <input
                id="adopt-x"
                className={cn(
                  "adoption-paper-input",
                  errors.xHandle && "adoption-paper-input--error"
                )}
                placeholder={copy.xPlaceholder}
                aria-invalid={!!errors.xHandle}
                {...register("xHandle")}
              />
              <FieldError id="adopt-x-error" message={errors.xHandle?.message} />
            </div>
            <XVerificationStatus xHandle={xHandle} />
            <div className="adoption-papers-field">
              <label htmlFor="adopt-discord" className="adoption-paper-label">
                {copy.discordLabel}
                <span className="text-paper-text-muted font-normal text-xs ml-1">
                  (optional)
                </span>
              </label>
              <input
                id="adopt-discord"
                className={cn(
                  "adoption-paper-input",
                  errors.discordUsername && "adoption-paper-input--error"
                )}
                placeholder={copy.discordPlaceholder}
                {...register("discordUsername")}
              />
              <FieldError
                id="adopt-discord-error"
                message={errors.discordUsername?.message}
              />
            </div>
          </div>
        )}

        {step === "wallet" && (
          <div className="adoption-papers-field">
            <label htmlFor="adopt-wallet" className="adoption-paper-label">
              {copy.walletLabel}{" "}
              <span className="text-pawlings-purple">*</span>
            </label>
            <p className="text-xs text-paper-text-muted mb-1.5">{copy.walletHint}</p>
            <input
              id="adopt-wallet"
              ref={(el) => {
                walletRegisterRef(el);
                walletRef.current = el;
              }}
              className={cn(
                "adoption-paper-input font-mono",
                errors.walletAddress && "adoption-paper-input--error"
              )}
              placeholder={copy.walletPlaceholder}
              aria-invalid={!!errors.walletAddress}
              {...walletField}
            />
            <FieldError
              id="adopt-wallet-error"
              message={errors.walletAddress?.message}
            />
            <p className="text-xs text-paper-text-muted mt-2">{copy.securityNote}</p>
          </div>
        )}

        {step === "statement" && (
          <div className="adoption-papers-field">
            <label htmlFor="adopt-statement" className="adoption-paper-label">
              {copy.statementLabel}
            </label>
            <p className="text-xs text-paper-text-muted mb-1.5">{copy.statementHint}</p>
            <textarea
              id="adopt-statement"
              rows={4}
              className="adoption-paper-input resize-y min-h-[100px]"
              placeholder={copy.statementPlaceholder}
              maxLength={500}
              {...register("applicationAnswer")}
            />
          </div>
        )}

        {step === "sign" && (
          <div className="space-y-4">
            <div className="adoption-papers-field adoption-signature-block">
              <label className="adoption-paper-label">
                {copy.signatureLabel}{" "}
                <span className="text-pawlings-purple">*</span>
              </label>
              <p className="text-xs text-paper-text-muted mb-2">{copy.signatureHint}</p>
              <AdoptionSignaturePad
                ref={signatureRef}
                error={signatureError ?? undefined}
                onChange={(dataUrl) => {
                  setValue("signatureDataUrl", dataUrl ?? "", { shouldValidate: true });
                  if (dataUrl) setSignatureError(null);
                }}
              />
            </div>

            <label htmlFor={agreementId} className="adoption-papers-agreement">
              <input
                id={agreementId}
                type="checkbox"
                className="mt-1 h-4 w-4 shrink-0 rounded accent-pawlings-purple"
                {...register("agreement")}
              />
              <span className="adoption-papers-agreement-text text-sm leading-snug">
                <span className="adoption-papers-agreement-heading">Adoption terms</span>
                {copy.agreement}{" "}
                <Link
                  href="/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="adoption-papers-agreement-link"
                >
                  Privacy
                </Link>{" "}
                ·{" "}
                <Link
                  href="/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="adoption-papers-agreement-link"
                >
                  Terms
                </Link>
              </span>
            </label>

            <p className="text-xs text-paper-text-muted">{copy.noGuaranteeNote}</p>
          </div>
        )}

        {error && (
          <div
            className={cn(
              isDuplicateNotice ? "adoption-paper-notice" : "adoption-paper-error"
            )}
            role="alert"
          >
            {error}
          </div>
        )}

        <div className="flex flex-col gap-2.5 pt-2">
          {step === "statement" && (
            <button
              type="button"
              onClick={() => setStepIndex((i) => i + 1)}
              className="adoption-papers-skip-link"
            >
              {copy.skip}
            </button>
          )}
          <GameButton
            type="submit"
            fullWidth
            loading={submitting}
            disabled={submitting}
            className="adoption-papers-continue-btn"
          >
            {step === "sign"
              ? submitting
                ? copy.submitting
                : copy.submit
              : copy.next}
          </GameButton>
        </div>
      </form>
    </div>
  );
}

function AdoptionProgress({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  const copy = pawlingsContent.adoption;
  const labels = [
    copy.steps.guardian,
    copy.steps.wallet,
    copy.steps.statement,
    copy.steps.sign,
  ];

  return (
    <div className="adoption-progress" aria-hidden>
      <div className="flex gap-1.5 mb-2">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors duration-300",
              i <= current ? "bg-pawlings-lime" : "bg-paper-border"
            )}
          />
        ))}
      </div>
      <p className="text-xs font-display font-bold uppercase tracking-wider text-paper-text-muted">
        {labels[current]}
      </p>
    </div>
  );
}
