"use client";

import { useGSAP } from "@gsap/react";
import { gsap, EASE_STANDARD, DURATION_BASE } from "@/lib/gsap";
import { useRef } from "react";

const stack = [
  {
    name: "React",
    category: "Frontend",
    icon: (
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="2" />
        <path d="M12 21.933c-3.412 0-6.643-2.072-8.324-4.811a.498.498 0 0 1 .15-.658l1.458-.841a.5.5 0 0 1 .658.15c1.474 2.456 4.305 4.16 6.058 4.16 1.753 0 4.584-1.704 6.058-4.16a.5.5 0 0 1 .658-.15l1.458.841a.5.5 0 1 .15.658c-1.681 2.739-4.912 4.811-8.324 4.811ZM12 2.067C8.588 2.067 5.357 4.139 3.676 6.878a.498.498 0 0 0 .15.658l1.458.841a.5.5 0 0 0 .658-.15C7.416 5.771 10.247 4.067 12 4.067c1.753 0 4.584 1.704 6.058 4.16a.5.5 0 0 0 .658.15l1.458-.841a.5.5 0 0 0 .15-.658C18.643 4.139 15.412 2.067 12 2.067Z" />
        <path d="M2.378 8.653a.5.5 0 0 1 .658-.15l1.458.841a.5.5 0 0 1 .15.658C3.17 12.391 3.17 16.035 4.644 18.5a.5.5 0 0 1-.15.658l-1.458.841a.5.5 0 0 1-.658-.15c-1.921-3.203-1.921-7.989 0-11.192ZM21.622 8.653a.5.5 0 0 0-.658-.15l-1.458.841a.5.5 0 0 0-.15.658c1.474 2.389 1.474 6.033 0 8.5a.5.5 0 0 0 .15.658l1.458.841a.5.5 0 0 0 .658-.15c1.921-3.203 1.921-7.989 0-11.192Z" />
      </svg>
    )
  },
  {
    name: "Next.js",
    category: "Fullstack",
    icon: (
      <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" />
        <path d="M18 12L12 12L7.5 18" />
        <path d="M16 11.5L9 6V18" />
      </svg>
    )
  },
  {
    name: "Node.js",
    category: "Backend",
    icon: (
      <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 21H14V7L19 12V3H5V12L10 7V21Z" />
      </svg>
    )
  },
  {
    name: "Tailwind",
    category: "Styles",
    icon: (
      <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 12C4 12 5.6 7 12 7C18.4 7 20 12 20 12C20 12 18.4 17 12 17C5.6 17 4 12 4 12Z" />
        <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" />
      </svg>
    )
  },
  {
    name: "PHP",
    category: "Core",
    icon: (
      <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="12" rx="10" ry="6" />
        <path d="M12 9V15M9 12H15" />
      </svg>
    )
  },
  {
    name: "Git",
    category: "DevOps",
    icon: (
      <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.5 12.5C11.8807 12.5 13 11.3807 13 10C13 8.61929 11.8807 7.5 10.5 7.5C9.11929 7.5 8 8.61929 8 10C8 11.3807 9.11929 12.5 10.5 12.5Z" />
        <path d="M16.5 16.5C17.8807 16.5 19 15.3807 19 14C19 12.6193 17.8807 11.5 16.5 11.5C15.1193 11.5 14 12.6193 14 14C14 15.3807 15.1193 16.5 16.5 16.5Z" />
        <path d="M10.5 12.5V18.5" />
        <path d="M16.5 11.5L10.5 7.5" />
      </svg>
    )
  },
];

function StackItem({ item, index }: { item: typeof stack[0], index: number }) {
  const iconRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const categoryRef = useRef<HTMLSpanElement>(null);

  const handleMouseEnter = () => {
    gsap.to(iconRef.current, {
      y: -20,
      opacity: 1,
      duration: 0.5,
      ease: "power4.out"
    });
    gsap.to([textRef.current, categoryRef.current], {
      y: -40,
      opacity: 0,
      duration: 0.5,
      ease: "power4.out"
    });
  };

  const handleMouseLeave = () => {
    gsap.to(iconRef.current, {
      y: 0,
      opacity: 0,
      duration: 0.5,
      ease: "power4.out"
    });
    gsap.to([textRef.current, categoryRef.current], {
      y: 0,
      opacity: 1,
      duration: 0.5,
      ease: "power4.out"
    });
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="stack-item group p-12 border-r border-b border-border-custom flex flex-col justify-between aspect-square hover:bg-foreground hover:text-background transition-colors duration-500 cursor-default relative overflow-hidden"
    >
      <div className="flex justify-between items-start">
          <div className="relative h-4 overflow-hidden w-full">
            <span ref={categoryRef} className="font-inter text-[10px] font-bold uppercase tracking-[0.3em] opacity-40 group-hover:opacity-60 block text-current">
              {String(index + 1).padStart(2, '0')} / {item.category}
            </span>
          </div>
        <div className="w-8 h-8 flex items-center justify-center border border-current opacity-20 group-hover:opacity-100 transition-all group-hover:rotate-45">
          <span className="text-[10px]">+</span>
        </div>
      </div>

      <div className="relative h-32 flex items-center justify-center">
         <h3 ref={textRef} className="text-4xl md:text-5xl font-syne font-extrabold uppercase tracking-tight group-hover:italic transition-all absolute text-current">
          {item.name}
        </h3>

        <div ref={iconRef} className="opacity-0 translate-y-8 absolute text-current">
            {item.icon}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="h-px w-0 group-hover:w-12 bg-current transition-all duration-700"></div>
        <span className="font-inter text-[9px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity delay-200 text-current">
          Highly Proficient
        </span>
      </div>
    </div>
  );
}

export default function TechStack() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Initial reveal
    gsap.from(".stack-item", {
      opacity: 0,
      y: 40,
      stagger: 0.1,
      duration: DURATION_BASE,
      ease: EASE_STANDARD,
      scrollTrigger: {
        trigger: container.current,
        start: "top 80%",
      }
    });
  }, { scope: container });

  return (
    <section id="stack" ref={container} className="py-32 px-6 md:px-12 border-b border-border-custom bg-surface overflow-hidden">
      <div className="max-w-screen-2xl mx-auto">
        <div className="flex justify-between items-end mb-20">
          <h2 className="text-6xl md:text-8xl font-syne font-extrabold uppercase tracking-tighter text-foreground leading-none">
            Core<br/>Stack
          </h2>
          <div className="hidden md:block w-32 h-px bg-foreground/20 mb-4"></div>
          <p className="font-inter text-[10px] font-bold uppercase tracking-[0.4em] text-foreground/40 text-right">
            [ Technical expertise ]
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 border-t border-l border-border-custom">
          {stack.map((item, index) => (
            <StackItem key={index} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
