"use client";

import { gsap } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { useRef } from "react";

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const textContentRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        // Desktop Animation
        gsap.set(portraitRef.current, { scale: 1.1, clipPath: "inset(100% 0 0 0)" });
        gsap.set(".about-text-reveal", { y: 50, opacity: 0 });

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
          .to(".about-text-reveal", { y: 0, opacity: 1, stagger: 0.15 }, "-=1.8");

        // Subtle Parallax on image
        gsap.to(portraitRef.current, {
          yPercent: -10,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      mm.add("(max-width: 1023px)", () => {
        // Mobile Animation
        gsap.from([portraitRef.current, ".about-text-reveal"], {
          opacity: 0,
          y: 40,
          stagger: 0.15,
          duration: 1.2,
          ease: "power3.out",
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
        className="relative flex min-h-[92vh] w-full flex-col items-center justify-center overflow-hidden rounded-[40px] bg-[#eaeaec] lg:min-h-[95vh] px-6 py-20 lg:px-20"
      >
        {/* Decorative Light Glow */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.03),transparent_70%)] opacity-50" />

        <div className="relative z-10 w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          {/* Left: Portrait */}
          <div className="lg:col-span-5 flex justify-center lg:justify-start w-full">
            <div
              ref={portraitRef}
              className="relative w-[85%] max-w-[450px] lg:w-full aspect-4/5 overflow-hidden rounded-[32px] shadow-2xl origin-bottom"
            >
              <div className="relative h-full w-full will-change-transform">
                <Image
                  src="/image/backward-profile.png"
                  alt="Portrait of Achyuta Arnab Dey"
                  fill
                  priority
                  className="object-cover grayscale brightness-[1.02] contrast-[1.05]"
                  sizes="(max-width: 1024px) 85vw, 40vw"
                />
              </div>
            </div>
          </div>

          {/* Right: Editorial Content */}
          <div
            ref={textContentRef}
            className="lg:col-span-7 flex flex-col justify-center text-center lg:text-left"
          >
            <h2 className="about-text-reveal font-syne text-[clamp(2.2rem,5.5vw,4rem)] font-extrabold leading-[0.9] tracking-tighter uppercase mb-8">
              Architecting the Future <br className="hidden lg:block" /> of Multi-tenant{" "}
              <span className="italic font-light text-black/60 font-syne">Infrastructure.</span>
            </h2>

            <div className="about-text-reveal space-y-6 text-lg md:text-xl text-black/70 font-inter max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              <p>
                True engineering lives beneath the surface. I specialize in building complex,
                production-ready SaaS platforms where security and tenant isolation are baked into
                the DNA of the code.
              </p>
              <p>
                My methodology prioritizes logical data isolation, granular RBAC, and
                high-performance API architecture. I believe a beautiful interface is only as good
                as the systems that power it—I build the power.
              </p>
            </div>

            {/* Social Links */}
            <div className="about-text-reveal mt-12 flex flex-wrap justify-center lg:justify-start gap-8">
              {["LinkedIn", "Github", "Instagram"].map((social) => (
                <div
                  key={social}
                  className="group flex cursor-pointer items-center gap-3 overflow-hidden"
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-black/20 group-hover:bg-black transition-colors duration-300" />
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-black/50 group-hover:text-black transition-colors duration-300">
                    {social}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
