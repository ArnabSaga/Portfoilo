"use client";

import { DURATION_BASE, EASE_STANDARD, gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { useRef } from "react";

const stack = [
  { name: "JavaScript", category: "Frontend & Backend", image: "/icon/javascript.jpg" },
  { name: "TypeScript", category: "Frontend & Backend", image: "/icon/typescript.jpg" },
  { name: "React.js", category: "Frontend", image: "/icon/reactjs.jpg" },
  { name: "Next.js", category: "Fullstack", image: "/icon/nextjs.jpg" },
  { name: "Node.js", category: "Backend", image: "/icon/nodejs.jpg" },
  { name: "Express.js", category: "Backend", image: "/icon/express.jpg" },
  { name: "MongoDB", category: "Backend", image: "/icon/mongodb.jpg" },
  { name: "PostgreSQL", category: "Backend", image: "/icon/postgresql.jpg" },
  { name: "Prisma", category: "Backend", image: "/icon/prisma.webp" },
  { name: "Docker", category: "DevOps", image: "/icon/docker.jpg" },
  { name: "Tailwind CSS", category: "Styles", image: "/icon/tailwind.jpg" },
  { name: "shadcn/ui", category: "Styles", image: "icon/shadcn.jpg" },
  { name: "GSAP", category: "Animation", image: "/icon/gsap.jpg" },
  { name: "Three.js", category: "Creative Dev", image: "/icon/three-js.jpg" },
  { name: "Git", category: "DevOps", image: "/icon/git.jpg" },
];

function StackCard({ item, index }: { item: (typeof stack)[0]; index: number }) {
  const cardRef = useRef<HTMLElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const plusRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (
        !cardRef.current ||
        !imageWrapRef.current ||
        !titleRef.current ||
        !metaRef.current ||
        !plusRef.current
      ) {
        return;
      }
      if (reducedMotion) return;

      const mm = gsap.matchMedia();

      mm.add("(hover: hover) and (pointer: fine)", () => {
        const tl = gsap.timeline({ paused: true });

        tl.to(
          cardRef.current,
          {
            y: -10,
            scale: 1.01,
            duration: 0.55,
            ease: EASE_STANDARD,
            borderColor: "var(--color-inverse-faint)",
          },
          0
        )
          .to(
            imageWrapRef.current,
            {
              scale: 1.035,
              opacity: 0.96,
              duration: 0.65,
              ease: EASE_STANDARD,
            },
            0
          )
          .to(
            titleRef.current,
            {
              y: -4,
              duration: 0.45,
              ease: EASE_STANDARD,
            },
            0
          )
          .to(
            metaRef.current,
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              ease: EASE_STANDARD,
            },
            0.08
          )
          .to(
            plusRef.current,
            {
              rotate: 90,
              scale: 1.08,
              backgroundColor: "var(--color-inverse)",
              color: "var(--color-section-dark)",
              borderColor: "transparent",
              duration: 0.45,
              ease: EASE_STANDARD,
            },
            0
          );

        const card = cardRef.current;
        if (!card) return;

        const onEnter = () => tl.play();
        const onLeave = () => tl.reverse();

        card.addEventListener("mouseenter", onEnter);
        card.addEventListener("mouseleave", onLeave);
        card.addEventListener("focusin", onEnter);
        card.addEventListener("focusout", onLeave);

        return () => {
          card.removeEventListener("mouseenter", onEnter);
          card.removeEventListener("mouseleave", onLeave);
          card.removeEventListener("focusin", onEnter);
          card.removeEventListener("focusout", onLeave);
        };
      });

      return () => mm.revert();
    },
    { scope: cardRef, dependencies: [reducedMotion], revertOnUpdate: true }
  );

  return (
    <article
      ref={cardRef}
      tabIndex={0}
      className={`stack-card group relative flex h-[320px] w-full max-w-full shrink-0 flex-col justify-between overflow-hidden rounded-[24px] border border-inverse-faint bg-glass-dark shadow-(--shadow-stack-card) outline-none backdrop-blur-2xl focus-visible:border-inverse-muted focus-visible:ring-2 focus-visible:ring-inverse-faint sm:h-[360px] md:h-[400px] ${reducedMotion ? "lg:h-[430px] lg:w-full lg:max-w-full xl:h-[450px] 2xl:h-[500px]" : "will-change-transform lg:h-[430px] lg:w-[380px] lg:max-w-none xl:h-[450px] xl:w-[400px] 2xl:h-[500px] 2xl:w-[430px]"}`}
    >
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div ref={imageWrapRef} className="relative h-full w-full">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover opacity-40 transition-opacity duration-500 group-hover:opacity-60"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 380px, (max-width: 1536px) 400px, 430px"
            unoptimized={item.image.startsWith('http')}
            loading="lazy"
          />
        </div>
        <div className="absolute inset-0 bg-(--stack-card-overlay)" />
      </div>

      <div className="relative z-10 flex items-start justify-between gap-4 p-5 sm:p-6 lg:p-7 2xl:p-10">
        <span className="max-w-[78%] font-inter text-[8px] font-semibold uppercase tracking-[0.24em] text-inverse-muted sm:text-[9px] lg:text-[10px]">
          {String(index + 1).padStart(2, '0')} — {item.category}
        </span>

        <div
          ref={plusRef}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-inverse-faint transition-colors sm:h-9 sm:w-9"
        >
          <span className="font-inter text-[12px] font-light leading-none text-inverse-muted group-hover:text-section-dark sm:text-[14px]">
            +
          </span>
        </div>
      </div>

      <div className="relative z-10 px-5 pb-8 pt-6 sm:px-6 sm:pb-10 lg:px-7 lg:pb-12 xl:px-8 2xl:px-10 2xl:pb-16">
        <h3
          ref={titleRef}
          className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap font-syne text-[clamp(1.35rem,6vw,1.75rem)] font-extrabold uppercase leading-[0.96] text-inverse sm:text-[1.65rem] md:text-[1.8rem] lg:text-[1.58rem] xl:text-[1.72rem] 2xl:text-[1.95rem]"
        >
          {item.name}
        </h3>

        <div ref={metaRef} className={`mt-4 flex items-center gap-3 xl:mt-5 ${reducedMotion ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}>
          <div className="h-px w-6 bg-inverse-faint xl:w-8" />
          <span className="font-inter text-[8px] font-semibold uppercase tracking-[0.24em] text-inverse-muted sm:text-[9px]">
            Highly Proficient
          </span>
        </div>
      </div>
    </article>
  );
}

export default function TechStack() {
  const sectionRef = useRef<HTMLElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (!sectionRef.current || !trackRef.current || !introRef.current) return;
      if (reducedMotion) return;

      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        const section = sectionRef.current!;
        const track = trackRef.current!;
        const cards = gsap.utils.toArray<HTMLElement>(".stack-card");

        const getScrollAmount = () =>
          Math.max(0, track.scrollWidth - window.innerWidth + window.innerWidth * 0.08);

        gsap.set(cards, {
          opacity: 0.58,
          scale: 0.94,
        });

        gsap.from(introRef.current, {
          opacity: 0,
          y: 36,
          duration: DURATION_BASE + 0.2,
          ease: EASE_STANDARD,
          scrollTrigger: {
            trigger: section,
            start: "top 82%",
            once: true,
          },
        });

        const horizontalTween = gsap.to(track, {
          x: () => -getScrollAmount(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${getScrollAmount()}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        cards.forEach((card) => {
          gsap.to(card, {
            opacity: 1,
            scale: 1,
            ease: EASE_STANDARD,
            duration: 0.45,
            scrollTrigger: {
              trigger: card,
              containerAnimation: horizontalTween,
              start: "left 82%",
              end: "center center",
              scrub: true,
            },
          });

          gsap.to(card, {
            opacity: 0.5,
            scale: 0.95,
            ease: EASE_STANDARD,
            duration: 0.45,
            scrollTrigger: {
              trigger: card,
              containerAnimation: horizontalTween,
              start: "center center",
              end: "right 12%",
              scrub: true,
            },
          });
        });
      });

      mm.add("(max-width: 1023px)", () => {
        gsap.from(".stack-card", {
          y: 28,
          stagger: 0.08,
          duration: DURATION_BASE + 0.1,
          ease: EASE_STANDARD,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            once: true,
          },
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [reducedMotion], revertOnUpdate: true }
  );

  return (
    <section
      id="stack"
      ref={sectionRef}
      className="relative flex min-h-screen w-full flex-col justify-center overflow-hidden bg-section-dark px-4 py-20 text-inverse sm:px-5 md:px-8 md:py-24 xl:py-28"
    >
      <div className="pointer-events-none absolute left-[10%] top-[14%] h-[240px] w-[240px] rounded-full bg-accent-cool blur-[90px] sm:h-[320px] sm:w-[320px] xl:h-[500px] xl:w-[500px] xl:blur-[120px]" />
      <div className="pointer-events-none absolute bottom-[8%] right-[10%] h-[280px] w-[280px] rounded-full bg-accent-warm blur-[90px] sm:h-[360px] sm:w-[360px] xl:h-[600px] xl:w-[600px] xl:blur-[120px]" />

      <div className="relative z-10 mx-auto w-full max-w-[1800px]">
        <div
          ref={introRef}
          className="mb-10 grid grid-cols-1 items-end gap-5 sm:mb-12 lg:mb-16 lg:grid-cols-[1.2fr_0.5fr_0.8fr] 2xl:mb-24"
        >
          <div>
            <h2 className="font-syne text-[clamp(3.2rem,10vw,10.5rem)] font-extrabold uppercase leading-[0.84] text-inverse">
              Core
              <br />
              Stack
            </h2>
          </div>

          <div className="hidden h-px w-full bg-inverse-faint lg:block" />

          <p className="pb-1 text-left font-inter text-[8px] font-semibold uppercase tracking-[0.34em] text-inverse-muted sm:text-[9px] lg:pb-4 lg:text-right lg:text-[10px]">
            [ Technical expertise ]
          </p>
        </div>

        <div
          ref={trackRef}
          className={reducedMotion
            ? "grid w-full grid-cols-1 gap-4 py-2 sm:gap-5 lg:grid-cols-2 lg:gap-7 xl:gap-8"
            : "flex w-full flex-col gap-4 py-2 sm:gap-5 lg:w-max lg:flex-row lg:items-center lg:gap-7 lg:pl-[18vw] lg:pr-[10vw] xl:gap-8 2xl:gap-9"}
        >
          {stack.map((item, index) => (
            <StackCard key={item.name} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
