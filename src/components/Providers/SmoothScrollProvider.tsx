"use client";

import { useGSAP } from "@gsap/react";
import { ReactLenis } from "lenis/react";
import { ReactNode, useEffect, useRef } from "react";
import { gsap, ScrollTrigger, isReducedMotion } from "@/lib/gsap";
import "lenis/dist/lenis.css";
import type { LenisRef } from "lenis/react";

interface SmoothScrollProviderProps {
  children: ReactNode;
}

export default function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    // Basic setup for Lenis + ScrollTrigger sync
    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }
    
    gsap.ticker.add(update);
    
    return () => {
      gsap.ticker.remove(update);
    };
  }, []);

  useGSAP(() => {
    // Connect ScrollTrigger to Lenis scroll
    if (lenisRef.current?.lenis) {
      lenisRef.current.lenis.on("scroll", ScrollTrigger.update);
      
      ScrollTrigger.scrollerProxy(document.body, {
        scrollTop(value) {
          const lenis = lenisRef.current?.lenis;
          if (!lenis) return 0;
          if (arguments.length && value !== undefined) {
              lenis.scrollTo(value);
          }
          return lenis.scroll;
        },
        getBoundingClientRect() {
          return {
            top: 0,
            left: 0,
            width: window.innerWidth,
            height: window.innerHeight,
          };
        },
      });
    }
  }, { scope: undefined });

  // Handle reduced motion
  const options = {
    lerp: isReducedMotion() ? 1 : 0.12,
    duration: isReducedMotion() ? 0 : 1.2,
    smoothWheel: !isReducedMotion(),
    wheelMultiplier: 1.1,
    touchMultiplier: 2,
    infinite: false,
  };

  return (
    <ReactLenis root ref={lenisRef} options={options}>
      {children}
    </ReactLenis>
  );
}
