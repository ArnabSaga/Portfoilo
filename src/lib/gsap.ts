import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import { SplitText } from "gsap/SplitText";

// Register ScrollTrigger globally only once
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, Flip, SplitText);
  
  // Set default config
  gsap.config({
    nullTargetWarn: false,
  });
}

// Motion Tokens
export const motion = {
  duration: {
    micro: 0.22,
    hover: 0.4,
    interface: 0.65,
    reveal: 0.9,
    major: 1.1,
    cinematic: 1.4,
  },
  stagger: { text: 0.04, item: 0.07 },
  magnetic: { subtle: 0.06, normal: 0.1 },
  pointer: { media: 0.12, frame: 0.08, orbit: 0.16 },
  ease: {
    interface: "power3.out",
    cinematic: "expo.out",
    enter: "power4.out",
  },
} as const;

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

export { Flip, gsap, ScrollTrigger, SplitText };
