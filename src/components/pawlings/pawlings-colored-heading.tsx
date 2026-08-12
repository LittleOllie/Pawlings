import { forwardRef, type HTMLAttributes } from "react";
import { pawlingsLogoWordColors } from "@/config/pawlings-brand-colors";
import { cn } from "@/lib/utils";

type HeadingTag = "h1" | "h2" | "h3";

interface PawlingsColoredHeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: HeadingTag;
  children: string;
  /** Word to render with logo letter colours; defaults to the last word */
  highlight?: string;
}

function colorForIndex(index: number): string {
  return pawlingsLogoWordColors[index % pawlingsLogoWordColors.length];
}

function resolveHighlight(text: string, highlight?: string): string {
  const trimmed = highlight?.trim();
  if (trimmed) return trimmed;

  const words = text.trim().split(/\s+/).filter(Boolean);
  return words[words.length - 1] ?? text.trim();
}

function ColoredLetters({ word }: { word: string }) {
  return (
    <>
      {word.split("").map((char, index) => (
        <span
          key={`${char}-${index}`}
          className="pawlings-colored-word"
          style={{ color: colorForIndex(index) }}
        >
          {char}
        </span>
      ))}
    </>
  );
}

function normalizeWord(word: string): string {
  return word.toLowerCase().replace(/[^\w]/g, "");
}

function wordsMatch(word: string, highlight: string): boolean {
  return normalizeWord(word) === normalizeWord(highlight);
}

export const PawlingsColoredHeading = forwardRef<
  HTMLHeadingElement,
  PawlingsColoredHeadingProps
>(function PawlingsColoredHeading(
  { as: Tag = "h2", children, highlight, className, ...props },
  ref
) {
  const text = children.trim();
  const words = text.split(/\s+/).filter(Boolean);
  const resolvedHighlight = resolveHighlight(text, highlight);

  return (
    <Tag
      ref={ref}
      className={cn("text-pawlings-white", className)}
      {...props}
    >
      {words.map((word, index) => (
        <span key={`${word}-${index}`}>
          {index > 0 && " "}
          {wordsMatch(word, resolvedHighlight) ? (
            <ColoredLetters word={word} />
          ) : (
            word
          )}
        </span>
      ))}
    </Tag>
  );
});
