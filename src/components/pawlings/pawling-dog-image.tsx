import Image from "next/image";
import { cn } from "@/lib/utils";

interface PawlingDogImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  /** Stagger floating animation */
  floatDelay?: "none" | "short" | "long";
  /** Flip horizontally (e.g. right-side companion) */
  mirrored?: boolean;
  /** Hide from assistive tech when purely decorative */
  decorative?: boolean;
}

export function PawlingDogImage({
  src,
  alt,
  className,
  priority = false,
  floatDelay = "none",
  mirrored = false,
  decorative = false,
}: PawlingDogImageProps) {
  return (
    <Image
      src={src}
      alt={decorative ? "" : alt}
      width={480}
      height={480}
      priority={priority}
      aria-hidden={decorative || undefined}
      className={cn(
        "object-contain drop-shadow-[0_16px_40px_rgba(0,0,0,0.35)] pointer-events-none select-none",
        mirrored && "-scale-x-100",
        floatDelay === "short" && "animate-dog-float",
        floatDelay === "long" && "animate-dog-float-delay",
        className
      )}
    />
  );
}
