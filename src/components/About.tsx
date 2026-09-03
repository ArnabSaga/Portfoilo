"use client";

import { SplitReveal } from "@/components/motion/SplitReveal";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { gsap, motion } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { useRef } from "react";

const manifestoLines = [
  "I care about",
  "what happens",
  "behind the",
  "interface.",
] as const;

const biography = [
  "I am a full stack developer focused on scalable systems, thoughtful interfaces, and production quality engineering.",
  "My work is shaped by logical data isolation, clear access control, and interface decisions that make complex products feel easier to use.",
] as const;

const principles = [
  "Architecture before complexity.",
  "Performance before decoration.",
  "Clarity before cleverness.",
] as const;

const profileLinks = [
  { label: "GitHub", href: "https://github.com/ArnabSaga" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/achyuta1/" },
  { label: "Email", href: "mailto:achyutaarnabdey@gmail.com" },
] as const;

function MicroLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-inter text-[0.68rem] font-bold uppercase tracking-[0.28em] text-foreground/48">
      {children}
    </p>
  );
}

function Signature() {
  return (
    <div className="about-reveal border-s border-foreground/18 ps-4 font-inter uppercase tracking-[0.2em] text-foreground/54">
      <p className="text-[0.68rem] font-bold text-foreground/70">
        Achyuta Arnab Dey
      </p>
      <p className="mt-2 text-[0.6rem] font-bold">Full Stack Developer</p>
      <p className="mt-2 text-[0.6rem] font-bold">Bangladesh</p>
    </div>
  );
}

function PortraitSpine({
  frameRef,
  imageRef,
}: {
  frameRef: React.RefObject<HTMLElement | null>;
  imageRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div className="relative mx-auto w-full max-w-[22rem] min-[1025px]:mt-4 min-[1025px]:max-w-[18rem] xl:mt-8 xl:max-w-[22rem]">
      <span
        aria-hidden="true"
        className="absolute inset-y-[-3rem] start-1/2 hidden w-px -translate-x-1/2 bg-border-custom min-[1025px]:block"
      />

      <figure
        ref={frameRef}
        data-about-portrait
        className="about-reveal relative z-10"
      >
        <div className="relative aspect-3/4 overflow-hidden rounded-sm border border-border-custom bg-surface">
          <span
            aria-hidden="true"
            className="absolute start-3 top-3 z-10 h-5 w-5 border-s border-t border-foreground/30"
          />
          <span
            aria-hidden="true"
            className="absolute bottom-3 end-3 z-10 h-5 w-5 border-b border-e border-foreground/24"
          />
          <div ref={imageRef} className="relative h-full w-full">
            <Image
              src="/image/backward-profile.png"
              alt="Portrait of Achyuta Arnab Dey"
              fill
              className="object-cover grayscale contrast-[1.05]"
              sizes="(max-width: 1024px) min(100vw, 24rem), 26vw"
            />
          </div>
        </div>
      </figure>

      <div className="relative z-10 mt-6">
        <Signature />
      </div>
    </div>
  );
}

