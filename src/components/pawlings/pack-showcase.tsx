"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { pawlingsContent } from "@/config/pawlings-content";
import { prefersReducedMotion } from "@/lib/intro-session";
import { cn } from "@/lib/utils";

const ROTATE_MS = 4500;

export function PackShowcase() {
  const dogs = pawlingsContent.characters.featured;
  const [active, setActive] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(prefersReducedMotion());
  }, []);

  useEffect(() => {
    if (reducedMotion || dogs.length <= 1) return;

    const id = window.setInterval(() => {
      setActive((index) => (index + 1) % dogs.length);
    }, ROTATE_MS);

    return () => window.clearInterval(id);
  }, [dogs.length, reducedMotion]);

  const selectDog = useCallback((index: number) => {
    setActive(index);
  }, []);

  const dog = dogs[active];

  return (
    <div className="pack-showcase-panel">
      <div className="pack-showcase-inner">
        <AnimatePresence mode="wait">
          <motion.div
            key={dog.name}
            className="pack-showcase-member"
            initial={reducedMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? undefined : { opacity: 0, y: -10 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="pack-showcase-image-wrap">
              <Image
                src={dog.image}
                alt={`${dog.name}, ${dog.trait}`}
                width={420}
                height={420}
                priority={active === 0}
                className={cn(
                  "pack-showcase-image animate-dog-float",
                  dog.mirrored && "-scale-x-100"
                )}
              />
            </div>
            <h3 className="font-display font-bold text-xl sm:text-2xl text-pawlings-white">
              {dog.name}
            </h3>
            <p className="text-sm sm:text-base text-pawlings-pink mt-1">{dog.trait}</p>
            {dog.stamp && <span className="pack-showcase-stamp">{dog.stamp}</span>}
          </motion.div>
        </AnimatePresence>

        <div className="pack-showcase-dots" role="tablist" aria-label="Meet the pack">
          {dogs.map((member, index) => (
            <button
              key={member.name}
              type="button"
              role="tab"
              aria-selected={index === active}
              aria-label={`Show ${member.name}`}
              className={cn(
                "pack-showcase-dot",
                index === active && "pack-showcase-dot--active"
              )}
              onClick={() => selectDog(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
