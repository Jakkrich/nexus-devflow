export interface StarterTemplate {
  name: string;
  description: string;
  files: Record<string, string>;
}

export const starterTemplates: Record<string, StarterTemplate> = {
  default: {
    name: "default",
    description: "Default Nexus-DevFlow workspace configuration",
    files: {}
  }
};
