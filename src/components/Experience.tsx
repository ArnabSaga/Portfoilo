"use client";

import { gsap } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

const experiences = [
  {
    step: "01",
    title: "Starting As Developer",
    company: "Self",
    side: "right",
    period: "2022 — 2023",
    description:
      "Started with fundamentals, frontend systems, component thinking, and clean implementation habits.",
    accent: "from-[#f2c4b7] to-[#d8a091]",
    text: "#2d1f1a",
  },
  {
    step: "02",
    title: "Frontend Engineer",
    company: "Craft & Systems",
    side: "left",
    period: "2023 — 2024",
    description:
      "Focused on interaction design, design systems, animation principles, and scalable UI architecture.",
    accent: "from-[#8d8190] to-[#4d3e4c]",
    text: "#ffffff",
  },
  {
    step: "03",
    title: "Full Stack Developer",
    company: "Product & Platform",
    side: "right",
    period: "2024 — 2025",
    description:
      "Built complete products with Next.js, Node.js, Prisma, authentication, RBAC, and production-ready flows.",
    accent: "from-[#5b4a57] to-[#1d151d]",
    text: "#ffffff",
  },
  {
    step: "04",
    title: "System Builder",
    company: "Architecture First",
    side: "left",
    period: "2026 — Present",
    description:
      "Designing systems with stronger motion direction, premium interfaces, scalable backend thinking, and SaaS structure.",
    accent: "from-[#d95c44] to-[#8c2f23]",
    text: "#ffffff",
  },
];

