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
  const titleWrapRef = useRef<HTMLDivElement>(null);
  const taglineWrapRef = useRef<HTMLDivElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const parallaxCircleRef = useRef<HTMLDivElement>(null);
  const parallaxSquareRef = useRef<HTMLDivElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);
  const availabilityRef = useRef<HTMLDivElement>(null);

  const xTo = useRef<((value: number) => void) | null>(null);
  const yTo = useRef<((value: number) => void) | null>(null);

  useGSAP(
    () => {
      if (
        !container.current ||
        !titleWrapRef.current ||
        !taglineWrapRef.current ||
        !lensRef.current ||
        !parallaxCircleRef.current ||
        !parallaxSquareRef.current ||
        !scrollCueRef.current ||
        !availabilityRef.current
      ) {
        return;
      }

      const reduced = isReducedMotion();

      const titleLines = gsap.utils.toArray<HTMLElement>(".hero-title-line");
      const titleWords = gsap.utils.toArray<HTMLElement>(".hero-title-word");
      const introItems = gsap.utils.toArray<HTMLElement>(".hero-intro");
      const metaItems = gsap.utils.toArray<HTMLElement>(".hero-meta");
      const taglineItems = gsap.utils.toArray<HTMLElement>(".tagline-item");

      gsap.set(titleLines, { overflow: "hidden" });
      gsap.set(titleWords, { yPercent: 110, opacity: 0 });
      gsap.set(introItems, { y: 28, opacity: 0 });
      gsap.set(metaItems, { y: 22, opacity: 0 });
      gsap.set(taglineItems, { opacity: 0 });

      if (!reduced) {
        gsap.set(lensRef.current, {
          opacity: 0,
          scale: 0.72,
          xPercent: -50,
          yPercent: -50,
        });
      } else {
        gsap.set(lensRef.current, { display: "none" });
      }

      const introTl = gsap.timeline({ defaults: { ease: EASE_STANDARD } });

      introTl
        .to(introItems, {
          y: 0,
          opacity: 1,
          duration: 0.75,
          stagger: 0.06,
        })
        .to(
          titleWords,
          {
            yPercent: 0,
            opacity: 1,
            duration: 1.15,
            stagger: 0.08,
            ease: "power4.out",
          },
          "-=0.35"
        )
        .to(
          metaItems,
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.08,
            ease: "power3.out",
          },
          "-=0.65"
        );

      if (!reduced && taglineItems.length > 0) {
        const taglineTl = gsap.timeline({ repeat: -1, repeatDelay: 0.15 });

        taglineItems.forEach((item) => {
          const words = item.querySelectorAll(".tagline-word");

          gsap.set(words, { y: 18, opacity: 0 });

          taglineTl
            .set(item, { opacity: 1 })
            .to(words, {
              y: 0,
              opacity: 1,
              stagger: 0.045,
              duration: 0.72,
              ease: "power3.out",
            })
            .to(
              words,
              {
                y: -14,
                opacity: 0,
                stagger: 0.025,
                duration: 0.5,
                ease: "power2.in",
              },
              "+=2.1"
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
          duration: 1.4,
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
    },
    { scope: container }
  );

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (e.pointerType === "touch" || isReducedMotion()) return;
    if (!container.current || !xTo.current || !yTo.current) return;

    const rect = container.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    xTo.current(x);
    yTo.current(y);
  }, []);

  const handlePointerEnter = useCallback(() => {
    if (isReducedMotion() || !lensRef.current) return;

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
      scale: 0.72,
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
      className="relative flex min-h-screen items-center overflow-hidden border-b border-border-custom bg-background px-[6vw] pb-20 pt-32"
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      {!isReducedMotion() && (
        <div
          ref={lensRef}
          className="pointer-events-none absolute left-0 top-0 z-30 h-56 w-56 overflow-hidden rounded-full border border-foreground/10 shadow-[0_24px_80px_rgba(0,0,0,0.18)]"
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
          <div className="absolute inset-0 border border-white/15 rounded-full" />
        </div>
      )}

      <div
        ref={parallaxCircleRef}
        className="pointer-events-none absolute right-[10%] top-[18%] z-0 h-56 w-56 rounded-full border border-foreground/6"
      />

      <div
        ref={parallaxSquareRef}
        className="pointer-events-none absolute bottom-[14%] left-[7%] z-0 h-40 w-40 rotate-12 border border-foreground/6"
      />

      <div className="relative z-10 mx-auto w-full max-w-screen-2xl">
        <div
          ref={availabilityRef}
          className="hero-intro mb-10 inline-flex items-center border border-foreground/18 px-4 py-2"
        >
          <span className="font-inter text-[10px] font-bold uppercase tracking-[0.45em] text-foreground/78">
            Available for Freelance — 2026
          </span>
        </div>

        <div ref={titleWrapRef}>
          {titleLines.map((line, lineIndex) => (
            <div key={lineIndex} className="hero-title-line leading-none">
              <div className="flex flex-wrap items-end gap-x-5">
                {line.map((word, wordIndex) => (
                  <span
                    key={`${lineIndex}-${wordIndex}`}
                    className="hero-title-word font-syne text-[clamp(3.2rem,11vw,11rem)] font-extrabold uppercase tracking-[-0.08em] text-foreground leading-[0.82]"
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 flex flex-col justify-between gap-14 md:mt-24 md:flex-row md:items-end">
          <div className="max-w-[760px]">
            <div className="hero-meta text-[clamp(1.9rem,3vw,3.4rem)] font-inter font-medium uppercase leading-[1.02] tracking-[-0.04em] text-foreground">
              Creative Web Developer
            </div>

            <div
              ref={taglineWrapRef}
              className="hero-meta relative mt-4 h-[1.3em] overflow-hidden text-[clamp(1.6rem,2.4vw,2.8rem)] font-inter font-normal leading-[1.05] tracking-[-0.03em] text-foreground/42"
            >
              {rotatingTaglines.map((phrase, index) => (
                <div
                  key={index}
                  className="tagline-item absolute left-0 top-0 flex flex-wrap gap-x-2"
                >
                  {phrase.split(" ").map((word, wordIndex) => (
                    <span key={wordIndex} className="tagline-word inline-block">
                      {word}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-start gap-8 md:items-end">
            <div className="hero-meta flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
              <span className="h-1.5 w-1.5 rounded-full bg-foreground/45" />
              <span className="h-1.5 w-1.5 rounded-full bg-foreground/18" />
            </div>

            <div className="hero-meta flex flex-col items-start md:items-end">
              <span className="font-inter text-[10px] font-bold uppercase tracking-[0.38em] text-foreground/36">
                Scroll to Explore
              </span>

              <div
                ref={scrollCueRef}
                className="mt-4 flex h-14 w-14 items-center justify-center rounded-full border border-foreground/14"
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
