import Image from "next/image";
import { Lock } from "lucide-react";
import { GameCard } from "./game-card";
import { pawlingsContent } from "@/config/pawlings-content";
import { cn } from "@/lib/utils";

interface CharacterCardProps {
  name?: string;
  trait?: string;
  hint?: string;
  image?: string;
  imageAlt?: string;
  stamp?: string;
  mirrored?: boolean;
  locked?: boolean;
}

export function CharacterCard({
  name = pawlingsContent.characters.placeholderName,
  trait = pawlingsContent.characters.placeholderTrait,
  hint = pawlingsContent.characters.placeholderHint,
  image,
  imageAlt,
  stamp,
  mirrored = false,
  locked = false,
}: CharacterCardProps) {
  const isLocked = locked || !image;

  return (
    <GameCard
      collectible
      tilt={!isLocked}
      className={cn(
        "p-5 text-center overflow-hidden relative",
        isLocked && "locked-collectible"
      )}
    >
      {isLocked ? (
        <>
          <div className="mx-auto mb-4 flex h-36 w-full items-end justify-center relative">
            <Image
              src={pawlingsContent.assets.dog1}
              alt=""
              width={200}
              height={200}
              className="h-28 w-auto object-contain locked-collectible-silhouette"
              aria-hidden
            />
            <div className="locked-collectible-overlay rounded-2xl">
              <span className="font-display text-5xl font-bold text-pawlings-white/30 mb-2">
                ?
              </span>
              <span className="locked-collectible-badge">
                <Lock className="h-3 w-3" aria-hidden />
                Locked
              </span>
            </div>
          </div>
          <h3 className="font-display font-bold text-lg text-pawlings-muted">
            {name}
          </h3>
          <p className="text-sm text-pawlings-purple/80 mt-1">{trait}</p>
          <p className="text-xs text-pawlings-muted/70 mt-2">{hint}</p>
        </>
      ) : (
        <>
          <div className="mx-auto mb-4 flex h-36 w-full items-end justify-center">
            <Image
              src={image}
              alt={imageAlt ?? name}
              width={280}
              height={280}
              className={cn(
                "h-32 sm:h-36 w-auto object-contain drop-shadow-[0_12px_28px_rgba(0,0,0,0.35)] animate-dog-float",
                mirrored && "-scale-x-100"
              )}
            />
          </div>
          <h3 className="font-display font-bold text-lg text-pawlings-white">
            {name}
          </h3>
          <p className="text-sm text-pawlings-pink mt-1">{trait}</p>
          {stamp && (
            <span className="inline-block mt-2 text-[0.6rem] font-display font-bold uppercase tracking-wider text-pawlings-yellow/90 border border-pawlings-yellow/30 rounded-full px-2 py-0.5">
              {stamp}
            </span>
          )}
        </>
      )}
    </GameCard>
  );
}

export { CharacterCard as PawlingCharacterCard };
