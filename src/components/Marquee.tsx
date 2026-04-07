"use client";

import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, DURATION_BASE, EASE_STANDARD, isReducedMotion } from "@/lib/gsap";
import { useRef } from "react";

export default function Marquee() {
  const container = useRef<HTMLDivElement>(null);
  const marqueeText = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const marquee = marqueeText.current;
    if (!marquee) return;

    const totalWidth = marquee.offsetWidth / 2;
    
    // Base infinite scroll
    const animation = gsap.to(marquee, {
      x: -totalWidth,
      duration: 30,
      ease: "none",
      repeat: -1,
    });

    let lastTimeScale = 1;
    ScrollTrigger.create({
      trigger: container.current,
      onUpdate: (self) => {
        if (isReducedMotion()) return;
        const velocity = self.getVelocity();
        const direction = self.direction; // 1 for down, -1 for up
        
        // Map velocity to timeScale (minimum 1, max based on scroll speed)
        // Adjust the divisor (200) to control sensitivity
        const newTimeScale = (1 + Math.abs(velocity / 400)) * (direction === 1 ? 1 : -1);
        
        // Only trigger a new animation if the change is significant (threshold 0.1)
        if (Math.abs(newTimeScale - lastTimeScale) > 0.1) {
          gsap.to(animation, { 
            timeScale: newTimeScale, 
            duration: DURATION_BASE, 
            ease: EASE_STANDARD,
            overwrite: true
          });
          lastTimeScale = newTimeScale;
        }
      }
    });
  }, { dependencies: [], scope: container });

  const items = [
    "Next.js Architect",
    "GSAP Motion",
    "Tailwind V4",
    "Brutalist UI",
    "Full Stack",
    "Interactive Design",
  ];

  return (
    <section ref={container} className="py-12 bg-background border-b border-border-custom overflow-hidden whitespace-nowrap select-none">
      <div ref={marqueeText} className="flex flex-nowrap w-fit">
        {[1, 2].map((set) => (
          <div key={set} className="flex gap-12 items-center pr-12">
            {items.map((item, i) => (
              <div key={i} className="flex gap-12 items-center">
                <span className="text-[clamp(3rem,8vw,8rem)] font-syne font-extrabold uppercase tracking-tighter text-foreground outline-text">
                  {item}
                </span>
                <div className="w-4 h-4 md:w-6 md:h-6 bg-foreground rotate-45 shrink-0" />
              </div>
            ))}
          </div>
        ))}
      </div>
      
      <style jsx>{`
        .outline-text {
          -webkit-text-stroke: 1.5px #111111;
          color: transparent;
          transition: color 0.5s ease;
        }
        .outline-text:hover {
          color: #111111;
        }
      `}</style>
    </section>
  );
}
