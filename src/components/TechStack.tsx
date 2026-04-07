"use client";

import { DURATION_BASE, EASE_STANDARD, gsap } from "@/lib/gsap";
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
  {
    name: "shadcn/ui",
    category: "Styles",
    image: "https://raw.githubusercontent.com/shadcn-ui/ui/main/apps/www/public/logo.png",
  },
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

      const mm = gsap.matchMedia();

      mm.add("(hover: hover) and (pointer: fine)", () => {
        const tl = gsap.timeline({ paused: true });

        tl.to(
          cardRef.current,
          {
            y: -10,
            scale: 1.015,
            duration: 0.55,
            ease: EASE_STANDARD,
            boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            borderColor: "rgba(255,255,255,0.18)",
          },
          0
        )
          .to(
            imageWrapRef.current,
            {
              scale: 1.06,
              opacity: 0.9,
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
              backgroundColor: "#fff",
              color: "#000",
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
    { scope: cardRef }
  );

  return (
    <article
      ref={cardRef}
      tabIndex={0}
      className="stack-card group relative flex h-[340px] w-full max-w-full shrink-0 flex-col justify-between overflow-hidden rounded-[24px] border border-white/10 bg-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.25)] outline-none backdrop-blur-2xl will-change-transform sm:h-[380px] md:h-[420px] lg:h-[440px] lg:w-[340px] lg:max-w-none xl:h-[470px] xl:w-[360px] 2xl:h-[520px] 2xl:w-[400px]"
    >
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div ref={imageWrapRef} className="relative h-full w-full">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover opacity-30 transition-opacity duration-500 group-hover:opacity-55"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 340px, (max-width: 1536px) 360px, 400px"
            unoptimized={item.image.startsWith("http")}
            priority={index < 8}
          />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,6,6,0.96)_0%,rgba(6,6,6,0.58)_45%,rgba(6,6,6,0.92)_100%)]" />
      </div>

      <div className="relative z-10 flex items-start justify-between gap-4 p-5 sm:p-6 lg:p-7 2xl:p-10">
        <span className="font-inter text-[8px] font-semibold uppercase tracking-[0.28em] text-white/52 sm:text-[9px] lg:text-[10px]">
          {String(index + 1).padStart(2, "0")} — {item.category}
        </span>

        <div
          ref={plusRef}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 transition-colors sm:h-9 sm:w-9"
        >
          <span className="font-inter text-[12px] font-light leading-none text-white/70 group-hover:text-black sm:text-[14px]">
            +
          </span>
        </div>
      </div>

      <div className="relative z-10 px-5 pb-8 pt-6 sm:px-6 sm:pb-10 lg:px-7 lg:pb-12 xl:px-8 2xl:px-10 2xl:pb-16">
        <h3
          ref={titleRef}
          className="font-syne text-[1.9rem] font-extrabold uppercase leading-[0.92] tracking-[-0.045em] text-white sm:text-[2.1rem] md:text-[2.25rem] lg:text-[2.35rem] xl:text-[2.55rem] 2xl:text-[2.85rem]"
        >
          {item.name}
        </h3>

        <div ref={metaRef} className="mt-4 flex translate-y-3 items-center gap-3 opacity-0 xl:mt-5">
          <div className="h-px w-6 bg-white/30 xl:w-8" />
          <span className="font-inter text-[8px] font-semibold uppercase tracking-[0.28em] text-white/50 sm:text-[9px]">
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

  useGSAP(
    () => {
      if (!sectionRef.current || !trackRef.current || !introRef.current) return;

      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        const section = sectionRef.current!;
        const track = trackRef.current!;
        const cards = gsap.utils.toArray<HTMLElement>(".stack-card");

        const getScrollAmount = () =>
          Math.max(0, track.scrollWidth - window.innerWidth + window.innerWidth * 0.08);

        gsap.set(cards, {
          opacity: 0.28,
          scale: 0.9,
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
            opacity: 0.28,
            scale: 0.9,
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
          opacity: 0,
          y: 42,
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
    { scope: sectionRef }
  );

  return (
    <section
      id="stack"
      ref={sectionRef}
      className="relative flex min-h-screen w-full flex-col justify-center overflow-hidden bg-[#060606] px-4 py-20 text-white sm:px-5 md:px-8 md:py-24 xl:py-28"
    >
      <div className="pointer-events-none absolute left-[10%] top-[14%] h-[240px] w-[240px] rounded-full bg-cyan-500/5 blur-[90px] sm:h-[320px] sm:w-[320px] xl:h-[500px] xl:w-[500px] xl:blur-[120px]" />
      <div className="pointer-events-none absolute bottom-[8%] right-[10%] h-[280px] w-[280px] rounded-full bg-amber-500/5 blur-[90px] sm:h-[360px] sm:w-[360px] xl:h-[600px] xl:w-[600px] xl:blur-[120px]" />

      <div className="relative z-10 mx-auto w-full max-w-[1800px]">
        <div
          ref={introRef}
          className="mb-10 grid grid-cols-1 items-end gap-5 sm:mb-12 lg:mb-16 lg:grid-cols-[1.2fr_0.5fr_0.8fr] 2xl:mb-24"
        >
          <div>
            <h2 className="font-syne text-[clamp(3.2rem,10vw,10.5rem)] font-extrabold uppercase leading-[0.84] tracking-[-0.08em] text-[#f8f7f4]">
              Core
              <br />
              Stack
            </h2>
          </div>

          <div className="hidden h-px w-full bg-white/10 lg:block" />

          <p className="pb-1 text-left font-inter text-[8px] font-semibold uppercase tracking-[0.42em] text-white/40 sm:text-[9px] lg:pb-4 lg:text-right lg:text-[10px]">
            [ Technical expertise ]
          </p>
        </div>

        <div
          ref={trackRef}
          className="flex w-full flex-col gap-4 py-2 sm:gap-5 lg:w-max lg:flex-row lg:items-center lg:gap-8 lg:pl-[18vw] lg:pr-[10vw] xl:gap-9 2xl:gap-10"
        >
          {stack.map((item, index) => (
            <StackCard key={item.name} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
