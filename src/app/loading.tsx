"use client";

import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { gsap, motion } from "@/lib/gsap";
import { useRef } from "react";

export default function Loading() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const subTextRef = useRef<HTMLParagraphElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(() => {
    if (reducedMotion) return;

    const tl = gsap.timeline();

    tl.from(textRef.current, {
      y: "100%",
      duration: motion.duration.reveal,
      ease: motion.ease.enter,
    })
    .from(lineRef.current, {
      scaleX: 0,
      duration: motion.duration.cinematic,
      repeat: -1,
      ease: "power2.inOut",
      transformOrigin: "left",
    }, "-=0.4")
    .from(subTextRef.current, {
      opacity: 0,
      duration: motion.duration.reveal,
    }, "-=1.5");
  }, { scope: containerRef, dependencies: [reducedMotion], revertOnUpdate: true });

  return (
    <div ref={containerRef} className="fixed inset-0 z-[100] flex items-center justify-center bg-background">
      <div className="flex flex-col items-center">
        <div className="relative overflow-hidden">
          <h1 
            ref={textRef}
            className="text-8xl md:text-[12rem] font-syne font-extrabold uppercase tracking-tighter text-foreground leading-none"
          >
            Loading
          </h1>
          <div 
            ref={lineRef}
            className="absolute bottom-0 left-0 w-full h-[2px] bg-foreground"
          />
        </div>
        <p 
          ref={subTextRef}
          className="mt-6 font-inter text-xs uppercase tracking-[0.5em] font-bold opacity-40"
        >
          Architectural Experience
        </p>
      </div>
    </div>
  );
}
