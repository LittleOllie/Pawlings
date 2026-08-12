import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { pawlingsContent } from "@/config/pawlings-content";

interface PawlingsLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "hero";
  priority?: boolean;
  linked?: boolean;
}

const heights = {
  sm: "h-10 w-auto",
  md: "h-14 w-auto",
  lg: "h-20 sm:h-24 w-auto",
  hero: "h-32 sm:h-44 md:h-52 lg:h-60 w-auto max-w-[min(92vw,560px)]",
};

export function PawlingsLogo({
  className,
  size = "md",
  priority = false,
  linked = false,
}: PawlingsLogoProps) {
  const img = (
    <Image
      src={pawlingsContent.brand.logoPath}
      alt={pawlingsContent.brand.logoAlt}
      width={512}
      height={512}
      priority={priority}
      className={cn(
        "object-contain drop-shadow-[0_12px_40px_rgba(0,0,0,0.45)]",
        heights[size],
        className
      )}
    />
  );

  if (linked) {
    return (
      <Link href="/#apply" className="inline-flex animate-logo-float">
        {img}
      </Link>
    );
  }

  return <span className="inline-flex animate-logo-float">{img}</span>;
}
