"use client";

import { DURATION_BASE, EASE_STANDARD, gsap } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const projects = [
  {
    id: "01",
    title: "OpScore",
    category: "SaaS Platform",
    description:
      "OpScore is a comprehensive platform for managing and analyzing sports data. It provides a seamless experience for users to track their performance, view statistics, and stay updated with the latest trends.",
    image: "/projects/opscore.png",
    tech: ["Next.js", "PostgreSQL", "TypeScript", "Shadcn/ui", "Gsap"],
    live: "opscore-frontend.vercel.app",
  },
  {
    id: "02",
    title: "Medi Store",
    category: "Fullstack Platform",
    description:
      "A comprehensive e-commerce platform for medical supplies, featuring a robust admin dashboard, secure payment gateway integration, and an intuitive user interface.",
    image: "/projects/eventsphere.png",
    tech: ["Next.js", "PostgreSQL", "TypeScript", "Shadcn/ui"],
    live: "medi-store-frontend-puce.vercel.app",
  },
  {
    id: "03",
    title: "Awwer",
    category: "Gaming Platform",
    description:
      "Awwer is a comprehensive platform for managing and analyzing sports data. It provides a seamless experience for users to track their performance, view statistics, and stay updated with the latest trends.",
    image: "/projects/awwer.png",
    tech: ["React", "JavaScript", "GSAP", "Tailwind"],
    live: "awwer.vercel.app",
  },
  {
    id: "04",
    title: "Velvet-Pour",
    category: "E-Commerce",
    description:
      "A luxury bar retail experience focused on sensory storytelling and minimalist micro-interactions.",
    image: "/projects/velvet-pour.png",
    tech: ["React", "JavaScript", "GSAP"],
    live: "velvet-pour-gamma-nine.vercel.app",
  },
  {
    id: "05",
    title: "MeetAi",
    category: "AI Platform",
    description:
      "MeetAI is a comprehensive platform for managing and analyzing sports data. It provides a seamless experience for users to track their performance, view statistics, and stay updated with the latest trends.",
    image: "/projects/meetai.png",
    tech: ["React", "JavaScript", "GSAP"],
    live: "On Progress",
  },
  {
    id: "06",
    title: "Velvet-Pour",
    category: "E-Commerce",
    description:
      "A luxury bar retail experience focused on sensory storytelling and minimalist micro-interactions.",
    image: "/projects/velvet-pour.png",
    tech: ["React", "JavaScript", "GSAP"],
    live: "velvet-pour-gamma-nine.vercel.app",
  },
];

export default function Projects() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const horizontalRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(true);

  // Check for desktop/mobile for responsive fallback
  useEffect(() => {
    const checkViewport = () => setIsDesktop(window.innerWidth > 1024);
    checkViewport();
    window.addEventListener("resize", checkViewport);
    return () => window.removeEventListener("resize", checkViewport);
  }, []);

  useGSAP(
    () => {
      if (!horizontalRef.current || !triggerRef.current) return;

      const mm = gsap.matchMedia();

      mm.add("(min-width: 1025px)", () => {
        const pinDistance = Math.max(0, horizontalRef.current!.scrollWidth - window.innerWidth);

        if (pinDistance <= 0) return;

        // Master horizontal tween
        const horizontalTween = gsap.to(horizontalRef.current, {
          x: -pinDistance,
          ease: "none",
          scrollTrigger: {
            trigger: triggerRef.current,
            pin: true,
            scrub: 1,
            start: "top top",
            end: () => `+=${pinDistance}`,
            invalidateOnRefresh: true,
            onRefresh: (self) => {
              // Ensure ScrollTrigger is updated if track changes
              if (self.end <= self.start) self.disable();
              else self.enable();
            },
          },
        });

        // Reveal animations for each card, synced to the master horizontal tween
        const cards = gsap.utils.toArray<HTMLElement>(".project-inner");
        cards.forEach((card) => {
          gsap.from(card, {
            scale: 0.95,
            opacity: 0,
            duration: DURATION_BASE,
            ease: EASE_STANDARD,
            scrollTrigger: {
              trigger: card,
              containerAnimation: horizontalTween,
              start: "left 85%",
              toggleActions: "play none none reverse",
            },
          });
        });
      });

      // Mobile fallback: simple vertical reveal
      mm.add("(max-width: 1024px)", () => {
        const cards = gsap.utils.toArray<HTMLElement>(".project-inner");
        cards.forEach((card) => {
          gsap.from(card, {
            y: 50,
            opacity: 0,
            duration: DURATION_BASE,
            ease: EASE_STANDARD,
            scrollTrigger: {
              trigger: card,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          });
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section id="work" ref={sectionRef} className="bg-background">
      <div
        ref={triggerRef}
        className={`${isDesktop ? "h-screen overflow-hidden" : "py-20"} flex items-center border-b border-border-custom`}
      >
        <div
          ref={horizontalRef}
          className={`${isDesktop ? "flex gap-[5vw] px-[10vw]" : "flex flex-col gap-20 px-6"} items-center whitespace-nowrap will-change-transform`}
          style={{ willChange: "transform" }}
        >
          {/* Section Info Card */}
          <div
            className={`${isDesktop ? "min-w-[50vw] shrink-0" : "w-full"} flex flex-col justify-center pr-32 whitespace-normal`}
          >
            <h2 className="text-6xl md:text-[clamp(3.5rem,8vw,7rem)] font-syne font-extrabold uppercase tracking-tighter text-foreground leading-[0.9] mb-12">
              Selected
              <br />
              Works
            </h2>
            <p className="font-inter text-sm md:text-base uppercase tracking-widest text-foreground/40 font-bold max-w-xs leading-relaxed">
              Curated experiments in digital architecture and functional aesthetics.
            </p>
          </div>

          {/* Project Item Cards */}
          {projects.map((project) => (
            <div key={project.id} className={`${isDesktop ? "w-[65vw] shrink-0" : "w-full"} group`}>
              <div className="project-inner flex flex-col md:flex-row items-center gap-12 md:gap-24 whitespace-normal">
                <div className="w-full md:w-[60%] aspect-16/10 bg-surface border border-border-custom relative overflow-hidden group-hover:border-foreground transition-colors duration-500">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover grayscale hover:grayscale-0 hover:scale-105 transition-all duration-700 ease-out"
                    sizes="(max-width: 768px) 100vw, 60vw"
                  />
                  <div className="absolute top-8 left-8 mix-blend-difference text-white font-syne font-bold text-6xl">
                    {project.id}
                  </div>
                </div>

                <div className="w-full md:flex-1 min-w-0">
                  <span className="font-inter text-[10px] font-bold uppercase tracking-[0.5em] text-foreground/30 mb-4 block">
                    {project.category}
                  </span>
                  <h3 className="text-5xl md:text-[clamp(2rem,4.5vw,4.5rem)] font-syne font-extrabold uppercase tracking-tighter text-foreground mb-6 wrap-break-word">
                    {project.title}
                  </h3>
                  <p className="text-lg font-inter text-foreground/60 leading-relaxed max-w-sm mb-10">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {project.tech.map((t) => (
                      <span
                        key={t}
                        className="px-4 py-1.5 border border-border-custom font-inter text-[9px] font-bold uppercase tracking-widest group-hover:border-foreground/40 transition-colors"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Outro Text */}
          {isDesktop && (
            <div className="w-[20vw] flex items-center pr-32">
              <h4 className="text-2xl font-syne font-bold uppercase tracking-tighter text-foreground/20 italic">
                More projects coming soon...
              </h4>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