const PILL_FOLD_OFFSETS = [150, -140, 125, -105];
const TEXT_FOLD_OFFSETS = [300, -360, 320, -340];
const CONNECTOR_ROTATIONS = [-20, 18, -16, 14];

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinWrapRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current || !pinWrapRef.current || !introRef.current) return;

      const mm = gsap.matchMedia();

      mm.add("(min-width: 1025px)", () => {
        const rows = gsap.utils.toArray<HTMLElement>(".exp-row");
        const pills = gsap.utils.toArray<HTMLElement>(".exp-pill");
        const textBlocks = gsap.utils.toArray<HTMLElement>(".exp-text");
        const numbers = gsap.utils.toArray<HTMLElement>(".exp-number");
        const markers = gsap.utils.toArray<HTMLElement>(".exp-marker");
        const connectors = gsap.utils.toArray<HTMLElement>(".exp-connector");
        const connectorLines = gsap.utils.toArray<HTMLElement>(".exp-connector-line");
        const connectorDots = gsap.utils.toArray<HTMLElement>(".exp-connector-dot");
        const beamRef = sectionRef.current?.querySelector(".exp-beam");
        const glowRef = sectionRef.current?.querySelector(".exp-glow");

        const state = { progress: 0 };

        gsap.set(pills, { willChange: "transform" });
        gsap.set(textBlocks, { willChange: "transform, opacity" });
        gsap.set(numbers, { willChange: "transform, opacity" });
        gsap.set(connectors, { willChange: "transform, opacity" });
        gsap.set(markers, { willChange: "transform, opacity" });

        if (beamRef) {
          gsap.set(beamRef, {
            opacity: 0.22,
            scaleY: 0.94,
            transformOrigin: "center top",
          });
        }

        if (glowRef) {
          gsap.set(glowRef, {
            opacity: 0.14,
            scale: 0.94,
          });
        }

        function render(progress: number) {
          rows.forEach((_, index) => {
            const pill = pills[index];
            const text = textBlocks[index];
            const number = numbers[index];
            const marker = markers[index];
            const connector = connectors[index];
            const line = connectorLines[index];
            const dot = connectorDots[index];

            const pillX = lerp(PILL_FOLD_OFFSETS[index], 0, progress);
            const textX = lerp(TEXT_FOLD_OFFSETS[index], 0, progress);
            const rotation = lerp(CONNECTOR_ROTATIONS[index], 0, progress);

            gsap.set(pill, {
              x: pillX,
              rotation: lerp(PILL_FOLD_OFFSETS[index] > 0 ? 10 : -10, 0, progress),
              scaleX: lerp(0.96, 1, progress),
              scaleY: lerp(1.02, 1, progress),
              transformOrigin: "center center",
            });

            gsap.set(text, {
              x: textX,
              opacity: lerp(0.72, 1, progress),
            });

            gsap.set(number, {
              y: lerp(PILL_FOLD_OFFSETS[index] > 0 ? 12 : -12, 0, progress),
              rotation: lerp(PILL_FOLD_OFFSETS[index] > 0 ? 5 : -5, 0, progress),
              opacity: lerp(0.85, 1, progress),
            });

            gsap.set(marker, {
              scale: lerp(0.84, 1, progress),
              opacity: lerp(0.7, 1, progress),
            });

            gsap.set(connector, {
              rotation,
              opacity: lerp(0.18, 0.62, progress),
              scaleX: lerp(0.88, 1, progress),
              transformOrigin: experiences[index].side === "left" ? "right center" : "left center",
            });

            gsap.set(line, {
              opacity: lerp(0.12, 0.38, progress),
            });

            gsap.set(dot, {
              scale: lerp(0.75, 1, progress),
              opacity: lerp(0.42, 1, progress),
            });
          });

          if (beamRef) {
            gsap.set(beamRef, {
              opacity: lerp(0.22, 0.5, progress),
              scaleY: lerp(0.94, 1, progress),
            });
          }

          if (glowRef) {
            gsap.set(glowRef, {
              opacity: lerp(0.14, 0.3, progress),
              scale: lerp(0.94, 1.05, progress),
            });
          }
        }

        render(0);

        gsap.from(introRef.current, {
          opacity: 0,
          y: 36,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 82%",
            once: true,
          },
        });

        gsap.to(state, {
          progress: 1,
          ease: "none",
          onUpdate: () => render(state.progress),
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=2400",
            scrub: 1.05,
            pin: pinWrapRef.current,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
      });

      mm.add("(max-width: 1024px)", () => {
        gsap.from(introRef.current, {
          opacity: 0,
          y: 30,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 88%",
            once: true,
          },
        });

        gsap.from(".exp-mobile-card", {
          opacity: 0,
          y: 36,
          stagger: 0.12,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 84%",
            once: true,
          },
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="relative overflow-hidden bg-[#070707] px-4 py-20 text-white sm:px-5 md:px-8 md:py-24 xl:py-28"
    >
      <div className="pointer-events-none absolute left-[12%] top-[12%] h-[220px] w-[220px] rounded-full bg-white/3 blur-[90px] md:h-[320px] md:w-[320px]" />
      <div className="pointer-events-none absolute bottom-[10%] right-[10%] h-[260px] w-[260px] rounded-full bg-white/3 blur-[90px] md:h-[360px] md:w-[360px]" />

      <div ref={pinWrapRef} className="mx-auto max-w-[1720px]">
        <div
          ref={introRef}
          className="mb-10 flex flex-col gap-5 md:mb-16 md:flex-row md:items-end md:justify-between xl:mb-20"
        >
          <div>
            <p className="mb-4 font-inter text-[9px] font-semibold uppercase tracking-[0.42em] text-white/35 sm:text-[10px]">
              [ Career Journey ]
            </p>
            <h2 className="font-syne text-[clamp(3rem,10vw,8.5rem)] font-extrabold uppercase leading-[0.86] tracking-[-0.08em] text-[#f4f1ec]">
              Experience
            </h2>
          </div>

          {/* <p className="max-w-md font-inter text-sm leading-6 text-white/45 md:text-right">
            Scroll down to unfold the journey. Scroll up and it folds back into shape.
          </p> */}
        </div>

        {/* Desktop premium unfolding version */}
        <div className="hidden lg:block">
          <div className="relative min-h-[82vh] overflow-hidden rounded-[32px] border border-white/10 bg-[#030303] px-8 py-12 xl:min-h-[84vh] xl:px-10 xl:py-14">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,255,255,0.04),transparent_42%)]" />

            <div className="exp-glow pointer-events-none absolute left-1/2 top-[10%] z-0 h-[80%] w-[220px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),rgba(255,255,255,0.02)_38%,transparent_72%)] blur-3xl" />

            <div className="exp-beam pointer-events-none absolute left-1/2 top-[10%] z-0 h-[80%] w-px -translate-x-1/2 bg-[linear-gradient(180deg,rgba(255,255,255,0.10),rgba(255,255,255,0.06),rgba(255,255,255,0.10))]" />

            <div className="pointer-events-none absolute left-1/2 top-6 z-20 -translate-x-1/2 font-inter text-[11px] uppercase tracking-[0.28em] text-white/35">
              Start
            </div>

            <div className="pointer-events-none absolute bottom-6 left-1/2 z-20 -translate-x-1/2 font-inter text-[11px] uppercase tracking-[0.28em] text-white/35">
              Present
            </div>

            <div className="relative z-10 mx-auto flex max-w-[1440px] flex-col gap-10 xl:gap-12">
              {experiences.map((item) => {
                const isLeft = item.side === "left";

                return (
                  <div
                    key={item.step}
                    className="exp-row relative grid min-h-[160px] grid-cols-[1fr_220px_1fr] items-center xl:min-h-[170px] xl:grid-cols-[1fr_260px_1fr]"
                  >
                    <div className="relative">
                      {isLeft && (
                        <div className="exp-text ml-auto max-w-[320px] pr-10 text-right xl:max-w-[360px] xl:pr-12">
                          <p className="mb-2 font-inter text-[11px] font-semibold uppercase tracking-[0.32em] text-white/32">
                            {item.period}
                          </p>

                          <h3 className="font-syne text-[1.75rem] font-bold uppercase tracking-[-0.05em] text-[#f3efe8] xl:text-[2rem]">
                            {item.title}
                          </h3>

                          <p className="mt-1 font-inter text-sm uppercase tracking-[0.22em] text-white/42">
                            {item.company}
                          </p>

                          <p className="mt-3 ml-auto max-w-sm font-inter text-sm leading-6 text-white/56">
                            {item.description}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="relative flex justify-center">
                      <div
                        className={`exp-connector pointer-events-none absolute top-1/2 z-0 flex h-px w-[180px] -translate-y-1/2 items-center ${
                          isLeft
                            ? "right-1/2 origin-right justify-start"
                            : "left-1/2 origin-left justify-end"
                        }`}
                      >
                        <div className="exp-connector-line h-px w-full bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.18),rgba(255,255,255,0.34))]" />
                        <div
                          className={`exp-connector-dot absolute h-2 w-2 rounded-full bg-white/65 shadow-[0_0_18px_rgba(255,255,255,0.35)] ${
                            isLeft ? "left-0" : "right-0"
                          }`}
                        />
                      </div>

                      <div
                        className={`exp-pill relative z-10 flex h-[128px] w-[180px] items-center justify-center rounded-[999px] bg-linear-to-br ${item.accent} shadow-[0_26px_60px_rgba(0,0,0,0.34)] xl:h-[150px] xl:w-[220px]`}
                      >
                        <div className="absolute inset-px rounded-[999px] bg-[linear-gradient(180deg,rgba(255,255,255,0.18),rgba(255,255,255,0.02))]" />
                        <div className="absolute inset-[14%] rounded-[999px] border border-white/10" />

                        <div
                          className="exp-number relative z-10 flex flex-col items-center justify-center leading-none"
                          style={{ color: item.text }}
                        >
                          <span className="font-inter text-[2.6rem] font-light tracking-[-0.06em] xl:text-[3.5rem]">
                            {item.step}
                          </span>
                          <span className="font-inter text-xs uppercase tracking-[0.28em] opacity-80 xl:text-sm">
                            data
                          </span>
                        </div>

                        <div className="exp-marker absolute left-1/2 top-1/2 z-20 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/35 bg-white/10 backdrop-blur-sm xl:h-5 xl:w-5" />
                      </div>
                    </div>

                    <div className="relative">
                      {!isLeft && (
                        <div className="max-w-[320px] pl-10 text-left xl:max-w-[360px] xl:pl-12 exp-text">
                          <p className="mb-2 font-inter text-[11px] font-semibold uppercase tracking-[0.32em] text-white/32">
                            {item.period}
                          </p>

                          <h3 className="font-syne text-[1.75rem] font-bold uppercase tracking-[-0.05em] text-[#f3efe8] xl:text-[2rem]">
                            {item.title}
                          </h3>

                          <p className="mt-1 font-inter text-sm uppercase tracking-[0.22em] text-white/42">
                            {item.company}
                          </p>

                          <p className="mt-3 max-w-sm font-inter text-sm leading-6 text-white/56">
                            {item.description}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tablet / Mobile premium editorial fallback */}
        <div className="lg:hidden">
          <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#030303] px-5 py-8 sm:px-6 sm:py-10">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_14%,rgba(255,255,255,0.05),transparent_42%)]" />
            <div className="pointer-events-none absolute left-6 top-0 bottom-0 w-px bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(255,255,255,0.04),rgba(255,255,255,0.12))] sm:left-8" />

            <div className="space-y-8 sm:space-y-10">
              {experiences.map((item) => (
                <article key={item.step} className="exp-mobile-card relative pl-12 sm:pl-16">
                  <div className="absolute left-[18px] top-10 z-10 h-4 w-4 -translate-x-1/2 rounded-full border border-white/30 bg-white/12 backdrop-blur-sm sm:left-[26px]" />

                  <div
                    className={`mb-5 flex h-[92px] w-[132px] items-center justify-center rounded-[999px] bg-linear-to-br ${item.accent} shadow-[0_18px_40px_rgba(0,0,0,0.28)] sm:h-[106px] sm:w-[150px]`}
                  >
                    <div
                      className="relative z-10 flex flex-col items-center justify-center leading-none"
                      style={{ color: item.text }}
                    >
                      <span className="font-inter text-[2rem] font-light tracking-[-0.06em] sm:text-[2.35rem]">
                        {item.step}
                      </span>
                      <span className="font-inter text-[10px] uppercase tracking-[0.28em] opacity-80">
                        data
                      </span>
                    </div>
                  </div>

                  <p className="mb-2 font-inter text-[10px] font-semibold uppercase tracking-[0.32em] text-white/32">
                    {item.period}
                  </p>

                  <h3 className="font-syne text-[1.8rem] font-bold uppercase leading-[0.95] tracking-[-0.05em] text-[#f3efe8] sm:text-[2.1rem]">
                    {item.title}
                  </h3>

                  <p className="mt-2 font-inter text-sm uppercase tracking-[0.22em] text-white/42">
                    {item.company}
                  </p>

                  <p className="mt-4 max-w-136 font-inter text-sm leading-7 text-white/58">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
