export type ExperiencePhase =
  | "Foundation"
  | "Interface"
  | "Product"
  | "Systems";

export interface ExperienceChapter {
  step: string;
  title: string;
  context: string;
  period: string;
  description: string;
  phase: ExperiencePhase;
}

export const experienceChapters = [
  {
    step: "01",
    title: "Starting As Developer",
    context: "Self",
    period: "2022 — 2023",
    description:
      "Started with fundamentals, frontend systems, component thinking, and clean implementation habits.",
    phase: "Foundation",
  },
  {
    step: "02",
    title: "Frontend Engineer",
    context: "Craft & Systems",
    period: "2023 — 2024",
    description:
      "Focused on interaction design, design systems, animation principles, and scalable UI architecture.",
    phase: "Interface",
  },
  {
    step: "03",
    title: "Full Stack Developer",
    context: "Product & Platform",
    period: "2024 — 2025",
    description:
      "Built complete products with Next.js, Node.js, Prisma, authentication, RBAC, and production-ready flows.",
    phase: "Product",
  },
  {
    step: "04",
    title: "System Builder",
    context: "Architecture First",
    period: "2026 — Present",
    description:
      "Designing systems with stronger motion direction, premium interfaces, scalable backend thinking, and SaaS structure.",
    phase: "Systems",
  },
] as const satisfies readonly ExperienceChapter[];
