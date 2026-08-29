"use client";

import { projects } from "@/content/projects";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { formatProjectDate } from "@/lib/project";
import { gsap, motion } from "@/lib/gsap";
import type { PortfolioProject } from "@/types/portfolio";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { useCallback, useRef } from "react";

function projectMediaUrl(project: PortfolioProject) {
  return project.liveUrl ?? project.repositoryUrls[0]?.url;
}

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

function ProjectMetadata({ project }: { project: PortfolioProject }) {
  return (
    <dl className="grid grid-cols-2 gap-x-5 gap-y-5 border-y border-current/12 py-5 sm:grid-cols-3">
      <div>
        <dt className="project-label">Date</dt>
        <dd className="project-value"><time dateTime={project.date.length === 4 ? project.date : `${project.date}-01`}>{formatProjectDate(project.date)}</time></dd>
      </div>
      {project.contribution && (
        <div>
          <dt className="project-label">Contribution</dt>
          <dd className="project-value">{project.contribution}</dd>
        </div>
      )}
      {project.access && (
        <div>
          <dt className="project-label">System Access</dt>
          <dd className="project-value">{project.access.join(" / ")}</dd>
        </div>
      )}
      {project.workspaceAccess && (
        <div>
          <dt className="project-label">Workspace Access</dt>
          <dd className="project-value">{project.workspaceAccess.join(" / ")}</dd>
        </div>
      )}
      <div className="col-span-2 sm:col-span-3">
        <dt className="project-label">Stack</dt>
        <dd className="project-value">{project.tech.join(" · ")}</dd>
      </div>
    </dl>
  );
}

function ProjectActions({ project }: { project: PortfolioProject }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {project.status === "in-progress" && (
        <span className="rounded-full border border-foreground/16 px-4 py-2 font-inter text-[9px] font-bold uppercase tracking-[0.22em] text-foreground/58">
          In Progress
        </span>
      )}
      {project.liveUrl && (
        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="project-action">
          Live Site <Arrow />
        </a>
      )}
      {project.repositoryUrls.map((repository) => (
        <a key={repository.url} href={repository.url} target="_blank" rel="noopener noreferrer" className="project-action">
          {repository.label} <Arrow />
        </a>
      ))}
    </div>
  );
}

function ProjectMedia({ project, priority = false }: { project: PortfolioProject; priority?: boolean }) {
  const destination = projectMediaUrl(project);
  const media = (
    <div className="relative aspect-[16/10] overflow-hidden rounded-[var(--radius-project)] border border-foreground/12 bg-surface shadow-[var(--shadow-media)]">
      <Image
        src={project.image}
        alt={destination ? `Open ${project.title}` : `${project.title} project preview`}
        fill
        priority={priority}
        sizes="(max-width: 1024px) 100vw, 62vw"
        className="object-cover transition-transform duration-700 group-hover/media:scale-[1.025]"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,var(--project-media-shade)_100%)]" />
    </div>
  );

  if (!destination) return media;
  return (
    <a
      href={destination}
      target="_blank"
      rel="noopener noreferrer"
      className="group/media block rounded-[var(--radius-project)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground"
      data-project-media
    >
      {media}
    </a>
  );
}

