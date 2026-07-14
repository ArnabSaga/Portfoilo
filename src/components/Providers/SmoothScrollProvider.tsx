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

const ANCHOR_SCROLL_OFFSET = 96;
const ANCHOR_REFRESH_DELAY = 80;

export default function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    const scrollToHash = (hash: string, immediate = false) => {
      if (!hash || hash === "#") return;

      const target = document.querySelector<HTMLElement>(hash);
      if (!target) return;

      ScrollTrigger.refresh();

      const targetY = window.scrollY + target.getBoundingClientRect().top - ANCHOR_SCROLL_OFFSET;
      const lenis = lenisRef.current?.lenis;

      if (lenis) {
        lenis.scrollTo(targetY, {
          immediate,
          duration: immediate ? 0 : 1.1,
        });
      } else {
        window.scrollTo({
          top: targetY,
          behavior: immediate || isReducedMotion() ? "auto" : "smooth",
        });
      }

      ScrollTrigger.update();
      window.setTimeout(() => ScrollTrigger.update(), immediate ? ANCHOR_REFRESH_DELAY : 1200);
    };

    const handleClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const anchor = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!anchor) return;

      const hash = anchor.getAttribute("href");
      if (!hash || hash === "#") return;

      event.preventDefault();
      window.history.pushState(null, "", hash);
      window.setTimeout(() => scrollToHash(hash), ANCHOR_REFRESH_DELAY);
    };

    const handleHashChange = () => {
      window.setTimeout(() => scrollToHash(window.location.hash, true), ANCHOR_REFRESH_DELAY);
    };

    document.addEventListener("click", handleClick);
    window.addEventListener("hashchange", handleHashChange);

    if (window.location.hash) {
      window.setTimeout(() => scrollToHash(window.location.hash, true), ANCHOR_REFRESH_DELAY);
    }

    return () => {
      document.removeEventListener("click", handleClick);
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

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
    }
  }, { scope: undefined });

  // Handle reduced motion
  const options = {
    lerp: isReducedMotion() ? 1 : 0.08,
    smoothWheel: !isReducedMotion(),
    wheelMultiplier: 1.1,
    touchMultiplier: 2,
    infinite: false,
  };

  return (
    <ReactLenis root ref={lenisRef} options={options} autoRaf={false}>
      {children}
    </ReactLenis>
  );
}
