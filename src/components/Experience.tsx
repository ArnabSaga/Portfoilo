"use client";

import { experienceChapters } from "@/content/experience";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { gsap, motion, ScrollTrigger } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";
import { type RefObject, useRef } from "react";

const CINEMATIC_QUERY =
  "(min-width: 1025px) and (prefers-reduced-motion: no-preference)";
const STACKED_REVEAL_QUERY =
  "(max-width: 1024px) and (prefers-reduced-motion: no-preference)";

const WORLD_WIDTH = 1600;
const WORLD_HEIGHT = 2920;
const SCROLL_DISTANCE_FACTOR = 4.3;
const LAST_CHAPTER = experienceChapters.length - 1;

const CAMERA_STOPS = [0, -700, -1410, -2140] as const;

// Derived from the approved route geometry at 605, 2115, 3735, and 5295.
const PATH_STOPS = [0.114, 0.399, 0.705, 1] as const;

const CAREER_ROUTE = [
  "M 335 450",
  "H 780",
  "V 610",
  "H 1210",
  "V 1120",
  "H 840",
  "V 1320",
  "H 350",
  "V 1880",
  "H 760",
  "V 2040",
  "H 1210",
  "V 2580",
  "H 840",
  "V 2780",
].join(" ");

const CHAPTER_POSITIONS = [
  { insetInlineStart: "7.5%", top: 140 },
  { insetInlineStart: "63.125%", top: 820 },
  { insetInlineStart: "8.75%", top: 1530 },
  { insetInlineStart: "62.5%", top: 2240 },
] as const;

const NODE_POSITIONS = [
  { x: 780, y: 610 },
  { x: 840, y: 1320 },
  { x: 760, y: 2040 },
  { x: 840, y: 2780 },
] as const;

const ENVIRONMENTAL_MARKERS = [
  { label: "START / 2022", insetInlineStart: "20.9%", top: 408 },
  { label: "UI SYSTEMS", insetInlineStart: "77%", top: 1064 },
  { label: "FULL STACK", insetInlineStart: "48%", top: 1282 },
  { label: "ARCHITECTURE", insetInlineStart: "18%", top: 1842 },
  { label: "PRESENT / 2026+", insetInlineStart: "53%", top: 2732 },
] as const;

const TITLE_LINES: Record<string, readonly string[]> = {
  "Starting As Developer": ["Starting", "As", "Developer"],
  "Frontend Engineer": ["Frontend", "Engineer"],
  "Full Stack Developer": ["Full Stack", "Developer"],
  "System Builder": ["System", "Builder"],
};

interface CareerNodeElements {
  root: SVGGElement;
  ring: SVGCircleElement;
  center: SVGCircleElement;
}

function clampRange(value: number, start: number, end: number) {
  return gsap.utils.clamp(0, 1, (value - start) / (end - start));
}

function easedRange(
  value: number,
  start: number,
  end: number,
  ease: gsap.EaseFunction,
) {
  return ease(clampRange(value, start, end));
}

function setCardExposure(card: HTMLElement, hidden: boolean) {
  if (hidden && card.contains(document.activeElement)) return;
  card.setAttribute("aria-hidden", String(hidden));
}

function ExperienceTitle({
  title,
  className,
}: {
  title: string;
  className: string;
}) {
  const lines = TITLE_LINES[title] ?? [title];

  return (
    <span className={className} aria-label={title} role="text">
      {lines.map((line) => (
        <span key={line} className="block whitespace-nowrap">
          {line}
        </span>
      ))}
    </span>
  );
}

function RouteSvg({
  activePathRef,
}: {
  activePathRef: RefObject<SVGPathElement | null>;
}) {
  return (
    <svg
      data-career-route-svg
      aria-hidden="true"
      viewBox={`0 0 ${WORLD_WIDTH} ${WORLD_HEIGHT}`}
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 z-10 h-full w-full overflow-visible"
    >
      <path
        data-career-route="base"
        d={CAREER_ROUTE}
        fill="none"
        vectorEffect="non-scaling-stroke"
        className="stroke-inverse-faint"
        strokeWidth="1.25"
      />
      <path
        ref={activePathRef}
        data-career-route="active"
        d={CAREER_ROUTE}
        fill="none"
        pathLength="1"
        strokeDasharray="1"
        strokeDashoffset="1"
        vectorEffect="non-scaling-stroke"
        className="stroke-experience-signal"
        strokeWidth="1.75"
      />
    </svg>
  );
}

