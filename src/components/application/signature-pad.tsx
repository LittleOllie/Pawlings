"use client";

import {
  useRef,
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import SignatureCanvas from "react-signature-canvas";
import { Button } from "@/components/ui/button";
import { Eraser, Undo2 } from "lucide-react";

export interface SignaturePadRef {
  clear: () => void;
  isEmpty: () => boolean;
  toDataURL: () => string;
}

interface SignaturePadProps {
  onChange?: (dataUrl: string | null) => void;
  disabled?: boolean;
}

export const SignaturePad = forwardRef<SignaturePadRef, SignaturePadProps>(
  ({ onChange, disabled }, ref) => {
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
      const height = Math.min(200, width * 0.4);

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

    const handleClear = () => {
      padRef.current?.clear();
      onChange?.(null);
    };

    const handleUndo = () => {
      const pad = padRef.current;
      if (!pad) return;
      const data = pad.toData();
      if (data.length > 0) {
        data.pop();
        pad.fromData(data);
        if (pad.isEmpty()) {
          onChange?.(null);
        } else {
          onChange?.(pad.toDataURL("image/png"));
        }
      }
    };

    return (
      <div className="space-y-3">
        <div
          ref={containerRef}
          className="relative rounded-lg border-2 border-dashed border-border overflow-hidden bg-signature-bg"
          role="application"
          aria-label="Signature drawing area"
        >
          <SignatureCanvas
            ref={padRef}
            penColor="#1a1917"
            canvasProps={{
              className: "w-full touch-none",
              "aria-hidden": true,
            }}
            onEnd={handleEnd}
            dotSize={2}
            minWidth={1}
            maxWidth={3}
          />
          {disabled && (
            <div className="absolute inset-0 bg-background/50 cursor-not-allowed" />
          )}
        </div>

        <p className="text-xs text-foreground-muted">
          This is a ceremonial signature for your adoption application. It does
          not authorise a blockchain transaction or provide access to your
          wallet.
        </p>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleUndo}
            disabled={disabled}
          >
            <Undo2 className="h-4 w-4" />
            Undo
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleClear}
            disabled={disabled}
          >
            <Eraser className="h-4 w-4" />
            Clear
          </Button>
        </div>
      </div>
    );
  }
);
SignaturePad.displayName = "SignaturePad";
