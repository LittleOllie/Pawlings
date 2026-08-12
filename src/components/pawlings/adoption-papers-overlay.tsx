"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { X } from "lucide-react";
import { pawlingsContent } from "@/config/pawlings-content";
import { prefersReducedMotion } from "@/lib/intro-session";
import { AdoptionApplicationFlow } from "./adoption-application-flow";
import { cn } from "@/lib/utils";

interface AdoptionPapersOverlayProps {
  open: boolean;
  onClose: () => void;
  canSubmit: boolean;
  closedMessage: string;
}

const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function AdoptionPapersOverlay({
  open,
  onClose,
  canSubmit,
  closedMessage,
}: AdoptionPapersOverlayProps) {
  const copy = pawlingsContent.adoption;
  const panelRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [fileNumber, setFileNumber] = useState("PAW-0001");
  const reducedMotion = prefersReducedMotion();

  useEffect(() => {
    if (!open) return;

    let cancelled = false;

    fetch("/api/applications/next-reference")
      .then((res) => res.json())
      .then((data: { referenceCode?: string }) => {
        if (!cancelled && data.referenceCode) {
          setFileNumber(data.referenceCode);
        }
      })
      .catch(() => {
        if (!cancelled) setFileNumber("PAW-0001");
      });

    return () => {
      cancelled = true;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    scrollRef.current?.scrollTo({ top: 0 });
    panelRef.current?.scrollTo({ top: 0 });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const timer = window.setTimeout(() => closeRef.current?.focus(), 120);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key !== "Tab" || !panelRef.current) return;

      const focusables = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)
      ).filter((el) => el.offsetParent !== null);

      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose]
  );

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label={copy.close}
            className="adoption-overlay-backdrop"
            initial={{ opacity: reducedMotion ? 1 : 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.3 }}
            onClick={onClose}
          />

          <div
            ref={scrollRef}
            className="adoption-papers-scroll"
            onClick={handleBackdropClick}
            role="presentation"
          >
            <motion.div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="adoption-papers-title"
              className="adoption-papers-document adoption-papers-document--paper adoption-papers-document--folded"
              initial={reducedMotion ? false : { y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={
                reducedMotion
                  ? { opacity: 0 }
                  : { y: "100%", opacity: 0 }
              }
              transition={
                reducedMotion
                  ? { duration: 0.15 }
                  : {
                      type: "spring",
                      stiffness: 340,
                      damping: 32,
                      mass: 0.9,
                    }
              }
              onClick={(e) => e.stopPropagation()}
            >
              <span className="adoption-papers-watermark-paw adoption-papers-watermark-paw--1" aria-hidden />
              <span className="adoption-papers-watermark-paw adoption-papers-watermark-paw--2" aria-hidden />
              <span className="adoption-papers-watermark-crown" aria-hidden />

              <button
                ref={closeRef}
                type="button"
                className="adoption-papers-close"
                onClick={onClose}
                aria-label={copy.close}
              >
                <X className="h-4 w-4" />
              </button>

              <div className="adoption-papers-frame">
                <span className="adoption-papers-corner adoption-papers-corner--tl" aria-hidden />
                <span className="adoption-papers-corner adoption-papers-corner--tr" aria-hidden />
                <span className="adoption-papers-corner adoption-papers-corner--bl" aria-hidden />
                <span className="adoption-papers-corner adoption-papers-corner--br" aria-hidden />

                <div className="adoption-papers-inner">
                  <div className="adoption-papers-stamp" aria-hidden>
                    <Image
                      src={pawlingsContent.assets.officialStamp}
                      alt=""
                      width={500}
                      height={500}
                      className="adoption-papers-stamp-image"
                      sizes="(max-width: 380px) 44px, (max-width: 640px) 56px, 88px"
                      priority
                    />
                  </div>

                  <div className="adoption-papers-header-row">
                    <span className="adoption-papers-file-no">
                      {copy.fileLabel} #{fileNumber}
                    </span>
                  </div>

                  <header className="adoption-papers-header">
                    <p className="adoption-papers-eyebrow" aria-hidden>
                      ✦ &nbsp; Pawlings Universe &nbsp; ✦
                    </p>
                    <div className="adoption-papers-ornament" aria-hidden>
                      <span className="adoption-papers-ornament-line" />
                      <span className="adoption-papers-ornament-paw">🐾</span>
                      <span className="adoption-papers-ornament-line" />
                    </div>
                    <h2
                      id="adoption-papers-title"
                      className={cn(
                        "adoption-papers-title adoption-papers-title--paper",
                        !reducedMotion && "animate-adoption-title-sparkle"
                      )}
                    >
                      {copy.overlayTitle}
                    </h2>
                    <p className="adoption-papers-subtitle adoption-papers-subtitle--paper">
                      {copy.overlaySubtitle}
                    </p>
                    <div className="adoption-papers-ornament adoption-papers-ornament--thin" aria-hidden>
                      <span className="adoption-papers-ornament-line" />
                    </div>
                  </header>

                  <div className="adoption-papers-form-panel adoption-papers-form-panel--paper">
                    <AdoptionApplicationFlow
                      canSubmit={canSubmit}
                      closedMessage={closedMessage}
                      onReturnHome={onClose}
                      onDismiss={onClose}
                    />
                  </div>

                  <p className="adoption-papers-agency">{copy.agency}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
