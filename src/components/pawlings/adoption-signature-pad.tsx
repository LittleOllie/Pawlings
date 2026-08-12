"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import SignatureCanvas from "react-signature-canvas";
import { Eraser, Undo2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AdoptionSignaturePadRef {
  clear: () => void;
  isEmpty: () => boolean;
  toDataURL: () => string;
}

interface AdoptionSignaturePadProps {
  onChange?: (dataUrl: string | null) => void;
  disabled?: boolean;
  error?: string;
}

export const AdoptionSignaturePad = forwardRef<
  AdoptionSignaturePadRef,
  AdoptionSignaturePadProps
>(({ onChange, disabled, error }, ref) => {
  const padRef = useRef<SignatureCanvas>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    clear: () => {
      padRef.current?.clear();
      onChange?.(null);
    },
    isEmpty: () => padRef.current?.isEmpty() ?? true,
    toDataURL: () => padRef.current?.toDataURL("image/png") ?? "",
  }));

  const resizeCanvas = useCallback(() => {
    const canvas = padRef.current?.getCanvas();
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    const width = container.offsetWidth;
    const height = Math.min(160, Math.max(120, width * 0.32));

    canvas.width = width * ratio;
    canvas.height = height * ratio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext("2d");
    if (ctx) ctx.scale(ratio, ratio);
  }, []);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [resizeCanvas]);

  const handleEnd = () => {
    if (padRef.current && !padRef.current.isEmpty()) {
      onChange?.(padRef.current.toDataURL("image/png"));
    }
  };

  return (
    <div className="space-y-3">
      <div
        ref={containerRef}
        className={cn(
          "adoption-signature-pad relative overflow-hidden",
          error && "adoption-signature-pad--error"
        )}
        role="application"
        aria-label="Draw your signature"
      >
        <span className="adoption-signature-pad-label" aria-hidden>
          Sign here
        </span>
        <SignatureCanvas
          ref={padRef}
          penColor="#141b45"
          canvasProps={{
            className: "w-full touch-none",
            "aria-hidden": true,
          }}
          onEnd={handleEnd}
          dotSize={2}
          minWidth={1.2}
          maxWidth={2.8}
        />
        {disabled && (
          <div className="absolute inset-0 bg-white/50 cursor-not-allowed" />
        )}
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => {
            const pad = padRef.current;
            if (!pad) return;
            const data = pad.toData();
            if (data.length > 0) {
              data.pop();
              pad.fromData(data);
              if (pad.isEmpty()) onChange?.(null);
              else onChange?.(pad.toDataURL("image/png"));
            }
          }}
          disabled={disabled}
          className="adoption-signature-pad-btn"
        >
          <Undo2 className="h-3.5 w-3.5" />
          Undo
        </button>
        <button
          type="button"
          onClick={() => {
            padRef.current?.clear();
            onChange?.(null);
          }}
          disabled={disabled}
          className="adoption-signature-pad-btn"
        >
          <Eraser className="h-3.5 w-3.5" />
          Clear
        </button>
      </div>

      {error && (
        <p className="text-xs text-pawlings-coral" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});
AdoptionSignaturePad.displayName = "AdoptionSignaturePad";
