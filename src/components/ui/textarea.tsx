import { cn } from "@/lib/utils";
import { forwardRef, type TextareaHTMLAttributes } from "react";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  showCount?: boolean;
  maxLength?: number;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      error,
      hint,
      showCount,
      maxLength,
      id,
      value,
      ...props
    },
    ref
  ) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    const charCount =
      typeof value === "string" ? value.length : 0;

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-foreground"
          >
            {label}
            {props.required && (
              <span className="text-accent ml-0.5" aria-hidden>
                *
              </span>
            )}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          maxLength={maxLength}
          value={value}
          className={cn(
            "w-full rounded-lg border bg-background-elevated px-4 py-3",
            "text-foreground placeholder:text-foreground-subtle",
            "border-border focus:border-accent focus:ring-1 focus:ring-accent/30",
            "transition-colors duration-200 min-h-[120px] resize-y",
            error && "border-error focus:border-error focus:ring-error/30",
            className
          )}
          aria-invalid={error ? true : undefined}
          {...props}
        />
        <div className="flex justify-between">
          {hint && !error && (
            <p className="text-xs text-foreground-muted">{hint}</p>
          )}
          {error && (
            <p className="text-xs text-error" role="alert">
              {error}
            </p>
          )}
          {showCount && maxLength && (
            <p
              className={cn(
                "text-xs ml-auto",
                charCount > maxLength * 0.9
                  ? "text-warning"
                  : "text-foreground-subtle"
              )}
            >
              {charCount}/{maxLength}
            </p>
          )}
        </div>
      </div>
    );
  }
);
Textarea.displayName = "Textarea";
