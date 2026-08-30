"use client";

import { Magnetic } from "@/components/motion/Magnetic";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Flip, gsap, motion, ScrollTrigger } from "@/lib/gsap";
import Image from "next/image";
import {
  type FocusEvent as ReactFocusEvent,
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

type NavChapter = "index" | "stack" | "experience" | "work" | "contact";
type NavTone = "light" | "dark";
type NavDensity = "expanded" | "compact";
type ScrollDirection = "up" | "down" | null;
type MenuCloseReason = "toggle" | "escape" | "selection" | "outside" | "focus-leave";

interface NavLinkItem {
  chapter: Exclude<NavChapter, "index">;
  href: `#${Exclude<NavChapter, "index">}`;
  label: string;
  number: string;
}

const navLinks: readonly NavLinkItem[] = [
  { chapter: "stack", href: "#stack", label: "Stack", number: "01" },
  { chapter: "experience", href: "#experience", label: "Journey", number: "02" },
  { chapter: "work", href: "#work", label: "Work", number: "03" },
  { chapter: "contact", href: "#contact", label: "Contact", number: "04" },
];

const RESUME_URL =
  "https://drive.google.com/file/d/1DXPHzJPxcWU0pD_o8vN6IqQBXL-lVzt3/view?usp=sharing";
const CHAPTER_PROBE_RATIO = 0.42;
const TOP_EXPANDED_LIMIT = 96;
const COMPACT_DISTANCE = 32;
const EXPAND_DISTANCE = 18;
const DESKTOP_QUERY = "(min-width: 1025px)";
const FINE_POINTER_QUERY = "(hover: hover) and (pointer: fine)";

const chapterProgress: Record<NavChapter, number> = {
  index: 0,
  stack: 0.25,
  experience: 0.5,
  work: 0.75,
  contact: 1,
};

function getTone(chapter: NavChapter): NavTone {
  return chapter === "stack" || chapter === "experience" ? "dark" : "light";
}

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const desktopControllerRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuPanelRef = useRef<HTMLDivElement>(null);
  const capsuleRef = useRef<HTMLSpanElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const menuTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const scheduleMeasureRef = useRef<() => void>(() => undefined);
  const menuCloseReasonRef = useRef<MenuCloseReason>("toggle");
  const lastScrollYRef = useRef(0);
  const accumulatedDistanceRef = useRef(0);
  const lastDirectionRef = useRef<ScrollDirection>(null);
  const hoveredRef = useRef(false);
  const focusWithinRef = useRef(false);
  const menuOpenRef = useRef(false);
  const finePointerRef = useRef(false);
  const reducedMotionRef = useRef(false);
  const previousChapterRef = useRef<NavChapter>("index");

  const [chapter, setChapter] = useState<NavChapter>("index");
  const [density, setDensity] = useState<NavDensity>("expanded");
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuInteractive, setMenuInteractive] = useState(false);
  const reducedMotion = useReducedMotion();
  const desktopMode = useMediaQuery(DESKTOP_QUERY);
  const finePointer = useMediaQuery(FINE_POINTER_QUERY);
  const tone = getTone(chapter);

  const resetDensityTracking = useCallback(() => {
    lastScrollYRef.current = window.scrollY;
    accumulatedDistanceRef.current = 0;
    lastDirectionRef.current = null;
  }, []);

  const requestExpanded = useCallback(() => {
    resetDensityTracking();
    setDensity((current) => (current === "expanded" ? current : "expanded"));
    scheduleMeasureRef.current();
  }, [resetDensityTracking]);

  const focusAfterDesktopTransition = useCallback((focusedChapter: string | undefined) => {
    window.requestAnimationFrame(() => {
      const target = focusedChapter
        ? document.querySelector<HTMLAnchorElement>(`[data-desktop-nav="${focusedChapter}"]`)
        : logoRef.current;
      (target ?? logoRef.current)?.focus({ preventScroll: true });
    });
  }, []);

  const finishMenuClose = useCallback(() => {
    const panel = menuPanelRef.current;
    const reason = menuCloseReasonRef.current;
    const focusStayedInside = Boolean(panel?.contains(document.activeElement));

    setMenuInteractive(false);
    gsap.set(panel, { autoAlpha: 0, y: -8, pointerEvents: "none" });

    if ((reason === "escape" || reason === "selection") && focusStayedInside) {
      window.requestAnimationFrame(() => {
        menuButtonRef.current?.focus({ preventScroll: true });
      });
    }
  }, []);

  const closeMenu = useCallback(
    (reason: MenuCloseReason) => {
      menuCloseReasonRef.current = reason;
      menuOpenRef.current = false;
      setMenuOpen(false);
      if (reducedMotion) finishMenuClose();
      resetDensityTracking();
      scheduleMeasureRef.current();
    },
    [finishMenuClose, reducedMotion, resetDensityTracking]
  );

  const openMenu = useCallback(() => {
    menuCloseReasonRef.current = "toggle";
    menuOpenRef.current = true;
    setMenuInteractive(true);
    setMenuOpen(true);
    requestExpanded();
  }, [requestExpanded]);

  useEffect(() => {
    finePointerRef.current = finePointer;
    reducedMotionRef.current = reducedMotion;
  }, [desktopMode, finePointer, reducedMotion]);

  useEffect(() => {
    const progressElement = progressRef.current;
    if (!progressElement) return;

    const setProgress = gsap.quickSetter(progressElement, "scaleX");
    let rafId: number | null = null;

    const resetTracking = (scrollY: number) => {
      lastScrollYRef.current = scrollY;
      accumulatedDistanceRef.current = 0;
      lastDirectionRef.current = null;
    };

    const measureController = () => {
      const currentScrollY = window.scrollY;
      const probe = window.innerHeight * CHAPTER_PROBE_RATIO;
      let nextChapter: NavChapter = "index";

      for (const item of navLinks) {
        const element = document.getElementById(item.chapter);
        const top = element?.getBoundingClientRect().top;
        if (typeof top === "number" && top <= probe) nextChapter = item.chapter;
      }

      setChapter((current) => (current === nextChapter ? current : nextChapter));

      if (reducedMotionRef.current) {
        setProgress(chapterProgress[nextChapter]);
      } else {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const progress = maxScroll > 0 ? currentScrollY / maxScroll : 0;
        setProgress(gsap.utils.clamp(0, 1, progress));
      }

      const forcedExpanded =
        currentScrollY <= TOP_EXPANDED_LIMIT ||
        menuOpenRef.current ||
        focusWithinRef.current ||
        (finePointerRef.current && hoveredRef.current);

      if (forcedExpanded) {
        setDensity((current) => (current === "expanded" ? current : "expanded"));
        resetTracking(currentScrollY);
        return;
      }

      const delta = currentScrollY - lastScrollYRef.current;
      const direction: ScrollDirection = delta > 0 ? "down" : delta < 0 ? "up" : null;

      if (direction && direction !== lastDirectionRef.current) {
        accumulatedDistanceRef.current = 0;
        lastDirectionRef.current = direction;
      }

      if (direction) accumulatedDistanceRef.current += Math.abs(delta);

      if (direction === "down" && accumulatedDistanceRef.current >= COMPACT_DISTANCE) {
        setDensity((current) => (current === "compact" ? current : "compact"));
        accumulatedDistanceRef.current = 0;
      } else if (direction === "up" && accumulatedDistanceRef.current >= EXPAND_DISTANCE) {
        setDensity((current) => (current === "expanded" ? current : "expanded"));
        accumulatedDistanceRef.current = 0;
      }

      lastScrollYRef.current = currentScrollY;
    };

    const scheduleMeasure = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = null;
        measureController();
      });
    };

    scheduleMeasureRef.current = scheduleMeasure;
    resetTracking(window.scrollY);
    scheduleMeasure();

    window.addEventListener("scroll", scheduleMeasure, { passive: true });
    window.addEventListener("resize", scheduleMeasure);
    window.addEventListener("hashchange", scheduleMeasure);
    window.addEventListener("popstate", scheduleMeasure);
    ScrollTrigger.addEventListener("refresh", scheduleMeasure);

    return () => {
      window.removeEventListener("scroll", scheduleMeasure);
      window.removeEventListener("resize", scheduleMeasure);
      window.removeEventListener("hashchange", scheduleMeasure);
      window.removeEventListener("popstate", scheduleMeasure);
      ScrollTrigger.removeEventListener("refresh", scheduleMeasure);
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      rafId = null;
      scheduleMeasureRef.current = () => undefined;
      gsap.set(progressElement, { clearProps: "transform" });
    };
  }, []);

  useEffect(() => {
    resetDensityTracking();
    scheduleMeasureRef.current();
  }, [desktopMode, finePointer, reducedMotion, resetDensityTracking]);

  useEffect(() => {
    if (!desktopMode) return;

    const panel = menuPanelRef.current;
    const activeElement = document.activeElement;
    const focusWasInside = Boolean(panel?.contains(activeElement));
    const focusedChapter =
      activeElement instanceof HTMLElement ? activeElement.dataset.mobileNav : undefined;

    menuTimelineRef.current?.kill();
    menuTimelineRef.current = null;
    menuOpenRef.current = false;
    gsap.set(panel, { autoAlpha: 0, y: -8, pointerEvents: "none" });
    resetDensityTracking();

    const closeFrame = window.requestAnimationFrame(() => {
      setMenuOpen(false);
      setMenuInteractive(false);
      if (focusWasInside) focusAfterDesktopTransition(focusedChapter);
    });

    return () => window.cancelAnimationFrame(closeFrame);
  }, [desktopMode, focusAfterDesktopTransition, resetDensityTracking]);

  useLayoutEffect(() => {
    const panel = menuPanelRef.current;
    if (!panel || desktopMode) return;

    const items = panel.querySelectorAll<HTMLElement>("[data-mobile-nav]");
    menuTimelineRef.current?.kill();

    if (menuOpen) {
      gsap.set(panel, { visibility: "visible", pointerEvents: "auto" });

      if (reducedMotion) {
        gsap.set(panel, { opacity: 1, y: 0 });
        gsap.set(items, { opacity: 1, y: 0 });
      } else {
        menuTimelineRef.current = gsap
          .timeline()
          .fromTo(
            panel,
            { opacity: 0, y: -8 },
            {
              opacity: 1,
              y: 0,
              duration: motion.duration.micro,
              ease: motion.ease.interface,
            }
          )
          .fromTo(
            items,
            { opacity: 0, y: 6 },
            {
              opacity: 1,
              y: 0,
              stagger: motion.stagger.text,
              duration: motion.duration.hover,
              ease: motion.ease.interface,
            },
            0
          );
      }

      const focusFrame = window.requestAnimationFrame(() => {
        panel.querySelector<HTMLAnchorElement>("a")?.focus({ preventScroll: true });
      });

      return () => window.cancelAnimationFrame(focusFrame);
    }

    if (!menuInteractive) {
      gsap.set(panel, { autoAlpha: 0, y: -8, pointerEvents: "none" });
      return;
    }

    if (reducedMotion) {
      const closeFrame = window.requestAnimationFrame(finishMenuClose);
      return () => window.cancelAnimationFrame(closeFrame);
    }

    gsap.set(panel, { pointerEvents: "none" });
    menuTimelineRef.current = gsap.timeline({ onComplete: finishMenuClose }).to(panel, {
      opacity: 0,
      y: -8,
      duration: motion.duration.micro,
      ease: motion.ease.interface,
    });
  }, [desktopMode, finishMenuClose, menuInteractive, menuOpen, reducedMotion]);

  useEffect(() => {
    if (!menuOpen || desktopMode) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu("escape");
    };
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (
        target &&
        !menuPanelRef.current?.contains(target) &&
        !menuButtonRef.current?.contains(target)
      ) {
        closeMenu("outside");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [closeMenu, desktopMode, menuOpen]);

  useLayoutEffect(() => {
    const capsule = capsuleRef.current;
    if (!capsule) return;

    if (chapter === "index") {
      if (reducedMotion) {
        gsap.set(capsule, { autoAlpha: 0 });
      } else {
        gsap.to(capsule, {
          autoAlpha: 0,
          duration: motion.duration.micro,
          ease: motion.ease.interface,
          overwrite: true,
        });
      }
      previousChapterRef.current = chapter;
      return;
    }

    const target = document.querySelector<HTMLElement>(`[data-desktop-nav="${chapter}"]`);
    if (!target) return;

    const previousChapter = previousChapterRef.current;
    const chapterChanged = previousChapter !== chapter;

    if (previousChapter === "index") {
      Flip.fit(capsule, target, { duration: 0 });
      if (reducedMotion) {
        gsap.set(capsule, { autoAlpha: 1 });
      } else {
        gsap.fromTo(
          capsule,
          { autoAlpha: 0 },
          {
            autoAlpha: 1,
            duration: motion.duration.hover,
            ease: motion.ease.interface,
            overwrite: true,
          }
        );
      }
    } else if (chapterChanged && !reducedMotion) {
      Flip.fit(capsule, target, {
        duration: motion.duration.interface,
        ease: motion.ease.interface,
      });
    } else {
      Flip.fit(capsule, target, { duration: 0 });
      gsap.set(capsule, { autoAlpha: 1 });
    }

    previousChapterRef.current = chapter;
  }, [chapter, density, reducedMotion]);

  useEffect(() => {
    const controller = desktopControllerRef.current;
    const capsule = capsuleRef.current;
    if (!controller || !capsule || !desktopMode) return;

    const refit = () => {
      if (chapter === "index") return;
      const target = controller.querySelector<HTMLElement>(`[data-desktop-nav="${chapter}"]`);
      if (target) Flip.fit(capsule, target, { duration: 0 });
    };
    const observer = new ResizeObserver(refit);
    let cancelled = false;

    observer.observe(controller);
    document.fonts.ready.then(() => {
      if (!cancelled) refit();
    });

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [chapter, desktopMode]);

  useEffect(() => {
    const root = navRef.current;
    if (!root || reducedMotion) return;
    const context = gsap.context(() => {
      gsap.from("[data-nav-piece]", {
        y: -12,
        opacity: 0,
        stagger: motion.stagger.item,
        duration: motion.duration.interface,
        ease: motion.ease.interface,
      });
    }, root);
    return () => context.revert();
  }, [reducedMotion]);

  useEffect(
    () => () => {
      menuTimelineRef.current?.kill();
      menuTimelineRef.current = null;
    },
    []
  );

  const handlePointerEnter = (event: ReactPointerEvent<HTMLElement>) => {
    if (!finePointer || event.pointerType !== "mouse") return;
    hoveredRef.current = true;
    requestExpanded();
  };

  const handlePointerLeave = (event: ReactPointerEvent<HTMLElement>) => {
    if (!finePointer || event.pointerType !== "mouse") return;
    hoveredRef.current = false;
    resetDensityTracking();
    scheduleMeasureRef.current();
  };

  const handleFocusCapture = () => {
    focusWithinRef.current = true;
    requestExpanded();
  };

  const handleBlurCapture = (event: ReactFocusEvent<HTMLElement>) => {
    if (event.currentTarget.contains(event.relatedTarget as Node | null)) return;
    focusWithinRef.current = false;
    resetDensityTracking();
    if (menuOpenRef.current) closeMenu("focus-leave");
    scheduleMeasureRef.current();
  };

  const lightTone = tone === "light";
  const controlHeight = density === "compact" ? "h-11" : "h-12";
  const shellTone = lightTone
    ? "border-foreground/10 bg-surface/80 text-foreground"
    : "border-inverse-faint bg-section-dark/90 text-inverse";
  const focusTone = lightTone
    ? "focus-visible:outline-foreground"
    : "focus-visible:outline-inverse";

  return (
    <nav
      ref={navRef}
      aria-label="Primary navigation"
      data-chapter={chapter}
      data-tone={tone}
      data-density={density}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onFocusCapture={handleFocusCapture}
      onBlurCapture={handleBlurCapture}
      className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 py-3 sm:px-5 min-[1025px]:px-7"
    >
      <div className="mx-auto flex w-full max-w-7xl items-start justify-between gap-2 transition-[gap] duration-300 sm:gap-3">
        <a
          ref={logoRef}
          data-nav-piece
          href="#hero"
          aria-label="Go to portfolio index"
          aria-current={chapter === "index" ? "location" : undefined}
          className={`pointer-events-auto flex min-w-0 items-center gap-2 rounded-2xl border px-2 shadow-[var(--shadow-floating)] backdrop-blur-xl transition-[height,border-color,background-color,color,padding] duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 ${controlHeight} ${shellTone} ${focusTone} ${
            chapter === "index"
              ? lightTone
                ? "border-foreground/30"
                : "border-inverse/30"
              : ""
          }`}
        >
          <Image src="/logo/logo.jpg" alt="" width={44} height={44} className="h-7 w-auto" priority />
          <span aria-hidden="true" className="font-inter text-[8px] font-bold uppercase leading-tight tracking-[0.18em]">
            <span className="min-[1025px]:hidden">00</span>
            <span className="hidden min-[1025px]:block">00 Index</span>
          </span>
        </a>

        <div
          ref={desktopControllerRef}
          data-nav-piece
          className={`pointer-events-auto relative hidden items-center rounded-full border px-1 shadow-[var(--shadow-floating)] backdrop-blur-xl transition-[height,border-color,background-color,color,padding] duration-300 min-[1025px]:flex ${controlHeight} ${shellTone}`}
        >
          <span
            ref={capsuleRef}
            aria-hidden="true"
            className={`invisible absolute left-0 top-0 z-0 rounded-full ${lightTone ? "bg-foreground" : "bg-inverse"}`}
          />
          {navLinks.map((item) => {
            const active = chapter === item.chapter;
            return (
              <a
                key={item.href}
                data-desktop-nav={item.chapter}
                href={item.href}
                aria-current={active ? "location" : undefined}
                className={`group relative z-10 flex min-h-11 items-center gap-2 rounded-full px-4 font-inter text-[10px] font-semibold uppercase tracking-[0.18em] transition-[color,padding] duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 lg:px-5 ${
                  active
                    ? lightTone
                      ? "text-inverse"
                      : "text-foreground"
                    : lightTone
                      ? "text-foreground/58 hover:text-foreground focus-visible:outline-foreground"
                      : "text-inverse-muted hover:text-inverse focus-visible:outline-inverse"
                }`}
              >
                <span
                  aria-hidden="true"
                  className="text-[8px] opacity-60 transition-[opacity,transform] duration-300 group-hover:-translate-x-px group-hover:opacity-100"
                >
                  {item.number}
                </span>
                <span className="transition-transform duration-300 group-hover:translate-x-px">
                  {item.label}
                </span>
              </a>
            );
          })}
          <span
            aria-hidden="true"
            className={`absolute inset-x-4 bottom-0 h-px overflow-hidden ${lightTone ? "bg-foreground/10" : "bg-inverse-faint"}`}
          >
            <span
              ref={progressRef}
              data-nav-progress
              className={`block h-full origin-left [transform:scaleX(0)] ${lightTone ? "bg-foreground/55" : "bg-inverse/60"}`}
            />
          </span>
        </div>

        <div data-nav-piece className="pointer-events-auto flex items-center gap-2">
          <button
            ref={menuButtonRef}
            type="button"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
            aria-controls="mobile-primary-navigation"
            onClick={() => (menuOpen ? closeMenu("toggle") : openMenu())}
            className={`flex w-11 items-center justify-center rounded-2xl border shadow-[var(--shadow-floating)] backdrop-blur-xl transition-[height,border-color,background-color,color] duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 min-[1025px]:hidden ${controlHeight} ${shellTone} ${focusTone}`}
          >
            <span aria-hidden="true" className="font-inter text-[8px] font-bold uppercase tracking-[0.18em]">
              {menuOpen ? "Close" : "Menu"}
            </span>
          </button>

          <Magnetic strength={motion.magnetic.subtle}>
            <a
              href={RESUME_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`group flex items-center gap-2 rounded-2xl border px-3 font-syne text-[9px] font-bold uppercase tracking-[0.16em] shadow-[var(--shadow-floating)] transition-[height,transform,background-color,color,border-color,padding] duration-300 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-4 sm:px-4 min-[1025px]:px-5 ${controlHeight} ${
                lightTone
                  ? "border-foreground/12 bg-foreground text-inverse focus-visible:outline-foreground"
                  : "border-inverse/20 bg-inverse text-foreground focus-visible:outline-inverse"
              }`}
            >
              Resume
              <span
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-[3px] group-hover:-translate-y-[3px]"
              >
                ↗
              </span>
            </a>
          </Magnetic>
        </div>
      </div>

      <div
        id="mobile-primary-navigation"
        ref={menuPanelRef}
        aria-hidden={!menuInteractive}
        inert={!menuInteractive ? true : undefined}
        data-mobile-disclosure
        className="pointer-events-none invisible mx-auto w-full max-w-7xl pt-3 opacity-0 min-[1025px]:hidden"
      >
        <div className={`rounded-3xl border p-3 shadow-[var(--shadow-floating)] backdrop-blur-xl ${shellTone}`}>
          <ul className="divide-y divide-current/10">
            {navLinks.map((item) => {
              const active = chapter === item.chapter;
              return (
                <li key={item.href}>
                  <a
                    data-mobile-nav={item.chapter}
                    href={item.href}
                    aria-current={active ? "location" : undefined}
                    onClick={() => closeMenu("selection")}
                    className={`group relative flex min-h-12 items-center justify-between rounded-2xl px-4 font-syne text-base font-bold uppercase transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 ${
                      lightTone
                        ? "focus-visible:outline-foreground"
                        : "focus-visible:outline-inverse"
                    }`}
                  >
                    <span aria-hidden="true" className="font-inter text-[9px] tracking-[0.2em] opacity-55">
                      {item.number}
                    </span>
                    <span>{item.label}</span>
                    <span
                      aria-hidden="true"
                      className={`absolute inset-x-4 bottom-1 h-px origin-left transition-transform duration-300 ${
                        lightTone ? "bg-foreground" : "bg-inverse"
                      } ${active ? "scale-x-100" : "scale-x-0"}`}
                    />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
}
