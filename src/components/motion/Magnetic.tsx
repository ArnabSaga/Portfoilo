"use client";

import { motion, gsap } from "@/lib/gsap";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cloneElement, type ReactElement, useCallback, useEffect, useRef } from "react";

interface MagneticProps {
  children: ReactElement<{ ref?: React.Ref<HTMLElement> }>;
  strength?: number;
}

export function Magnetic({ children, strength = motion.magnetic.subtle }: MagneticProps) {
  const elementRef = useRef<HTMLElement | null>(null);
  const xToRef = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  const yToRef = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  const reducedMotion = useReducedMotion();
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const enabled = finePointer && !reducedMotion;

  useEffect(() => {
    const element = elementRef.current;
    if (!element || !enabled) return;

    const xTo = gsap.quickTo(element, "x", {
      duration: motion.duration.hover,
      ease: motion.ease.interface,
    });
    const yTo = gsap.quickTo(element, "y", {
      duration: motion.duration.hover,
      ease: motion.ease.interface,
    });
    xToRef.current = xTo;
    yToRef.current = yTo;

    return () => {
      xTo.tween.kill();
      yTo.tween.kill();
      xToRef.current = null;
      yToRef.current = null;
      gsap.set(element, { x: 0, y: 0 });
    };
  }, [enabled]);

  const handleMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!enabled || event.pointerType !== "mouse" || !elementRef.current) return;
      const bounds = event.currentTarget.getBoundingClientRect();
      xToRef.current?.((event.clientX - bounds.left - bounds.width / 2) * strength);
      yToRef.current?.((event.clientY - bounds.top - bounds.height / 2) * strength);
    },
    [enabled, strength]
  );

  const reset = useCallback(() => {
    xToRef.current?.(0);
    yToRef.current?.(0);
  }, []);

  return (
    <div onPointerMove={handleMove} onPointerLeave={reset}>
      {cloneElement(children, { ref: elementRef })}
    </div>
  );
}
