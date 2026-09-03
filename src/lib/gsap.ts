import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import { SplitText } from "gsap/SplitText";
import { motion } from "@/lib/motion";

// Register ScrollTrigger globally only once
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, Flip, SplitText);
  
  // Set default config
  gsap.config({
    nullTargetWarn: false,
  });
}

export const EASE_STANDARD = motion.ease.cinematic;
export const EASE_SOFT = "power2.inOut";
export const DURATION_FAST = motion.duration.hover;
export const DURATION_BASE = 0.8;
export const DURATION_SLOW = motion.duration.cinematic;

// Helper to check for reduced motion
export const isReducedMotion = () => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

export { Flip, gsap, motion, ScrollTrigger, SplitText };
