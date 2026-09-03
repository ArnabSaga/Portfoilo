"use client";

import { projects } from "@/content/projects";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { gsap, motion, ScrollTrigger } from "@/lib/gsap";
import { formatProjectDate } from "@/lib/project";
import type { PortfolioProject } from "@/types/portfolio";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { flushSync } from "react-dom";

const LAST_PROJECT = projects.length - 1;
const TOTAL_PROJECTS = String(projects.length).padStart(2, "0");
const clamp01 = gsap.utils.clamp(0, 1);
const easeInOut = gsap.parseEase("power2.inOut");
const easeOut = gsap.parseEase("power3.out");

const projectMediaPaths = new Set([
  "/project/opscore.jpg",
  "/project/medistore.jpg",
  "/project/awwer.jpg",
  "/project/velvet-pour.jpg",
  "/project/meetai.jpg",
  "/project/monster-steamer.png",
  "/project/path-to-peace.jpg",
  "/project/operix.png",
  "/project/nexora.png",
]);

type MediaSlotIndex = 0 | 1 | 2;
type CopyPanelIndex = 0 | 1;

interface MediaRoles {
  previous: MediaSlotIndex;
  current: MediaSlotIndex;
  next: MediaSlotIndex;
}

interface CopyRoles {
  current: CopyPanelIndex;
  next: CopyPanelIndex;
}

interface CinematicAssignments {
  segment: number;
  mediaProjects: readonly [number | null, number | null, number | null];
  mediaRoles: MediaRoles;
  copyProjects: readonly [number | null, number | null];
  copyRoles: CopyRoles;
}

const initialAssignments: CinematicAssignments = {
  segment: 0,
  mediaProjects: [null, 0, projects.length > 1 ? 1 : null],
  mediaRoles: { previous: 0, current: 1, next: 2 },
  copyProjects: [0, projects.length > 1 ? 1 : null],
  copyRoles: { current: 0, next: 1 },
};

function projectMediaUrl(project: PortfolioProject) {
  return project.liveUrl ?? project.repositoryUrls[0]?.url;
}

function hasProjectMedia(project: PortfolioProject) {
  return projectMediaPaths.has(project.image);
}

function easedRange(
  value: number,
  start: number,
  end: number,
  ease: (progress: number) => number,
) {
  if (end <= start) return value >= end ? 1 : 0;
  return ease(clamp01((value - start) / (end - start)));
}

function interpolate(from: number, to: number, progress: number) {
  return from + (to - from) * progress;
}

function resolvePosition(rawPosition: number) {
  const position = gsap.utils.clamp(0, LAST_PROJECT, rawPosition);

  if (position >= LAST_PROJECT) {
    return {
      position,
      segment: LAST_PROJECT,
      localProgress: 0,
      currentIndex: LAST_PROJECT,
      nextIndex: null,
    };
  }

  const segment = Math.floor(position);
  return {
    position,
    segment,
    localProgress: position - segment,
    currentIndex: segment,
    nextIndex: segment + 1,
  };
}

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

function ProjectMetadata({ project }: { project: PortfolioProject }) {
  return (
    <dl className="grid gap-4 border-y border-current/12 py-5 sm:grid-cols-2">
      <div>
        <dt className="project-label">Date</dt>
        <dd className="project-value">
          <time dateTime={project.date.length === 4 ? project.date : `${project.date}-01`}>
            {formatProjectDate(project.date)}
          </time>
        </dd>
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
      <div className="sm:col-span-2">
        <dt className="project-label">Stack</dt>
        <dd className="project-value">{project.tech.join(" · ")}</dd>
      </div>
    </dl>
  );
}

