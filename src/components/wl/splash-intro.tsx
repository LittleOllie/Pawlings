"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WlLogo } from "@/components/wl/wl-logo";
import { projectConfig } from "@/config/project";

export function SplashIntro() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-art grain art-gradient">
      {/* Dog background */}
      <div className="absolute inset-0 z-0 animate-dog-reveal-slow scale-105 sm:scale-110 md:scale-[1.15] origin-center">
        <Image
          src={projectConfig.assets.splashDog}
          alt=""
          fill
          className="object-contain object-center"
          priority
          aria-hidden
        />
      </div>

      <div
        className="absolute inset-0 z-[1] bg-gradient-to-b from-background/20 via-transparent to-background/60 pointer-events-none"
        aria-hidden
      />
      <div
        className="absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(10,18,32,0.4)_100%)] pointer-events-none"
        aria-hidden
      />

      {/* Logo + CTA */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-12">
        <div className="relative flex items-center justify-center w-full max-w-2xl aspect-square sm:aspect-auto sm:min-h-[420px] md:min-h-[480px]">
          {/* Soft glow — fades in on landing */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              className={`w-[min(92vw,560px)] h-[min(92vw,560px)] rounded-full ${
                ready ? "animate-logo-glow" : "opacity-0"
              }`}
              style={{
                background:
                  "radial-gradient(circle, rgba(163,230,53,0.2) 0%, rgba(236,72,153,0.12) 35%, rgba(168,85,247,0.08) 55%, transparent 72%)",
              }}
              aria-hidden
            />
          </div>

          <div
            className={
              ready
                ? "animate-logo-land relative z-10"
                : "opacity-0 scale-[0.12] blur-2xl relative z-10"
            }
          >
            <WlLogo size="hero" linked={false} glow={false} />
          </div>
        </div>

        <Link
          href="/apply"
          className={`mt-6 sm:mt-8 ${ready ? "animate-splash-cta-clean" : "opacity-0"}`}
        >
          <Button size="sm" variant="outline" className="text-sm px-5">
            {projectConfig.splashCta}
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
