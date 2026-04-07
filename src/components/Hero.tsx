"use client";

import { EASE_STANDARD, gsap, isReducedMotion } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";
import { useCallback, useRef } from "react";

const rotatingTaglines = [
  "Crafting high-end digital experiences",
  "With architectural precision",
  "Building scalable web architectures",
];

export default function Hero() {
  const container = useRef<HTMLElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const parallaxCircleRef = useRef<HTMLDivElement>(null);
  const parallaxSquareRef = useRef<HTMLDivElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);

  const xTo = useRef<((value: number) => void) | null>(null);
  const yTo = useRef<((value: number) => void) | null>(null);

  useGSAP(
    () => {
      if (
        !container.current ||
        !lensRef.current ||
        !parallaxCircleRef.current ||
        !parallaxSquareRef.current ||
        !scrollCueRef.current
      ) {
        return;
      }

      const reduced = isReducedMotion();
      const mm = gsap.matchMedia();

      const titleWords = gsap.utils.toArray<HTMLElement>(".hero-title-word");
      const introItems = gsap.utils.toArray<HTMLElement>(".hero-intro");
      const metaItems = gsap.utils.toArray<HTMLElement>(".hero-meta");
      const taglineItems = gsap.utils.toArray<HTMLElement>(".tagline-item");

      gsap.set(titleWords, { yPercent: 110, opacity: 0 });
      gsap.set(introItems, { y: 24, opacity: 0 });
      gsap.set(metaItems, { y: 20, opacity: 0 });
      gsap.set(taglineItems, { opacity: 0 });

      if (!reduced) {
        gsap.set(lensRef.current, {
          opacity: 0,
          scale: 0.76,
          xPercent: -50,
          yPercent: -50,
        });
      } else {
        gsap.set(lensRef.current, { display: "none" });
      }

      const introTl = gsap.timeline({
        defaults: { ease: EASE_STANDARD },
      });

      introTl
        .to(introItems, {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.06,
        })
        .to(
          titleWords,
          {
            yPercent: 0,
            opacity: 1,
            duration: 1.05,
            stagger: 0.08,
            ease: "power4.out",
          },
          "-=0.3"
        )
        .to(
          metaItems,
          {
            y: 0,
            opacity: 1,
            duration: 0.75,
            stagger: 0.08,
            ease: "power3.out",
          },
          "-=0.65"
        );

      if (!reduced && taglineItems.length > 0) {
        const taglineTl = gsap.timeline({ repeat: -1, repeatDelay: 0.2 });

        taglineItems.forEach((item) => {
          const words = item.querySelectorAll(".tagline-word");
          gsap.set(words, { y: 16, opacity: 0 });

          taglineTl
            .set(item, { opacity: 1 })
            .to(words, {
              y: 0,
              opacity: 1,
              stagger: 0.04,
              duration: 0.65,
              ease: "power3.out",
            })
            .to(
              words,
              {
                y: -12,
                opacity: 0,
                stagger: 0.02,
                duration: 0.45,
                ease: "power2.in",
              },
              "+=2"
            )
            .set(item, { opacity: 0 });
        });
      } else if (taglineItems.length > 0) {
        gsap.set(taglineItems[0], { opacity: 1 });
        gsap.set(taglineItems[0].querySelectorAll(".tagline-word"), {
          y: 0,
          opacity: 1,
        });
      }

      mm.add("(min-width: 1025px)", () => {
        if (!reduced) {
          gsap.to(parallaxCircleRef.current, {
            yPercent: -14,
            rotate: 12,
            ease: "none",
            scrollTrigger: {
              trigger: container.current,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          });

          gsap.to(parallaxSquareRef.current, {
            yPercent: 10,
            rotate: -10,
            ease: "none",
            scrollTrigger: {
              trigger: container.current,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          });

          gsap.to(scrollCueRef.current, {
            y: 8,
            repeat: -1,
            yoyo: true,
            duration: 1.5,
            ease: "sine.inOut",
          });

          xTo.current = gsap.quickTo(lensRef.current, "x", {
            duration: 0.45,
            ease: "power3.out",
          });

          yTo.current = gsap.quickTo(lensRef.current, "y", {
            duration: 0.45,
            ease: "power3.out",
          });
        }
      });

      mm.add("(max-width: 1024px)", () => {
        gsap.to(scrollCueRef.current, {
          y: 6,
          repeat: -1,
          yoyo: true,
          duration: 1.6,
          ease: "sine.inOut",
        });

        gsap.to(parallaxCircleRef.current, {
          yPercent: -6,
          ease: "none",
          scrollTrigger: {
            trigger: container.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });

        gsap.to(parallaxSquareRef.current, {
          yPercent: 5,
          ease: "none",
          scrollTrigger: {
            trigger: container.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      return () => mm.revert();
    },
    { scope: container }
  );

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || isReducedMotion()) return;
    if (!container.current || !xTo.current || !yTo.current) return;
    if (window.innerWidth < 1025) return;

    const rect = container.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    xTo.current(x);
    yTo.current(y);
  }, []);

  const handlePointerEnter = useCallback(() => {
    if (isReducedMotion() || !lensRef.current) return;
    if (window.innerWidth < 1025) return;

    gsap.to(lensRef.current, {
      opacity: 1,
      scale: 1,
      duration: 0.45,
      ease: "power3.out",
    });

    videoRef.current?.play().catch(() => {});
  }, []);

  const handlePointerLeave = useCallback(() => {
    if (!lensRef.current) return;

    gsap.to(lensRef.current, {
      opacity: 0,
      scale: 0.76,
      duration: 0.4,
      ease: "power3.out",
    });

    videoRef.current?.pause();
  }, []);

  const titleLines = [["Achyuta"], ["Arnab"], ["Dey"]];

  return (
    <section
      id="hero"
      ref={container}
      className="relative flex min-h-screen items-center overflow-hidden border-b border-border-custom bg-background px-4 pb-16 pt-28 sm:px-6 sm:pb-18 sm:pt-32 md:px-[6vw] md:pb-20 md:pt-36"
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      {!isReducedMotion() && (
        <div
          ref={lensRef}
          className="pointer-events-none absolute left-0 top-0 z-30 hidden h-44 w-44 overflow-hidden rounded-full border border-foreground/10 shadow-[0_24px_80px_rgba(0,0,0,0.18)] lg:block xl:h-52 xl:w-52 2xl:h-56 2xl:w-56"
        >
          <video
            ref={videoRef}
            src="/video/Project_showcase_video_202604070031.mp4"
            muted
            loop
            playsInline
            className="absolute left-1/2 top-1/2 min-h-full min-w-full -translate-x-1/2 -translate-y-1/2 object-cover"
          />
          <div className="absolute inset-0 bg-foreground/10 mix-blend-overlay" />
          <div className="absolute inset-0 rounded-full border border-white/15" />
        </div>
      )}

      <div
        ref={parallaxCircleRef}
        className="pointer-events-none absolute right-[6%] top-[12%] z-0 h-24 w-24 rounded-full border border-foreground/6 sm:h-32 sm:w-32 md:h-40 md:w-40 xl:h-56 xl:w-56"
      />

      <div
        ref={parallaxSquareRef}
        className="pointer-events-none absolute bottom-[12%] left-[4%] z-0 h-20 w-20 rotate-12 border border-foreground/6 sm:h-24 sm:w-24 md:h-28 md:w-28 xl:h-40 xl:w-40"
      />

      <div className="relative z-10 mx-auto w-full max-w-screen-2xl">
        <div className="hero-intro mb-8 inline-flex items-center border border-foreground/18 px-3 py-2 sm:px-4">
          <span className="font-inter text-[9px] font-bold uppercase tracking-[0.38em] text-foreground/78 sm:text-[10px] sm:tracking-[0.45em]">
            Available for Freelance — 2026
          </span>
        </div>

        <div>
          {titleLines.map((line, lineIndex) => (
            <div key={lineIndex} className="leading-none">
              <div className="flex flex-wrap items-end gap-x-4 sm:gap-x-5">
                {line.map((word, wordIndex) => (
                  <span
                    key={`${lineIndex}-${wordIndex}`}
                    className="hero-title-word whitespace-nowrap font-syne text-[clamp(3rem,13vw,11rem)] font-extrabold uppercase leading-[0.82] tracking-[-0.08em] text-foreground"
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-10 sm:mt-14 md:mt-16 md:gap-12 lg:mt-20 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[760px]">
            <div className="hero-meta text-[clamp(1.35rem,4.8vw,3.4rem)] font-inter font-medium uppercase leading-[1.04] tracking-[-0.04em] text-foreground">
              Creative Web Developer
            </div>

            <div className="hero-meta relative mt-3 h-[2.5em] overflow-hidden text-[clamp(1.05rem,3.6vw,2.8rem)] font-inter font-normal leading-[1.08] tracking-[-0.03em] text-foreground/42 sm:mt-4 sm:h-[1.35em]">
              {rotatingTaglines.map((phrase, index) => (
                <div
                  key={index}
                  className="tagline-item absolute left-0 top-0 flex max-w-[18ch] flex-wrap gap-x-2 sm:max-w-none"
                >
                  {phrase.split(" ").map((word, wordIndex) => (
                    <span key={wordIndex} className="tagline-word inline-block whitespace-nowrap">
                      {word}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-start gap-6 sm:gap-7 lg:items-end lg:gap-8">
            <div className="hero-meta flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
              <span className="h-1.5 w-1.5 rounded-full bg-foreground/45" />
              <span className="h-1.5 w-1.5 rounded-full bg-foreground/18" />
            </div>

            <div className="hero-meta flex flex-col items-start lg:items-end">
              <span className="font-inter text-[9px] font-bold uppercase tracking-[0.34em] text-foreground/36 sm:text-[10px] sm:tracking-[0.38em]">
                Scroll to Explore
              </span>

              <div
                ref={scrollCueRef}
                className="mt-3 flex h-12 w-12 items-center justify-center rounded-full border border-foreground/14 sm:mt-4 sm:h-14 sm:w-14"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.5 2V13M7.5 13L2.5 8M7.5 13L12.5 8"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="square"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
