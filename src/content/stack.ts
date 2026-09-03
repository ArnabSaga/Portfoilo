export type StackLayerName =
  | "Language"
  | "Interface"
  | "Runtime"
  | "Data"
  | "Delivery"
  | "Motion";

export interface StackTechnology {
  name: string;
  image: string;
}

export interface StackLayer {
  step: string;
  name: StackLayerName;
  technologies: readonly StackTechnology[];
}

export const stackLayers = [
  {
    step: "01",
    name: "Language",
    technologies: [
      { name: "JavaScript", image: "/icon/javascript.jpg" },
      { name: "TypeScript", image: "/icon/typescript.jpg" },
    ],
  },
  {
    step: "02",
    name: "Interface",
    technologies: [
      { name: "React.js", image: "/icon/reactjs.jpg" },
      { name: "Next.js", image: "/icon/nextjs.jpg" },
      { name: "Tailwind CSS", image: "/icon/tailwind.jpg" },
      { name: "shadcn/ui", image: "/icon/shadcn.jpg" },
    ],
  },
  {
    step: "03",
    name: "Runtime",
    technologies: [
      { name: "Node.js", image: "/icon/nodejs.jpg" },
      { name: "Express.js", image: "/icon/express.jpg" },
    ],
  },
  {
    step: "04",
    name: "Data",
    technologies: [
      { name: "PostgreSQL", image: "/icon/postgresql.jpg" },
      { name: "MongoDB", image: "/icon/mongodb.jpg" },
      { name: "Prisma", image: "/icon/prisma.webp" },
    ],
  },
  {
    step: "05",
    name: "Delivery",
    technologies: [
      { name: "Docker", image: "/icon/docker.jpg" },
      { name: "Git", image: "/icon/git.jpg" },
    ],
  },
  {
    step: "06",
    name: "Motion",
    technologies: [
      { name: "GSAP", image: "/icon/gsap.jpg" },
      { name: "Three.js", image: "/icon/three-js.jpg" },
    ],
  },
] as const satisfies readonly StackLayer[];
