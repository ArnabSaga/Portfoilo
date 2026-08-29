"use client";

import { Magnetic } from "@/components/motion/Magnetic";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Flip, gsap, motion } from "@/lib/gsap";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

const navLinks = [
  { href: "#work", label: "Work", number: "01" },
  { href: "#stack", label: "Stack", number: "02" },
  { href: "#experience", label: "Journey", number: "03" },
  { href: "#contact", label: "Contact", number: "04" },
] as const;

type SectionId = (typeof navLinks)[number]["href"] | null;

const RESUME_URL =
  "https://drive.google.com/file/d/1DXPHzJPxcWU0pD_o8vN6IqQBXL-lVzt3/view?usp=sharing";

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuPanelRef = useRef<HTMLDivElement>(null);
  const capsuleRef = useRef<HTMLSpanElement>(null);
  const lastScrollY = useRef(0);
  const [activeSection, setActiveSection] = useState<SectionId>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const reducedMotion = useReducedMotion();

  const measureSections = useCallback(() => {
    const anchor = window.scrollY + window.innerHeight * 0.42;
    let current: SectionId = null;

    const sections = navLinks
      .map((item) => ({ item, section: document.querySelector<HTMLElement>(item.href) }))
      .filter((entry): entry is { item: (typeof navLinks)[number]; section: HTMLElement } => Boolean(entry.section))
      .sort((a, b) => a.section.offsetTop - b.section.offsetTop);

    for (const { item, section } of sections) {
      if (section.offsetTop <= anchor) current = item.href;
    }

    setActiveSection(current);
  }, []);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const currentY = window.scrollY;
        setCompact(currentY > 96 && currentY > lastScrollY.current);
        lastScrollY.current = currentY;
        measureSections();
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    window.addEventListener("hashchange", update);
    window.addEventListener("popstate", update);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      window.removeEventListener("hashchange", update);
      window.removeEventListener("popstate", update);
    };
  }, [measureSections]);

  useLayoutEffect(() => {
    const capsule = capsuleRef.current;
    if (!capsule || !activeSection) return;
    const target = document.querySelector<HTMLElement>(`[data-nav-link="${activeSection}"]`);
    if (!target) return;

    gsap.set(capsule, { display: "block" });
    Flip.fit(capsule, target, {
      duration: reducedMotion ? 0 : motion.duration.interface,
      ease: motion.ease.interface,
    });
  }, [activeSection, reducedMotion]);

  useEffect(() => {
    if (!menuOpen) return;
    const firstLink = menuPanelRef.current?.querySelector<HTMLAnchorElement>("a");
    firstLink?.focus();

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setMenuOpen(false);
      menuButtonRef.current?.focus();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  useEffect(() => {
    if (!navRef.current || reducedMotion) return;
    const context = gsap.context(() => {
      gsap.from("[data-nav-piece]", {
        y: -18,
        opacity: 0,
        stagger: motion.stagger.item,
        duration: motion.duration.interface,
        ease: motion.ease.interface,
      });
    }, navRef);
    return () => context.revert();
  }, [reducedMotion]);

  return (
    <nav
      ref={navRef}
      aria-label="Primary navigation"
      data-compact={compact}
      className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 py-3 sm:px-5 md:px-7"
    >
      <div className="flex items-start justify-between gap-3 transition-transform duration-500 data-[compact=true]:scale-[0.94]" data-compact={compact}>
        <Link
          data-nav-piece
          href="#hero"
          aria-label="Return to introduction"
          className="pointer-events-auto relative flex min-h-11 min-w-11 items-center justify-center overflow-hidden rounded-2xl border border-foreground/10 bg-surface/80 p-2 shadow-[var(--shadow-floating)] backdrop-blur-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground"
        >
          <Image src="/logo/logo.jpg" alt="AAD" width={44} height={44} className="h-7 w-auto sm:h-9" priority />
        </Link>

        <div
          data-nav-piece
          className="pointer-events-auto relative hidden items-center rounded-full border border-foreground/10 bg-surface/80 p-1.5 shadow-[var(--shadow-floating)] backdrop-blur-xl md:flex"
        >
          <span
            ref={capsuleRef}
            aria-hidden="true"
            className={`absolute left-0 top-0 z-0 rounded-full bg-foreground ${activeSection ? "block" : "hidden"}`}
          />
          {navLinks.map((item) => {
            const active = activeSection === item.href;
            return (
              <Link
                key={item.href}
                data-nav-link={item.href}
                href={item.href}
                aria-current={active ? "location" : undefined}
                className={`relative z-10 flex min-h-11 items-center gap-2 rounded-full px-4 font-inter text-[10px] font-semibold uppercase tracking-[0.18em] transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground lg:px-5 ${active ? "text-inverse" : "text-foreground/58 hover:text-foreground"}`}
              >
                <span className="text-[8px] opacity-60">{item.number}</span>
                {item.label}
              </Link>
            );
          })}
        </div>

        <div data-nav-piece className="pointer-events-auto flex items-center gap-2">
          <button
            ref={menuButtonRef}
            type="button"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((value) => !value)}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-foreground/10 bg-surface/80 shadow-[var(--shadow-floating)] backdrop-blur-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground md:hidden"
          >
            <span aria-hidden="true" className="font-inter text-[9px] font-bold uppercase tracking-[0.2em]">{menuOpen ? "Close" : "Menu"}</span>
          </button>

          <Magnetic>
            <a
              href={RESUME_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex min-h-11 items-center gap-2 rounded-2xl border border-foreground/12 bg-foreground px-4 font-syne text-[10px] font-bold uppercase tracking-[0.18em] text-inverse shadow-[var(--shadow-floating)] transition-transform duration-300 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground sm:px-5"
            >
              Resume
              <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">↗</span>
            </a>
          </Magnetic>
        </div>
      </div>

      {menuOpen && (
        <div id="mobile-navigation" ref={menuPanelRef} className="pointer-events-auto pt-3 md:hidden">
          <div className="rounded-3xl border border-foreground/10 bg-surface/94 p-3 shadow-[var(--shadow-floating)] backdrop-blur-xl">
            <ul className="space-y-1">
              {navLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={activeSection === item.href ? "location" : undefined}
                    onClick={() => setMenuOpen(false)}
                    className="flex min-h-12 items-center justify-between rounded-2xl px-4 font-syne text-lg font-bold uppercase focus-visible:outline-2 focus-visible:outline-foreground"
                  >
                    {item.label}<span className="font-inter text-[9px] tracking-[0.2em]">{item.number}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </nav>
  );
}
