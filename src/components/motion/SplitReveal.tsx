"use client";

import { SplitText, gsap, motion } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useGSAP } from "@gsap/react";
import { type ReactNode, useRef } from "react";

interface SplitRevealProps {
  children: ReactNode;
  className?: string;
  direction?: "up" | "left" | "right";
  delay?: number;
}

export function SplitReveal({
  children,
  className,
  direction = "up",
  delay = 0,
}: SplitRevealProps) {
  const elementRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (!elementRef.current || reducedMotion) return;

      const split = new SplitText(elementRef.current, {
        type: "lines",
        mask: "lines",
        linesClass: "split-reveal-line",
      });
      const from =
        direction === "left" ? { xPercent: -8 } : direction === "right" ? { xPercent: 8 } : { yPercent: 105 };

      gsap.from(split.lines, {
        ...from,
        opacity: 0,
        duration: motion.duration.major,
        stagger: motion.stagger.text,
        delay,
        ease: motion.ease.enter,
      });

      return () => split.revert();
    },
    { scope: elementRef, dependencies: [delay, direction, reducedMotion] }
  );

  return <span ref={elementRef} className={className}>{children}</span>;
}
