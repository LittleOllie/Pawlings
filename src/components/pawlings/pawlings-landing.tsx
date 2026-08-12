"use client";

import { type RefObject } from "react";
import { motion } from "framer-motion";
import { PawlingsHeader } from "./pawlings-header";
import { PawlingsFooter } from "./pawlings-footer";
import { GameButton } from "./game-button";
import { useAdoptionOverlay } from "./adoption-overlay-context";
import { FaqAccordion } from "./faq-accordion";
import { CharacterCard } from "./character-card";
import { PawlingDogImage } from "./pawling-dog-image";
import { PawlingsColoredHeading } from "./pawlings-colored-heading";
import { PawlingsSharedLogo } from "./intro/pawlings-shared-logo";
import { WorldBackground } from "./world-background";
import { HeroAtmosphere } from "./hero-atmosphere";
import { SectionReveal } from "./section-reveal";
import { RoadmapSection } from "./roadmap-section";
import Link from "next/link";
import { pawlingsContent } from "@/config/pawlings-content";
import { introEasing, introMotion } from "@/config/intro-motion";

interface PawlingsLandingProps {
  xUrl?: string;
  discordUrl?: string;
  introComplete?: boolean;
  isTransitioning?: boolean;
  logoInHero?: boolean;
  showChrome?: boolean;
  heroFocusRef?: RefObject<HTMLHeadingElement | null>;
}

