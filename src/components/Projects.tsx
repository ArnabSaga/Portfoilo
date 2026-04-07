"use client";

import { DURATION_BASE, EASE_STANDARD, gsap } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { useRef } from "react";

const projects = [
  {
    id: "01",
    title: "OpsCore",
    category: "SaaS Platform",
    description:
      "A multi-tenant SaaS platform focused on workspace management, RBAC, billing, and production-style architecture with a premium product experience.",
    image: "/project/opscore.jpg",
    tech: ["Next.js", "PostgreSQL", "TypeScript", "shadcn/ui", "GSAP"],
    live: "https://opscore-frontend.vercel.app",
  },
  {
    id: "02",
    title: "Medi-Store",
    category: "Fullstack Platform",
    description:
      "A medicine commerce platform with admin workflow, inventory logic, secure checkout flow, and a clean, scalable fullstack architecture.",
    image: "/project/medistore.jpg",
    tech: ["Next.js", "PostgreSQL", "TypeScript", "shadcn/ui"],
    live: "https://medi-store-frontend-puce.vercel.app",
  },
  {
    id: "03",
    title: "Awwer",
    category: "Gaming Platform",
    description:
      "An interactive gaming-focused experience with expressive motion, bold visual rhythm, and a playful interface structure.",
    image: "/project/awwer.jpg",
    tech: ["React", "JavaScript", "GSAP", "Tailwind"],
    live: "https://awwer.vercel.app",
  },
  {
    id: "04",
    title: "Velvet-Pour",
    category: "E-Commerce",
    description:
      "A luxury retail experience centered on mood, storytelling, and refined transitions for a more sensory web interaction.",
    image: "/project/velvet-pour.jpg",
    tech: ["React", "JavaScript", "GSAP"],
    live: "https://velvet-pour-gamma-nine.vercel.app",
  },
  {
    id: "05",
    title: "MeetAI",
    category: "AI Platform",
    description:
      "An AI-first concept platform designed for intelligent meeting workflows, assistant-driven productivity, and future-facing UI.",
    image: "/project/meetai.jpg",
    tech: ["React", "JavaScript", "GSAP"],
    live: "On Progress",
  },
  {
    id: "06",
    title: "Path-To-Peace",
    category: "E-Commerce",
    description:
      "A calm and minimal brand experience designed with thoughtful pacing, gentle motion, and spiritual storytelling.",
    image: "/project/path-to-peace.jpg",
    tech: ["React", "JavaScript", "GSAP"],
    live: "https://path-to-peace.vercel.app/",
  },
];

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current || !triggerRef.current || !trackRef.current || !introRef.current) {
        return;
      }

      const mm = gsap.matchMedia();

      mm.add("(min-width: 1025px)", () => {
        const section = sectionRef.current!;
        const trigger = triggerRef.current!;
        const track = trackRef.current!;
        const cards = gsap.utils.toArray<HTMLElement>(".project-card");
        const inners = gsap.utils.toArray<HTMLElement>(".project-inner");

        const getScrollAmount = () =>
          Math.max(0, track.scrollWidth - window.innerWidth + window.innerWidth * 0.08);

        if (getScrollAmount() <= 0) return;

        gsap.set(cards, {
          opacity: 0.32,
          scale: 0.92,
        });

        gsap.from(introRef.current, {
          opacity: 0,
          y: 36,
          duration: DURATION_BASE + 0.15,
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
            trigger,
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
            duration: 0.45,
            ease: EASE_STANDARD,
            scrollTrigger: {
              trigger: card,
              containerAnimation: horizontalTween,
              start: "left 82%",
              end: "center center",
              scrub: true,
            },
          });

          gsap.to(card, {
            opacity: 0.32,
            scale: 0.92,
            duration: 0.45,
            ease: EASE_STANDARD,
            scrollTrigger: {
              trigger: card,
              containerAnimation: horizontalTween,
              start: "center center",
              end: "right 12%",
              scrub: true,
            },
          });
        });

        inners.forEach((inner) => {
          const image = inner.querySelector<HTMLElement>(".project-image-wrap");
          const content = inner.querySelector<HTMLElement>(".project-content");

          if (image) {
            gsap.to(image, {
              yPercent: -8,
              ease: "none",
              scrollTrigger: {
                trigger: inner,
                containerAnimation: horizontalTween,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            });
          }

          if (content) {
            gsap.to(content, {
              yPercent: -4,
              ease: "none",
              scrollTrigger: {
                trigger: inner,
                containerAnimation: horizontalTween,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            });
          }
        });
      });

      mm.add("(max-width: 1024px)", () => {
        gsap.from(".project-card", {
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

        gsap.from(introRef.current, {
          opacity: 0,
          y: 30,
          duration: DURATION_BASE,
          ease: EASE_STANDARD,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 88%",
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
      id="work"
      ref={sectionRef}
      className="relative overflow-hidden bg-background py-20 text-foreground md:py-24 xl:py-28"
    >
      <div className="pointer-events-none absolute left-[8%] top-[16%] h-[240px] w-[240px] rounded-full bg-white/4 blur-[90px] md:h-[360px] md:w-[360px]" />
      <div className="pointer-events-none absolute bottom-[10%] right-[8%] h-[260px] w-[260px] rounded-full bg-white/4 blur-[90px] md:h-[420px] md:w-[420px]" />

      <div ref={triggerRef} className="relative">
        <div className="mx-auto max-w-[1800px] px-4 sm:px-6 md:px-8">
          <div
            ref={introRef}
            className="mb-12 grid grid-cols-1 items-end gap-6 lg:mb-16 lg:grid-cols-[1.1fr_0.45fr_0.8fr] 2xl:mb-20"
          >
            <div>
              <p className="mb-4 font-inter text-[9px] font-semibold uppercase tracking-[0.42em] text-foreground/36 sm:text-[10px]">
                [ Selected Works ]
              </p>
              <h2 className="font-syne text-[clamp(3.2rem,10vw,8.8rem)] font-extrabold uppercase leading-[0.86] tracking-[-0.08em] text-foreground">
                Selected
                <br />
                Works
              </h2>
            </div>

            <div className="hidden h-px w-full bg-foreground/10 lg:block" />

            <p className="max-w-sm font-inter text-sm leading-6 text-foreground/46 lg:ml-auto lg:text-right">
              Curated experiments in digital architecture, product systems, and functional
              aesthetics.
            </p>
          </div>

          <div
            ref={trackRef}
            className="flex w-full flex-col gap-12 lg:w-max lg:flex-row lg:items-center lg:gap-10 lg:pl-[16vw] lg:pr-[12vw] xl:gap-12"
          >
            <div className="project-card w-full lg:w-[48vw] lg:min-w-[48vw] lg:shrink-0">
              <div className="project-info flex h-full flex-col justify-center pr-0 lg:pr-12">
                <p className="mb-5 font-inter text-[9px] font-semibold uppercase tracking-[0.42em] text-foreground/35 sm:text-[10px]">
                  [ Featured Collection ]
                </p>

                <h3 className="font-syne text-[clamp(2.8rem,7vw,6rem)] font-extrabold uppercase leading-[0.9] tracking-[-0.07em] text-foreground">
                  Built For
                  <br />
                  Real Use
                </h3>

                <p className="mt-6 max-w-md font-inter text-sm leading-7 text-foreground/48 md:text-base">
                  From SaaS systems to immersive brand experiences, each project is shaped with
                  clarity, motion sensitivity, and product thinking.
                </p>
              </div>
            </div>

            {projects.map((project) => (
              <article
                key={project.id}
                className="project-card group w-full lg:w-[72vw] lg:min-w-[72vw] lg:shrink-0 xl:w-[68vw] xl:min-w-[68vw]"
              >
                <div className="project-inner grid items-center gap-8 lg:grid-cols-[0.95fr_0.8fr] lg:gap-14 xl:gap-20">
                  <div className="project-image-wrap relative overflow-hidden rounded-[28px] border border-border-custom bg-surface shadow-[0_12px_40px_rgba(0,0,0,0.12)]">
                    <div className="relative aspect-16/11 w-full overflow-hidden">
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover grayscale transition-all duration-700 ease-out group-hover:scale-[1.04] group-hover:grayscale-0"
                        sizes="(max-width: 1024px) 100vw, 52vw"
                        priority={project.id === "01"}
                      />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.12),rgba(0,0,0,0.28))]" />
                      <div className="absolute left-5 top-5 rounded-full border border-white/18 bg-black/18 px-4 py-2 backdrop-blur-md md:left-6 md:top-6">
                        <span className="font-syne text-3xl font-bold uppercase tracking-[-0.05em] text-white md:text-5xl">
                          {project.id}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="project-content min-w-0">
                    <span className="mb-4 block font-inter text-[9px] font-semibold uppercase tracking-[0.42em] text-foreground/34 sm:text-[10px]">
                      {project.category}
                    </span>

                    <h3 className="text-[clamp(2.2rem,5vw,4.8rem)] font-syne font-extrabold uppercase leading-[0.92] tracking-[-0.06em] text-foreground">
                      {project.title}
                    </h3>

                    <p className="mt-5 max-w-136 font-inter text-sm leading-7 text-foreground/58 md:text-base">
                      {project.description}
                    </p>

                    <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
                      {project.live !== "On Progress" ? (
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group/link inline-flex items-center gap-2 border-b border-foreground/18 pb-1 font-syne text-base font-bold uppercase tracking-[-0.02em] text-foreground transition-all duration-300 hover:border-foreground"
                        >
                          Live View
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="transition-transform duration-300 group-hover/link:translate-x-1 group-hover/link:-translate-y-1"
                          >
                            <path
                              d="M1 11L11 1M11 1H3.5M11 1V8.5"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </a>
                      ) : (
                        <span className="inline-flex items-center border-b border-foreground/10 pb-1 font-syne text-base font-bold uppercase tracking-[-0.02em] text-foreground/28 italic">
                          Coming Soon
                        </span>
                      )}

                      <span className="font-syne text-base font-bold uppercase tracking-[-0.02em] text-foreground/22 italic">
                        {project.live !== "On Progress" ? "View Case Study" : "In Progress"}
                      </span>
                    </div>

                    <div className="mt-8 flex flex-wrap gap-3">
                      {project.tech.map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-border-custom px-4 py-2 font-inter text-[9px] font-semibold uppercase tracking-[0.28em] text-foreground/56 transition-colors duration-300 group-hover:border-foreground/28"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            ))}

            <div className="project-card hidden lg:flex lg:w-[18vw] lg:min-w-[18vw] lg:items-center lg:pr-[4vw]">
              <h4 className="font-syne text-2xl font-bold uppercase tracking-[-0.04em] text-foreground/18 italic xl:text-3xl">
                More projects
                <br />
                coming soon...
              </h4>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
