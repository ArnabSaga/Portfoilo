"use client";

import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useGSAP } from "@gsap/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

// ─── Constants ───────────────────────────────────────────────────────────────

const SESSION_KEY = "portfolio-entry-seen";
const CONTENT_ID = "portfolio-content";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function checkEligibility(): boolean {
  // Dev override: ?intro=1 forces replay regardless of session
  if (new URLSearchParams(window.location.search).get("intro") === "1") {
    return true;
  }
  // Already played this session
  if (sessionStorage.getItem(SESSION_KEY)) return false;
  // Deep-link — never block intentional hash navigation
  const hash = window.location.hash;
  if (hash && hash !== "#") return false;
  return true;
}

function lockScroll(): void {
  document.documentElement.setAttribute("data-entry-active", "true");
  document.getElementById(CONTENT_ID)?.setAttribute("aria-hidden", "true");
}

function unlockScroll(): void {
  document.documentElement.removeAttribute("data-entry-active");
  document.getElementById(CONTENT_ID)?.removeAttribute("aria-hidden");
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function PortfolioEntry() {
  const reducedMotion = useReducedMotion();

  const [eligible, setEligible] = useState(false);
  const [visible, setVisible] = useState(true);

  // ── Refs ──────────────────────────────────────────────────────────────────
  const containerRef    = useRef<HTMLDivElement>(null);
  const leftShutterRef  = useRef<HTMLDivElement>(null);
  const rightShutterRef = useRef<HTMLDivElement>(null);
  const topRuleRef      = useRef<HTMLDivElement>(null);
  const bottomRuleRef   = useRef<HTMLDivElement>(null);
  const spineRef        = useRef<HTMLDivElement>(null);
  const monogramRef     = useRef<HTMLDivElement>(null);
  const achyutaRef      = useRef<HTMLDivElement>(null);
  const arnabRef        = useRef<HTMLDivElement>(null);
  const deyRef          = useRef<HTMLDivElement>(null);
  const metaLeftRef     = useRef<HTMLDivElement>(null);
  const metaRightRef    = useRef<HTMLDivElement>(null);
  const skipBtnRef      = useRef<HTMLButtonElement>(null);
  const timelineRef     = useRef<gsap.core.Timeline | null>(null);

  useLayoutEffect(() => {
    if (reducedMotion) return;
    if (checkEligibility()) setEligible(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!eligible) return;
    lockScroll();
    containerRef.current?.focus();

    return () => {
      unlockScroll();
    };
  }, [eligible]);

  const finalize = () => {
    unlockScroll();
    sessionStorage.setItem(SESSION_KEY, "1");
    setVisible(false);
    window.requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
  };

  const handleSkip = () => {
    const tl = timelineRef.current;
    if (tl) {
      tl.kill();
      timelineRef.current = null;
    }

    if (!containerRef.current) {
      finalize();
      return;
    }

    gsap.to(containerRef.current, {
      opacity: 0,
      duration: 0.35,
      ease: "power2.out",
      onComplete: finalize,
    });
  };

  useGSAP(() => {
    if (!eligible || !containerRef.current) return;

    gsap.set(topRuleRef.current,    { scaleX: 0,       transformOrigin: "left center" });
    gsap.set(bottomRuleRef.current, { scaleX: 0,       transformOrigin: "left center" });
    gsap.set(spineRef.current,      { scaleY: 0,       transformOrigin: "top center"  });
    gsap.set(monogramRef.current,   { opacity: 0, y: 8 });
    gsap.set(achyutaRef.current,    { x: "-8vw",  opacity: 0 });
    gsap.set(arnabRef.current,      { y: 44,      opacity: 0 });
    gsap.set(deyRef.current,        { x: "8vw",   opacity: 0 });
    gsap.set(metaLeftRef.current,   { opacity: 0, y: 6  });
    gsap.set(metaRightRef.current,  { opacity: 0, y: 6  });
    gsap.set(skipBtnRef.current,    { opacity: 0 });

    const enter  = "expo.out";
    const smooth = "power3.out";
    const out    = "power2.in";

    const tl = gsap.timeline({
      onComplete() {
        // Container fade: ends at 4.30 + 0.30 = 4.60s total
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 0.5,
          ease: "power2.inOut",
          onComplete: finalize,
        });
      },
    });

    timelineRef.current = tl;

    // ── 0.20 – 0.90  Structural assembly ────────────────────────────────────
    tl.to(topRuleRef.current,    { scaleX: 1, duration: 0.70, ease: smooth }, 0.20);
    tl.to(bottomRuleRef.current, { scaleX: 1, duration: 0.70, ease: smooth }, 0.30);
    tl.to(spineRef.current,      { scaleY: 1, duration: 0.75, ease: enter  }, 0.30);

    // ── 0.55 – 1.05  AAD identity seed ──────────────────────────────────────
    tl.to(monogramRef.current, { opacity: 1, y: 0, duration: 0.6, ease: enter }, 0.55);

    // ── 0.85 – 1.70  Name reveal ─────────────────────────────────────────────
    tl.to(achyutaRef.current, { x: 0, opacity: 1, duration: 0.85, ease: enter }, 0.85);
    tl.to(arnabRef.current,   { y: 0, opacity: 1, duration: 0.85, ease: enter }, 1.00);
    tl.to(deyRef.current,     { x: 0, opacity: 1, duration: 0.85, ease: enter }, 1.15);

    // ── 1.50          AAD monogram fades as full name is present ─────────────
    tl.to(monogramRef.current, { opacity: 0, duration: 0.40, ease: out }, 1.50);

    // ── 1.55 – 2.20  Micro metadata settles ──────────────────────────────────
    tl.to(metaLeftRef.current,  { opacity: 1, y: 0, duration: 0.6, ease: smooth }, 1.55);
    tl.to(metaRightRef.current, { opacity: 1, y: 0, duration: 0.6, ease: smooth }, 1.65);

    // ── 1.00          Skip button appears (quiet, not distracting) ────────────
    tl.to(skipBtnRef.current, { opacity: 1, duration: 0.5 }, 1.0);

    // ── 2.15 – 2.80  IDENTITY LOCK — intentional still moment ────────────────
    //   (no tweens in this window — everything holds)

    // ── 2.80 – 3.20  Structural consolidation / spine pulse ──────────────────
    tl.to(spineRef.current, { opacity: 0.25, duration: 0.22, ease: "power2.inOut" }, 2.80);
    tl.to(spineRef.current, { opacity: 1,    duration: 0.22, ease: "power2.out"   }, 3.02);

    // ── 3.15 – 3.55  Pre-exit: content fades out ─────────────────────────────
    tl.to(
      [
        achyutaRef.current, arnabRef.current, deyRef.current,
        metaLeftRef.current, metaRightRef.current,
        spineRef.current, topRuleRef.current, bottomRuleRef.current,
      ],
      { opacity: 0, duration: 0.45, ease: out },
      3.15,
    );

    // ── 3.35 – 4.30  Shutter exit — left/right panels open ───────────────────
    //   xPercent: ±100 = ±(element's own width = 50vw) → fully off-screen
    tl.to(leftShutterRef.current,  { xPercent: -100, duration: 0.95, ease: "expo.inOut" }, 3.35);
    tl.to(rightShutterRef.current, { xPercent:  100, duration: 0.95, ease: "expo.inOut" }, 3.35);
    // Timeline ends at 4.30s → onComplete → 0.30s container fade → 4.60s total

    return () => { tl.kill(); };
  }, { scope: containerRef, dependencies: [eligible] });

  // ── Render ────────────────────────────────────────────────────────────────
  if (!eligible || !visible) return null;

  const nameClass =
    "font-syne text-[clamp(3.2rem,10vw,10rem)] font-extrabold uppercase leading-[0.84] tracking-[-0.04em] text-inverse";
  const labelClass =
    "font-inter text-[0.625rem] font-bold uppercase tracking-[0.28em] text-inverse/50";

  return (
    <>
      {/* ── Cinematic overlay ─────────────────────────────────────────────── */}
      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Portfolio entry sequence"
        tabIndex={-1}
        className="fixed inset-0 z-[200] overflow-hidden focus:outline-none"
      >
        {/* Shutters — dark panels that slide away to reveal Hero */}
        <div
          ref={leftShutterRef}
          aria-hidden="true"
          className="absolute inset-y-0 left-0 w-1/2 bg-section-dark"
        />
        <div
          ref={rightShutterRef}
          aria-hidden="true"
          className="absolute inset-y-0 right-0 w-1/2 bg-section-dark"
        />

        {/* Content layer — lives above both shutters */}
        <div
          aria-hidden="true"
          className="pointer-events-none relative z-10 flex h-full flex-col px-6 py-6 sm:px-10 sm:py-8 min-[1025px]:px-14 min-[1025px]:py-10"
        >
          {/* Top bar */}
          <div className="flex items-center justify-between">
            <span className={labelClass}>Portfolio / Entry</span>
            <span className={labelClass}>Portfolio / 2026</span>
          </div>

          {/* Top structural rule */}
          <div ref={topRuleRef} className="mt-4 h-px w-full bg-inverse/15" />

          {/* Center — identity composition */}
          <div className="relative flex flex-1 items-center">
            {/* Vertical spine */}
            <div
              ref={spineRef}
              aria-hidden="true"
              className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-inverse/12"
            />

            {/* AAD monogram — appears briefly before full name */}
            <div
              ref={monogramRef}
              className="absolute left-1/2 top-[15%] -translate-x-1/2 text-center"
            >
              <p className="font-inter text-[0.6rem] font-bold uppercase tracking-[0.6em] text-inverse/55">
                A&nbsp;&nbsp;A&nbsp;&nbsp;D
              </p>
            </div>

            {/* Name block */}
            <div className="w-full py-4">
              {/* ACHYUTA — enters from left */}
              <div ref={achyutaRef}>
                <p className={nameClass}>ACHYUTA</p>
              </div>
              {/* ARNAB — rises from below, offset right for staircase rhythm */}
              <div ref={arnabRef} className="pl-[10%] min-[1025px]:pl-[16%]">
                <p className={nameClass}>ARNAB</p>
              </div>
              {/* DEY — enters from right, furthest offset */}
              <div ref={deyRef} className="pl-[24%] min-[1025px]:pl-[34%]">
                <p className={nameClass}>DEY</p>
              </div>
            </div>
          </div>

          {/* Bottom structural rule */}
          <div ref={bottomRuleRef} className="h-px w-full bg-inverse/15" />

          {/* Bottom bar */}
          <div className="mt-4 flex items-center justify-between">
            <div ref={metaLeftRef}>
              <span className={labelClass}>Creative Web Developer</span>
            </div>
            <div ref={metaRightRef}>
              <span className={labelClass}>Architectural Systems</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Skip Intro button — outside dialog so it's always reachable ─── */}
      <button
        ref={skipBtnRef}
        type="button"
        onClick={handleSkip}
        className={[
          "fixed bottom-6 right-6 z-[201]",
          "font-inter text-[0.625rem] font-bold uppercase tracking-[0.24em]",
          "text-inverse/40 transition-colors duration-300 hover:text-inverse/90",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inverse/60",
          "rounded-none", // intentionally no border-radius — architectural
        ].join(" ")}
        aria-label="Skip intro animation"
      >
        Skip Intro
      </button>
    </>
  );
}
