"use client";

import { gsap } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { useRef } from "react";

const stats = [
  // { value: "03+", label: "Years Building" },
  { value: "06+", label: "Core Projects" },
  { value: "100%", label: "Architecture Focused" },
];

const socials = [
  { name: "Github", url: "https://github.com/ArnabSaga" },
  { name: "LinkedIn", url: "https://www.linkedin.com/in/achyuta1/" },
  // { name: "Instagram", url: "https://www.instagram.com/rz_arnab_/" },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const portraitFrameRef = useRef<HTMLDivElement>(null);
  const portraitInnerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (
        !sectionRef.current ||
        !containerRef.current ||
        !portraitFrameRef.current ||
        !portraitInnerRef.current ||
        !contentRef.current
      ) {
        return;
      }

      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        gsap.set(portraitFrameRef.current, {
          clipPath: "inset(100% 0 0 0 round 32px)",
        });

        gsap.set(portraitInnerRef.current, {
          scale: 1.12,
          y: 36,
        });

        gsap.set(".about-kicker", {
          y: 20,
          opacity: 0,
        });

        gsap.set(".about-heading-line", {
          yPercent: 110,
          opacity: 0,
        });

        gsap.set(".about-copy", {
          y: 30,
          opacity: 0,
        });

        gsap.set(".about-stat", {
          y: 24,
          opacity: 0,
        });

        gsap.set(".about-social", {
          y: 18,
          opacity: 0,
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 72%",
            toggleActions: "play none none reverse",
          },
          defaults: {
            ease: "power4.out",
          },
        });

        tl.to(".about-kicker", {
          y: 0,
          opacity: 1,
          duration: 0.55,
        })
          .to(
            portraitFrameRef.current,
            {
              clipPath: "inset(0% 0 0 0 round 32px)",
              duration: 1.4,
            },
            "-=0.15"
          )
          .to(
            portraitInnerRef.current,
            {
              scale: 1,
              y: 0,
              duration: 1.5,
            },
            "<"
          )
          .to(
            ".about-heading-line",
            {
              yPercent: 0,
              opacity: 1,
              duration: 1,
              stagger: 0.08,
            },
            "-=1.05"
          )
          .to(
            ".about-copy",
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              stagger: 0.08,
            },
            "-=0.7"
          )
          .to(
            ".about-stat",
            {
              y: 0,
              opacity: 1,
              duration: 0.7,
              stagger: 0.06,
            },
            "-=0.55"
          )
          .to(
            ".about-social",
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              stagger: 0.06,
            },
            "-=0.5"
          );

        gsap.to(portraitInnerRef.current, {
          yPercent: -8,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });

        gsap.to(contentRef.current, {
          yPercent: -4,
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
        gsap.from(".about-mobile-reveal", {
          y: 28,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            once: true,
          },
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative overflow-hidden bg-[#f3f3f3] px-3 py-3 text-black sm:px-4 md:px-6"
    >
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden rounded-[28px] bg-[#e9e9ea] px-5 py-10 sm:px-6 sm:py-12 md:px-8 md:py-14 lg:min-h-[92vh] lg:rounded-[40px] lg:px-12 lg:py-16 xl:px-16 xl:py-20"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.03),transparent_70%)] opacity-60" />
        <div className="pointer-events-none absolute left-[8%] top-[10%] h-[180px] w-[180px] rounded-full bg-black/2 blur-[70px] md:h-[260px] md:w-[260px]" />
        <div className="pointer-events-none absolute bottom-[8%] right-[8%] h-[220px] w-[220px] rounded-full bg-black/2 blur-[80px] md:h-[300px] md:w-[300px]" />

        <div className="relative z-10 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14 xl:gap-20">
          {/* Portrait */}
          <div className="about-mobile-reveal lg:col-span-5 flex items-center justify-center lg:justify-start">
            <div
              ref={portraitFrameRef}
              className="relative aspect-4/5 w-full max-w-[340px] overflow-hidden rounded-[24px] shadow-[0_20px_60px_rgba(0,0,0,0.12)] sm:max-w-[400px] md:max-w-[460px] lg:max-w-none lg:rounded-[32px]"
            >
              <div ref={portraitInnerRef} className="relative h-full w-full will-change-transform">
                <Image
                  src="/image/backward-profile.png"
                  alt="Portrait of Achyuta Arnab Dey"
                  fill
                  priority
                  className="object-cover grayscale brightness-[1.02] contrast-[1.05]"
                  sizes="(max-width: 1024px) 90vw, 40vw"
                />
              </div>
            </div>
          </div>

          {/* Content */}
          <div ref={contentRef} className="lg:col-span-7 flex flex-col justify-center">
            <p className="about-kicker about-mobile-reveal mb-5 font-inter text-[9px] font-semibold uppercase tracking-[0.42em] text-black/36 sm:text-[10px]">
              [ About Me ]
            </p>

            <div className="overflow-hidden">
              <h2 className="about-heading-line about-mobile-reveal font-syne text-[clamp(2.2rem,7vw,4.8rem)] font-extrabold uppercase leading-[0.9] tracking-[-0.07em] text-black">
                Architecting the Future
              </h2>
            </div>

            <div className="overflow-hidden">
              <h2 className="about-heading-line about-mobile-reveal font-syne text-[clamp(2.2rem,7vw,4.8rem)] font-extrabold uppercase leading-[0.9] tracking-[-0.07em] text-black">
                of Multi-tenant
              </h2>
            </div>

            <div className="overflow-hidden">
              <h2 className="about-heading-line about-mobile-reveal font-syne text-[clamp(2.2rem,7vw,4.8rem)] font-extrabold uppercase leading-[0.9] tracking-[-0.07em] text-black">
                <span className="italic font-light text-black/58">Infrastructure.</span>
              </h2>
            </div>

            <div className="mt-8 space-y-5 sm:space-y-6">
              <p className="about-copy about-mobile-reveal max-w-2xl font-inter text-base leading-7 text-black/68 sm:text-lg sm:leading-8">
                True engineering lives beneath the surface. I specialize in building complex,
                production-ready SaaS platforms where security and tenant isolation are baked into
                the DNA of the code.
              </p>

              <p className="about-copy about-mobile-reveal max-w-2xl font-inter text-base leading-7 text-black/68 sm:text-lg sm:leading-8">
                My methodology prioritizes logical data isolation, granular RBAC, and
                high-performance API architecture. I believe a beautiful interface is only as good
                as the systems that power it — I build the power.
              </p>
            </div>

            {/* Stats */}
            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5 lg:mt-12">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="about-stat about-mobile-reveal rounded-[20px] border border-black/8 bg-white/45 px-5 py-5 backdrop-blur-sm"
                >
                  <div className="font-syne text-3xl font-extrabold uppercase tracking-[-0.05em] text-black sm:text-4xl">
                    {stat.value}
                  </div>
                  <div className="mt-2 font-inter text-[10px] font-semibold uppercase tracking-[0.28em] text-black/42 sm:text-[11px]">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Socials */}
            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-4 sm:mt-12 lg:gap-x-8">
              {socials.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="about-social about-mobile-reveal group inline-flex items-center gap-3"
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-black/20 transition-colors duration-300 group-hover:bg-black" />
                  <span className="font-inter text-[10px] font-semibold uppercase tracking-[0.22em] text-black/48 transition-colors duration-300 group-hover:text-black sm:text-xs">
                    {social.name}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
