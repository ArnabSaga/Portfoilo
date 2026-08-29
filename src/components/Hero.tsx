"use client";

import { SplitReveal } from "@/components/motion/SplitReveal";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { gsap, motion } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";
import { useCallback, useRef } from "react";

const statements = [
  "High-end digital systems",
  "With architectural precision",
  "Scalable full-stack architecture",
];

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const desktopPointer = useMediaQuery("(min-width: 1025px) and (hover: hover) and (pointer: fine)");
  const hasLens = desktopPointer && !reducedMotion;

  useGSAP(
    () => {
      if (!sectionRef.current) return;
      const context = gsap.context(() => {
        if (!reducedMotion) {
          gsap.from("[data-hero-meta]", {
            opacity: 0,
            y: 16,
            stagger: motion.stagger.item,
            duration: motion.duration.interface,
            delay: 0.12,
            ease: motion.ease.interface,
          });
          gsap.from("[data-hero-role]", {
            opacity: 0,
            y: 20,
            duration: motion.duration.reveal,
            delay: 1,
            ease: motion.ease.interface,
          });
        }

        if (!reducedMotion) {
          const items = gsap.utils.toArray<HTMLElement>("[data-statement]");
          gsap.set(items, { opacity: 0, y: 12 });
          const statementTimeline = gsap.timeline({ repeat: -1, delay: 1.35 });
          items.forEach((item) => {
            statementTimeline
              .to(item, { opacity: 1, y: 0, duration: motion.duration.interface, ease: motion.ease.interface })
              .to(item, { opacity: 1, duration: 1.8 })
              .to(item, { opacity: 0, y: -10, duration: motion.duration.hover, ease: "power2.in" });
          });
        }

        if (hasLens && lensRef.current) {
          gsap.from(lensRef.current, {
            opacity: 0,
            scale: 0.78,
            duration: motion.duration.major,
            delay: 1.75,
            ease: motion.ease.cinematic,
          });
        }

        if (!reducedMotion) {
          const lines = gsap.utils.toArray<HTMLElement>("[data-name-line]");
          gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: "bottom top",
              scrub: 1,
            },
          })
            .to(lines[0], { x: "-4vw", ease: "none" }, 0)
            .to(lines[1], { x: "3vw", ease: "none" }, 0)
            .to(lines[2], { x: "-2vw", ease: "none" }, 0)
            .to(sectionRef.current, { opacity: 0.82, ease: "none" }, 0)
            .to(lensRef.current, { width: "32vw", borderRadius: "1.75rem", ease: "none" }, 0);
        }
      }, sectionRef);
      return () => context.revert();
    },
    { scope: sectionRef, dependencies: [hasLens, reducedMotion] }
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (!hasLens || !sectionRef.current || !lensRef.current) return;
      const bounds = sectionRef.current.getBoundingClientRect();
      const x = event.clientX - bounds.left;
      const y = event.clientY - bounds.top;
      gsap.to(lensRef.current, { x, y, duration: motion.duration.hover, ease: motion.ease.interface, overwrite: "auto" });

      const dx = event.clientX - bounds.left - bounds.width / 2;
      const dy = event.clientY - bounds.top - bounds.height / 2;
      if (mediaRef.current) gsap.to(mediaRef.current, { x: dx * motion.pointer.media, y: dy * motion.pointer.media, overwrite: "auto" });
      if (frameRef.current) gsap.to(frameRef.current, { x: dx * motion.pointer.frame, y: dy * motion.pointer.frame, overwrite: "auto" });
      if (orbitRef.current) gsap.to(orbitRef.current, { x: dx * motion.pointer.orbit, y: dy * motion.pointer.orbit, overwrite: "auto" });
    },
    [hasLens]
  );

  return (
    <section
      id="hero"
      ref={sectionRef}
      onPointerMove={handlePointerMove}
      className="hero-grid relative flex min-h-screen overflow-hidden bg-background px-4 pb-14 pt-28 text-foreground sm:px-6 md:px-8 lg:items-end lg:pb-16"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_32%,var(--color-surface)_0%,transparent_34%)] opacity-60" />

      {hasLens && (
        <div
          ref={lensRef}
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 z-20 h-52 w-52 -translate-x-1/2 -translate-y-1/2 overflow-visible rounded-full"
        >
          <div ref={frameRef} className="absolute inset-0 overflow-hidden rounded-[inherit] border border-foreground/16 shadow-[var(--shadow-media)]">
            <div ref={mediaRef} className="absolute -inset-8">
              <video
                src="/video/Project_showcase_video_202604070031.mp4"
                muted
                playsInline
                loop
                autoPlay
                preload="metadata"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <div ref={orbitRef} className="absolute -inset-6 animate-[spin_14s_linear_infinite] rounded-full border border-dashed border-foreground/20">
            <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-background px-2 font-inter text-[8px] font-bold uppercase tracking-[0.2em]">Explore Work</span>
          </div>
        </div>
      )}

      <div className="relative z-10 mx-auto w-full max-w-screen-2xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-foreground/12 pb-4 font-inter text-[9px] font-semibold uppercase tracking-[0.28em] text-foreground/52">
          <span data-hero-meta>Portfolio / 2026</span>
          <span data-hero-meta>Creative Engineering</span>
          <span data-hero-meta className="hidden sm:inline">22.8456° N / 89.5403° E</span>
        </div>

        <h1 className="sr-only">Achyuta Arnab Dey, Creative Web Developer</h1>
        <div aria-hidden="true" className="space-y-0">
          <div data-name-line><SplitReveal direction="left" delay={0.24} className="block font-syne text-[clamp(3rem,12vw,10.5rem)] font-extrabold uppercase leading-[0.78] tracking-[-0.075em]">Achyuta</SplitReveal></div>
          <div data-name-line><SplitReveal direction="up" delay={0.34} className="block font-syne text-[clamp(3rem,12vw,10.5rem)] font-extrabold uppercase leading-[0.78] tracking-[-0.075em]">Arnab</SplitReveal></div>
          <div data-name-line><SplitReveal direction="right" delay={0.44} className="block font-syne text-[clamp(3rem,12vw,10.5rem)] font-extrabold uppercase leading-[0.78] tracking-[-0.075em]">Dey</SplitReveal></div>
        </div>

        <div data-hero-role className="mt-10 grid gap-7 border-t border-foreground/12 pt-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <p className="font-inter text-sm font-semibold uppercase tracking-[0.18em] text-foreground/62">Creative Web Developer</p>
          <div className="lg:text-end">
            <span className="block font-inter text-[9px] font-bold uppercase tracking-[0.32em] text-foreground/38">Building</span>
            <div className="relative mt-2 min-h-[2.6rem] overflow-hidden font-syne text-[clamp(1.35rem,3vw,2.8rem)] font-bold uppercase leading-none tracking-[-0.04em]">
              {statements.map((statement, index) => (
                <span
                  key={statement}
                  data-statement
                  aria-hidden={index > 0}
                  className={`absolute inset-x-0 top-0 block ${index === 0 ? "opacity-100" : "opacity-0"}`}
                >
                  {statement}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
