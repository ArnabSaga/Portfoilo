"use client";

import { gsap, motion } from "@/lib/gsap";
import { useEffect } from "react";
import type { RefObject } from "react";

export interface PointerParallaxLayer {
  ref: RefObject<HTMLElement | null>;
  strength: number;
}

export interface UsePointerParallaxOptions {
  rootRef: RefObject<HTMLElement | null>;
  cursorRef?: RefObject<HTMLElement | null>;
  layers: readonly PointerParallaxLayer[];
  enabled: boolean;
}

export function usePointerParallax({
  rootRef,
  cursorRef,
  layers,
  enabled,
}: UsePointerParallaxOptions) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !enabled) return;

    const cursor = cursorRef?.current ?? null;
    const cursorX = cursor
      ? gsap.quickTo(cursor, "x", {
          duration: motion.duration.hover,
          ease: motion.ease.interface,
        })
      : null;
    const cursorY = cursor
      ? gsap.quickTo(cursor, "y", {
          duration: motion.duration.hover,
          ease: motion.ease.interface,
        })
      : null;
    const layerSetters = layers.flatMap(({ ref, strength }) => {
      const element = ref.current;
      if (!element) return [];

      return [{
        element,
        strength,
        xTo: gsap.quickTo(element, "x", {
          duration: motion.duration.hover,
          ease: motion.ease.interface,
        }),
        yTo: gsap.quickTo(element, "y", {
          duration: motion.duration.hover,
          ease: motion.ease.interface,
        }),
      }];
    });

    const reset = () => {
      layerSetters.forEach(({ xTo, yTo }) => {
        xTo(0);
        yTo(0);
      });
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const bounds = root.getBoundingClientRect();
      const localX = event.clientX - bounds.left;
      const localY = event.clientY - bounds.top;
      const deltaX = localX - bounds.width / 2;
      const deltaY = localY - bounds.height / 2;

      cursorX?.(localX);
      cursorY?.(localY);
      layerSetters.forEach(({ strength, xTo, yTo }) => {
        xTo(deltaX * strength);
        yTo(deltaY * strength);
      });
    };

    root.addEventListener("pointermove", handlePointerMove);
    root.addEventListener("pointerleave", reset);

    return () => {
      root.removeEventListener("pointermove", handlePointerMove);
      root.removeEventListener("pointerleave", reset);
      cursorX?.tween.kill();
      cursorY?.tween.kill();
      if (cursor) gsap.set(cursor, { x: 0, y: 0 });
      layerSetters.forEach(({ element, xTo, yTo }) => {
        xTo.tween.kill();
        yTo.tween.kill();
        gsap.set(element, { x: 0, y: 0 });
      });
    };
  }, [cursorRef, enabled, layers, rootRef]);
}