function NodeSvg({
  nodeRefs,
}: {
  nodeRefs: RefObject<Array<SVGGElement | null>>;
}) {
  return (
    <svg
      data-career-node-svg
      aria-hidden="true"
      viewBox={`0 0 ${WORLD_WIDTH} ${WORLD_HEIGHT}`}
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 z-40 h-full w-full overflow-visible"
    >
      {NODE_POSITIONS.map((node, index) => (
        <g
          key={experienceChapters[index].step}
          ref={(element) => {
            nodeRefs.current[index] = element;
          }}
          data-career-node
          data-node-index={index}
          className="text-inverse"
        >
          <circle
            cx={node.x}
            cy={node.y}
            r="18"
            fill="var(--color-section-dark)"
            vectorEffect="non-scaling-stroke"
            className="stroke-inverse-faint"
            strokeWidth="1"
          />
          <circle
            data-node-ring
            cx={node.x}
            cy={node.y}
            r="27"
            fill="none"
            vectorEffect="non-scaling-stroke"
            className="stroke-experience-signal"
            strokeWidth="1.25"
          />
          <circle
            data-node-center
            cx={node.x}
            cy={node.y}
            r="6"
            vectorEffect="non-scaling-stroke"
            className="fill-experience-signal"
          />
          <text
            x={node.x + 38}
            y={node.y - 18}
            vectorEffect="non-scaling-stroke"
            className="fill-inverse font-inter text-[11px] font-bold tracking-[0.22em]"
          >
            {experienceChapters[index].step}
          </text>
        </g>
      ))}
    </svg>
  );
}