function StackedProjects() {
  return (
    <ol className="space-y-20 lg:space-y-28">
      {projects.map((project, index) => (
        <li key={project.id}>
          <article className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-14">
            <ProjectMedia project={project} priority={index === 0} />
            <div>
              <div className="mb-5 flex items-center justify-between gap-4">
                <span className="project-label">{project.id} / {String(projects.length).padStart(2, "0")}</span>
                <span className="project-label">{project.category}</span>
              </div>
              <h3 className="font-syne text-[clamp(2.7rem,8vw,5.8rem)] font-extrabold uppercase leading-[0.86] tracking-[-0.065em]">{project.title}</h3>
              <p className="mt-6 max-w-xl font-inter text-base leading-7 text-foreground/62">{project.description}</p>
              <div className="mt-7"><ProjectMetadata project={project} /></div>
              <div className="mt-7"><ProjectActions project={project} /></div>
            </div>
          </article>
        </li>
      ))}
    </ol>
  );
}

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const viewCursorRef = useRef<HTMLDivElement>(null);
  const desktop = useMediaQuery("(min-width: 1025px)");
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const reducedMotion = useReducedMotion();
  const cinematic = desktop && !reducedMotion;

  useGSAP(
    () => {
      if (!cinematic || !sectionRef.current || !stageRef.current) return;
      const scenes = gsap.utils.toArray<HTMLElement>("[data-project-scene]");
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: stageRef.current,
          start: "top top",
          end: () => `+=${window.innerHeight * (projects.length - 1)}`,
          scrub: 0.8,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      gsap.set(scenes, { autoAlpha: 0, pointerEvents: "none" });
      gsap.set(scenes[0], { autoAlpha: 1, pointerEvents: "auto" });

      for (let index = 1; index < scenes.length; index += 1) {
        const previous = scenes[index - 1];
        const incoming = scenes[index];
        const previousMedia = previous.querySelector("[data-scene-media]");
        const previousCopy = previous.querySelector("[data-scene-copy]");
        const previousNumber = previous.querySelector("[data-scene-number]");
        const incomingMedia = incoming.querySelector("[data-scene-media]");
        const incomingCopy = incoming.querySelector("[data-scene-copy]");
        const incomingNumber = incoming.querySelector("[data-scene-number]");
        const position = index - 1;

        timeline
          .to(previousCopy, { y: -20, opacity: 0, duration: 0.22, ease: "power2.in" }, position)
          .to(previousMedia, { scale: 0.96, clipPath: "inset(0 0 100% 0 round var(--radius-project))", duration: 0.42, ease: motion.ease.interface }, position + 0.1)
          .to(previousNumber, { yPercent: -110, opacity: 0, duration: 0.28, ease: "power2.in" }, position + 0.12)
          .set(previous, { autoAlpha: 0, pointerEvents: "none" }, position + 0.48)
          .set(incoming, { autoAlpha: 1, pointerEvents: "auto" }, position + 0.26)
          .fromTo(incomingNumber, { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.3, ease: motion.ease.interface }, position + 0.27)
          .fromTo(incomingMedia, { clipPath: "inset(100% 0 0 0 round var(--radius-project))", scale: 0.98 }, { clipPath: "inset(0% 0 0 0 round var(--radius-project))", scale: 1, duration: 0.48, ease: motion.ease.cinematic }, position + 0.31)
          .fromTo(incomingCopy, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.34, ease: motion.ease.interface }, position + 0.48);
      }

      return () => timeline.kill();
    },
    { scope: sectionRef, dependencies: [cinematic] }
  );

  const moveViewCursor = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (!finePointer || !viewCursorRef.current) return;
      const media = (event.target as Element).closest<HTMLElement>("[data-project-media]");
      if (!media) {
        gsap.to(viewCursorRef.current, { scale: 0, duration: motion.duration.micro });
        return;
      }
      gsap.to(viewCursorRef.current, {
        x: event.clientX,
        y: event.clientY,
        scale: 1,
        duration: motion.duration.micro,
        ease: motion.ease.interface,
        overwrite: "auto",
      });
    },
    [finePointer]
  );

  return (
    <section
      id="work"
      ref={sectionRef}
      onPointerMove={moveViewCursor}
      onPointerLeave={() => viewCursorRef.current && gsap.to(viewCursorRef.current, { scale: 0 })}
      className="relative overflow-hidden bg-background py-20 text-foreground md:py-24 xl:py-28"
    >
      {finePointer && (
        <div ref={viewCursorRef} aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-[70] flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 scale-0 items-center justify-center rounded-full bg-foreground font-inter text-[9px] font-bold uppercase tracking-[0.15em] text-inverse">
          View ↗
        </div>
      )}

      <header className="mx-auto mb-14 grid max-w-[1800px] gap-6 px-4 sm:px-6 md:px-8 lg:mb-20 lg:grid-cols-[1fr_0.55fr] lg:items-end">
        <div>
          <p className="project-label mb-4">[ Selected Works ]</p>
          <h2 className="font-syne text-[clamp(3.4rem,10vw,9rem)] font-extrabold uppercase leading-[0.82] tracking-[-0.075em]">Project<br />Systems</h2>
        </div>
        <p className="max-w-md font-inter text-base leading-7 text-foreground/58 lg:justify-self-end lg:text-end">Seven chapters in product architecture, interaction design, and systems built for real use.</p>
      </header>

      {cinematic ? (
        <div ref={stageRef} className="relative mx-auto h-screen max-w-[1800px] px-8 py-20">
          <div aria-hidden="true" className="absolute inset-x-[8%] inset-y-[14%] translate-x-4 translate-y-5 rounded-[var(--radius-project)] border border-foreground/8 bg-surface/42" />
          <div aria-hidden="true" className="absolute inset-x-[8%] inset-y-[14%] translate-x-2 translate-y-2 rounded-[var(--radius-project)] border border-foreground/10 bg-surface/72" />
          {projects.map((project, index) => (
            <article key={project.id} data-project-scene className="invisible absolute inset-x-8 top-1/2 grid -translate-y-1/2 grid-cols-[1.12fr_0.88fr] items-center gap-14 opacity-0">
              <div data-scene-media><ProjectMedia project={project} priority={index === 0} /></div>
              <div data-scene-copy>
                <div className="mb-5 flex items-center justify-between gap-4 overflow-hidden">
                  <span data-scene-number className="font-syne text-5xl font-extrabold tracking-[-0.06em]">{project.id} <span className="text-foreground/24">/ 07</span></span>
                  <span className="project-label">{project.category}</span>
                </div>
                <h3 className="font-syne text-[clamp(3rem,5.6vw,6.4rem)] font-extrabold uppercase leading-[0.84] tracking-[-0.07em]">{project.title}</h3>
                <p className="mt-6 max-w-xl font-inter text-base leading-7 text-foreground/60">{project.description}</p>
                <div className="mt-7"><ProjectMetadata project={project} /></div>
                <div className="mt-7"><ProjectActions project={project} /></div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="mx-auto max-w-[1800px] px-4 sm:px-6 md:px-8"><StackedProjects /></div>
      )}
    </section>
  );
}
