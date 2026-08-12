import { cn } from "@/lib/utils";
import { forwardRef, type ButtonHTMLAttributes } from "react";

type GameButtonVariant = "primary" | "secondary" | "pink" | "ghost";

interface GameButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: GameButtonVariant;
  loading?: boolean;
  fullWidth?: boolean;
}

const variants: Record<GameButtonVariant, string> = {
  primary: "btn-pawlings-primary",
  secondary: "btn-pawlings-secondary",
  pink: "btn-pawlings-pink",
  ghost:
    "bg-transparent text-pawlings-muted hover:text-pawlings-white border border-transparent",
};

export const GameButton = forwardRef<HTMLButtonElement, GameButtonProps>(
  (
    {
      className,
      variant = "primary",
      loading,
      disabled,
      fullWidth,
      children,
      ...props
    },
    ref
  ) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-display font-bold tracking-wide transition-transform",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pawlings-lime",
        variants[variant],
        fullWidth && "w-full",
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden
        />
      )}
      {children}
    </button>
  )
);
GameButton.displayName = "GameButton";