function StackedCareerPath() {
  return (
    <ol className="mx-auto max-w-6xl">
      {experienceChapters.map((chapter, index) => {
        const alignRight = index % 2 === 1;
        const connectorBendsRight = index % 2 === 0;

        return (
          <li
            key={chapter.step}
            className="experience-career-item relative"
          >
            <article
              className={`w-[92%] rounded-sm border border-inverse-faint bg-glass-dark p-6 sm:w-[82%] sm:p-8 lg:w-[42rem] ${
                alignRight ? "ms-auto" : "me-auto"
              }`}
            >
              <div className="flex items-center justify-between gap-4 border-b border-inverse-faint pb-5">
                <p className="flex items-center gap-3 font-inter text-[10px] font-bold uppercase tracking-[0.26em] text-experience-signal">
                  <span
                    data-stacked-node
                    aria-hidden="true"
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-experience-signal"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-experience-signal" />
                  </span>
                  {chapter.step} / {chapter.phase}
                </p>
                <time className="shrink-0 font-inter text-[10px] font-semibold uppercase tracking-[0.2em] text-inverse/45">
                  {chapter.period}
                </time>
              </div>

              <div className="mt-8">
                <h3>
                  <ExperienceTitle
                    title={chapter.title}
                    className="block max-w-full font-syne text-[1.62rem] font-extrabold uppercase leading-[0.9] text-inverse sm:text-[2.1rem]"
                  />
                </h3>
                <p className="mt-4 font-inter text-xs font-semibold uppercase tracking-[0.2em] text-inverse/45">
                  {chapter.context}
                </p>
              </div>

              <div className="mt-8 border-t border-inverse-faint pt-6">
                <p className="max-w-[46ch] font-inter text-base leading-7 text-inverse-muted">
                  {chapter.description}
                </p>
                <p className="mt-7 font-inter text-[9px] font-bold uppercase tracking-[0.28em] text-experience-signal">
                  Chapter / {chapter.phase}
                </p>
              </div>
            </article>

            {index < LAST_CHAPTER && (
              <svg
                data-stacked-connector
                aria-hidden="true"
                viewBox="0 0 100 80"
                preserveAspectRatio="none"
                className="block h-20 w-full overflow-visible"
              >
                <path
                  d={
                    connectorBendsRight
                      ? "M 24 0 V 34 H 76 V 80"
                      : "M 76 0 V 34 H 24 V 80"
                  }
                  fill="none"
                  vectorEffect="non-scaling-stroke"
                  className="stroke-inverse-faint"
                  strokeWidth="1"
                />
                <path
                  data-stacked-signal
                  d={
                    connectorBendsRight
                      ? "M 24 0 V 34 H 76 V 80"
                      : "M 76 0 V 34 H 24 V 80"
                  }
                  fill="none"
                  pathLength="1"
                  strokeDasharray="1"
                  strokeDashoffset="0"
                  vectorEffect="non-scaling-stroke"
                  className="stroke-experience-signal/45"
                  strokeWidth="1"
                />
              </svg>
            )}
          </li>
        );
      })}
    </ol>
  );
}

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const stackedRef = useRef<HTMLDivElement>(null);
  const cinematicRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const activePathRef = useRef<SVGPathElement>(null);
  const cardRefs = useRef<Array<HTMLElement | null>>([]);
  const nodeRefs = useRef<Array<SVGGElement | null>>([]);
  const telemetryRef = useRef<HTMLSpanElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const section = sectionRef.current;
      const stacked = stackedRef.current;
      const cinematic = cinematicRef.current;
      const world = worldRef.current;
      const activePath = activePathRef.current;
      const telemetry = telemetryRef.current;
      const cards = cardRefs.current.filter(
        (card): card is HTMLElement => card !== null,
      );
      const cardContents = cards
        .map((card) => card.querySelector<HTMLElement>("[data-card-content]"))
        .filter((content): content is HTMLElement => content !== null);
      const nodeRoots = nodeRefs.current.filter(
        (node): node is SVGGElement => node !== null,
      );

      if (!section || !stacked || !cinematic || !world || !activePath || !telemetry) {
        return;
      }

      const restoreStaticCareerPath = () => {
        stacked.hidden = false;
        stacked.removeAttribute("aria-hidden");
        cinematic.setAttribute("aria-hidden", "true");
        cinematic.style.visibility = "hidden";
        cinematic.style.opacity = "0";
        cinematic.style.pointerEvents = "none";
        delete section.dataset.experienceEnhanced;
      };

      restoreStaticCareerPath();

      if (reducedMotion) return;

      const mm = gsap.matchMedia();

      mm.add(CINEMATIC_QUERY, () => {
        let active = true;
        let proxyTween: gsap.core.Tween | null = null;
        let experienceTrigger: ScrollTrigger | null = null;
        let lastDominantIndex = -1;
        const proxy = { position: 0 };

        if (
          cards.length !== experienceChapters.length ||
          cardContents.length !== experienceChapters.length ||
          nodeRoots.length !== experienceChapters.length
        ) {
          return;
        }

        const nodes = nodeRoots.map<CareerNodeElements>((root) => {
          const ring = root.querySelector<SVGCircleElement>("[data-node-ring]");
          const center = root.querySelector<SVGCircleElement>("[data-node-center]");
          if (!ring || !center) throw new Error("Experience node geometry is incomplete");
          return { root, ring, center };
        });

        const easeInterface = gsap.parseEase(motion.ease.interface);
        const easeTravel = gsap.parseEase("power2.inOut");

        const updateDominance = (dominantIndex: number) => {
          if (dominantIndex === lastDominantIndex) return;

          cards.forEach((card, index) => {
            const dominant = index === dominantIndex;
            setCardExposure(card, !dominant);
            if (dominant) {
              card.dataset.careerDominant = "true";
            } else {
              delete card.dataset.careerDominant;
            }
          });

          telemetry.textContent = experienceChapters[dominantIndex].step;
          section.dataset.experienceChapter = String(dominantIndex + 1);
          lastDominantIndex = dominantIndex;
        };

        const renderNode = (
          node: CareerNodeElements,
          state: "past" | "current" | "future" | "leaving" | "arriving",
          progress = 0,
        ) => {
          if (state === "past") {
            gsap.set(node.root, { opacity: 0.58 });
            gsap.set(node.ring, { opacity: 0, scale: 0.82, transformOrigin: "center" });
            gsap.set(node.center, { opacity: 0.45, scale: 0.75, transformOrigin: "center" });
            return;
          }

          if (state === "future") {
            gsap.set(node.root, { opacity: 0.3 });
            gsap.set(node.ring, { opacity: 0, scale: 0.82, transformOrigin: "center" });
            gsap.set(node.center, { opacity: 0, scale: 0.7, transformOrigin: "center" });
            return;
          }

          if (state === "current") {
            gsap.set(node.root, { opacity: 1 });
            gsap.set(node.ring, { opacity: 1, scale: 1, transformOrigin: "center" });
            gsap.set(node.center, { opacity: 1, scale: 1, transformOrigin: "center" });
            return;
          }

          if (state === "leaving") {
            gsap.set(node.root, { opacity: gsap.utils.interpolate(1, 0.58, progress) });
            gsap.set(node.ring, {
              opacity: 1 - progress,
              scale: gsap.utils.interpolate(1, 0.82, progress),
              transformOrigin: "center",
            });
            gsap.set(node.center, {
              opacity: gsap.utils.interpolate(1, 0.45, progress),
              scale: gsap.utils.interpolate(1, 0.75, progress),
              transformOrigin: "center",
            });
            return;
          }

          gsap.set(node.root, { opacity: gsap.utils.interpolate(0.3, 1, progress) });
          gsap.set(node.ring, {
            opacity: progress,
            scale: gsap.utils.interpolate(0.82, 1, progress),
            transformOrigin: "center",
          });
          gsap.set(node.center, {
            opacity: progress,
            scale: gsap.utils.interpolate(0.7, 1, progress),
            transformOrigin: "center",
          });
        };

        const renderCareerPath = (rawPosition: number) => {
          if (!active) return;

          const position = gsap.utils.clamp(0, LAST_CHAPTER, rawPosition);
          let currentIndex: number;
          let nextIndex: number | null;
          let localProgress: number;
          let cameraY: number;
          let pathProgress: number;

          if (position >= LAST_CHAPTER) {
            currentIndex = LAST_CHAPTER;
            nextIndex = null;
            localProgress = 0;
            cameraY = CAMERA_STOPS[LAST_CHAPTER];
            pathProgress = PATH_STOPS[LAST_CHAPTER];
          } else {
            currentIndex = Math.floor(position);
            nextIndex = currentIndex + 1;
            localProgress = position - currentIndex;

            const travel = easedRange(localProgress, 0.22, 0.72, easeTravel);
            cameraY = gsap.utils.interpolate(
              CAMERA_STOPS[currentIndex],
              CAMERA_STOPS[nextIndex],
              travel,
            );
            pathProgress = gsap.utils.interpolate(
              PATH_STOPS[currentIndex],
              PATH_STOPS[nextIndex],
              travel,
            );
          }

          const outgoing = easedRange(
            localProgress,
            0.18,
            0.52,
            easeInterface,
          );
          const incoming = easedRange(
            localProgress,
            0.52,
            0.78,
            easeInterface,
          );
          const nodeTransfer = easedRange(
            localProgress,
            0.42,
            0.58,
            easeInterface,
          );
          const dominantIndex =
            nextIndex !== null && localProgress >= 0.56
              ? nextIndex
              : currentIndex;

          gsap.set(world, { y: cameraY });
          activePath.setAttribute(
            "stroke-dashoffset",
            String(1 - pathProgress),
          );

          cards.forEach((card, index) => {
            const content = cardContents[index];

            if (index === currentIndex) {
              gsap.set(card, {
                opacity: 1,
                scale: gsap.utils.interpolate(1, 0.98, outgoing),
                y: gsap.utils.interpolate(0, -12, outgoing),
              });
              gsap.set(content, {
                opacity: gsap.utils.interpolate(1, 0.48, outgoing),
              });
              return;
            }

            if (index === nextIndex) {
              gsap.set(card, {
                opacity: 1,
                scale: gsap.utils.interpolate(0.965, 1, incoming),
                y: gsap.utils.interpolate(24, 0, incoming),
              });
              gsap.set(content, {
                opacity: gsap.utils.interpolate(0.28, 1, incoming),
              });
              return;
            }

            gsap.set(card, { opacity: 1, scale: 0.965, y: 0 });
            gsap.set(content, { opacity: 0.18 });
          });

          nodes.forEach((node, index) => {
            if (index < currentIndex) {
              renderNode(node, "past");
            } else if (index === currentIndex) {
              renderNode(
                node,
                nextIndex === null ? "current" : "leaving",
                nodeTransfer,
              );
            } else if (index === nextIndex) {
              renderNode(node, "arriving", nodeTransfer);
            } else {
              renderNode(node, "future");
            }
          });

          updateDominance(dominantIndex);
        };

        const clearCinematicState = () => {
          gsap.set(
            [
              world,
              activePath,
              ...cards,
              ...cardContents,
              ...nodes.flatMap((node) => [node.root, node.ring, node.center]),
            ],
            { clearProps: "all" },
          );
          cards.forEach((card) => {
            card.setAttribute("aria-hidden", "true");
            delete card.dataset.careerDominant;
            card.style.willChange = "";
          });
          cardContents.forEach((content) => {
            content.style.willChange = "";
          });
          world.style.willChange = "";
          activePath.style.willChange = "";
          activePath.setAttribute("stroke-dashoffset", "1");
          telemetry.textContent = experienceChapters[0].step;
          delete section.dataset.experienceChapter;
          lastDominantIndex = -1;
        };

        const teardownCinematic = () => {
          active = false;
          experienceTrigger?.kill();
          experienceTrigger = null;
          proxyTween?.kill();
          proxyTween = null;
          clearCinematicState();
          restoreStaticCareerPath();
        };

        try {
          world.style.willChange = "transform";
          activePath.style.willChange = "stroke-dashoffset";
          cards.forEach((card) => {
            card.style.willChange = "transform";
          });
          cardContents.forEach((content) => {
            content.style.willChange = "opacity";
          });

          renderCareerPath(0);

          proxyTween = gsap.to(proxy, {
            position: LAST_CHAPTER,
            ease: "none",
            onUpdate: () => renderCareerPath(proxy.position),
            scrollTrigger: {
              id: "experience-career-path",
              trigger: cinematic,
              start: "top top",
              end: () =>
                `+=${Math.round(window.innerHeight * SCROLL_DISTANCE_FACTOR)}`,
              scrub: 0.8,
              pin: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onRefresh: () => renderCareerPath(proxy.position),
            },
          });
          experienceTrigger = proxyTween.scrollTrigger ?? null;
          if (!experienceTrigger) {
            throw new Error("Experience Career Path controller did not initialize");
          }

          section.dataset.experienceEnhanced = "true";
          stacked.hidden = true;
          stacked.setAttribute("aria-hidden", "true");
          cinematic.setAttribute("aria-hidden", "false");
          cinematic.style.visibility = "visible";
          cinematic.style.opacity = "1";
          cinematic.style.pointerEvents = "auto";

          ScrollTrigger.refresh();
          renderCareerPath(proxy.position);
        } catch (error) {
          teardownCinematic();
          console.error("Experience Career Path enhancement could not initialize", error);
        }

        return teardownCinematic;
      });

      mm.add(STACKED_REVEAL_QUERY, () => {
        const items = gsap.utils.toArray<HTMLElement>(
          ".experience-career-item",
          stacked,
        );
        const nodes = gsap.utils.toArray<HTMLElement>(
          "[data-stacked-node]",
          stacked,
        );
        const signals = gsap.utils.toArray<SVGPathElement>(
          "[data-stacked-signal]",
          stacked,
        );

        const reveal = gsap.timeline({
          scrollTrigger: {
            trigger: stacked,
            start: "top 86%",
            once: true,
          },
        });

        reveal
          .from(items, {
            opacity: 0,
            y: 14,
            stagger: motion.stagger.item,
            duration: motion.duration.reveal,
            ease: motion.ease.interface,
          })
          .from(
            nodes,
            {
              opacity: 0,
              scale: 0.75,
              stagger: motion.stagger.item,
              duration: motion.duration.hover,
              ease: motion.ease.interface,
            },
            0,
          )
          .from(
            signals,
            {
              strokeDashoffset: 1,
              stagger: motion.stagger.item,
              duration: motion.duration.interface,
              ease: motion.ease.interface,
            },
            0.08,
          );
      });

      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [reducedMotion], revertOnUpdate: true },
  );

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="relative overflow-x-clip bg-section-dark px-4 py-20 text-inverse sm:px-5 md:px-8 md:py-24 xl:py-28"
    >
      <header className="relative z-50 mx-auto mb-12 max-w-[1600px] md:mb-16">
        <p className="font-inter text-[10px] font-semibold uppercase tracking-[0.42em] text-experience-signal">
          [ Career Path ]
        </p>
        <h2 className="mt-4 font-syne text-[clamp(3rem,10vw,8.5rem)] font-extrabold uppercase leading-[0.86] tracking-[-0.08em] text-inverse">
          Experience
        </h2>
        <p className="mt-6 max-w-[16ch] font-inter text-xs font-semibold uppercase leading-6 tracking-[0.28em] text-inverse/45 sm:max-w-none">
          From foundation
          <span className="mx-3 hidden text-experience-signal sm:inline" aria-hidden="true">
            / 
          </span>
          <span className="block sm:inline">to systems</span>
        </p>
      </header>

      <div className="relative grid">
        <div
          ref={cinematicRef}
          data-experience-stage
          aria-hidden="true"
          className="invisible relative z-10 col-start-1 row-start-1 h-[clamp(34rem,calc(100svh-5.5rem),48rem)] overflow-hidden opacity-0 pointer-events-none"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-8 top-20 z-50 flex items-center justify-between font-inter text-[10px] font-bold uppercase tracking-[0.3em] text-inverse/55 md:inset-x-12"
          >
            <span>Career Path</span>
            <span className="flex items-center gap-2">
              <span ref={telemetryRef}>01</span>
              <span className="text-inverse/25">/ 04</span>
            </span>
          </div>

          <div
            ref={worldRef}
            data-career-world
            className="absolute inset-x-0 top-0 mx-auto h-[2920px] w-[min(1600px,calc(100vw-64px))]"
          >
            <RouteSvg activePathRef={activePathRef} />

            <div aria-hidden="true" className="absolute inset-0 z-20">
              {ENVIRONMENTAL_MARKERS.map((marker) => (
                <span
                  key={marker.label}
                  data-career-marker
                  style={{
                    insetInlineStart: marker.insetInlineStart,
                    top: marker.top,
                  }}
                  className="absolute font-inter text-[9px] font-semibold uppercase tracking-[0.28em] text-inverse/24"
                >
                  {marker.label}
                </span>
              ))}
            </div>

            <div className="absolute inset-0 z-30">
              {experienceChapters.map((chapter, index) => (
                <article
                  key={chapter.step}
                  ref={(element) => {
                    cardRefs.current[index] = element;
                  }}
                  data-career-card
                  data-card-index={index}
                  aria-hidden="true"
                  style={CHAPTER_POSITIONS[index]}
                  className="absolute isolate flex min-h-[19rem] h-auto w-[clamp(22rem,29vw,31rem)] origin-center flex-col overflow-hidden rounded-sm border border-inverse/16 bg-section-dark p-7 data-[career-dominant=true]:border-experience-signal/45 xl:p-8"
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-px bg-experience-signal/65"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute start-3 top-3 h-4 w-4 border-s border-t border-experience-signal/45"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute bottom-3 end-3 h-4 w-4 border-b border-e border-experience-signal/30"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute bottom-0 start-0 h-px w-2/5 bg-experience-signal/45"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute end-0 top-1/2 h-px w-1/4 bg-experience-signal/55"
                  />

                  <div data-card-content className="flex min-h-0 flex-1 flex-col">
                    <div className="flex items-center justify-between gap-5 border-b border-inverse-faint pb-5">
                      <p className="inline-flex h-8 min-w-10 items-center justify-center rounded-sm border border-experience-signal/35 bg-experience-signal/8 px-2 font-inter text-[11px] font-bold uppercase tracking-[0.24em] text-experience-signal">
                        {chapter.step}
                      </p>
                      <time className="font-inter text-[10px] font-semibold uppercase tracking-[0.2em] text-inverse/45">
                        {chapter.period}
                      </time>
                    </div>

                    <div className="py-7">
                      <h3>
                        <ExperienceTitle
                          title={chapter.title}
                          className="block max-w-full font-syne text-[1.58rem] font-extrabold uppercase leading-[0.9] text-inverse min-[1536px]:text-[1.95rem]"
                        />
                      </h3>
                      <p className="mt-5 flex items-center gap-3 font-inter text-xs font-semibold uppercase tracking-[0.2em] text-inverse/45">
                        <span
                          aria-hidden="true"
                          className="h-px w-6 bg-experience-signal/55"
                        />
                        {chapter.context}
                      </p>
                    </div>

                    <div className="mt-auto border-t border-inverse-faint pt-5">
                      <p className="max-w-[46ch] font-inter text-base leading-7 text-inverse-muted">
                        {chapter.description}
                      </p>
                      <p className="mt-6 inline-flex w-fit items-center border border-experience-signal/25 px-3 py-2 font-inter text-[9px] font-bold uppercase tracking-[0.28em] text-experience-signal">
                        Chapter / {chapter.phase}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <NodeSvg nodeRefs={nodeRefs} />
          </div>
        </div>

        <div
          ref={stackedRef}
          data-experience-stacked
          className="relative z-20 col-start-1 row-start-1"
        >
          <StackedCareerPath />
        </div>
      </div>
    </section>
  );
}
