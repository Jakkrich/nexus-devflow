export interface FrontmatterResult {
  name?: string;
  description?: string;
  allowedTools?: string;
}

export interface SkillBudgetStats {
  rel: string;
  words: number;
  bytes: number;
  isSkillMd: boolean;
}

export interface SkillBudgetResult {
  violations: string[];
  warnings: string[];
  stats: SkillBudgetStats[];
}

export interface SkillBudgetOptions {
  skillBudget?: number;
  supportBudget?: number;
  descCap?: number;
  warnThreshold?: number;
}

export declare const DEFAULT_SKILL_BYTE_BUDGET: number;
export declare const DEFAULT_SUPPORT_MD_BYTE_BUDGET: number;
export declare const DEFAULT_DESCRIPTION_CHAR_CAP: number;
export declare const DEFAULT_WARN_AT: number;

export declare function parseFrontmatter(text: string): FrontmatterResult;
export declare function checkSkillBudgets(skillsDir: string, options?: SkillBudgetOptions): SkillBudgetResult;
