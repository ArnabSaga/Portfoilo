export type ProjectStatus = "live" | "in-progress";

export interface ProjectRepository {
  label: string;
  url: string;
}

export interface PortfolioProject {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  tech: readonly string[];
  date: string;
  status: ProjectStatus;
  liveUrl?: string;
  repositoryUrls: readonly ProjectRepository[];
  access?: readonly string[];
  workspaceAccess?: readonly string[];
  contribution?: string;
}
