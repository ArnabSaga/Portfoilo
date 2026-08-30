"use client";

import { SplitText, gsap, motion } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useGSAP } from "@gsap/react";
import { type ReactNode, useCallback, useRef } from "react";

type SplitRevealElement = "span" | "p" | "h1" | "h2" | "h3";

interface SplitRevealProps {
  as?: SplitRevealElement;
  children: ReactNode;
  className?: string;
  direction?: "up" | "left" | "right";
  delay?: number;
}

export function SplitReveal({
  as = "span",
  children,
  className,
  direction = "up",
  delay = 0,
}: SplitRevealProps) {
  const elementRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const setElementRef = useCallback((node: HTMLElement | null) => {
    elementRef.current = node;
  }, []);

  useGSAP(
    () => {
      if (!elementRef.current || reducedMotion) return;

      let cancelled = false;
      let split: SplitText | null = null;
      let animation: gsap.core.Tween | null = null;

      const initialize = () => {
        if (cancelled || !elementRef.current) return;

        split = new SplitText(elementRef.current, {
          type: "lines",
          mask: "lines",
          linesClass: "split-reveal-line",
          autoSplit: true,
          onSplit: (instance) => {
            animation?.kill();
            const from =
              direction === "left"
                ? { xPercent: -8 }
                : direction === "right"
                  ? { xPercent: 8 }
                  : { yPercent: 105 };

            animation = gsap.from(instance.lines, {
              ...from,
              opacity: 0,
              duration: motion.duration.major,
              stagger: motion.stagger.text,
              delay,
              ease: motion.ease.enter,
            });
          },
        });
      };

      void document.fonts.ready.then(initialize);

      return () => {
        cancelled = true;
        animation?.kill();
        split?.revert();
      };
    },
    { scope: elementRef, dependencies: [delay, direction, reducedMotion], revertOnUpdate: true }
  );

  const Element = as;
  return <Element ref={setElementRef} className={className}>{children}</Element>;
}
