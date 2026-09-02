"use client";

import { SplitReveal } from "@/components/motion/SplitReveal";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { gsap, motion } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { useRef } from "react";

const statementLines = [
  "I build digital",
  "systems with",
  "architectural",
  "precision.",
] as const;

const biography = [
  "I am a full stack developer focused on scalable systems, thoughtful interfaces, and production quality engineering.",
  "My work is shaped by logical data isolation, clear access control, and interface decisions that make complex products feel easier to use.",
] as const;

const philosophy = [
  "Architecture before complexity.",
  "Performance before decoration.",
  "Clarity before cleverness.",
] as const;

const profileLinks = [
  { label: "GitHub", href: "https://github.com/ArnabSaga" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/achyuta1/" },
  { label: "Email", href: "mailto:achyutaarnabdey@gmail.com" },
] as const;

function PortraitPlate({
  frameRef,
  imageRef,
}: {
  frameRef: React.RefObject<HTMLElement | null>;
  imageRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <figure
      ref={frameRef}
      data-about-portrait
      className="about-reveal relative mx-auto w-full max-w-[28rem] lg:mx-0 lg:max-w-none"
    >
      <div className="relative aspect-4/5 overflow-hidden rounded-sm border border-border-custom bg-surface">
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
            sizes="(max-width: 1024px) min(100vw, 28rem), 34vw"
          />
        </div>
      </div>
      <figcaption className="mt-4 flex items-center justify-between gap-4 font-inter text-[0.62rem] font-bold uppercase tracking-[0.24em] text-foreground/50">
        <span>Portrait / Profile</span>
        <span aria-hidden="true">01</span>
      </figcaption>
    </figure>
  );
}

function WorkingPhilosophy({
  className = "",
  headingId = "about-philosophy-heading",
}: {
  className?: string;
  headingId?: string;
}) {
  return (
    <section
      data-about-group
      aria-labelledby={headingId}
      className={`about-reveal ${className}`}
    >
      <p
        id={headingId}
        className="font-inter text-[0.68rem] font-bold uppercase tracking-[0.28em] text-foreground/48"
      >
        Working Philosophy
      </p>
      <ul className="mt-6 space-y-4">
        {philosophy.map((item) => (
          <li
            key={item}
            className="flex gap-4 font-inter text-base leading-7 text-foreground/74"
          >
            <span
              aria-hidden="true"
              className="mt-3 h-px w-7 shrink-0 bg-foreground/30"
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ProfileLinks({ className = "" }: { className?: string }) {
  return (
    <nav
      data-about-group
      aria-label="Profile links"
      className={`about-reveal ${className}`}
    >
      <p className="font-inter text-[0.68rem] font-bold uppercase tracking-[0.28em] text-foreground/48">
        Profile Links
      </p>
      <ul className="mt-5 divide-y divide-border-custom border-y border-border-custom">
        {profileLinks.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={
                link.href.startsWith("http") ? "noopener noreferrer" : undefined
              }
              className="group flex min-h-11 items-center justify-between gap-5 py-3 font-inter text-[0.72rem] font-bold uppercase tracking-[0.22em] text-foreground/72 transition-colors duration-300 hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground"
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

function ApproachBlock({ className = "" }: { className?: string }) {
  return (
    <div className={`about-reveal ${className}`}>
      <p className="font-inter text-[0.68rem] font-bold uppercase tracking-[0.28em] text-foreground/48">
        Approach / 02
      </p>
      <p className="mt-5 max-w-[20ch] font-syne text-[clamp(1.4rem,5vw,1.95rem)] font-bold uppercase leading-[0.95] tracking-[-0.04em] text-foreground min-[1025px]:text-[clamp(1.4rem,2vw,2rem)]">
        Architecture
        <span className="block">before complexity.</span>
      </p>
    </div>
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
          y: 18,
        });

        gsap.set(portraitFrameRef.current, {
          clipPath: "inset(100% 0 0 0)",
        });

        gsap.set(portraitImageRef.current, {
          scale: 1.03,
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
              clipPath: "inset(0% 0 0 0)",
              duration: motion.duration.major,
            },
            0.18,
          )
          .to(
            portraitImageRef.current,
            {
              scale: 1,
              duration: motion.duration.major,
            },
            0.18,
          )
          .to(
            ".about-reveal",
            {
              opacity: 1,
              y: 0,
              duration: motion.duration.reveal,
              stagger: motion.stagger.item,
            },
            0.34,
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
        <header className="grid gap-5 border-b border-border-custom pb-6 font-inter text-[0.68rem] font-bold uppercase tracking-[0.28em] text-foreground/48 sm:grid-cols-2">
          <p data-about-kicker>About / Profile</p>
          <p data-about-kicker className="sm:text-end">
            01 / Identity
          </p>
        </header>

        <div className="pt-14 sm:pt-16 min-[1025px]:pt-36">
          <div className="grid gap-11 min-[1025px]:grid-cols-12 min-[1025px]:items-start min-[1025px]:gap-x-10 xl:gap-x-14">
            <div className="min-[1025px]:col-span-7 xl:col-span-8">
              <SplitReveal
                as="h2"
                className="font-syne text-[clamp(1.35rem,6.1vw,2.4rem)] font-extrabold uppercase leading-[0.9] tracking-[-0.045em] text-foreground sm:max-[1024px]:text-[clamp(3rem,5.65vw,4.05rem)] sm:max-[1024px]:leading-[0.88] min-[1025px]:text-[clamp(2.35rem,2.75vw,2.65rem)] min-[1025px]:leading-[0.88] min-[1280px]:text-[clamp(3.3rem,4.05vw,5rem)] min-[1536px]:text-[clamp(4rem,3.7vw,5.1rem)]"
              >
                {statementLines.map((line) => (
                  <span key={line} className="block whitespace-nowrap">
                    {line}
                  </span>
                ))}
            </SplitReveal>

              <ApproachBlock className="mt-10 hidden sm:mt-12 min-[1025px]:block" />
              <WorkingPhilosophy
                className="mt-12 hidden max-w-[36rem] border-t border-border-custom pt-9 min-[1025px]:block"
                headingId="about-philosophy-heading-desktop"
              />
            </div>

            <div className="space-y-10 min-[1025px]:col-span-5 min-[1025px]:col-start-8 min-[1025px]:space-y-9 min-[1025px]:pt-2 xl:col-span-4 xl:col-start-9">
              <PortraitPlate
                frameRef={portraitFrameRef}
                imageRef={portraitImageRef}
              />

              <div className="about-reveal max-w-[45ch] space-y-5 font-inter text-base leading-[1.6] text-foreground/74 sm:text-[clamp(1rem,1.15vw,1.2rem)]">
                <p className="font-inter text-[0.68rem] font-bold uppercase leading-none tracking-[0.28em] text-foreground/48">
                  Profile / 03
                </p>
                {biography.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              <ProfileLinks className="hidden max-w-[32rem] min-[1025px]:block" />
            </div>

            <ApproachBlock className="min-[1025px]:hidden" />
            <WorkingPhilosophy
              className="min-[1025px]:hidden"
              headingId="about-philosophy-heading-mobile"
            />
            <ProfileLinks className="min-[1025px]:hidden" />
          </div>
        </div>
      </div>
    </section>
  );
}
