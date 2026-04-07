import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger globally only once
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  
  // Set default config
  gsap.config({
    nullTargetWarn: false,
  });
}

// Motion Tokens
export const EASE_STANDARD = "expo.out";
export const EASE_SOFT = "power2.inOut";

export const DURATION_FAST = 0.4;
export const DURATION_BASE = 0.8;
export const DURATION_SLOW = 1.4;

// Helper to check for reduced motion
export const isReducedMotion = () => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

export { gsap, ScrollTrigger };
