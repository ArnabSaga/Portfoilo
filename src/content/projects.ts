import type { PortfolioProject } from "@/types/portfolio";

export const projects = [
  {
    id: "01",
    title: "OpsCore",
    category: "SaaS Platform",
    description:
      "A multi-tenant SaaS platform focused on workspace management, RBAC, billing, and production-style architecture with a premium product experience.",
    image: "/project/opscore.jpg",
    tech: ["Next.js", "PostgreSQL", "TypeScript", "shadcn/ui", "GSAP"],
    date: "2026",
    status: "live",
    liveUrl: "https://opscore-frontend.vercel.app",
    repositoryUrls: [
      { label: "Frontend", url: "https://github.com/ArnabSaga/OpsCore-Frontend" },
    ],
    access: ["USER", "SUPER_ADMIN"],
    workspaceAccess: ["OWNER", "ADMIN", "MEMBER"],
  },
  {
    id: "02",
    title: "Medi-Store",
    category: "Fullstack Platform",
    description:
      "A medicine commerce platform with admin workflow, inventory logic, secure checkout flow, and a clean, scalable fullstack architecture.",
    image: "/project/medistore.jpg",
    tech: ["Next.js", "PostgreSQL", "TypeScript", "shadcn/ui"],
    date: "2026-01",
    status: "live",
    liveUrl: "https://medi-store-frontend-puce.vercel.app",
    repositoryUrls: [
      { label: "Frontend", url: "https://github.com/ArnabSaga/MediStore-Frontend" },
    ],
    access: ["CUSTOMER", "SELLER", "ADMIN"],
  },
  {
    id: "03",
    title: "Awwer",
    category: "Gaming Platform",
    description:
      "An interactive gaming-focused experience with expressive motion, bold visual rhythm, and a playful interface structure.",
    image: "/project/awwer.jpg",
    tech: ["React", "JavaScript", "GSAP", "Tailwind"],
    date: "2025-07",
    status: "live",
    liveUrl: "https://awwer.vercel.app",
    repositoryUrls: [{ label: "Repository", url: "https://github.com/ArnabSaga/Awwer" }],
    contribution: "Frontend",
  },
  {
    id: "04",
    title: "Velvet-Pour",
    category: "E-Commerce",
    description:
      "A luxury retail experience centered on mood, storytelling, and refined transitions for a more sensory web interaction.",
    image: "/project/velvet-pour.jpg",
    tech: ["React", "JavaScript", "GSAP"],
    date: "2025-07",
    status: "live",
    liveUrl: "https://velvet-pour-gamma-nine.vercel.app",
    repositoryUrls: [
      { label: "Repository", url: "https://github.com/ArnabSaga/Velvet-Pour" },
    ],
    contribution: "Frontend",
  },
  {
    id: "05",
    title: "MeetAI",
    category: "AI Platform",
    description:
      "An AI-first concept platform designed for intelligent meeting workflows, assistant-driven productivity, and future-facing UI.",
    image: "/project/meetai.jpg",
    tech: ["React", "JavaScript", "GSAP"],
    date: "2025-07",
    status: "in-progress",
    repositoryUrls: [{ label: "Repository", url: "https://github.com/ArnabSaga/MeetAi" }],
  },
  {
    id: "06",
    title: "Path-To-Peace",
    category: "E-Commerce",
    description:
      "A calm and minimal brand experience designed with thoughtful pacing, gentle motion, and spiritual storytelling.",
    image: "/project/path-to-peace.jpg",
    tech: ["React", "JavaScript", "GSAP"],
    date: "2026-03",
    status: "live",
    liveUrl: "https://path-to-peace.vercel.app/",
    repositoryUrls: [
      { label: "Frontend", url: "https://github.com/Sumyta-Bentey-Habib/path-to-peace" },
    ],
  },
  {
    id: "07",
    title: "Monster-Steamer",
    category: "E-Commerce",
    description: "Premium carpet cleaning and professional hygiene services in San Diego.",
    image: "/project/Monster-Steamer.png",
    tech: ["React", "JavaScript", "GSAP"],
    date: "2024-06",
    status: "live",
    liveUrl: "https://monster-steamer-inky.vercel.app/",
    repositoryUrls: [
      { label: "Repository", url: "https://github.com/ArnabSaga/Monster-Steamer" },
    ],
    contribution: "Frontend",
  },
] as const satisfies readonly PortfolioProject[];