function ProjectActions({
  project,
  tabIndex,
}: {
  project: PortfolioProject;
  tabIndex?: number;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {project.status === "in-progress" && (
        <span className="rounded-full border border-foreground/16 px-4 py-2 font-inter text-[9px] font-bold uppercase tracking-[0.22em] text-foreground/58">
          In Progress
        </span>
      )}
      {project.liveUrl && (
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="project-action"
          tabIndex={tabIndex}
        >
          Live Site <Arrow />
        </a>
      )}
      {project.repositoryUrls.map((repository) => (
        <a
          key={repository.url}
          href={repository.url}
          target="_blank"
          rel="noopener noreferrer"
          className="project-action"
          tabIndex={tabIndex}
        >
          {repository.label} <Arrow />
        </a>
      ))}
    </div>
  );
}

function ProjectMedia({
  project,
  priority = false,
  cinematic = false,
}: {
  project: PortfolioProject;
  priority?: boolean;
  cinematic?: boolean;
}) {
  const destination = projectMediaUrl(project);
  const mediaAvailable = hasProjectMedia(project);
  const depthClass = cinematic ? "[transform-style:preserve-3d]" : "";
  const media = (
    <div className={`relative ${depthClass}`}>
      <div className="relative overflow-hidden rounded-[var(--radius-project)] border border-foreground/12 bg-surface shadow-[var(--shadow-media)] [backface-visibility:hidden] [transform:translateZ(0)]">
        <div className="flex h-10 items-center justify-between border-b border-foreground/10 px-4 sm:h-11">
          <div aria-hidden="true" className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-foreground/22" />
            <span className="h-1.5 w-1.5 rounded-full bg-foreground/18" />
            <span className="h-1.5 w-1.5 rounded-full bg-foreground/14" />
          </div>
          <span className="project-label">
            {mediaAvailable ? `Project / ${project.id}` : "Product / In Development"}
          </span>
        </div>
        <div className="relative aspect-video overflow-hidden bg-background">
          {mediaAvailable ? (
            <>
              <Image
                src={project.image}
                alt={destination ? `View ${project.title} project` : `${project.title} project preview`}
                fill
                priority={priority}
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover transition-transform duration-700 group-hover/media:scale-[1.02]"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,var(--project-media-shade)_100%)]"
              />
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center px-6 text-center">
              <p className="project-label mb-5">Preview unavailable</p>
              <p className="font-syne text-[clamp(2rem,6vw,4rem)] font-extrabold uppercase leading-[0.86] text-foreground">
                {project.title.replaceAll("-", " ")}
              </p>
              <p className="project-value mt-5">Media pending</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (!destination || !mediaAvailable) return media;
  return (
    <a
      href={destination}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={
        project.liveUrl
          ? `View ${project.title} live site`
          : `View ${project.title} repository`
      }
      className="group/media block rounded-[var(--radius-project)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground"
      data-project-media
      tabIndex={cinematic ? -1 : undefined}
    >
      {media}
    </a>
  );
}

function ProjectCopyPanel({ project }: { project: PortfolioProject }) {
  return (
    <div className="flex h-full flex-col">
      <div data-copy-title>
        <div className="mb-6 flex h-[clamp(3.5rem,4.6vw,4.75rem)] items-start justify-end gap-4">
          <span className="project-label max-w-[70%] text-right">{project.category}</span>
        </div>
        <div className="min-h-[9rem]">
          <h3 className="text-balance font-syne text-[clamp(2.9rem,4.5vw,5.4rem)] font-extrabold uppercase leading-[0.86] tracking-[-0.065em]">
            {project.title}
          </h3>
        </div>
      </div>
      <p
        data-copy-description
        className="mt-4 min-h-[6.5rem] max-w-xl font-inter text-base leading-7 text-foreground/60"
      >
        {project.description}
      </p>
      <div className="mt-auto">
        <div data-copy-meta>
          <ProjectMetadata project={project} />
        </div>
        <div data-copy-actions className="mt-[clamp(1.5rem,4svh,3.5rem)]">
          <ProjectActions project={project} tabIndex={-1} />
        </div>
      </div>
    </div>
  );
}

function StackedProjects() {
  return (
    <ol className="space-y-20 lg:space-y-24">
      {projects.map((project, index) => (
        <li key={project.id}>
          <article className="grid gap-8 lg:grid-cols-[1.2fr_0.9fr] lg:items-stretch lg:gap-12">
            <ProjectMedia project={project} priority={index === 0} />
            <div className="flex flex-col">
              <div className="mb-5 flex items-center justify-between gap-4">
                <span className="project-label">
                  {project.id} / {TOTAL_PROJECTS}
                </span>
                <span className="project-label">{project.category}</span>
              </div>
              <div className="min-h-[clamp(5.25rem,18vw,9rem)] lg:min-h-[9rem]">
                <h3 className="text-balance font-syne text-[clamp(2.7rem,8vw,5.4rem)] font-extrabold uppercase leading-[0.86] tracking-[-0.065em]">
                  {project.title}
                </h3>
              </div>
              <p className="mt-5 min-h-[5.25rem] max-w-xl font-inter text-base leading-7 text-foreground/62">
                {project.description}
              </p>
              <div className="mt-7">
                <ProjectMetadata project={project} />
              </div>
              <div className="mt-7 lg:mt-auto lg:pt-7">
                <ProjectActions project={project} />
              </div>
            </div>
          </article>
        </li>
      ))}
    </ol>
  );
}

function DesktopCinematicProjects({ finePointer }: { finePointer: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const deckRef = useRef<HTMLDivElement>(null);
  const viewCursorRef = useRef<HTMLDivElement>(null);
  const mediaSlotRefs = useRef<Array<HTMLDivElement | null>>([]);
  const copyPanelRefs = useRef<Array<HTMLDivElement | null>>([]);
  const numberRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const assignmentsRef = useRef<CinematicAssignments>(initialAssignments);
  const latestPositionRef = useRef(0);
  const viewEligibleRef = useRef(false);
  const [assignments, setAssignments] = useState<CinematicAssignments>(initialAssignments);

  const elementContainsFocus = useCallback((element: HTMLElement | null) => {
    const activeElement = document.activeElement;
    return Boolean(element && activeElement && element.contains(activeElement));
  }, []);

  const commitAssignments = useCallback((nextAssignments: CinematicAssignments) => {
    assignmentsRef.current = nextAssignments;
    flushSync(() => setAssignments(nextAssignments));
  }, []);

  const canRecycle = useCallback(
    (mediaSlot: MediaSlotIndex, copyPanel: CopyPanelIndex) =>
      !elementContainsFocus(mediaSlotRefs.current[mediaSlot]) &&
      !elementContainsFocus(copyPanelRefs.current[copyPanel]),
    [elementContainsFocus],
  );

  const ensureSegment = useCallback(
    (targetSegment: number) => {
      const current = assignmentsRef.current;
      if (targetSegment === current.segment) return true;

      if (targetSegment === current.segment + 1) {
        const recycledMedia = current.mediaRoles.previous;
        const recycledCopy = current.copyRoles.current;
        if (!canRecycle(recycledMedia, recycledCopy)) return false;

        const mediaProjects = [...current.mediaProjects] as [number | null, number | null, number | null];
        const copyProjects = [...current.copyProjects] as [number | null, number | null];
        mediaProjects[recycledMedia] = targetSegment < LAST_PROJECT ? targetSegment + 1 : null;
        copyProjects[recycledCopy] = targetSegment < LAST_PROJECT ? targetSegment + 1 : null;

        commitAssignments({
          segment: targetSegment,
          mediaProjects,
          mediaRoles: {
            previous: current.mediaRoles.current,
            current: current.mediaRoles.next,
            next: recycledMedia,
          },
          copyProjects,
          copyRoles: {
            current: current.copyRoles.next,
            next: recycledCopy,
          },
        });
        return true;
      }

      if (targetSegment === current.segment - 1) {
        const recycledMedia = current.mediaRoles.next;
        const recycledCopy = current.copyRoles.next;
        if (!canRecycle(recycledMedia, recycledCopy)) return false;

        const mediaProjects = [...current.mediaProjects] as [number | null, number | null, number | null];
        const copyProjects = [...current.copyProjects] as [number | null, number | null];
        mediaProjects[recycledMedia] = targetSegment > 0 ? targetSegment - 1 : null;
        copyProjects[recycledCopy] = targetSegment;

        commitAssignments({
          segment: targetSegment,
          mediaProjects,
          mediaRoles: {
            previous: recycledMedia,
            current: current.mediaRoles.previous,
            next: current.mediaRoles.current,
          },
          copyProjects,
          copyRoles: {
            current: recycledCopy,
            next: current.copyRoles.current,
          },
        });
        return true;
      }

      if (
        mediaSlotRefs.current.some(elementContainsFocus) ||
        copyPanelRefs.current.some(elementContainsFocus)
      ) {
        return false;
      }

      commitAssignments({
        segment: targetSegment,
        mediaProjects: [
          targetSegment > 0 ? targetSegment - 1 : null,
          targetSegment,
          targetSegment < LAST_PROJECT ? targetSegment + 1 : null,
        ],
        mediaRoles: { previous: 0, current: 1, next: 2 },
        copyProjects: [
          targetSegment,
          targetSegment < LAST_PROJECT ? targetSegment + 1 : null,
        ],
        copyRoles: { current: 0, next: 1 },
      });
      return true;
    },
    [canRecycle, commitAssignments, elementContainsFocus],
  );

  const hideViewCursor = useCallback(() => {
    viewEligibleRef.current = false;
    if (viewCursorRef.current) {
      gsap.set(viewCursorRef.current, { scale: 0 });
    }
  }, []);

  const setExposure = useCallback((elements: Array<HTMLElement | null>, active: HTMLElement | null) => {
    elements.forEach((element) => {
      if (!element) return;
      const isActive = element === active;
      const focusedInside = elementContainsFocus(element);

      if (isActive || focusedInside) element.removeAttribute("aria-hidden");
      else element.setAttribute("aria-hidden", "true");

      element.style.pointerEvents = isActive ? "auto" : "none";
      element.toggleAttribute("data-cinematic-active", isActive);
      element.querySelectorAll<HTMLElement>("a, button, [tabindex]").forEach((focusable) => {
        focusable.tabIndex = isActive ? 0 : -1;
      });
    });
  }, [elementContainsFocus]);

  const renderCinematicFrame = useCallback(
    (rawPosition: number) => {
      latestPositionRef.current = rawPosition;
      const frame = resolvePosition(rawPosition);
      if (!ensureSegment(frame.segment)) {
        hideViewCursor();
        return;
      }

      const currentAssignments = assignmentsRef.current;
      const { mediaRoles, copyRoles } = currentAssignments;
      const local = frame.localProgress;
      const recede = easedRange(local, 0.25, 0.82, easeInOut);
      const incoming = easedRange(local, 0.42, 0.82, easeOut);
      const titleOut = easedRange(local, 0.32, 0.52, easeOut);
      const titleIn = easedRange(local, 0.52, 0.68, easeOut);
      const descriptionIn = easedRange(local, 0.64, 0.74, easeOut);
      const metadataOut = easedRange(local, 0.38, 0.52, easeOut);
      const metadataIn = easedRange(local, 0.68, 0.78, easeOut);
      const actionsIn = easedRange(local, 0.74, 0.82, easeOut);
      const numberOut = easedRange(local, 0.38, 0.52, easeOut);
      const numberIn = easedRange(local, 0.42, 0.58, easeOut);
      const hasIncoming = frame.nextIndex !== null;
      const incomingDominant = hasIncoming && local >= 0.52;

      const previousSlot = mediaSlotRefs.current[mediaRoles.previous];
      const currentSlot = mediaSlotRefs.current[mediaRoles.current];
      const nextSlot = mediaSlotRefs.current[mediaRoles.next];

      mediaSlotRefs.current.forEach((slot, index) => {
        if (!slot) return;
        const hasProject = currentAssignments.mediaProjects[index] !== null;
        gsap.set(slot, { visibility: hasProject ? "visible" : "hidden", pointerEvents: "none" });
        const light = slot.querySelector<HTMLElement>("[data-depth-light]");
        if (light) gsap.set(light, { opacity: 0 });
      });

      if (previousSlot) {
        gsap.set(previousSlot, {
          xPercent: -14,
          z: -140,
          rotationY: 16,
          scale: 0.92,
          opacity: 0,
          zIndex: 10,
        });
        const light = previousSlot.querySelector<HTMLElement>("[data-depth-light]");
        if (light) gsap.set(light, { opacity: 0 });
      }

      if (currentSlot) {
        gsap.set(currentSlot, {
          xPercent: interpolate(0, -14, recede),
          z: interpolate(0, -140, recede),
          rotationY: interpolate(0, 16, recede),
          scale: interpolate(1, 0.92, recede),
          opacity: 1 - recede,
          zIndex: incomingDominant ? 20 : 40,
        });
        const light = currentSlot.querySelector<HTMLElement>("[data-depth-light]");
        if (light) gsap.set(light, { opacity: recede * 0.1 });
      }

      if (nextSlot && hasIncoming) {
        gsap.set(nextSlot, {
          visibility: "visible",
          xPercent: interpolate(16, 0, incoming),
          z: interpolate(-160, 0, incoming),
          rotationY: interpolate(-18, 0, incoming),
          scale: interpolate(0.92, 1, incoming),
          opacity: incoming,
          zIndex: incomingDominant ? 40 : 20,
        });
        const light = nextSlot.querySelector<HTMLElement>("[data-depth-light]");
        if (light) gsap.set(light, { opacity: (1 - incoming) * 0.1 });
      }

      if (deckRef.current) {
        const cameraScale = local < 0.52
          ? interpolate(1, 0.985, easedRange(local, 0.25, 0.52, easeInOut))
          : interpolate(0.985, 1, easedRange(local, 0.52, 0.82, easeOut));
        gsap.set(deckRef.current, { scale: hasIncoming ? cameraScale : 1 });
      }

      const currentPanel = copyPanelRefs.current[copyRoles.current];
      const nextPanel = copyPanelRefs.current[copyRoles.next];
      copyPanelRefs.current.forEach((panel, index) => {
        if (!panel) return;
        gsap.set(panel, {
          visibility: currentAssignments.copyProjects[index] === null ? "hidden" : "visible",
        });
      });

      if (currentPanel) {
        gsap.set(currentPanel.querySelector("[data-copy-title]"), {
          y: -24 * titleOut,
          opacity: 1 - titleOut,
        });
        gsap.set(currentPanel.querySelector("[data-copy-description]"), {
          y: -12 * titleOut,
          opacity: 1 - titleOut,
        });
        gsap.set(currentPanel.querySelector("[data-copy-meta]"), {
          y: -6 * metadataOut,
          opacity: 1 - metadataOut,
        });
        gsap.set(currentPanel.querySelector("[data-copy-actions]"), {
          y: -6 * metadataOut,
          opacity: 1 - metadataOut,
        });
      }

      if (nextPanel && hasIncoming) {
        gsap.set(nextPanel.querySelector("[data-copy-title]"), {
          y: 24 * (1 - titleIn),
          opacity: titleIn,
        });
        gsap.set(nextPanel.querySelector("[data-copy-description]"), {
          y: 12 * (1 - descriptionIn),
          opacity: descriptionIn,
        });
        gsap.set(nextPanel.querySelector("[data-copy-meta]"), {
          y: 6 * (1 - metadataIn),
          opacity: metadataIn,
        });
        gsap.set(nextPanel.querySelector("[data-copy-actions]"), {
          y: 6 * (1 - actionsIn),
          opacity: actionsIn,
        });
      }

      const currentNumber = numberRefs.current[copyRoles.current];
      const nextNumber = numberRefs.current[copyRoles.next];
      numberRefs.current.forEach((number, index) => {
        if (!number) return;
        gsap.set(number, {
          visibility: currentAssignments.copyProjects[index] === null ? "hidden" : "visible",
        });
      });
      if (currentNumber) {
        gsap.set(currentNumber, { yPercent: -110 * numberOut, opacity: 1 - numberOut });
      }
      if (nextNumber && hasIncoming) {
        gsap.set(nextNumber, { yPercent: 110 * (1 - numberIn), opacity: numberIn });
      }

      const dominantMedia = incomingDominant ? nextSlot : currentSlot;
      const dominantPanel = incomingDominant ? nextPanel : currentPanel;
      const dominantNumber = incomingDominant ? nextNumber : currentNumber;
      setExposure(mediaSlotRefs.current, dominantMedia ?? null);
      setExposure(copyPanelRefs.current, dominantPanel ?? null);
      numberRefs.current.forEach((number) => {
        if (!number) return;
        number.setAttribute("aria-hidden", number === dominantNumber ? "false" : "true");
      });

      mediaSlotRefs.current.forEach((slot) => slot?.removeAttribute("data-view-active"));
      const viewSettled = local <= 0.15 || local >= 0.85 || !hasIncoming;
      const dominantLink = dominantMedia?.querySelector<HTMLElement>("[data-project-media]");
      viewEligibleRef.current = Boolean(finePointer && viewSettled && dominantLink);
      if (viewEligibleRef.current) dominantMedia?.setAttribute("data-view-active", "true");
      else hideViewCursor();
    },
    [ensureSegment, finePointer, hideViewCursor, setExposure],
  );

  useGSAP(
    () => {
      const proxy = { position: 0 };
      renderCinematicFrame(0);

      const proxyTween = gsap.to(proxy, {
        position: LAST_PROJECT,
        duration: LAST_PROJECT,
        ease: "none",
        paused: true,
        onUpdate: () => renderCinematicFrame(proxy.position),
      });
      const trigger = ScrollTrigger.create({
        id: "projects-cinematic-pin",
        trigger: stageRef.current,
        start: "top top",
        end: () => `+=${window.innerHeight * LAST_PROJECT}`,
        animation: proxyTween,
        scrub: 0.8,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      });

      return () => {
        hideViewCursor();
        proxyTween.kill();
        trigger.kill();
        assignmentsRef.current = initialAssignments;
      };
    },
    { scope: rootRef, dependencies: [renderCinematicFrame, hideViewCursor] },
  );

  const moveViewCursor = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!finePointer || !viewEligibleRef.current || !viewCursorRef.current) return;
      const media = (event.target as Element).closest<HTMLElement>("[data-project-media]");
      const activeSlot = media?.closest<HTMLElement>("[data-view-active='true']");
      if (!media || !activeSlot) {
        hideViewCursor();
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
    [finePointer, hideViewCursor],
  );

  return (
    <div
      ref={rootRef}
      onPointerMove={moveViewCursor}
      onPointerLeave={hideViewCursor}
      onBlurCapture={() => {
        window.requestAnimationFrame(() => renderCinematicFrame(latestPositionRef.current));
      }}
      data-cinematic-projects
    >
      {finePointer && (
        <div
          ref={viewCursorRef}
          aria-hidden="true"
          className="pointer-events-none fixed left-0 top-0 z-[70] flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 scale-0 items-center justify-center rounded-full bg-foreground font-inter text-[9px] font-bold uppercase tracking-[0.15em] text-inverse"
        >
          View ↗
        </div>
      )}

      <div
        ref={stageRef}
        className="relative mx-auto grid h-screen max-w-[1800px] place-items-center px-8"
        data-projects-stage
      >
        <div className="grid h-[clamp(34rem,68svh,40.5rem)] w-full grid-cols-[1.2fr_0.9fr] items-stretch gap-12">
          <div className="relative self-center aspect-video overflow-hidden [perspective:1600px]">
            <div ref={deckRef} className="absolute inset-[2%] [transform-style:preserve-3d]" data-media-deck>
              {([0, 1, 2] as const).map((slotIndex) => {
                const projectIndex = assignments.mediaProjects[slotIndex];
                const project = projectIndex === null ? null : projects[projectIndex];
                return (
                  <div
                    key={slotIndex}
                    ref={(element) => {
                      mediaSlotRefs.current[slotIndex] = element;
                    }}
                    className="absolute inset-0 [backface-visibility:hidden] [transform-style:preserve-3d] will-change-[transform,opacity]"
                    data-media-slot={slotIndex}
                    aria-hidden="true"
                  >
                    {project && (
                      <>
                        <ProjectMedia project={project} priority={projectIndex === 0} cinematic />
                        <div
                          aria-hidden="true"
                          data-depth-light
                          className="pointer-events-none absolute inset-0 z-20 rounded-[var(--radius-project)] bg-foreground opacity-0"
                        />
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative h-full py-1" data-copy-stage>
            <div className="pointer-events-none absolute left-0 top-0 z-20 h-[clamp(3.5rem,4.6vw,4.75rem)] w-[55%] overflow-hidden">
              {([0, 1] as const).map((panelIndex) => {
                const projectIndex = assignments.copyProjects[panelIndex];
                const project = projectIndex === null ? null : projects[projectIndex];
                return (
                  <span
                    key={panelIndex}
                    ref={(element) => {
                      numberRefs.current[panelIndex] = element;
                    }}
                    className="absolute inset-x-0 top-0 block font-syne text-[clamp(2.7rem,4.4vw,4.6rem)] font-extrabold leading-none tracking-[-0.06em]"
                    aria-hidden="true"
                  >
                    {project && (
                      <>
                        {project.id}{" "}
                        <span className="text-foreground/24">/ {TOTAL_PROJECTS}</span>
                      </>
                    )}
                  </span>
                );
              })}
            </div>

            {([0, 1] as const).map((panelIndex) => {
              const projectIndex = assignments.copyProjects[panelIndex];
              const project = projectIndex === null ? null : projects[projectIndex];
              return (
                <div
                  key={panelIndex}
                  ref={(element) => {
                    copyPanelRefs.current[panelIndex] = element;
                  }}
                  className="absolute inset-0"
                  data-copy-panel={panelIndex}
                  aria-hidden="true"
                >
                  {project && <ProjectCopyPanel project={project} />}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const desktop = useMediaQuery("(min-width: 1025px)");
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const reducedMotion = useReducedMotion();
  const cinematic = desktop && !reducedMotion;

  return (
    <section
      id="work"
      ref={sectionRef}
      className="relative overflow-hidden bg-background py-20 text-foreground md:py-24 xl:py-28"
    >
      <header className="mx-auto mb-14 grid max-w-[1800px] gap-6 px-4 sm:px-6 md:px-8 lg:mb-20 lg:grid-cols-[1fr_0.55fr] lg:items-end">
        <div>
          <p className="project-label mb-4">[ Selected Works ]</p>
          <h2 className="font-syne text-[clamp(2.6rem,11vw,9rem)] font-extrabold uppercase leading-[0.82] tracking-[-0.075em]">
            Project
            <br />
            Systems
          </h2>
        </div>
        <p className="max-w-md font-inter text-base leading-7 text-foreground/58 lg:justify-self-end lg:text-end">
          Selected systems across product architecture, interaction design, and real-world engineering.
        </p>
      </header>

      {cinematic ? (
        <DesktopCinematicProjects finePointer={finePointer} />
      ) : (
        <div className="mx-auto max-w-[1800px] px-4 sm:px-6 md:px-8">
          <StackedProjects />
        </div>
      )}
    </section>
  );
}
