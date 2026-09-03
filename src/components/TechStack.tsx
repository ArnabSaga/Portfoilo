"use client";

import { stackLayers, type StackTechnology } from "@/content/stack";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { gsap, motion } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { useRef } from "react";

const MODULE_GRID_COLUMNS = {
  2: "min-[1280px]:grid-cols-2",
  3: "min-[1280px]:grid-cols-3",
  4: "min-[1280px]:grid-cols-4",
} as const;

interface StackModuleProps {
  technology: StackTechnology;
  layerName: string;
  moduleIndex: number;
  position: number;
}

function StackModule({
  technology,
  layerName,
  moduleIndex,
  position,
}: StackModuleProps) {
  const responsiveDivider = [
    position % 2 === 1 ? "min-[360px]:border-l" : "",
    position > 0 ? "min-[1280px]:border-l" : "min-[1280px]:border-l-0",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <li
      data-stack-module
      className={`stack-module group relative flex min-h-44 flex-col border-b border-inverse-faint px-4 py-5 sm:min-h-48 sm:px-5 sm:py-6 min-[1025px]:min-h-52 min-[1025px]:px-6 min-[1025px]:py-7 min-[1280px]:min-h-56 min-[1280px]:px-7 ${responsiveDivider}`}
    >
      <span className="font-inter text-[0.625rem] font-semibold uppercase tracking-[0.28em] text-inverse-muted">
        {String(moduleIndex).padStart(2, "0")}
      </span>

      <div className="mt-5 flex flex-1 flex-col justify-end sm:mt-6">
        <div
          className="stack-module-icon relative h-8 w-8 overflow-hidden opacity-70 grayscale transition-opacity duration-300 sm:h-9 sm:w-9 min-[1025px]:h-10 min-[1025px]:w-10 min-[1280px]:h-13 min-[1280px]:w-13"
        >
          <Image
            src={technology.image}
            alt=""
            width={52}
            height={52}
            className="h-full w-full object-cover"
            sizes="52px"
          />
        </div>

        <p
          className="stack-module-name mt-5 break-words font-syne text-[clamp(1rem,5.2vw,1.35rem)] font-bold uppercase leading-[0.92] tracking-[-0.035em] text-inverse transition-[color,transform] duration-300 sm:text-[1.35rem] min-[1025px]:text-[1.5rem] min-[1280px]:text-[clamp(1.25rem,1.55vw,1.75rem)]"
        >
          {technology.name}
        </p>

        <span className="mt-2 font-inter text-[0.5625rem] font-semibold uppercase tracking-[0.24em] text-inverse-muted">
          {layerName}
        </span>

        <span
          aria-hidden="true"
          className="stack-module-rule mt-5 h-px w-10 bg-inverse-faint transition-[width,background-color] duration-300 sm:mt-6"
        />
      </div>
    </li>
  );
}

