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

    // Simulate API call
    setTimeout(() => {
      setFormStatus("success");
      setTimeout(() => setFormStatus("idle"), 3000);
    }, 1500);
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

      const ctx = gsap.context(() => {
        gsap.set(".contact-kicker", { y: 20, opacity: 0 });
        gsap.set(".contact-title-line", { yPercent: 110, opacity: 0 });
        gsap.set(".contact-copy", { y: 28, opacity: 0 });
        gsap.set(".contact-info-card", { y: 32, opacity: 0 });
        gsap.set(".contact-form-reveal", { y: 32, opacity: 0 });
        gsap.set(cardRef.current, { y: 40, opacity: 0, scale: 0.98 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 72%",
            toggleActions: "play none none reverse",
          },
        });

        tl.to(".contact-kicker", {
          y: 0,
          opacity: 1,
          duration: 0.6,
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
            "-=0.3"
          )
          .to(
            ".contact-copy",
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              ease: "power3.out",
            },
            "-=0.45"
          )
          .to(
            ".contact-info-card",
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              stagger: 0.08,
              ease: "power3.out",
            },
            "-=0.35"
          )
          .to(
            cardRef.current,
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 1,
              ease: "power4.out",
            },
            "-=0.75"
          )
          .to(
            ".contact-form-reveal",
            {
              y: 0,
              opacity: 1,
              duration: 0.7,
              stagger: 0.05,
              ease: "power3.out",
            },
            "-=0.65"
          );

        gsap.to(bgRef.current, {
          yPercent: -12,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });

        gsap.to(leftRef.current, {
          yPercent: -6,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });

        gsap.to(rightRef.current, {
          yPercent: -10,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }, sectionRef);

      return () => ctx.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative overflow-hidden bg-[#f4f2ef] px-4 py-20 text-[#000000] md:px-8 md:py-28"
    >
      <div className="mx-auto max-w-[1800px]">
        <div className="relative overflow-hidden rounded-[32px] border border-black/10 bg-[#d9dde7] min-h-[900px]">
          {/* Background image layer */}
          <div
            ref={bgRef}
            className="absolute inset-0 bg-[url('/contact/contact-bg.jpg')] bg-cover bg-center opacity-90"
          />

          {/* Dark-to-light overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(28,34,48,0.68)_0%,rgba(36,43,60,0.48)_28%,rgba(255,255,255,0.12)_58%,rgba(255,255,255,0.18)_100%)]" />

          {/* Soft glass haze */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_18%,rgba(255,255,255,0.16),transparent_35%),radial-gradient(circle_at_75%_24%,rgba(255,255,255,0.18),transparent_30%),radial-gradient(circle_at_55%_72%,rgba(255,255,255,0.1),transparent_28%)]" />

          <div className="relative z-10 grid min-h-[900px] grid-cols-1 gap-10 p-6 md:p-8 xl:grid-cols-[1.05fr_0.95fr] xl:gap-12">
            {/* LEFT SIDE */}
            <div
              ref={leftRef}
              className="flex flex-col justify-between rounded-[28px] p-4 md:p-6 xl:p-8"
            >
              <div className="max-w-[640px]">
                <p className="contact-kicker mb-6 font-inter text-[10px] font-semibold uppercase tracking-[0.42em] text-white/70">
                  [ Let&apos;s Talk ]
                </p>

                <div className="overflow-hidden">
                  <h2 className="contact-title-line font-syne text-[clamp(3rem,6vw,5.6rem)] font-semibold leading-[0.92] tracking-[-0.06em] text-white">
                    You Have Questions,
                  </h2>
                </div>

                <div className="overflow-hidden">
                  <h2 className="contact-title-line font-syne text-[clamp(3rem,6vw,5.6rem)] font-semibold leading-[0.92] tracking-[-0.06em] text-white">
                    I Have Answers
                  </h2>
                </div>

                <p className="contact-copy mt-6 max-w-[520px] font-inter text-base leading-7 text-white/72 md:text-lg">
                  Discover experiences you won&apos;t find anywhere else — thoughtfully designed to
                  immerse you in the heart of the destination. Soulful stories waiting to be lived.
                </p>
              </div>

              <div className="mt-12 grid grid-cols-1 gap-4 md:mt-16 md:grid-cols-2">
                <Link
                  href="https://www.google.com/maps/search/?api=1&query=Khulna,+Bangladesh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-info-card group rounded-[26px] border border-white/14 bg-white/10 p-6 text-white backdrop-blur-md transition-all duration-300 hover:bg-white/15 hover:border-white/25"
                >
                  <h3 className="font-syne text-2xl font-semibold tracking-[-0.04em]">Location</h3>
                  <p className="mt-4 font-inter text-sm leading-7 text-white/78 group-hover:text-white transition-colors">
                    Khulna, Bangladesh 9000
                  </p>
                  <p className="mt-5 font-inter text-[10px] font-medium uppercase tracking-widest text-white/40 group-hover:text-white/60 transition-colors">
                    Available Globally
                  </p>
                </Link>

                <div className="contact-info-card rounded-[26px] border border-white/14 bg-white/10 p-6 text-white backdrop-blur-md transition-all duration-300">
                  <h3 className="font-syne text-2xl font-semibold tracking-[-0.04em]">
                    Social Media
                  </h3>
                  <div className="mt-4 flex flex-col gap-3 font-inter text-sm text-white/78">
                    <Link
                      href="https://www.linkedin.com/in/achyuta1/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white transition-colors w-fit"
                    >
                      LinkedIn
                    </Link>
                    <Link
                      href="https://github.com/ArnabSaga"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white transition-colors w-fit"
                    >
                      Github
                    </Link>
                    <Link
                      href="https://www.instagram.com/rz_arnab_/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className=" transition-colors w-fit"
                    >
                      Instagram
                    </Link>
                  </div>
                </div>

                <Link
                  href="mailto:aranabdey15091@gmail.com"
                  className="contact-info-card group rounded-[26px] border border-white/14 bg-white/10 p-6 text-white backdrop-blur-md transition-all duration-300"
                >
                  <h3 className="font-syne text-2xl font-semibold tracking-[-0.04em]">Email</h3>
                  <p className="mt-4 font-inter text-sm leading-7 text-white/78 group-hover:text-white transition-colors break-all">
                    aranabdey15091@gmail.com
                  </p>
                </Link>

                <Link
                  href="tel:+8801933268979"
                  className="contact-info-card group rounded-[26px] border border-white/14 bg-white/10 p-6 text-white backdrop-blur-md transition-all duration-300"
                >
                  <h3 className="font-syne text-2xl font-semibold tracking-[-0.04em]">Contact</h3>
                  <p className="mt-4 font-inter text-sm leading-7 text-white/78 group-hover:text-white transition-colors">
                    +880 19 332 689 79
                  </p>
                </Link>
              </div>
            </div>

            {/* RIGHT SIDE FORM */}
            <div ref={rightRef} className="flex items-start justify-center xl:justify-end">
              <div
                ref={cardRef}
                className="w-full max-w-[720px] rounded-[28px] border border-black/10 bg-[rgba(255,255,255,0.82)] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.12)] backdrop-blur-xl md:p-8 xl:p-10"
              >
                <div className="contact-form-reveal">
                  <h3 className="font-syne text-[clamp(2rem,3vw,2.6rem)] font-semibold leading-none tracking-[-0.04em] text-[#000000]">
                    Tell Me What You Need
                  </h3>
                </div>

                <div className="contact-form-reveal">
                  <p className="mt-4 max-w-[560px] font-inter text-base leading-7 text-black/45">
                    I am ready to assist you with every detail, big or small.
                  </p>
                </div>

                <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <input
                      required
                      name="firstName"
                      className="contact-form-reveal h-14 rounded-full border border-black/12 bg-white/50 px-5 font-inter text-sm text-black outline-none placeholder:text-black/32 transition-all duration-300 focus:border-black/25 focus:bg-white"
                      placeholder="First Name"
                    />
                    <input
                      required
                      name="lastName"
                      className="contact-form-reveal h-14 rounded-full border border-black/12 bg-white/50 px-5 font-inter text-sm text-black outline-none placeholder:text-black/32 transition-all duration-300 focus:border-black/25 focus:bg-white"
                      placeholder="Last Name"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <input
                      name="country"
                      className="contact-form-reveal h-14 rounded-full border border-black/12 bg-white/50 px-5 font-inter text-sm text-black outline-none placeholder:text-black/32 transition-all duration-300 focus:border-black/25 focus:bg-white"
                      placeholder="Country"
                    />
                    <input
                      name="phone"
                      className="contact-form-reveal h-14 rounded-full border border-black/12 bg-white/50 px-5 font-inter text-sm text-black outline-none placeholder:text-black/32 transition-all duration-300 focus:border-black/25 focus:bg-white"
                      placeholder="Phone Number"
                    />
                  </div>

                  <input
                    required
                    type="email"
                    name="email"
                    className="contact-form-reveal h-14 w-full rounded-full border border-black/12 bg-white/50 px-5 font-inter text-sm text-black outline-none placeholder:text-black/32 transition-all duration-300 focus:border-black/25 focus:bg-white"
                    placeholder="Email Address"
                  />

                  <div className="contact-form-reveal pt-3">
                    <p className="mb-4 font-inter text-sm font-medium text-black/50">
                      Type of Inquiry
                    </p>

                    <div className="flex flex-wrap gap-3">
                      {inquiryTypes.map((type) => {
                        const active = selectedType === type;

                        return (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setSelectedType(type)}
                            className={`rounded-full border px-5 py-3 font-inter text-sm transition-all duration-300 ${
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
                    rows={6}
                    className="contact-form-reveal w-full rounded-[24px] border border-black/12 bg-white/50 px-5 py-4 font-inter text-sm text-black outline-none placeholder:text-black/32 transition-all duration-300 focus:border-black/25 focus:bg-white resize-none"
                    placeholder="Message"
                  />

                  <label className="contact-form-reveal flex items-center gap-3 pt-1 font-inter text-sm text-black/38 cursor-pointer group">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-black/20 cursor-pointer"
                    />
                    <span className="group-hover:text-black transition-colors">
                      I’d like to receive exclusive offers and updates
                    </span>
                  </label>

                  <div className="contact-form-reveal pt-2">
                    <button
                      type="submit"
                      disabled={formStatus === "submitting" || formStatus === "success"}
                      className={`group flex h-16 w-full items-center justify-center rounded-full border border-black/14 font-syne text-sm font-bold uppercase tracking-[0.2em] transition-all duration-500 hover:scale-[1.01] hover:shadow-[0_14px_30px_rgba(0,0,0,0.12)] active:scale-[0.99] ${
                        formStatus === "success" ? "bg-black text-white" : "bg-white text-black"
                      }`}
                    >
                      <span className="mr-2">
                        {formStatus === "idle" && "Submit"}
                        {formStatus === "submitting" && "Sending..."}
                        {formStatus === "success" && "Sent Successfully!"}
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