function IdentityBlock() {
  return (
    <section
      data-about-group
      aria-labelledby="about-identity-heading"
      className="about-reveal max-w-[44ch] min-[1025px]:mt-24"
    >
      <p
        id="about-identity-heading"
        className="font-inter text-[0.68rem] font-bold uppercase tracking-[0.28em] text-foreground/48"
      >
        01 / Identity
      </p>
      <div className="mt-7 space-y-6 font-inter text-[clamp(1.05rem,1.2vw,1.25rem)] leading-[1.55] text-foreground/76">
        {biography.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}

function ApproachBlock() {
  return (
    <section
      data-about-group
      aria-labelledby="about-approach-heading"
      className="about-reveal max-w-[30rem]"
    >
      <p
        id="about-approach-heading"
        className="font-inter text-[0.68rem] font-bold uppercase tracking-[0.28em] text-foreground/48"
      >
        02 / Approach
      </p>
      <ul className="mt-7 space-y-4 font-inter text-base leading-7 text-foreground/74">
        {principles.map((principle) => (
          <li
            key={principle}
            className="flex gap-4"
          >
            <span
              aria-hidden="true"
              className="mt-3 h-px w-7 shrink-0 bg-foreground/30"
            />
            <span>{principle}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ConnectionRow() {
  return (
    <nav
      data-about-group
      aria-label="Profile links"
      className="about-reveal border-t border-border-custom pt-9 min-[1025px]:pt-10"
    >
      <MicroLabel>03 / Connection</MicroLabel>
      <ul className="mt-6 grid gap-0 divide-y divide-border-custom border-y border-border-custom min-[768px]:grid-cols-3 min-[768px]:divide-x min-[768px]:divide-y-0">
        {profileLinks.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={
                link.href.startsWith("http") ? "noopener noreferrer" : undefined
              }
              className="group flex min-h-13 items-center justify-between gap-5 px-0 py-4 font-inter text-[0.72rem] font-bold uppercase tracking-[0.22em] text-foreground/72 transition-colors duration-300 hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground min-[768px]:px-6 min-[1025px]:px-8"
            >
              <span>{link.label}</span>
              <span
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              >
                ↗
              </span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const portraitFrameRef = useRef<HTMLElement>(null);
  const portraitImageRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (
        reducedMotion ||
        !sectionRef.current ||
        !portraitFrameRef.current ||
        !portraitImageRef.current
      ) {
        return;
      }

      const context = gsap.context(() => {
        gsap.set("[data-about-kicker], .about-reveal", {
          opacity: 0,
          y: 16,
        });

        gsap.set(portraitFrameRef.current, {
          clipPath: "inset(0 100% 0 0)",
        });

        gsap.set(portraitImageRef.current, {
          scale: 1.02,
        });

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 78%",
            once: true,
          },
          defaults: {
            ease: motion.ease.enter,
          },
        });

        timeline
          .to("[data-about-kicker]", {
            opacity: 1,
            y: 0,
            duration: motion.duration.interface,
          })
          .to(
            portraitFrameRef.current,
            {
              clipPath: "inset(0 0 0 0)",
              duration: motion.duration.major,
            },
            0.14,
          )
          .to(
            portraitImageRef.current,
            {
              scale: 1,
              duration: motion.duration.major,
            },
            0.14,
          )
          .to(
            ".about-reveal",
            {
              opacity: 1,
              y: 0,
              duration: motion.duration.reveal,
              stagger: motion.stagger.item,
              clearProps: "willChange",
            },
            0.28,
          );
      }, sectionRef);

      return () => context.revert();
    },
    { scope: sectionRef, dependencies: [reducedMotion], revertOnUpdate: true },
  );

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative scroll-mt-32 overflow-hidden bg-background px-4 py-18 text-foreground sm:px-6 lg:scroll-mt-36 lg:px-8 lg:py-24"
    >
      <div className="mx-auto max-w-screen-2xl">
        <header className="border-b border-border-custom pb-6">
          <div data-about-kicker>
            <MicroLabel>About / Profile</MicroLabel>
          </div>
        </header>

        <div className="pt-10 sm:pt-14 min-[1025px]:pt-18 xl:pt-22">
          <div className="grid gap-12 min-[1025px]:grid-cols-12 min-[1025px]:items-start min-[1025px]:gap-x-7 xl:gap-x-10">
            <div className="min-[1025px]:col-span-5">
              <SplitReveal
                as="h2"
                className="font-syne text-[clamp(1.45rem,6.2vw,2.65rem)] font-extrabold uppercase leading-[0.9] tracking-[-0.05em] text-foreground min-[768px]:text-[clamp(3rem,6.4vw,4.8rem)] min-[1025px]:text-[clamp(2rem,2.85vw,2.75rem)] min-[1280px]:text-[clamp(2.45rem,2.1vw,3rem)]"
              >
                {manifestoLines.map((line) => (
                  <span key={line} className="block whitespace-nowrap">
                    {line}
                  </span>
                ))}
              </SplitReveal>

              <div className="mt-12 hidden min-[1025px]:block xl:mt-14">
                <ApproachBlock />
              </div>
            </div>

            <div className="min-[1025px]:col-span-3 min-[1025px]:col-start-6 xl:col-span-3 xl:col-start-6">
              <PortraitSpine
                frameRef={portraitFrameRef}
                imageRef={portraitImageRef}
              />
            </div>

            <div className="hidden min-[1025px]:col-span-4 min-[1025px]:col-start-9 min-[1025px]:block xl:col-span-4 xl:col-start-9">
              <IdentityBlock />
            </div>

            <div className="min-[1025px]:hidden">
              <IdentityBlock />
            </div>

            <div className="min-[1025px]:hidden">
              <ApproachBlock />
            </div>
          </div>

          <div className="mt-14 sm:mt-16 min-[1025px]:mt-20">
            <ConnectionRow />
          </div>
        </div>
      </div>
    </section>
  );
}
