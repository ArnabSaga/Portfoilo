"use client";

import { motion, gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cloneElement, type ReactElement, useCallback, useRef } from "react";

interface MagneticProps {
  children: ReactElement<{ ref?: React.Ref<HTMLElement> }>;
  strength?: number;
}

export function Magnetic({ children, strength = motion.magnetic.subtle }: MagneticProps) {
  const elementRef = useRef<HTMLElement | null>(null);
  const reducedMotion = useReducedMotion();

  const handleMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (reducedMotion || event.pointerType !== "mouse" || !elementRef.current) return;
      const bounds = event.currentTarget.getBoundingClientRect();
      gsap.to(elementRef.current, {
        x: (event.clientX - bounds.left - bounds.width / 2) * strength,
        y: (event.clientY - bounds.top - bounds.height / 2) * strength,
        duration: motion.duration.hover,
        ease: motion.ease.interface,
        overwrite: "auto",
      });
    },
    [reducedMotion, strength]
  );

  const reset = useCallback(() => {
    if (!elementRef.current) return;
    gsap.to(elementRef.current, {
      x: 0,
      y: 0,
      duration: motion.duration.hover,
      ease: motion.ease.interface,
      overwrite: "auto",
    });
  }, []);

  return (
    <div onPointerMove={handleMove} onPointerLeave={reset}>
      {cloneElement(children, { ref: elementRef })}
    </div>
  );
}
