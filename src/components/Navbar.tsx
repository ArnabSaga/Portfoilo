"use client";

import { gsap } from "@/lib/gsap";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

type CtaState = "idle" | "waiting" | "angry" | "clicked";

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
  const menuRef = useRef<HTMLDivElement>(null);
  const resumeWrapRef = useRef<HTMLDivElement>(null);
  const resumeBtnRef = useRef<HTMLButtonElement>(null);

  const danceTweenRef = useRef<gsap.core.Tween | null>(null);
  const pulseTweenRef = useRef<gsap.core.Tween | null>(null);
  const angerTweenRef = useRef<gsap.core.Timeline | null>(null);

  const waitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const angryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const ctaStateRef = useRef<CtaState>("idle");

  const [ctaState, setCtaState] = useState<CtaState>("idle");
  const [ctaText, setCtaText] = useState("Resume");

  const triggerWaitingState = useCallback(() => {
    if (!resumeBtnRef.current || ctaStateRef.current === "clicked") return;

    ctaStateRef.current = "waiting";
    setCtaState("waiting");
    setCtaText("Click me — I’ve been waiting");

    danceTweenRef.current?.kill();
    pulseTweenRef.current?.kill();
    angerTweenRef.current?.kill();

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
  }, []);

  const triggerAngryState = useCallback(() => {
    if (!resumeBtnRef.current || ctaStateRef.current === "clicked") return;

    ctaStateRef.current = "angry";
    setCtaState("angry");
    setCtaText("Why didn’t you click me?");

    danceTweenRef.current?.kill();
    pulseTweenRef.current?.kill();
    angerTweenRef.current?.kill();

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
  }, []);

  const handleResumeClick = useCallback(() => {
    if (!resumeBtnRef.current) return;

    if (waitTimerRef.current) clearTimeout(waitTimerRef.current);
    if (angryTimerRef.current) clearTimeout(angryTimerRef.current);

    danceTweenRef.current?.kill();
    pulseTweenRef.current?.kill();
    angerTweenRef.current?.kill();

    ctaStateRef.current = "clicked";
    setCtaState("clicked");
    setCtaText("Opening Resume");

    gsap
      .timeline()
      .to(resumeBtnRef.current, {
        scale: 0.96,
        duration: 0.09,
        ease: "power2.out",
      })
      .to(resumeBtnRef.current, {
        scale: 1,
        duration: 0.18,
        ease: "power2.out",
      });

    window.open("/resume.pdf", "_blank");
  }, []);

  useEffect(() => {
    if (
      !navRef.current ||
      !logoRef.current ||
      !menuRef.current ||
      !resumeWrapRef.current ||
      !resumeBtnRef.current
    ) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set([logoRef.current, menuRef.current, resumeWrapRef.current], {
        y: -24,
        opacity: 0,
      });

      gsap.to([logoRef.current, menuRef.current, resumeWrapRef.current], {
        y: 0,
        opacity: 1,
        duration: 0.85,
        stagger: 0.08,
        ease: "power3.out",
        delay: 0.15,
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

      danceTweenRef.current?.kill();
      pulseTweenRef.current?.kill();
      angerTweenRef.current?.kill();
    };
  }, [triggerWaitingState, triggerAngryState]);

  return (
    <nav
      ref={navRef}
      className="pointer-events-none fixed left-0 top-0 z-50 w-full px-4 py-4 md:px-6 md:py-5"
    >
      <div className="flex items-center justify-between gap-4">
        <div ref={logoRef} className="pointer-events-auto">
          <Link
            href="#hero"
            className="group relative flex items-center justify-center rounded-2xl border border-black/10 bg-white/70 px-2.5 py-2.5 shadow-[0_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-xl transition-all duration-500 hover:border-black/15 hover:bg-white/82"
          >
            <div className="absolute inset-0 rounded-2xl bg-[linear-gradient(180deg,rgba(255,255,255,0.55),rgba(255,255,255,0.18))]" />
            <Image
              src="/logo/logo.jpg"
              alt="AAD Logo"
              width={50}
              height={50}
              className="relative z-10 object-contain"
            />
          </Link>
        </div>

        <div
          ref={menuRef}
          className="pointer-events-auto hidden items-center rounded-full border border-black/10 bg-white/70 px-7 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-xl md:flex"
        >
          <div className="absolute inset-0 rounded-full bg-[linear-gradient(180deg,rgba(255,255,255,0.58),rgba(255,255,255,0.2))]" />
          <div className="relative z-10 flex items-center gap-8 lg:gap-10">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group relative font-inter text-[10px] font-semibold uppercase tracking-[0.22em] text-black/55 transition-colors duration-300 hover:text-black"
              >
                {item.label}
                <span className="absolute -bottom-1 left-1/2 h-px w-0 -translate-x-1/2 bg-black/80 transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>
        </div>

        <div ref={resumeWrapRef} className="pointer-events-auto">
          <button
            ref={resumeBtnRef}
            onClick={handleResumeClick}
            aria-label={ctaText}
            className={`group relative overflow-hidden border px-6 py-3.5 font-syne text-[10px] font-bold uppercase tracking-[0.22em] shadow-[0_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-xl transition-colors duration-300 ${
              ctaState === "idle"
                ? "rounded-2xl border-black/10 bg-white/82 text-black"
                : ctaState === "waiting"
                  ? "rounded-full border-black/10 bg-white/88 text-black"
                  : ctaState === "angry"
                    ? "rounded-[22px] border-[#d8b1a7] bg-[#f3d1c8] text-black"
                    : "rounded-full border-black/10 bg-white/88 text-black"
            }`}
          >
            <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.4),rgba(255,255,255,0.12))]" />
            <span className="relative z-10 flex items-center gap-2">
              <span>{ctaText}</span>
              {ctaState !== "idle" && <span className="text-[11px] leading-none">→</span>}
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
}
