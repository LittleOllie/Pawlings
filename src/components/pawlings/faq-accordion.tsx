"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { pawlingsContent } from "@/config/pawlings-content";
import { cn } from "@/lib/utils";

export function FaqAccordion() {
  const baseId = useId();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="faq-signpost space-y-3">
      {pawlingsContent.faq.items.map((item, i) => {
        const open = openIndex === i;
        const panelId = `${baseId}-panel-${i}`;
        const buttonId = `${baseId}-button-${i}`;

        return (
          <div
            key={item.question}
            className={cn("faq-item overflow-hidden", open && "faq-item--open")}
          >
            <button
              id={buttonId}
              type="button"
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-display font-semibold text-pawlings-white hover:bg-white/[0.04] transition-colors"
              aria-expanded={open}
              aria-controls={panelId}
              onClick={() => setOpenIndex(open ? null : i)}
            >
              <span className="flex items-center gap-3">
                <span
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-pawlings-lime/15 text-xs font-bold text-pawlings-lime"
                  aria-hidden
                >
                  {i + 1}
                </span>
                {item.question}
              </span>
              <ChevronDown
                className={cn(
                  "h-5 w-5 shrink-0 text-pawlings-muted transition-transform duration-300",
                  open && "rotate-180 text-pawlings-lime"
                )}
                aria-hidden
              />
            </button>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!open}
              className="px-5 pb-5 pl-[3.25rem] text-sm text-pawlings-muted leading-relaxed border-t border-white/[0.06] pt-3 mx-5"
            >
              {item.answer}
              {"link" in item && item.link && (
                <>
                  {" "}
                  <Link href={item.link} className="text-pawlings-lime hover:underline">
                    {"linkLabel" in item && item.linkLabel ? item.linkLabel : "Apply here"}
                  </Link>
                </>
              )}
            </div>
          </div>
        );
      })}
      {pawlingsContent.faq.footerNote && (
        <p className="text-sm text-pawlings-muted/80 text-center pt-4 italic">
          {pawlingsContent.faq.footerNote}
        </p>
      )}
    </div>
  );
}