export default function TechStack() {
  const sectionRef = useRef<HTMLElement>(null);
  const introRef = useRef<HTMLElement>(null);
  const layerRefs = useRef<(HTMLElement | null)[]>([]);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const intro = introRef.current;
      const layers = layerRefs.current.filter(
        (layer): layer is HTMLElement => layer !== null,
      );

      if (!intro || layers.length !== stackLayers.length || reducedMotion) {
        return;
      }

      gsap.fromTo(
        intro,
        {
          autoAlpha: 0,
          y: 20,
          willChange: "transform, opacity",
        },
        {
          autoAlpha: 1,
          y: 0,
          duration: motion.duration.interface,
          ease: motion.ease.interface,
          clearProps: "opacity,visibility,transform,willChange",
          scrollTrigger: {
            trigger: intro,
            start: "top 88%",
            once: true,
          },
        },
      );

      layers.forEach((layer) => {
        const rule = layer.querySelector<HTMLElement>("[data-stack-rule]");
        const metadata = layer.querySelector<HTMLElement>("[data-stack-layer-meta]");
        const modules = gsap.utils.toArray<HTMLElement>(
          "[data-stack-module]",
          layer,
        );

        if (!rule || !metadata || modules.length === 0) return;

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: layer,
            start: "top 86%",
            once: true,
          },
        });

        timeline
          .fromTo(
            rule,
            { scaleX: 0, transformOrigin: "left center" },
            {
              scaleX: 1,
              duration: motion.duration.interface,
              ease: motion.ease.interface,
              clearProps: "transform,transformOrigin,willChange",
            },
            0,
          )
          .fromTo(
            metadata,
            { opacity: 0, y: 8, willChange: "transform, opacity" },
            {
              opacity: 1,
              y: 0,
              duration: motion.duration.interface,
              ease: motion.ease.interface,
              clearProps: "opacity,transform,willChange",
            },
            0.04,
          )
          .fromTo(
            modules,
            { opacity: 0.25, y: 14, willChange: "transform, opacity" },
            {
              opacity: 1,
              y: 0,
              duration: motion.duration.interface,
              stagger: motion.stagger.text,
              ease: motion.ease.interface,
              clearProps: "opacity,transform,willChange",
            },
            0.08,
          );
      });
    },
    {
      scope: sectionRef,
      dependencies: [reducedMotion],
      revertOnUpdate: true,
    },
  );

  return (
    <section
      id="stack"
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-section-dark px-4 py-20 text-inverse sm:px-5 sm:py-24 md:px-8 min-[1025px]:py-28 min-[1280px]:py-32"
    >
      <div className="mx-auto w-full max-w-[112rem]">
        <header ref={introRef} className="mb-14 sm:mb-16 min-[1025px]:mb-20">
          <div className="flex items-center justify-between gap-5 font-inter text-[0.5625rem] font-semibold uppercase tracking-[0.28em] text-inverse-muted sm:text-[0.625rem]">
            <span>Core / Stack</span>
            <span className="hidden sm:inline">15 Modules / 06 Layers</span>
            <span className="sm:hidden">15 / 06</span>
          </div>

          <div aria-hidden="true" className="mt-5 h-px w-full bg-inverse-faint" />

          <div className="mt-9 grid items-end gap-8 sm:mt-11 min-[1025px]:grid-cols-12 min-[1025px]:gap-6 min-[1280px]:mt-14">
            <h2 className="font-syne text-[clamp(3.5rem,15vw,6.5rem)] font-extrabold uppercase leading-[0.8] tracking-[-0.055em] text-inverse min-[1025px]:col-span-7 min-[1025px]:text-[clamp(5.5rem,8vw,8rem)] min-[1280px]:col-span-6">
              Core
              <br />
              Stack
            </h2>

            <p className="max-w-[31ch] font-inter text-base leading-relaxed text-inverse-muted min-[1025px]:col-span-4 min-[1025px]:col-start-9 min-[1025px]:pb-2 min-[1280px]:col-span-3 min-[1280px]:col-start-10">
              Technical systems arranged by role inside the product architecture.
            </p>
          </div>
        </header>

        <div aria-label="Technical system layers">
          {stackLayers.map((layer, layerIndex) => {
            const gridColumns =
              MODULE_GRID_COLUMNS[layer.technologies.length as 2 | 3 | 4];

            return (
              <article
                key={layer.name}
                ref={(element) => {
                  layerRefs.current[layerIndex] = element;
                }}
                className="relative grid min-[1280px]:grid-cols-12"
              >
                <span
                  data-stack-rule
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-px bg-inverse-faint"
                />

                <header
                  data-stack-layer-meta
                  className="flex items-center justify-start gap-3 border-b border-inverse-faint py-6 min-[1280px]:col-span-2 min-[1280px]:flex-col min-[1280px]:items-start min-[1280px]:justify-start min-[1280px]:gap-0 min-[1280px]:border-b-0 min-[1280px]:border-r min-[1280px]:px-5 min-[1280px]:py-7"
                >
                  <span className="font-inter text-[0.625rem] font-semibold uppercase tracking-[0.28em] text-inverse-muted">
                    {layer.step}
                  </span>
                  <h3 className="font-syne text-lg font-bold uppercase leading-none tracking-[-0.025em] text-inverse sm:text-xl min-[1280px]:mt-3">
                    {layer.name}
                  </h3>
                </header>

                <ul
                  className={`grid grid-cols-1 min-[360px]:grid-cols-2 min-[1280px]:col-span-10 ${gridColumns}`}
                >
                  {layer.technologies.map((technology, position) => {
                    const moduleIndex =
                      stackLayers
                        .slice(0, layerIndex)
                        .reduce(
                          (total, currentLayer) =>
                            total + currentLayer.technologies.length,
                          0,
                        ) +
                      position +
                      1;

                    return (
                      <StackModule
                        key={technology.name}
                        technology={technology}
                        layerName={layer.name}
                        moduleIndex={moduleIndex}
                        position={position}
                      />
                    );
                  })}
                </ul>
              </article>
            );
          })}
        </div>
      </div>

      <style>{`
        @media (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) {
          #stack .stack-module:hover .stack-module-icon {
            opacity: 1;
          }

          #stack .stack-module:hover .stack-module-name {
            transform: translateY(calc(var(--spacing) * -0.5));
          }

          #stack .stack-module:hover .stack-module-rule {
            width: calc(var(--spacing) * 16);
            background-color: var(--color-inverse-muted);
          }
        }
      `}</style>
    </section>
  );
}
