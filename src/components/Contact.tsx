"use client";

import { gsap } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import { useRef, useState } from "react";

const inquiryTypes = ["Booking", "General", "Wedding", "Corporate", "Others"];

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const [selectedType, setSelectedType] = useState("General");
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("submitting");

    setTimeout(() => {
      setFormStatus("success");
      setTimeout(() => setFormStatus("idle"), 2500);
    }, 1400);
  };

  useGSAP(
    () => {
      if (
        !sectionRef.current ||
        !bgRef.current ||
        !leftRef.current ||
        !rightRef.current ||
        !cardRef.current
      ) {
        return;
      }

      const mm = gsap.matchMedia();

      mm.add("(min-width: 1025px)", () => {
        gsap.set(".contact-kicker", { y: 18, opacity: 0 });
        gsap.set(".contact-title-line", { yPercent: 110, opacity: 0 });
        gsap.set(".contact-copy", { y: 24, opacity: 0 });
        gsap.set(".contact-info-card", { y: 28, opacity: 0 });
        gsap.set(".contact-form-reveal", { y: 24, opacity: 0 });
        gsap.set(cardRef.current, { y: 34, opacity: 0, scale: 0.985 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        });

        tl.to(".contact-kicker", {
          y: 0,
          opacity: 1,
          duration: 0.55,
          ease: "power3.out",
        })
          .to(
            ".contact-title-line",
            {
              yPercent: 0,
              opacity: 1,
              duration: 0.9,
              stagger: 0.08,
              ease: "power4.out",
            },
            "-=0.25"
          )
          .to(
            ".contact-copy",
            {
              y: 0,
              opacity: 1,
              duration: 0.75,
              ease: "power3.out",
            },
            "-=0.45"
          )
          .to(
            ".contact-info-card",
            {
              y: 0,
              opacity: 1,
              duration: 0.75,
              stagger: 0.08,
              ease: "power3.out",
            },
            "-=0.3"
          )
          .to(
            cardRef.current,
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.95,
              ease: "power4.out",
            },
            "-=0.65"
          )
          .to(
            ".contact-form-reveal",
            {
              y: 0,
              opacity: 1,
              duration: 0.65,
              stagger: 0.05,
              ease: "power3.out",
            },
            "-=0.55"
          );

        gsap.to(bgRef.current, {
          yPercent: -10,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });

        gsap.to(leftRef.current, {
          yPercent: -5,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });

        gsap.to(rightRef.current, {
          yPercent: -7,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      mm.add("(max-width: 1024px)", () => {
        gsap.from(".contact-mobile-reveal", {
          opacity: 0,
          y: 30,
          stagger: 0.08,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            once: true,
          },
        });

        gsap.to(bgRef.current, {
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

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative overflow-hidden bg-[#f4f2ef] px-3 py-14 text-[#000000] sm:px-4 sm:py-16 md:px-6 md:py-20 xl:px-8 xl:py-28"
    >
      <div className="mx-auto max-w-[1800px]">
        <div className="relative overflow-hidden rounded-[26px] border border-black/10 bg-[#d9dde7] sm:rounded-[28px] lg:rounded-[32px]">
          <div
            ref={bgRef}
            className="absolute inset-0 bg-[url('/contact/contact-bg.jpg')] bg-cover bg-center opacity-90"
          />

          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(22,28,38,0.72)_0%,rgba(28,35,48,0.56)_28%,rgba(255,255,255,0.14)_68%,rgba(255,255,255,0.2)_100%)] xl:bg-[linear-gradient(90deg,rgba(28,34,48,0.68)_0%,rgba(36,43,60,0.48)_28%,rgba(255,255,255,0.12)_58%,rgba(255,255,255,0.18)_100%)]" />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_18%,rgba(255,255,255,0.16),transparent_35%),radial-gradient(circle_at_75%_24%,rgba(255,255,255,0.18),transparent_30%),radial-gradient(circle_at_55%_72%,rgba(255,255,255,0.1),transparent_28%)]" />

          <div className="relative z-10 grid min-h-[780px] grid-cols-1 gap-8 p-4 sm:p-5 md:p-6 lg:min-h-[860px] lg:p-8 xl:min-h-[900px] xl:grid-cols-[1.02fr_0.98fr] xl:gap-10">
            {/* LEFT */}
            <div
              ref={leftRef}
              className="flex flex-col justify-between rounded-[22px] p-2 sm:rounded-[24px] sm:p-3 md:p-4 xl:rounded-[28px] xl:p-6"
            >
              <div className="max-w-[680px]">
                <p className="contact-kicker contact-mobile-reveal mb-5 font-inter text-[9px] font-semibold uppercase tracking-[0.36em] text-white/72 sm:text-[10px] sm:tracking-[0.42em]">
                  [ Let&apos;s Talk ]
                </p>

                <div className="overflow-hidden">
                  <h2 className="contact-title-line contact-mobile-reveal font-syne text-[clamp(2.2rem,9vw,5.6rem)] font-semibold leading-[0.92] tracking-[-0.06em] text-white">
                    You Have Questions,
                  </h2>
                </div>

                <div className="overflow-hidden">
                  <h2 className="contact-title-line contact-mobile-reveal font-syne text-[clamp(2.2rem,9vw,5.6rem)] font-semibold leading-[0.92] tracking-[-0.06em] text-white">
                    I Have Answers
                  </h2>
                </div>

                <p className="contact-copy contact-mobile-reveal mt-5 max-w-[560px] font-inter text-sm leading-7 text-white/72 sm:text-base md:text-lg">
                  Let’s build something thoughtful, scalable, and visually refined — whether it is a
                  product, platform, or premium digital experience.
                </p>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-3 sm:mt-10 sm:grid-cols-2 sm:gap-4 lg:mt-12">
                <Link
                  href="https://www.google.com/maps/search/?api=1&query=Khulna,+Bangladesh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-info-card contact-mobile-reveal group rounded-[20px] border border-white/14 bg-white/10 p-5 text-white backdrop-blur-md transition-all duration-300 hover:border-white/24 hover:bg-white/15 sm:rounded-[22px] sm:p-6"
                >
                  <h3 className="font-syne text-xl font-semibold tracking-[-0.04em] sm:text-2xl">
                    Location
                  </h3>
                  <p className="mt-3 font-inter text-sm leading-7 text-white/78 transition-colors group-hover:text-white">
                    Khulna, Bangladesh 9000
                  </p>
                  <p className="mt-4 font-inter text-[10px] font-medium uppercase tracking-widest text-white/40 transition-colors group-hover:text-white/60">
                    Available Globally
                  </p>
                </Link>

                <div className="contact-info-card contact-mobile-reveal rounded-[20px] border border-white/14 bg-white/10 p-5 text-white backdrop-blur-md sm:rounded-[22px] sm:p-6">
                  <h3 className="font-syne text-xl font-semibold tracking-[-0.04em] sm:text-2xl">
                    Social Media
                  </h3>
                  <div className="mt-3 flex flex-col gap-2.5 font-inter text-sm text-white/78">
                    <Link
                      href="https://www.linkedin.com/in/achyuta1/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-fit transition-colors hover:text-white"
                    >
                      LinkedIn
                    </Link>
                    <Link
                      href="https://github.com/ArnabSaga"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-fit transition-colors hover:text-white"
                    >
                      Github
                    </Link>
                    <Link
                      href="https://www.instagram.com/rz_arnab_/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-fit transition-colors hover:text-white"
                    >
                      Instagram
                    </Link>
                  </div>
                </div>

                <Link
                  href="mailto:aranabdey15091@gmail.com"
                  className="contact-info-card contact-mobile-reveal group rounded-[20px] border border-white/14 bg-white/10 p-5 text-white backdrop-blur-md transition-all duration-300 hover:border-white/24 hover:bg-white/15 sm:rounded-[22px] sm:p-6"
                >
                  <h3 className="font-syne text-xl font-semibold tracking-[-0.04em] sm:text-2xl">
                    Email
                  </h3>
                  <p className="mt-3 break-all font-inter text-sm leading-7 text-white/78 transition-colors group-hover:text-white">
                    aranabdey15091@gmail.com
                  </p>
                </Link>

                <Link
                  href="tel:+8801933268979"
                  className="contact-info-card contact-mobile-reveal group rounded-[20px] border border-white/14 bg-white/10 p-5 text-white backdrop-blur-md transition-all duration-300 hover:border-white/24 hover:bg-white/15 sm:rounded-[22px] sm:p-6"
                >
                  <h3 className="font-syne text-xl font-semibold tracking-[-0.04em] sm:text-2xl">
                    Contact
                  </h3>
                  <p className="mt-3 font-inter text-sm leading-7 text-white/78 transition-colors group-hover:text-white">
                    +880 19 332 689 79
                  </p>
                </Link>
              </div>
            </div>

            {/* RIGHT */}
            <div ref={rightRef} className="flex items-start justify-center xl:justify-end">
              <div
                ref={cardRef}
                className="contact-mobile-reveal w-full max-w-[760px] rounded-[22px] border border-black/10 bg-[rgba(255,255,255,0.84)] p-5 shadow-[0_20px_70px_rgba(0,0,0,0.12)] backdrop-blur-xl sm:rounded-[24px] sm:p-6 md:p-7 xl:rounded-[28px] xl:p-10"
              >
                <div className="contact-form-reveal">
                  <h3 className="font-syne text-[clamp(1.7rem,5vw,2.6rem)] font-semibold leading-none tracking-[-0.04em] text-[#000000]">
                    Tell Me What You Need
                  </h3>
                </div>

                <div className="contact-form-reveal">
                  <p className="mt-3 max-w-[560px] font-inter text-sm leading-7 text-black/45 sm:mt-4 sm:text-base">
                    I’m ready to help with product ideas, fullstack builds, design systems, and
                    premium digital experiences.
                  </p>
                </div>

                <form className="mt-7 space-y-4 sm:mt-8 sm:space-y-5" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
                    <input
                      required
                      name="firstName"
                      className="contact-form-reveal h-13 rounded-full border border-black/12 bg-white/55 px-5 font-inter text-sm text-black outline-none placeholder:text-black/32 transition-all duration-300 focus:border-black/25 focus:bg-white sm:h-14"
                      placeholder="First Name"
                    />
                    <input
                      required
                      name="lastName"
                      className="contact-form-reveal h-13 rounded-full border border-black/12 bg-white/55 px-5 font-inter text-sm text-black outline-none placeholder:text-black/32 transition-all duration-300 focus:border-black/25 focus:bg-white sm:h-14"
                      placeholder="Last Name"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
                    <input
                      name="country"
                      className="contact-form-reveal h-13 rounded-full border border-black/12 bg-white/55 px-5 font-inter text-sm text-black outline-none placeholder:text-black/32 transition-all duration-300 focus:border-black/25 focus:bg-white sm:h-14"
                      placeholder="Country"
                    />
                    <input
                      name="phone"
                      className="contact-form-reveal h-13 rounded-full border border-black/12 bg-white/55 px-5 font-inter text-sm text-black outline-none placeholder:text-black/32 transition-all duration-300 focus:border-black/25 focus:bg-white sm:h-14"
                      placeholder="Phone Number"
                    />
                  </div>

                  <input
                    required
                    type="email"
                    name="email"
                    className="contact-form-reveal h-13 w-full rounded-full border border-black/12 bg-white/55 px-5 font-inter text-sm text-black outline-none placeholder:text-black/32 transition-all duration-300 focus:border-black/25 focus:bg-white sm:h-14"
                    placeholder="Email Address"
                  />

                  <div className="contact-form-reveal pt-2 sm:pt-3">
                    <p className="mb-3 font-inter text-sm font-medium text-black/50 sm:mb-4">
                      Type of Inquiry
                    </p>

                    <div className="flex flex-wrap gap-2.5 sm:gap-3">
                      {inquiryTypes.map((type) => {
                        const active = selectedType === type;

                        return (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setSelectedType(type)}
                            className={`rounded-full border px-4 py-2.5 font-inter text-sm transition-all duration-300 sm:px-5 sm:py-3 ${
                              active
                                ? "border-black/20 bg-white text-black shadow-[0_6px_20px_rgba(0,0,0,0.08)]"
                                : "border-black/10 bg-white/40 text-black/45 hover:border-black/16 hover:bg-white/60 hover:text-black/70"
                            }`}
                          >
                            {type}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <textarea
                    required
                    name="message"
                    rows={5}
                    className="contact-form-reveal w-full rounded-[20px] border border-black/12 bg-white/55 px-5 py-4 font-inter text-sm text-black outline-none placeholder:text-black/32 transition-all duration-300 focus:border-black/25 focus:bg-white resize-none sm:rounded-[24px]"
                    placeholder="Message"
                  />

                  <label className="contact-form-reveal group flex cursor-pointer items-start gap-3 pt-1 font-inter text-sm text-black/38">
                    <input
                      type="checkbox"
                      className="mt-0.5 h-4 w-4 rounded border-black/20 cursor-pointer"
                    />
                    <span className="transition-colors group-hover:text-black">
                      I’d like to receive exclusive offers and updates
                    </span>
                  </label>

                  <div className="contact-form-reveal pt-1 sm:pt-2">
                    <button
                      type="submit"
                      disabled={formStatus === "submitting" || formStatus === "success"}
                      className={`group flex h-14 w-full items-center justify-center rounded-full border border-black/14 font-syne text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-500 hover:scale-[1.01] hover:shadow-[0_14px_30px_rgba(0,0,0,0.12)] active:scale-[0.99] sm:h-16 sm:text-sm ${
                        formStatus === "success" ? "bg-black text-white" : "bg-white text-black"
                      }`}
                    >
                      <span className="mr-2">
                        {formStatus === "idle" && "Submit"}
                        {formStatus === "submitting" && "Sending..."}
                        {formStatus === "success" && "Sent Successfully!"}
                        {formStatus === "error" && "Try Again"}
                      </span>
                      {formStatus === "idle" && (
                        <span className="transition-transform duration-500 group-hover:translate-x-1">
                          →
                        </span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
