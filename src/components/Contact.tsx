"use client";

import { useGSAP } from "@gsap/react";
import { gsap, EASE_STANDARD, DURATION_SLOW } from "@/lib/gsap";
import { useRef } from "react";

export default function Contact() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(".contact-reveal", {
      scrollTrigger: {
        trigger: container.current,
        start: "top 70%",
        toggleActions: "play none none reverse",
      },
      y: 50,
      opacity: 0,
      stagger: 0.1,
      duration: DURATION_SLOW,
      ease: EASE_STANDARD,
    });
  }, { scope: container });

  return (
    <section id="contact" ref={container} className="py-64 px-6 md:px-12 bg-background flex flex-col items-center justify-center text-center border-b border-border-custom min-h-screen">
      <div className="contact-reveal">
        <p className="font-inter text-[10px] uppercase tracking-[1em] mb-12 text-foreground/40 font-bold">
          Ready to build?
        </p>
      </div>
      
      <div className="contact-reveal overflow-hidden">
        <h2 className="text-6xl md:text-[12vw] font-syne font-extrabold uppercase tracking-tighter text-foreground mb-24 leading-[0.85]">
          Got a<br/>project?
        </h2>
      </div>
      
      <div className="contact-reveal">
        <a 
          href="mailto:hello@arnabdey.dev" 
          className="group relative inline-flex items-center gap-6 px-16 py-8 bg-foreground text-background font-syne font-bold uppercase tracking-widest text-xl md:text-3xl hover:scale-105 active:scale-95 transition-all duration-500 rounded-full"
        >
          <span>Say Hello</span>
          <div className="w-12 h-12 flex items-center justify-center bg-background rounded-full group-hover:rotate-45 transition-transform duration-500">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 16L16 4M16 4H7M16 4V13" stroke="#111111" strokeWidth="2.5" strokeLinecap="square"/>
            </svg>
          </div>
        </a>
      </div>
      
      <div className="contact-reveal mt-24">
        <p className="font-inter text-xs uppercase tracking-widest text-foreground/40 font-bold">
          Based in London / GBR • Available worldwide
        </p>
      </div>
    </section>
  );
}
