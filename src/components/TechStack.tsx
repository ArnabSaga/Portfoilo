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
  const imageRef = useRef<HTMLImageElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const plusRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (
        !cardRef.current ||
        !imageRef.current ||
        !titleRef.current ||
        !metaRef.current ||
        !plusRef.current
      ) {
        return;
      }

      const tl = gsap.timeline({ paused: true });

      tl.to(
        cardRef.current,
        {
          y: -15,
          scale: 1.02,
          duration: 0.6,
          ease: EASE_STANDARD,
          boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
          borderColor: "rgba(255,255,255,0.2)",
        },
        0
      )
        .to(
          imageRef.current,
          {
            scale: 1.1,
            opacity: 0.8,
            duration: 0.7,
            ease: EASE_STANDARD,
          },
          0
        )
        .to(
          titleRef.current,
          {
            y: -6,
            duration: 0.5,
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
          0.1
        )
        .to(
          plusRef.current,
          {
            rotate: 90,
            scale: 1.1,
            backgroundColor: "#fff",
            color: "#000",
            borderColor: "transparent",
            duration: 0.5,
            ease: EASE_STANDARD,
          },
          0
        );

      const card = cardRef.current;
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
    },
    { scope: cardRef }
  );

  return (
    <article
      ref={cardRef}
      tabIndex={0}
      // FIXED: Added responsive scaling. lg screens get a smaller card, xl/2xl get the massive one.
      className="stack-card group relative flex shrink-0 flex-col justify-between overflow-hidden rounded-[32px] border border-white/10 bg-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.3)] outline-none backdrop-blur-2xl will-change-transform h-[420px] w-[320px] lg:h-[460px] lg:w-[360px] 2xl:h-[520px] 2xl:w-[400px]"
    >
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          ref={imageRef}
          src={item.image}
          alt={item.name}
          fill
          className="object-cover opacity-30 transition-opacity duration-500 group-hover:opacity-60"
          sizes="(max-width: 1024px) 320px, (max-width: 1536px) 360px, 400px"
          unoptimized={item.image.startsWith("http")}
        />
        <div className="absolute inset-0 bg-linear-to-b from-[#060606]/95 via-[#060606]/50 to-[#060606]/95" />
      </div>

      <div className="relative z-10 flex items-start justify-between gap-4 p-6 lg:p-8 2xl:p-10">
        <span className="font-inter text-[9px] font-semibold uppercase tracking-[0.3em] text-white/50 lg:text-[10px]">
          {String(index + 1).padStart(2, "0")} — {item.category}
        </span>

        <div
          ref={plusRef}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 transition-colors lg:h-9 lg:w-9"
        >
          <span className="font-inter text-[12px] font-light leading-none text-white/70 group-hover:text-black lg:text-[14px]">
            +
          </span>
        </div>
      </div>

      <div className="relative z-10 px-6 pt-6 pb-10 lg:px-8 lg:pt-8 lg:pb-12 2xl:px-10 2xl:pt-10 2xl:pb-16">
        <h3
          ref={titleRef}
          className="font-syne text-[2.2rem] font-extrabold uppercase leading-[0.9] tracking-[-0.04em] text-white lg:text-[2.5rem] 2xl:text-[2.85rem]"
        >
          {item.name}
        </h3>

        <div
          ref={metaRef}
          className="mt-4 flex translate-y-3 items-center gap-3 opacity-0 2xl:mt-5"
        >
          <div className="h-px w-6 bg-white/30 2xl:w-8" />
          <span className="font-inter text-[8px] font-semibold uppercase tracking-[0.3em] text-white/50 lg:text-[9px]">
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

        const maxScroll = () => Math.max(0, track.scrollWidth - window.innerWidth);

        gsap.set(cards, {
          opacity: 0.25,
          scale: 0.88,
        });

        gsap.set(track, { x: () => -maxScroll() });

        gsap.from(introRef.current, {
          opacity: 0,
          y: 40,
          duration: DURATION_BASE + 0.2,
          ease: EASE_STANDARD,
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            once: true,
          },
        });

        const horizontalTween = gsap.to(track, {
          x: 0,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${maxScroll()}`,
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
            duration: 0.5,
            scrollTrigger: {
              trigger: card,
              containerAnimation: horizontalTween,
              start: "right 15%",
              end: "center center",
              scrub: true,
            },
          });

          gsap.to(card, {
            opacity: 0.25,
            scale: 0.88,
            ease: EASE_STANDARD,
            duration: 0.5,
            scrollTrigger: {
              trigger: card,
              containerAnimation: horizontalTween,
              start: "center center",
              end: "left 85%",
              scrub: true,
            },
          });
        });
      });

      mm.add("(max-width: 1023px)", () => {
        gsap.from(".stack-card", {
          opacity: 0,
          y: 50,
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
      // FIXED: Added min-h-screen, flex, flex-col, and justify-center so it behaves beautifully on all heights.
      className="relative flex min-h-screen w-full flex-col justify-center overflow-hidden bg-[#060606] px-5 py-24 text-white md:px-8"
    >
      <div className="pointer-events-none absolute left-[15%] top-[20%] h-[500px] w-[500px] rounded-full bg-cyan-500/5 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-[10%] right-[15%] h-[600px] w-[600px] rounded-full bg-amber-500/5 blur-[120px]" />

      <div className="relative z-10 mx-auto w-full max-w-[1800px]">
        <div
          ref={introRef}
          className="mb-12 grid grid-cols-1 items-end gap-6 lg:mb-16 lg:grid-cols-[1.2fr_0.5fr_0.8fr] 2xl:mb-24"
        >
          <div>
            <h2 className="font-syne text-[clamp(4rem,8vw,10.5rem)] font-extrabold uppercase leading-[0.84] tracking-[-0.08em] text-[#f8f7f4]">
              Core
              <br />
              Stack
            </h2>
          </div>

          <div className="hidden h-px w-full bg-white/10 lg:block" />

          <p className="pb-2 text-left font-inter text-[9px] font-semibold uppercase tracking-[0.45em] text-white/40 lg:pb-4 lg:text-right lg:text-[10px]">
            [ Technical expertise ]
          </p>
        </div>

        {/* FIXED: Switched lg:items-stretch to lg:items-center so cards don't warp vertically */}
        <div
          ref={trackRef}
          className="flex w-full flex-col gap-6 py-4 lg:w-max lg:flex-row-reverse lg:items-center lg:gap-8 lg:pl-[25vw] lg:pr-[8vw] 2xl:gap-10"
        >
          {stack.map((item, index) => (
            <StackCard key={item.name} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
