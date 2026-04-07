"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, isReducedMotion } from "@/lib/gsap";
import Image from "next/image";

export default function Footer() {
  const [time, setTime] = useState("");
  const footerRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZoneName: "short"
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const xTo = useRef<((v: number) => void) | null>(null);
  const yTo = useRef<((v: number) => void) | null>(null);
  const scaleTo = useRef<((v: number) => void) | null>(null);

  useGSAP((ctx) => {
    if (nameRef.current) {
      xTo.current = gsap.quickTo(nameRef.current, "x", { duration: 0.8, ease: "power3" });
      yTo.current = gsap.quickTo(nameRef.current, "y", { duration: 0.8, ease: "power3" });
      scaleTo.current = gsap.quickTo(nameRef.current, "scale", { duration: 0.8, ease: "power3" });
    }
    return () => ctx.revert();
  }, { dependencies: [], scope: footerRef });

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (isReducedMotion() || e.pointerType === "touch") return;
    const name = nameRef.current;
    if (!name || !xTo.current || !yTo.current || !scaleTo.current) return;

    const rect = name.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

    // Magnetic effect radius
    if (distance < 600) {
      xTo.current(distanceX * 0.35);
      yTo.current(distanceY * 0.35);
      scaleTo.current(1.15);
    } else {
      xTo.current(0);
      yTo.current(0);
      scaleTo.current(1);
    }
  }, []);

  const handlePointerLeave = useCallback(() => {
    if (xTo.current && yTo.current && scaleTo.current) {
      xTo.current(0);
      yTo.current(0);
      scaleTo.current(1);
    }
  }, []);

  const currentYear = new Date().getFullYear();

  return (
    <footer ref={footerRef} className="py-32 px-6 md:px-12 bg-white border-t border-border-custom overflow-hidden">
      <div className="max-w-screen-2xl mx-auto flex flex-col md:grid md:grid-cols-4 gap-24 items-start mb-48">
        <div className="col-span-1">
          <div className="mb-8">
            <Image
              src="/logo/logo.jpg"
              alt="AAD Logo"
              width={64}
              height={64}
              className="object-contain"
            />
          </div>
          <p className="font-inter text-[10px] leading-relaxed text-foreground/40 uppercase tracking-[0.2em] max-w-xs font-bold">
            © {currentYear} Creative Web Developer.<br/>
            All rights reserved. Design for high impact, built for extreme performance.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          <span className="font-inter text-[10px] font-bold uppercase tracking-[0.5em] text-foreground/30">Navigation</span>
          {[ "Work", "Stack", "Contact" ].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="font-syne font-bold text-xl uppercase tracking-tight hover:italic hover:pl-2 transition-all duration-300">
              {item}
            </a>
          ))}
        </div>

        <div className="flex flex-col gap-6">
          <span className="font-inter text-[10px] font-bold uppercase tracking-[0.5em] text-foreground/30">Connect</span>
          {[
            { name: "Github", url: "https://github.com/ArnabSaga" },
            { name: "LinkedIn", url: "https://www.linkedin.com/in/achyuta1/" },
            { name: "Instagram", url: "https://www.instagram.com/rz_arnab_/" }
          ].map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-syne font-bold text-xl uppercase tracking-tight hover:italic hover:pl-2 transition-all duration-300"
            >
              {social.name}
            </a>
          ))}
        </div>

        <div className="flex flex-col gap-6">
          <span className="font-inter text-[10px] font-bold uppercase tracking-[0.5em] text-foreground/30">Presence</span>
          <div className="flex flex-col gap-4">
            <p className="font-syne font-bold text-xl uppercase tracking-tight leading-none text-foreground/60">Bangladesh / BGD</p>
            <div className="flex items-center gap-4 py-3 px-4 border border-border-custom w-fit">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="font-inter text-[10px] font-bold uppercase tracking-widest text-foreground/60 tabular-nums">
                {time}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Massive Magnetic Name */}
      <div className="max-w-screen-2xl mx-auto py-12 flex justify-center items-center pointer-events-none" onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave}>
        <div
            ref={nameRef}
            className="text-[clamp(5rem,25vw,30rem)] font-syne font-extrabold uppercase tracking-tighter text-foreground leading-[0.7] select-none pointer-events-auto cursor-default mix-blend-difference"
        >
          AAD
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto mt-24 pt-12 border-t border-border-custom flex flex-col md:flex-row justify-between items-center gap-8">
        <span className="font-inter text-[9px] uppercase tracking-[0.5em] text-foreground/20 font-bold">
          CODEBASE VERSION 1.0.0 / GSAP BRUTALIST_CORE
        </span>
        <div className="flex gap-4 items-center opacity-20">
            <div className="flex gap-1">
                <div className="w-1 h-8 bg-foreground"></div>
                <div className="w-1 h-8 bg-foreground/10"></div>
                <div className="w-1 h-8 bg-foreground/50"></div>
                <div className="w-1 h-8 bg-foreground/20"></div>
            </div>
          <span className="font-inter text-[9px] uppercase tracking-widest text-foreground font-bold">BD-DEV-2026</span>
        </div>
      </div>
    </footer>
  );
}
