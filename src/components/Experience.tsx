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

const PILL_FOLD_OFFSETS = [160, -150, 135, -115];
const TEXT_FOLD_OFFSETS = [340, -420, 360, -400];
const CONNECTOR_ROTATIONS = [-24, 20, -18, 16];

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinWrapRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current || !pinWrapRef.current) return;

      const rows = gsap.utils.toArray<HTMLElement>(".exp-row");
      const pills = gsap.utils.toArray<HTMLElement>(".exp-pill");
      const textBlocks = gsap.utils.toArray<HTMLElement>(".exp-text");
      const numbers = gsap.utils.toArray<HTMLElement>(".exp-number");
      const markers = gsap.utils.toArray<HTMLElement>(".exp-marker");
      const connectors = gsap.utils.toArray<HTMLElement>(".exp-connector");
      const connectorLines = gsap.utils.toArray<HTMLElement>(".exp-connector-line");
      const connectorDots = gsap.utils.toArray<HTMLElement>(".exp-connector-dot");
      const beamRef = sectionRef.current.querySelector(".exp-beam");
      const glowRef = sectionRef.current.querySelector(".exp-glow");
      const intro = sectionRef.current.querySelector(".experience-intro");

      const state = { progress: 0 };

      gsap.set(pills, { willChange: "transform" });
      gsap.set(textBlocks, { willChange: "transform, opacity" });
      gsap.set(numbers, { willChange: "transform, opacity" });
      gsap.set(connectors, { willChange: "transform, opacity" });
      gsap.set(markers, { willChange: "transform, opacity" });

      if (beamRef) {
        gsap.set(beamRef, {
          opacity: 0.25,
          scaleY: 0.92,
          transformOrigin: "center top",
        });
      }

      if (glowRef) {
        gsap.set(glowRef, {
          opacity: 0.18,
          scale: 0.92,
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
            rotation: lerp(PILL_FOLD_OFFSETS[index] > 0 ? 12 : -12, 0, progress),
            scaleX: lerp(0.95, 1, progress),
            scaleY: lerp(1.02, 1, progress),
            transformOrigin: "center center",
          });

          gsap.set(text, {
            x: textX,
            opacity: lerp(0.72, 1, progress),
          });

          gsap.set(number, {
            y: lerp(PILL_FOLD_OFFSETS[index] > 0 ? 16 : -16, 0, progress),
            rotation: lerp(PILL_FOLD_OFFSETS[index] > 0 ? 6 : -6, 0, progress),
            opacity: lerp(0.82, 1, progress),
          });

          gsap.set(marker, {
            scale: lerp(0.84, 1, progress),
            opacity: lerp(0.72, 1, progress),
          });

          gsap.set(connector, {
            rotation,
            opacity: lerp(0.22, 0.7, progress),
            scaleX: lerp(0.86, 1, progress),
            transformOrigin: experiences[index].side === "left" ? "right center" : "left center",
          });

          gsap.set(line, {
            opacity: lerp(0.16, 0.45, progress),
          });

          gsap.set(dot, {
            scale: lerp(0.72, 1, progress),
            opacity: lerp(0.4, 1, progress),
          });
        });

        if (beamRef) {
          gsap.set(beamRef, {
            opacity: lerp(0.22, 0.52, progress),
            scaleY: lerp(0.92, 1, progress),
          });
        }

        if (glowRef) {
          gsap.set(glowRef, {
            opacity: lerp(0.16, 0.34, progress),
            scale: lerp(0.92, 1.05, progress),
          });
        }
      }

      render(0);

      if (intro) {
        gsap.from(intro, {
          opacity: 0,
          y: 40,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            once: true,
          },
        });
      }

      gsap.to(state, {
        progress: 1,
        ease: "none",
        onUpdate: () => render(state.progress),
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=2600",
          scrub: 1.1,
          pin: pinWrapRef.current,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="relative bg-[#070707] px-4 py-24 text-white md:px-8 md:py-32"
    >
      <div ref={pinWrapRef} className="mx-auto max-w-[1720px]">
        <div className="experience-intro mb-14 flex flex-col gap-6 md:mb-20 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-4 font-inter text-[10px] font-semibold uppercase tracking-[0.42em] text-white/35">
              [ Career Journey ]
            </p>
            <h2 className="font-syne text-[clamp(3.5rem,8vw,8.5rem)] font-extrabold uppercase leading-[0.86] tracking-[-0.08em] text-[#f4f1ec]">
              Experience
            </h2>
          </div>

          <p className="max-w-md font-inter text-sm leading-6 text-white/45">
            Scroll down to unfold the journey. Scroll up and it folds back into shape.
          </p>
        </div>

        <div className="relative min-h-[84vh] overflow-hidden rounded-[36px] border border-white/10 bg-[#030303] px-6 py-12 md:px-10 md:py-14">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,255,255,0.04),transparent_42%)]" />

          {/* Premium center glow */}
          <div className="exp-glow pointer-events-none absolute left-1/2 top-[10%] z-0 h-[80%] w-[220px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),rgba(255,255,255,0.02)_38%,transparent_72%)] blur-3xl" />

          {/* Premium spine beam */}
          <div className="exp-beam pointer-events-none absolute left-1/2 top-[10%] z-0 h-[80%] w-px -translate-x-1/2 bg-linear-to-b from-white/10 via-white/6 to-white/10" />

          <div className="pointer-events-none absolute left-1/2 top-6 z-20 -translate-x-1/2 font-inter text-[11px] uppercase tracking-[0.28em] text-white/35">
            Start
          </div>

          <div className="pointer-events-none absolute bottom-6 left-1/2 z-20 -translate-x-1/2 font-inter text-[11px] uppercase tracking-[0.28em] text-white/35">
            Present
          </div>

          <div className="relative z-10 mx-auto flex max-w-[1440px] flex-col gap-12">
            {experiences.map((item) => {
              const isLeft = item.side === "left";

              return (
                <div
                  key={item.step}
                  className="exp-row relative grid min-h-[170px] grid-cols-[1fr_240px_1fr] items-center md:grid-cols-[1fr_260px_1fr]"
                >
                  {/* LEFT TEXT */}
                  <div className="relative">
                    {isLeft && (
                      <div className="exp-text md:ml-auto md:max-w-[360px] md:pr-12 md:text-right">
                        <p className="mb-2 font-inter text-[11px] font-semibold uppercase tracking-[0.32em] text-white/32">
                          {item.period}
                        </p>

                        <h3 className="font-syne text-[2rem] font-bold uppercase tracking-[-0.05em] text-[#f3efe8]">
                          {item.title}
                        </h3>

                        <p className="mt-1 font-inter text-sm uppercase tracking-[0.22em] text-white/42">
                          {item.company}
                        </p>

                        <p className="mt-3 max-w-sm font-inter text-sm leading-6 text-white/56 md:ml-auto">
                          {item.description}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* CENTER PILL */}
                  <div className="relative flex justify-center">
                    <div
                      className={`exp-connector pointer-events-none absolute top-1/2 z-0 flex h-px w-[200px] -translate-y-1/2 items-center ${
                        isLeft
                          ? "right-1/2 origin-right justify-start"
                          : "left-1/2 origin-left justify-end"
                      }`}
                    >
                      <div className="exp-connector-line h-px w-full bg-linear-to-r from-transparent via-white/18 to-white/35" />
                      <div
                        className={`exp-connector-dot absolute h-2 w-2 rounded-full bg-white/65 shadow-[0_0_18px_rgba(255,255,255,0.35)] ${
                          isLeft ? "left-0" : "right-0"
                        }`}
                      />
                    </div>

                    <div
                      className={`exp-pill relative z-10 flex h-[138px] w-[190px] items-center justify-center rounded-[999px] bg-linear-to-br ${item.accent} shadow-[0_30px_70px_rgba(0,0,0,0.34)] md:h-[150px] md:w-[220px]`}
                    >
                      <div className="absolute inset-px rounded-[999px] bg-[linear-gradient(180deg,rgba(255,255,255,0.18),rgba(255,255,255,0.02))]" />
                      <div className="absolute inset-[14%] rounded-[999px] border border-white/10" />

                      <div
                        className="exp-number relative z-10 flex flex-col items-center justify-center leading-none"
                        style={{ color: item.text }}
                      >
                        <span className="font-inter text-[3rem] font-light tracking-[-0.06em] md:text-[3.5rem]">
                          {item.step}
                        </span>
                        <span className="font-inter text-sm uppercase tracking-[0.3em] opacity-80">
                          data
                        </span>
                      </div>

                      <div className="exp-marker absolute left-1/2 top-1/2 z-20 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/35 bg-white/10 backdrop-blur-sm" />
                    </div>
                  </div>

                  {/* RIGHT TEXT */}
                  <div className="relative">
                    {!isLeft && (
                      <div className="exp-text max-w-[360px] pl-12 text-left">
                        <p className="mb-2 font-inter text-[11px] font-semibold uppercase tracking-[0.32em] text-white/32">
                          {item.period}
                        </p>

                        <h3 className="font-syne text-[2rem] font-bold uppercase tracking-[-0.05em] text-[#f3efe8]">
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
    </section>
  );
}
