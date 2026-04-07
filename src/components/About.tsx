"use client";

import { gsap } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { useRef } from "react";

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);
  const socialRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        // Initial setup
        gsap.set(".name-line", { yPercent: 100, opacity: 0 });
        gsap.set(portraitRef.current, { scale: 1.15, clipPath: "inset(100% 0 0 0)" });
        gsap.set([roleRef.current, socialRef.current], { opacity: 0, y: 30 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 65%",
            toggleActions: "play none none reverse",
          },
          defaults: { ease: "expo.out", duration: 1.6 },
        });

        tl.to(portraitRef.current, { clipPath: "inset(0% 0 0 0)", duration: 2 })
          .to(portraitRef.current, { scale: 1, duration: 2.2 }, "<")
          .to(".name-line", { yPercent: 0, opacity: 1, stagger: 0.1 }, "-=1.6")
          .to([socialRef.current, roleRef.current], { opacity: 1, y: 0, stagger: 0.08 }, "-=1.2");

        // Parallax
        gsap.to(nameRef.current, {
          yPercent: -15,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });

        gsap.to(portraitRef.current, {
          yPercent: -8,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      mm.add("(max-width: 767px)", () => {
        gsap.from([portraitRef.current, ".name-line", roleRef.current, socialRef.current], {
          opacity: 0,
          y: 40,
          stagger: 0.1,
          duration: 1.2,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            once: true,
          },
        });
      });

      return () => mm.revert();
    },
    { dependencies: [], scope: sectionRef }
  );

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative overflow-hidden bg-[#f3f3f3] px-3 pb-3 pt-3 text-black sm:px-4 sm:pb-4 md:px-6 md:pb-6"
    >
      <div
        ref={containerRef}
        className="relative flex min-h-[92vh] w-full flex-col items-center justify-center overflow-hidden rounded-[40px] bg-[#eaeaec] lg:min-h-[95vh]"
      >
        {/* Decorative Light Glow */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.03),transparent_70%)] opacity-50" />

        {/* Massive Background Name (aria-hidden) */}
        {/* <div
          ref={nameRef}
          aria-hidden="true"
          className="pointer-events-none absolute z-0 flex flex-col items-center justify-center whitespace-nowrap text-center text-foreground"
        >
          <div className="name-line font-syne text-[clamp(3rem,14vw,18rem)] font-extrabold leading-[0.85] tracking-[-0.07em]">
            ACHYUTA
          </div>
          <div className="name-line font-syne text-[clamp(3rem,14vw,18rem)] font-extrabold leading-[0.85] tracking-[-0.07em] md:-mt-[0.1em]">
            ARNAB
          </div>
          <div className="name-line font-syne text-[clamp(3rem,14vw,18rem)] font-extrabold leading-[0.85] tracking-[-0.07em] md:-mt-[0.1em]">
            DEY
          </div>
        </div> */}

        {/*  Center Portrait (Layered in front of name) */}
        <div
          ref={portraitRef}
          className="relative z-10 w-[85%] max-w-[550px] aspect-4/5 overflow-hidden rounded-[32px] shadow-2xl md:w-[42%] lg:w-[35%]"
        >
          <div ref={imageRef} className="relative h-full w-full will-change-transform">
            <Image
              src="/image/backward-profile.png"
              alt="Portrait of Achyuta Arnab Dey"
              fill
              priority
              className="object-cover grayscale brightness-[1.02] contrast-[1.05]"
              sizes="(max-width: 768px) 90vw, 40vw"
            />
          </div>
        </div>

        {/*  Social Links (Bottom Left) */}
        <nav
          ref={socialRef}
          className="absolute bottom-10 left-6 z-40 flex flex-col gap-3 sm:left-10 lg:left-14"
        >
          {["LinkedIn", "Twitter", "Instagram"].map((social) => (
            <div
              key={social}
              className="group flex cursor-pointer items-center gap-3 overflow-hidden"
            >
              <div className="h-1.5 w-1.5 rounded-full bg-black/20 group-hover:bg-black transition-colors" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-black/40 group-hover:text-black transition-colors">
                {social}
              </span>
            </div>
          ))}
        </nav>

        {/*  Role Description (Bottom Right) */}
        <div
          ref={roleRef}
          className="absolute bottom-10 right-6 z-40 text-right sm:right-10 lg:right-14"
        >
          <h2 className="font-syne text-[clamp(1.5rem,4vw,3.2rem)] font-bold italic leading-none tracking-[-0.04em] text-black/80">
            {"// Full Stack Developer"}
            <br />
            {"System Designer"}
          </h2>
        </div>
      </div>
    </section>
  );
}
