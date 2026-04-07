"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, isReducedMotion } from "@/lib/gsap";
import Image from "next/image";
import Link from "next/link";

const navItems = [
  { label: "Work", href: "#work" },
  { label: "Stack", href: "#stack" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

const socialItems = [
  { name: "Github", url: "https://github.com/ArnabSaga" },
  { name: "LinkedIn", url: "https://www.linkedin.com/in/achyuta1/" },
  { name: "Instagram", url: "https://www.instagram.com/rz_arnab_/" },
];

export default function Footer() {
  const [time, setTime] = useState("");
  const footerRef = useRef<HTMLElement>(null);
  const brandRef = useRef<HTMLDivElement>(null);

  const xTo = useRef<((v: number) => void) | null>(null);
  const yTo = useRef<((v: number) => void) | null>(null);
  const scaleTo = useRef<((v: number) => void) | null>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZoneName: "short",
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useGSAP(
    () => {
      if (!footerRef.current || !brandRef.current) return;

      const mm = gsap.matchMedia();

      gsap.from(".footer-reveal", {
        opacity: 0,
        y: 24,
        stagger: 0.06,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 82%",
          once: true,
        },
      });

      mm.add("(hover: hover) and (pointer: fine) and (min-width: 1024px)", () => {
        if (isReducedMotion()) return;

        xTo.current = gsap.quickTo(brandRef.current, "x", {
          duration: 0.8,
          ease: "power3.out",
        });

        yTo.current = gsap.quickTo(brandRef.current, "y", {
          duration: 0.8,
          ease: "power3.out",
        });

        scaleTo.current = gsap.quickTo(brandRef.current, "scale", {
          duration: 0.8,
          ease: "power3.out",
        });
      });

      return () => mm.revert();
    },
    { scope: footerRef }
  );

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (isReducedMotion() || e.pointerType !== "mouse") return;
    if (window.innerWidth < 1024) return;

    const brand = brandRef.current;
    if (!brand || !xTo.current || !yTo.current || !scaleTo.current) return;

    const rect = brand.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    const distance = Math.hypot(distanceX, distanceY);

    if (distance < 520) {
      xTo.current(distanceX * 0.22);
      yTo.current(distanceY * 0.22);
      scaleTo.current(1.06);
    } else {
      xTo.current(0);
      yTo.current(0);
      scaleTo.current(1);
    }
  }, []);

  const handlePointerLeave = useCallback(() => {
    xTo.current?.(0);
    yTo.current?.(0);
    scaleTo.current?.(1);
  }, []);

  const currentYear = new Date().getFullYear();

  return (
    <footer
      ref={footerRef}
      className="relative overflow-hidden border-t border-border-custom bg-white px-4 py-16 text-foreground sm:px-6 sm:py-20 md:px-8 md:py-24 xl:py-28"
    >
      <div className="pointer-events-none absolute left-[8%] top-[10%] h-[180px] w-[180px] rounded-full bg-black/2 blur-[70px] md:h-[260px] md:w-[260px]" />
      <div className="pointer-events-none absolute bottom-[10%] right-[8%] h-[220px] w-[220px] rounded-full bg-black/2 blur-[80px] md:h-[320px] md:w-[320px]" />

      <div className="relative z-10 mx-auto max-w-screen-2xl">
        {/* Top grid */}
        <div className="grid grid-cols-1 gap-12 sm:gap-14 md:grid-cols-2 md:gap-x-10 md:gap-y-14 xl:grid-cols-4 xl:gap-10">
          <div className="footer-reveal">
            <div className="mb-6">
              <Image
                src="/logo/logo.jpg"
                alt="AAD Logo"
                width={58}
                height={58}
                className="object-contain sm:h-16 sm:w-16"
                style={{ width: "auto", height: "auto" }}
              />
            </div>

            <p className="max-w-xs font-inter text-[10px] font-bold uppercase leading-relaxed tracking-[0.22em] text-foreground/38">
              © {currentYear} Creative Web Developer.
              <br />
              Built for performance, crafted with motion, and designed for long-term systems
              thinking.
            </p>
          </div>

          <div className="footer-reveal flex flex-col gap-5">
            <span className="font-inter text-[9px] font-bold uppercase tracking-[0.42em] text-foreground/28 sm:text-[10px]">
              Navigation
            </span>

            <div className="flex flex-col gap-3 sm:gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="group w-fit font-syne text-xl font-bold uppercase tracking-[-0.03em] transition-all duration-300 hover:italic hover:pl-2 sm:text-2xl"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="footer-reveal flex flex-col gap-5">
            <span className="font-inter text-[9px] font-bold uppercase tracking-[0.42em] text-foreground/28 sm:text-[10px]">
              Connect
            </span>

            <div className="flex flex-col gap-3 sm:gap-4">
              {socialItems.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group w-fit font-syne text-xl font-bold uppercase tracking-[-0.03em] transition-all duration-300 hover:italic hover:pl-2 sm:text-2xl"
                >
                  {social.name}
                </a>
              ))}
            </div>
          </div>

          <div className="footer-reveal flex flex-col gap-5">
            <span className="font-inter text-[9px] font-bold uppercase tracking-[0.42em] text-foreground/28 sm:text-[10px]">
              Presence
            </span>

            <div className="flex flex-col gap-4">
              <p className="font-syne text-xl font-bold uppercase leading-none tracking-[-0.03em] text-foreground/62 sm:text-2xl">
                Bangladesh / BGD
              </p>

              <div className="flex w-fit items-center gap-4 border border-border-custom px-4 py-3">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="font-inter text-[10px] font-bold uppercase tracking-[0.24em] text-foreground/60 tabular-nums">
                  {time}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Massive brand mark */}
        <div
          className="pointer-events-none flex justify-center py-16 sm:py-20 lg:py-24"
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
        >
          <div
            ref={brandRef}
            className="footer-reveal pointer-events-auto select-none font-syne text-[clamp(4.5rem,22vw,24rem)] font-extrabold uppercase leading-[0.78] tracking-[-0.08em] text-foreground"
          >
            AAD
          </div>
        </div>

        {/* Bottom strip */}
        <div className="footer-reveal mt-2 flex flex-col gap-6 border-t border-border-custom pt-8 sm:mt-4 sm:pt-10 md:flex-row md:items-center md:justify-between">
          <span className="font-inter text-[9px] font-bold uppercase tracking-[0.38em] text-foreground/24">
            CODEBASE VERSION 1.0.0 / GSAP BRUTALIST_CORE
          </span>

          <div className="flex items-center gap-4 opacity-25">
            <div className="flex gap-1">
              <div className="h-7 w-1 bg-foreground sm:h-8" />
              <div className="h-7 w-1 bg-foreground/12 sm:h-8" />
              <div className="h-7 w-1 bg-foreground/45 sm:h-8" />
              <div className="h-7 w-1 bg-foreground/20 sm:h-8" />
            </div>

            <span className="font-inter text-[9px] font-bold uppercase tracking-[0.28em] text-foreground">
              BD-DEV-2026
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