export function PawlingsLanding({
  xUrl,
  discordUrl,
  introComplete = true,
  isTransitioning = false,
  logoInHero = true,
  showChrome = true,
  heroFocusRef,
}: PawlingsLandingProps) {
  const hero = pawlingsContent.hero;
  const adoption = pawlingsContent.adoption;
  const { openAdoption } = useAdoptionOverlay();

  const scrollToMeetThePack = () => {
    document.getElementById("meet-the-pack")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="pawlings-page relative min-h-screen overflow-x-hidden">
      <WorldBackground />

      {/* Deep-link anchor for /apply and #adopt hash */}
      <span id="adopt" className="sr-only" aria-hidden />

      <motion.div
        initial={false}
        animate={{ opacity: showChrome ? 1 : 0, y: showChrome ? 0 : -12 }}
        transition={{ duration: introMotion.pageReveal, ease: introEasing }}
      >
        <PawlingsHeader xUrl={xUrl} />
      </motion.div>

      <main className="relative z-10 pt-24 sm:pt-28">
        {/* Hero */}
        <section
          id="home"
          className="relative min-h-[85svh] flex flex-col justify-center px-4 sm:px-6 pb-16 scroll-mt-24 overflow-visible"
        >
          <HeroAtmosphere active={introComplete} />

          <div className="mx-auto w-full max-w-6xl">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <motion.div
                className="relative z-10 space-y-6 text-center lg:text-left order-2 lg:order-1 min-w-0"
                initial={false}
                animate={{
                  opacity: introComplete ? 1 : 0,
                  y: introComplete ? 0 : 20,
                }}
                transition={{
                  duration: introMotion.pageReveal,
                  ease: introEasing,
                  delay: isTransitioning ? introMotion.logoTransition * 0.4 : 0,
                }}
              >
                <p className="section-eyebrow">{hero.eyebrow}</p>
                <PawlingsColoredHeading
                  as="h1"
                  ref={heroFocusRef}
                  tabIndex={introComplete ? -1 : undefined}
                  highlight={hero.headlineHighlight}
                  className="font-display font-bold leading-[1.08] outline-none"
                  style={{ fontSize: "var(--text-display-xl)" }}
                >
                  {hero.headline}
                </PawlingsColoredHeading>
                <p
                  className="text-pawlings-muted leading-relaxed max-w-xl mx-auto lg:mx-0"
                  style={{ fontSize: "var(--text-body-lg)" }}
                >
                  {hero.subheadline}
                </p>
                <p className="text-sm text-pawlings-muted/90">{hero.microcopy}</p>
                <div className="flex flex-col sm:flex-row flex-wrap gap-3 justify-center lg:justify-start pt-1">
                  <GameButton type="button" onClick={openAdoption}>
                    {hero.ctaPrimary}
                  </GameButton>
                  <GameButton type="button" variant="secondary" onClick={scrollToMeetThePack}>
                    {hero.ctaSecondary}
                  </GameButton>
                </div>
              </motion.div>

              <motion.div
                className="relative order-1 lg:order-2 flex justify-center lg:justify-end w-full min-w-0"
                initial={false}
                animate={{ opacity: introComplete ? 1 : 0, scale: introComplete ? 1 : 0.96 }}
                transition={{ duration: introMotion.pageReveal, ease: introEasing }}
              >
                <div className="hero-scene">
                  <div className="hero-scene-logo">
                    {logoInHero ? (
                      <PawlingsSharedLogo
                        variant="hero"
                        layout
                        priority={introComplete || isTransitioning}
                        disableFloat={!introComplete}
                      />
                    ) : (
                      <div className="h-36 sm:h-48 w-48 shrink-0" aria-hidden />
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Trust strip */}
        <section className="px-4 sm:px-6 pb-4" aria-label="Adoption programme information">
          <div className="mx-auto max-w-4xl trust-strip">
            <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              {pawlingsContent.trustStrip.items.map((item) => (
                <li key={item} className="trust-strip-item">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Meet the Pawlings */}
        <section id="meet-the-pack" className="section-flow px-4 sm:px-6 scroll-mt-28">
          <SectionReveal className="mx-auto max-w-6xl">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <div className="space-y-5">
                <p className="section-eyebrow">{pawlingsContent.about.eyebrow}</p>
                <PawlingsColoredHeading
                  as="h2"
                  highlight={pawlingsContent.about.headingHighlight}
                  className="font-display font-bold leading-tight"
                  style={{ fontSize: "var(--text-display-lg)" }}
                >
                  {pawlingsContent.about.heading}
                </PawlingsColoredHeading>
                <p className="text-pawlings-muted leading-relaxed text-base sm:text-lg">
                  {pawlingsContent.about.body}
                </p>
                <p className="text-pawlings-muted leading-relaxed">
                  {pawlingsContent.about.body2}
                </p>
                <p className="font-display text-lg font-bold text-pawlings-pink">
                  {pawlingsContent.about.highlight}
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {pawlingsContent.about.stamps.map((s) => (
                    <span key={s} className="personality-stamp">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {pawlingsContent.characters.featured.map((dog) => (
                  <CharacterCard
                    key={dog.name}
                    image={dog.image}
                    imageAlt={pawlingsContent.assets.dogAlt}
                    name={dog.name}
                    trait={dog.trait}
                    stamp={dog.stamp}
                    mirrored={dog.mirrored ?? false}
                  />
                ))}
              </div>
            </div>
          </SectionReveal>
        </section>

        {/* Roadmap */}
        <section id="roadmap" className="section-flow px-4 sm:px-6 scroll-mt-28">
          <SectionReveal className="mx-auto max-w-6xl">
            <div className="text-center mb-10">
              <p className="section-eyebrow mb-2">{pawlingsContent.roadmap.eyebrow}</p>
              <PawlingsColoredHeading
                as="h2"
                highlight={pawlingsContent.roadmap.headingHighlight}
                className="font-display font-bold"
                style={{ fontSize: "var(--text-heading-1)" }}
              >
                {pawlingsContent.roadmap.heading}
              </PawlingsColoredHeading>
            </div>
            <RoadmapSection />
          </SectionReveal>
        </section>

        {/* Adoption CTA */}
        <section className="section-flow px-4 sm:px-6">
          <SectionReveal className="mx-auto max-w-3xl text-center">
            <div className="adoption-invite-panel px-6 sm:px-10 py-10 sm:py-12">
              <PawlingsColoredHeading
                as="h2"
                highlight={pawlingsContent.adoptionCta.headingHighlight}
                className="font-display font-bold mb-4"
                style={{ fontSize: "var(--text-heading-1)" }}
              >
                {pawlingsContent.adoptionCta.heading}
              </PawlingsColoredHeading>
              <p className="text-pawlings-muted mb-6 max-w-lg mx-auto leading-relaxed">
                {pawlingsContent.adoptionCta.body}
              </p>
              <GameButton type="button" onClick={openAdoption}>
                {adoption.cta}
              </GameButton>
              <p className="text-sm text-pawlings-muted/80 mt-4">
                {pawlingsContent.adoptionCta.microcopy}
              </p>
            </div>
          </SectionReveal>
        </section>

        {/* Community */}
        {(xUrl || discordUrl) && (
          <section id="community" className="section-flow px-4 sm:px-6">
            <SectionReveal className="mx-auto max-w-5xl">
              <div className="community-panel grid md:grid-cols-[1fr_auto] gap-8 items-center px-6 sm:px-10 py-10 sm:py-12">
                <div>
                  <p className="section-eyebrow mb-3">{pawlingsContent.social.eyebrow}</p>
                  <PawlingsColoredHeading
                    as="h2"
                    highlight={pawlingsContent.social.headingHighlight}
                    className="font-display font-bold mb-3"
                    style={{ fontSize: "var(--text-heading-2)" }}
                  >
                    {pawlingsContent.social.heading}
                  </PawlingsColoredHeading>
                  <p className="text-pawlings-muted leading-relaxed max-w-md">
                    {pawlingsContent.social.body}
                  </p>
                  <div className="flex flex-wrap gap-3 mt-6">
                    {xUrl && (
                      <a href={xUrl} target="_blank" rel="noopener noreferrer">
                        <GameButton type="button" variant="primary">
                          {pawlingsContent.social.x}
                        </GameButton>
                      </a>
                    )}
                    {discordUrl && (
                      <a href={discordUrl} target="_blank" rel="noopener noreferrer">
                        <GameButton type="button" variant="secondary">
                          {pawlingsContent.social.discord}
                        </GameButton>
                      </a>
                    )}
                  </div>
                </div>
                <div className="hidden md:flex items-end justify-center gap-2 opacity-90">
                  <PawlingDogImage
                    src={pawlingsContent.assets.dog1}
                    alt=""
                    className="w-28 -rotate-6"
                    floatDelay="short"
                  />
                  <PawlingDogImage
                    src={pawlingsContent.assets.dog2}
                    alt=""
                    className="w-32 rotate-3"
                    floatDelay="long"
                    mirrored
                  />
                </div>
              </div>
            </SectionReveal>
          </section>
        )}

        {/* FAQ */}
        <section id="faq" className="section-flow px-4 sm:px-6 scroll-mt-28">
          <SectionReveal className="mx-auto max-w-3xl">
            <div className="text-left mb-8">
              <PawlingsColoredHeading
                as="h2"
                highlight={pawlingsContent.faq.headingHighlight}
                className="font-display font-bold mb-2"
                style={{ fontSize: "var(--text-heading-1)" }}
              >
                {pawlingsContent.faq.heading}
              </PawlingsColoredHeading>
              <p className="text-pawlings-muted">{pawlingsContent.faq.intro}</p>
            </div>
            <FaqAccordion />
          </SectionReveal>
        </section>

        {/* Final CTA */}
        <section className="section-flow px-4 sm:px-6 pb-4">
          <SectionReveal className="mx-auto max-w-2xl text-center">
            <PawlingsColoredHeading
              as="h2"
              highlight={pawlingsContent.finalCta.headingHighlight}
              className="font-display font-bold mb-6"
              style={{ fontSize: "var(--text-heading-1)" }}
            >
              {pawlingsContent.finalCta.heading}
            </PawlingsColoredHeading>
            <GameButton type="button" onClick={openAdoption}>
              {adoption.cta}
            </GameButton>
          </SectionReveal>
        </section>
      </main>

      <PawlingsFooter xUrl={xUrl} />
    </div>
  );
}
