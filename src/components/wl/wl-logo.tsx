import Image from "next/image";
import Link from "next/link";
import { projectConfig } from "@/config/project";
import { cn } from "@/lib/utils";

interface WlLogoProps {
  className?: string;
  size?: "lg" | "xl" | "splash" | "hero";
  linked?: boolean;
  glow?: boolean;
}

const sizeClasses = {
  lg: "h-24 sm:h-32 md:h-36 w-auto",
  xl: "h-28 sm:h-40 md:h-48 w-auto",
  splash: "h-36 sm:h-52 md:h-64 w-auto",
  hero: "h-48 sm:h-64 md:h-80 lg:h-[22rem] w-auto max-w-[min(92vw,680px)]",
};

export function WlLogo({
  className,
  size = "xl",
  linked = true,
  glow = true,
}: WlLogoProps) {
  const image = (
    <div className={cn("relative inline-flex", className)}>
      {glow && (
        <>
          <div
            className="absolute inset-0 scale-110 blur-2xl bg-accent/20 rounded-full pointer-events-none"
            aria-hidden
          />
          <div
            className="absolute inset-0 scale-90 blur-3xl bg-highlight/15 rounded-full pointer-events-none"
            aria-hidden
          />
        </>
      )}
      <Image
        src={projectConfig.assets.logo}
        alt={projectConfig.name}
        width={512}
        height={512}
        className={cn(
          "relative object-contain",
          glow
            ? "drop-shadow-[0_10px_36px_rgba(163,230,53,0.35)]"
            : "drop-shadow-[0_16px_48px_rgba(0,0,0,0.5)]",
          sizeClasses[size]
        )}
        priority
      />
    </div>
  );

  if (linked) {
    return (
      <Link
        href="/apply"
        className="inline-flex transition-transform duration-200 hover:scale-[1.02]"
      >
        {image}
      </Link>
    );
  }

  return image;
}
