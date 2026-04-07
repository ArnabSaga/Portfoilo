"use client";

import { useGSAP } from "@gsap/react";
import { gsap, EASE_STANDARD, DURATION_BASE, isReducedMotion } from "@/lib/gsap";
import { useRef, useCallback } from "react";

export default function Hero() {
  const container = useRef<HTMLDivElement>(null);
  const titleAreaRef = useRef<HTMLHeadingElement>(null);
  const parallaxRef1 = useRef<HTMLDivElement>(null);
  const parallaxRef2 = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);

  // Setup quickTo for smooth performance
  const xTo = useRef<((v: number) => void) | null>(null);
  const yTo = useRef<((v: number) => void) | null>(null);

  useGSAP((ctx) => {
    // Initial intro animation
    const tl = gsap.timeline();

    gsap.set(".reveal", { y: "100%" });

    tl.to(".reveal", {
      y: "0%",
      stagger: 0.1,
      duration: 1.2,
      ease: EASE_STANDARD,
    })
    .from(".sub-reveal", {
      opacity: 0,
      y: 30,
      duration: DURATION_BASE,
      ease: "power3.out",
    }, "-=0.8");

    // Tagline Rotation Animation
    const taglines = gsap.utils.toArray<HTMLElement>(".tagline-item");
    if (taglines.length > 0 && !isReducedMotion()) {
      const taglineTl = gsap.timeline({ repeat: -1 });

      taglines.forEach((item) => {
        const words = item.querySelectorAll(".tagline-word");
        
        taglineTl.to(item, { opacity: 1, pointerEvents: "auto", duration: 0 })
        .to(words, {
          y: 0,
          opacity: 1,
          stagger: 0.05,
          duration: 0.8,
          ease: "expo.out"
        })
        .to(words, {
          y: -20,
          opacity: 0,
          stagger: 0.02,
          duration: 0.6,
          ease: "power2.in",
          delay: 3
        })
        .to(item, { opacity: 0, pointerEvents: "none", duration: 0 });
      });
    } else if (taglines.length > 0) {
      gsap.set(taglines[0], { opacity: 1 });
      gsap.set(taglines[0].querySelectorAll(".tagline-word"), { opacity: 1, y: 0 });
    }

    // Parallax background items - only on desktop and if motion is not reduced
    if (!isReducedMotion()) {
      gsap.to(parallaxRef1.current, {
        y: -150,
        rotate: 30,
        scrollTrigger: {
          trigger: container.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        }
      });

      gsap.to(parallaxRef2.current, {
        y: 100,
        rotate: -10,
        scrollTrigger: {
          trigger: container.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        }
      });
    }

    // Initialize quickTo
    if (lensRef.current) {
      xTo.current = gsap.quickTo(lensRef.current, "x", { duration: 0.6, ease: "power3" });
      yTo.current = gsap.quickTo(lensRef.current, "y", { duration: 0.6, ease: "power3" });
    }

    return () => ctx.revert();
  }, { scope: container });

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    // Skip if on touch or reduced motion
    if (e.pointerType === "touch" || isReducedMotion()) return;

    const rect = container.current?.getBoundingClientRect();
    if (!rect || !xTo.current || !yTo.current) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    xTo.current(x);
    yTo.current(y);
  }, []);

  const handleMouseEnter = () => {
    if (isReducedMotion()) return;
    gsap.to(lensRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: EASE_STANDARD
    });
    videoRef.current?.play().catch(() => {}); // Catch play() interruption
  };

  const handleMouseLeave = () => {
    gsap.to(lensRef.current, {
        opacity: 0,
        scale: 0.5,
        duration: 0.5,
        ease: EASE_STANDARD
    });
    videoRef.current?.pause();
  };

  const words = [
    { text: "Achyuta", delay: 0 },
    { text: "Arnab", delay: 0.1 },
    { text: "Dey", delay: 0.2 },
  ];

  return (
    <section ref={container} className="min-h-screen flex flex-col justify-center px-[6vw] pt-32 pb-20 border-b border-border-custom relative overflow-hidden bg-background">
      {/* Video Lens Follower */}
      <div
        ref={lensRef}
        className="absolute top-0 left-0 w-64 h-64 pointer-events-none z-20 overflow-hidden rounded-full border border-foreground/10 opacity-0 scale-50 -translate-x-1/2 -translate-y-1/2 shadow-2xl origin-center"
      >
        <video
          ref={videoRef}
          src="/video/Project_showcase_video_202604070031.mp4"
          muted
          loop
          playsInline
          className="absolute top-1/2 left-1/2 min-w-full min-h-full object-cover -translate-x-1/2 -translate-y-1/2"
        />
        <div className="absolute inset-0 bg-foreground/10 mix-blend-overlay" />
      </div>

      {/* Parallax Elements */}
      <div
        ref={parallaxRef1}
        className="absolute top-[15%] right-[12%] w-64 h-64 border border-foreground/5 rounded-full pointer-events-none z-0"
      />
      <div
        ref={parallaxRef2}
        className="absolute bottom-[15%] left-[8%] w-48 h-48 border border-foreground/5 pointer-events-none z-0 rotate-12"
      />

      <div className="max-w-screen-2xl mx-auto w-full relative z-10">
        <div className="mb-12">
          <span className="sub-reveal inline-block font-inter text-[10px] uppercase tracking-[0.5em] font-bold py-1.5 px-4 border border-foreground mb-4">
            Available for Freelance — 2026
          </span>
        </div>

        <h1
          ref={titleAreaRef}
          className="flex flex-col gap-0 select-none cursor-default"
          onPointerMove={handlePointerMove}
          onPointerEnter={handleMouseEnter}
          onPointerLeave={handleMouseLeave}
        >
          {words.map((word, i) => (
            <div key={i} className="overflow-hidden w-full">
              <span className="reveal flex flex-nowrap whitespace-nowrap gap-0 pr-6">
                {word.text.split("").map((char, charIdx) => (
                  <span
                    key={charIdx}
                    className="block text-[clamp(2.4rem,11vw,10rem)] font-syne font-extrabold leading-[0.8] tracking-tighter uppercase text-foreground hover:text-foreground/20 transition-colors duration-300"
                  >
                    {char}
                  </span>
                ))}
              </span>
            </div>
          ))}
        </h1>

        <div className="mt-20 flex flex-col md:flex-row md:items-end justify-between gap-12">
          <div className="sub-reveal max-w-2xl">
            <div className="text-2xl md:text-3xl lg:text-4xl font-inter font-medium leading-[1.1] text-foreground uppercase tracking-tight">
              <span className="block mb-2">Creative Web Developer</span>
              <div className="relative h-[1.2em] overflow-hidden text-foreground/40 font-normal normal-case">
                {[
                  "Crafting high-end digital experiences",
                  "With architectural precision.",
                  "Building scalable web architectures."
                ].map((phrase, i) => (
                  <div 
                    key={i} 
                    className="tagline-item absolute top-0 left-0 flex flex-wrap gap-x-2 opacity-0 select-none pointer-events-none"
                  >
                    {phrase.split(" ").map((word, j) => (
                      <span key={j} className="inline-block translate-y-4 opacity-0 tagline-word">
                        {word}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="sub-reveal flex flex-col items-end gap-6">
            <div className="flex gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-foreground" />
                <div className="w-1.5 h-1.5 rounded-full bg-foreground/40" />
                <div className="w-1.5 h-1.5 rounded-full bg-foreground/20" />
            </div>
            <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">Scroll to Explore</span>
                <div className="w-12 h-12 mt-4 rounded-full border border-foreground/20 flex items-center justify-center animate-bounce">
                <svg width="12" height="12" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.5 2V13M7.5 13L2.5 8M7.5 13L12.5 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"/>
                </svg>
                </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
