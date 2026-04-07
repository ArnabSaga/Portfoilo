"use client";

import { DURATION_BASE, EASE_STANDARD, ScrollTrigger, gsap, isReducedMotion } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

const items = [
  "Next.js Architect",
  "GSAP Motion",
  "Tailwind V4",
  "Brutalist UI",
  "Full Stack",
  "Interactive Design",
];

export default function Marquee() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const track = trackRef.current;
      const section = sectionRef.current;
      if (!track || !section) return;

      const reduced = isReducedMotion();
      let loopTween: gsap.core.Tween | null = null;
      let trigger: ScrollTrigger | null = null;

      const buildAnimation = () => {
        const totalWidth = track.scrollWidth / 2;

        gsap.set(track, { x: 0 });

        loopTween = gsap.to(track, {
          x: -totalWidth,
          duration: reduced ? 40 : 24,
          ease: "none",
          repeat: -1,
          modifiers: {
            x: (x) => {
              const current = parseFloat(x);
              return `${current % -totalWidth}px`;
            },
          },
        });

        if (!reduced) {
          trigger = ScrollTrigger.create({
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            onUpdate: (self) => {
              if (!loopTween) return;

              const velocity = self.getVelocity();
              const direction = self.direction === 1 ? 1 : -1;

              const mapped = (1 + Math.min(Math.abs(velocity) / 900, 2.2)) * direction;

              gsap.to(loopTween, {
                timeScale: mapped,
                duration: 0.35,
                ease: EASE_STANDARD,
                overwrite: true,
              });
            },
            onLeave: () => {
              if (!loopTween) return;
              gsap.to(loopTween, {
                timeScale: 1,
                duration: DURATION_BASE,
                ease: EASE_STANDARD,
                overwrite: true,
              });
            },
            onLeaveBack: () => {
              if (!loopTween) return;
              gsap.to(loopTween, {
                timeScale: 1,
                duration: DURATION_BASE,
                ease: EASE_STANDARD,
                overwrite: true,
              });
            },
          });
        }
      };

      buildAnimation();

      const onRefresh = () => {
        trigger?.kill();
        loopTween?.kill();
        buildAnimation();
      };

      ScrollTrigger.addEventListener("refreshInit", onRefresh);

      return () => {
        ScrollTrigger.removeEventListener("refreshInit", onRefresh);
        trigger?.kill();
        loopTween?.kill();
      };
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden border-b border-border-custom bg-background py-8 sm:py-10 md:py-12 lg:py-14 select-none"
      aria-label="Skills marquee"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-linear-to-r from-background to-transparent sm:w-16 md:w-24" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-linear-to-l from-background to-transparent sm:w-16 md:w-24" />

      <div ref={trackRef} className="flex w-max flex-nowrap items-center">
        {[0, 1].map((set) => (
          <div
            key={set}
            className="flex flex-nowrap items-center gap-6 pr-6 sm:gap-8 sm:pr-8 md:gap-10 md:pr-10 lg:gap-12 lg:pr-12 xl:gap-14 xl:pr-14"
          >
            {items.map((item) => (
              <div
                key={`${set}-${item}`}
                className="group flex flex-nowrap items-center gap-6 sm:gap-8 md:gap-10 lg:gap-12"
              >
                <span className="marquee-outline whitespace-nowrap font-syne text-[clamp(2.2rem,8vw,7rem)] font-extrabold uppercase leading-none tracking-[-0.06em] text-transparent transition-colors duration-500 group-hover:text-foreground">
                  {item}
                </span>

                <div className="h-3 w-3 shrink-0 rotate-45 bg-foreground/85 sm:h-4 sm:w-4 md:h-5 md:w-5 lg:h-6 lg:w-6" />
              </div>
            ))}
          </div>
        ))}
      </div>

      <style jsx>{`
        .marquee-outline {
          -webkit-text-stroke: 1px rgba(17, 17, 17, 0.92);
        }

        @media (min-width: 768px) {
          .marquee-outline {
            -webkit-text-stroke: 1.25px rgba(17, 17, 17, 0.92);
          }
        }

        @media (min-width: 1280px) {
          .marquee-outline {
            -webkit-text-stroke: 1.5px rgba(17, 17, 17, 0.95);
          }
        }
      `}</style>
    </section>
  );
}
