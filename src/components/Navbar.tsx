"use client";

import { gsap } from "@/lib/gsap";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

type CtaState = "idle" | "waiting" | "angry" | "happy" | "clicked";

const navLinks = [
  { href: "#hero", label: "Home" },
  { href: "#work", label: "Work" },
  { href: "#stack", label: "Stack" },
  { href: "#experience", label: "Experience" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const desktopMenuRef = useRef<HTMLDivElement>(null);
  const resumeWrapRef = useRef<HTMLDivElement>(null);
  const resumeBtnRef = useRef<HTMLButtonElement>(null);
  const mobilePanelRef = useRef<HTMLDivElement>(null);
  const mobileMenuBtnRef = useRef<HTMLButtonElement>(null);

  const danceTweenRef = useRef<gsap.core.Tween | null>(null);
  const pulseTweenRef = useRef<gsap.core.Tween | null>(null);
  const angerTweenRef = useRef<gsap.core.Timeline | null>(null);

  const waitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const angryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const happyDanceTweenRef = useRef<gsap.core.Tween | null>(null);

  const ctaStateRef = useRef<CtaState>("idle");

  const [ctaState, setCtaState] = useState<CtaState>("idle");
  const [ctaText, setCtaText] = useState("Resume");
  const [menuOpen, setMenuOpen] = useState(false);

  const stopCtaAnimations = useCallback(() => {
    danceTweenRef.current?.kill();
    pulseTweenRef.current?.kill();
    angerTweenRef.current?.kill();
    happyDanceTweenRef.current?.kill();
  }, []);

  const triggerWaitingState = useCallback(() => {
    if (!resumeBtnRef.current || ctaStateRef.current === "clicked") return;
    if (window.innerWidth < 768) return;

    ctaStateRef.current = "waiting";
    setCtaState("waiting");
    setCtaText("Click me — I’ve been waiting");

    stopCtaAnimations();

    gsap.to(resumeBtnRef.current, {
      paddingLeft: 28,
      paddingRight: 28,
      borderRadius: 999,
      duration: 0.45,
      ease: "power3.out",
    });

    pulseTweenRef.current = gsap.to(resumeBtnRef.current, {
      boxShadow: "0 0 0 10px rgba(0,0,0,0)",
      repeat: -1,
      duration: 1.8,
      ease: "power2.out",
    });

    danceTweenRef.current = gsap.to(resumeBtnRef.current, {
      keyframes: [
        { rotation: -2, y: -2, duration: 0.18 },
        { rotation: 2, y: 0, duration: 0.18 },
        { rotation: -1.5, y: -1, duration: 0.16 },
        { rotation: 0, y: 0, duration: 0.16 },
      ],
      repeat: -1,
      repeatDelay: 1.1,
      ease: "power1.inOut",
    });
  }, [stopCtaAnimations]);

  const triggerAngryState = useCallback(() => {
    if (!resumeBtnRef.current || ctaStateRef.current === "clicked") return;
    if (window.innerWidth < 768) return;

    ctaStateRef.current = "angry";
    setCtaState("angry");
    setCtaText("Why didn’t you click me?");

    stopCtaAnimations();

    angerTweenRef.current = gsap.timeline({ repeat: -1, repeatDelay: 1.4 });

    angerTweenRef.current
      .to(resumeBtnRef.current, { x: -4, duration: 0.07, ease: "power1.inOut" })
      .to(resumeBtnRef.current, { x: 4, duration: 0.07, ease: "power1.inOut" })
      .to(resumeBtnRef.current, { x: -3, duration: 0.06, ease: "power1.inOut" })
      .to(resumeBtnRef.current, { x: 3, duration: 0.06, ease: "power1.inOut" })
      .to(resumeBtnRef.current, { x: 0, scale: 1.03, duration: 0.18, ease: "power2.out" })
      .to(resumeBtnRef.current, { scale: 1, duration: 0.2, ease: "power2.out" });

    gsap.to(resumeBtnRef.current, {
      borderRadius: 22,
      duration: 0.35,
      ease: "power3.out",
    });
  }, [stopCtaAnimations]);

  const handleResumeClick = useCallback(() => {
    if (!resumeBtnRef.current) return;

    if (waitTimerRef.current) clearTimeout(waitTimerRef.current);
    if (angryTimerRef.current) clearTimeout(angryTimerRef.current);

    stopCtaAnimations();

    ctaStateRef.current = "happy";
    setCtaState("happy");
    setCtaText("Yay! You clicked me");

    const tl = gsap.timeline();

    tl.to(resumeBtnRef.current, {
      y: -12,
      scale: 1.05,
      rotation: 5,
      duration: 0.15,
      ease: "power2.out",
    })
      .to(resumeBtnRef.current, {
        y: 0,
        scale: 1,
        rotation: -5,
        duration: 0.12,
        ease: "bounce.out",
      })
      .to(resumeBtnRef.current, {
        rotation: 0,
        duration: 0.1,
        onComplete: () => {
          if (!resumeBtnRef.current) return;
          // Start slow dancing
          happyDanceTweenRef.current = gsap.to(resumeBtnRef.current, {
            rotation: 3,
            duration: 2.2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        },
      });

    // Small delay before opening to let the animation play
    setTimeout(() => {
      window.open(
        "https://drive.google.com/file/d/1DXPHzJPxcWU0pD_o8vN6IqQBXL-lVzt3/view?usp=sharing",
        "_blank"
      );
    }, 200);
  }, [stopCtaAnimations]);

  useEffect(() => {
    if (
      !navRef.current ||
      !logoRef.current ||
      !desktopMenuRef.current ||
      !resumeWrapRef.current ||
      !resumeBtnRef.current
    ) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set([logoRef.current, desktopMenuRef.current, resumeWrapRef.current], {
        y: -20,
        opacity: 0,
      });

      gsap.to([logoRef.current, desktopMenuRef.current, resumeWrapRef.current], {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.08,
        ease: "power3.out",
        delay: 0.1,
      });
    }, navRef);

    waitTimerRef.current = setTimeout(() => {
      triggerWaitingState();
    }, 10000);

    angryTimerRef.current = setTimeout(() => {
      triggerAngryState();
    }, 30000);

    return () => {
      ctx.revert();

      if (waitTimerRef.current) clearTimeout(waitTimerRef.current);
      if (angryTimerRef.current) clearTimeout(angryTimerRef.current);

      stopCtaAnimations();
    };
  }, [triggerWaitingState, triggerAngryState, stopCtaAnimations]);

  useEffect(() => {
    if (!mobilePanelRef.current) return;

    if (menuOpen) {
      gsap.set(mobilePanelRef.current, { display: "block" });
      gsap.fromTo(
        mobilePanelRef.current,
        { opacity: 0, y: -12 },
        {
          opacity: 1,
          y: 0,
          duration: 0.3,
          ease: "power3.out",
        }
      );
    } else {
      gsap.to(mobilePanelRef.current, {
        opacity: 0,
        y: -10,
        duration: 0.24,
        ease: "power2.out",
        onComplete: () => {
          if (mobilePanelRef.current) {
            gsap.set(mobilePanelRef.current, { display: "none" });
          }
        },
      });
    }
  }, [menuOpen]);

  const handleMobileLinkClick = () => {
    setMenuOpen(false);
  };

  const ctaLabel =
    ctaState === "idle"
      ? "Resume"
      : ctaState === "waiting"
        ? "Click me"
        : ctaState === "angry"
          ? "Click me?"
          : ctaState === "happy"
            ? "Yay!"
            : "Opening";

  return (
    <nav
      ref={navRef}
      className="pointer-events-none fixed left-0 top-0 z-50 w-full px-3 py-3 sm:px-4 sm:py-4 md:px-6 md:py-5"
    >
      <div className="flex items-start justify-between gap-3 sm:gap-4">
        {/* Logo */}
        <div ref={logoRef} className="pointer-events-auto shrink-0">
          <Link
            href="#hero"
            className="group relative flex items-center justify-center rounded-2xl border border-black/10 bg-white/72 px-2 py-2 shadow-[0_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-xl transition-all duration-500 hover:border-black/15 hover:bg-white/84 sm:px-2.5 sm:py-2.5"
          >
            <div className="absolute inset-0 rounded-2xl bg-[linear-gradient(180deg,rgba(255,255,255,0.55),rgba(255,255,255,0.18))]" />
            <Image
              src="/logo/logo.jpg"
              alt="AAD Logo"
              width={44}
              height={44}
              className="relative z-10 object-contain sm:h-[50px] sm:w-[50px]"
              style={{ width: "auto", height: "auto" }}
            />
          </Link>
        </div>

        {/* Desktop menu */}
        <div
          ref={desktopMenuRef}
          className="pointer-events-auto relative hidden items-center rounded-full border border-black/10 bg-white/72 px-6 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-xl md:flex lg:px-7"
        >
          <div className="absolute inset-0 rounded-full bg-[linear-gradient(180deg,rgba(255,255,255,0.58),rgba(255,255,255,0.2))]" />
          <div className="relative z-10 flex items-center gap-6 lg:gap-8 xl:gap-10">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group relative font-inter text-[10px] font-semibold uppercase tracking-[0.2em] text-black/58 transition-colors duration-300 hover:text-black"
              >
                {item.label}
                <span className="absolute -bottom-1 left-1/2 h-px w-0 -translate-x-1/2 bg-black/80 transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>
        </div>

        {/* Right controls */}
        <div className="pointer-events-auto flex items-center gap-2 sm:gap-3">
          {/* Mobile menu button */}
          <button
            ref={mobileMenuBtnRef}
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-black/10 bg-white/78 shadow-[0_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-xl transition-all duration-300 hover:bg-white/88 md:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            <span className="absolute inset-0 rounded-2xl bg-[linear-gradient(180deg,rgba(255,255,255,0.52),rgba(255,255,255,0.16))]" />
            <div className="relative z-10 flex flex-col gap-[4px]">
              <span
                className={`h-[1.5px] w-4 bg-black transition-transform duration-300 ${
                  menuOpen ? "translate-y-[5.5px] rotate-45" : ""
                }`}
              />
              <span
                className={`h-[1.5px] w-4 bg-black transition-opacity duration-300 ${
                  menuOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`h-[1.5px] w-4 bg-black transition-transform duration-300 ${
                  menuOpen ? "-translate-y-[5.5px] -rotate-45" : ""
                }`}
              />
            </div>
          </button>

          {/* Resume CTA */}
          <div ref={resumeWrapRef}>
            <button
              ref={resumeBtnRef}
              onClick={handleResumeClick}
              aria-label={ctaText}
              className={`group relative overflow-hidden border px-4 py-3 font-syne text-[10px] font-bold uppercase tracking-[0.18em] shadow-[0_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-xl transition-colors duration-300 sm:px-5 sm:py-3.5 sm:tracking-[0.22em] ${
                ctaState === "idle"
                  ? "rounded-2xl border-black/10 bg-white/84 text-black"
                  : ctaState === "waiting"
                    ? "rounded-full border-black/10 bg-white/90 text-black"
                    : ctaState === "angry"
                      ? "rounded-[22px] border-[#d8b1a7] bg-[#f3d1c8] text-black"
                      : ctaState === "happy"
                        ? "rounded-full border-[#b5d8b1] bg-[#d1f3c8] text-black"
                        : "rounded-full border-black/10 bg-white/90 text-black"
              }`}
            >
              <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.4),rgba(255,255,255,0.12))]" />
              <span className="relative z-10 flex items-center gap-2">
                <span className="hidden sm:inline">{ctaText}</span>
                <span className="sm:hidden">{ctaLabel}</span>
                {ctaState !== "idle" && <span className="text-[11px] leading-none">→</span>}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown panel */}
      <div ref={mobilePanelRef} className="pointer-events-auto hidden pt-3 md:hidden">
        <div className="overflow-hidden rounded-[24px] border border-black/10 bg-white/82 p-4 shadow-[0_18px_40px_rgba(0,0,0,0.1)] backdrop-blur-xl">
          <div className="mb-3 font-inter text-[9px] font-semibold uppercase tracking-[0.34em] text-black/34">
            Navigation
          </div>

          <div className="flex flex-col gap-1">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleMobileLinkClick}
                className="rounded-2xl px-3 py-3 font-syne text-lg font-bold uppercase tracking-[-0.03em] text-black transition-colors duration-300 hover:bg-black/4"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
