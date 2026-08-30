"use client";

import { useReducedMotion } from "@/hooks/useReducedMotion";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { type ReactNode, useEffect, useRef } from "react";

interface SmoothScrollProviderProps {
  children: ReactNode;
}

const ANCHOR_SCROLL_OFFSET = 96;
const ANCHOR_REFRESH_DELAY = 80;

export default function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const reducedMotion = useReducedMotion();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (reducedMotion) return;

    const lenis = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
      wheelMultiplier: 1.1,
      touchMultiplier: 2,
      infinite: false,
      autoRaf: false,
    });
    const handleScroll = () => ScrollTrigger.update();
    const unsubscribeScroll = lenis.on("scroll", handleScroll);
    const handleTick = (time: number) => lenis.raf(time * 1000);

    lenisRef.current = lenis;
    gsap.ticker.add(handleTick);

    return () => {
      unsubscribeScroll();
      gsap.ticker.remove(handleTick);
      lenis.destroy();
      if (lenisRef.current === lenis) lenisRef.current = null;
    };
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return;

    const timers = new Set<number>();
    let navigationTimer: number | null = null;

    const schedule = (callback: () => void, delay: number) => {
      const timer = window.setTimeout(() => {
        timers.delete(timer);
        callback();
      }, delay);
      timers.add(timer);
      return timer;
    };

    const scrollToHash = (hash: string, immediate = false) => {
      if (!hash || hash === "#") return;

      let id: string;
      try {
        id = decodeURIComponent(hash.slice(1));
      } catch {
        return;
      }

      const target = document.getElementById(id);
      if (!target) return;

      ScrollTrigger.refresh();
      const targetY = window.scrollY + target.getBoundingClientRect().top - ANCHOR_SCROLL_OFFSET;
      const lenis = lenisRef.current;

      if (lenis) {
        lenis.scrollTo(targetY, {
          immediate,
          duration: immediate ? 0 : 1.1,
        });
      } else {
        window.scrollTo({ top: targetY, behavior: "auto" });
      }

      ScrollTrigger.update();
      schedule(() => ScrollTrigger.update(), immediate ? ANCHOR_REFRESH_DELAY : 1200);
    };

    const scheduleHashScroll = (hash: string, immediate = false) => {
      if (navigationTimer !== null) {
        window.clearTimeout(navigationTimer);
        timers.delete(navigationTimer);
      }
      navigationTimer = schedule(() => {
        navigationTimer = null;
        scrollToHash(hash, immediate);
      }, ANCHOR_REFRESH_DELAY);
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

      const anchor = (event.target as Element | null)?.closest<HTMLAnchorElement>("a[href]");
      if (!anchor || anchor.hasAttribute("download") || anchor.target) return;

      const destination = new URL(anchor.href, window.location.href);
      const current = new URL(window.location.href);
      const sameDocument =
        destination.origin === current.origin &&
        destination.pathname === current.pathname &&
        destination.search === current.search;

      if (!sameDocument || !destination.hash || destination.hash === "#") return;

      event.preventDefault();
      if (destination.hash !== window.location.hash) {
        window.history.pushState(null, "", destination.hash);
      }
      scheduleHashScroll(destination.hash);
    };

    const handleHistoryNavigation = () => {
      scheduleHashScroll(window.location.hash, true);
    };

    document.addEventListener("click", handleClick);
    window.addEventListener("hashchange", handleHistoryNavigation);
    window.addEventListener("popstate", handleHistoryNavigation);

    if (window.location.hash) {
      scheduleHashScroll(window.location.hash, true);
    }

    return () => {
      document.removeEventListener("click", handleClick);
      window.removeEventListener("hashchange", handleHistoryNavigation);
      window.removeEventListener("popstate", handleHistoryNavigation);
      timers.forEach((timer) => window.clearTimeout(timer));
      timers.clear();
    };
  }, [reducedMotion]);

  return children;
}
