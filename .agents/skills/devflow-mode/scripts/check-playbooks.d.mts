export interface CheckPlaybooksOptions {
  sharedOnly?: boolean;
}

export function checkPlaybooks(
  root: string,
  bundled?: string,
  options?: CheckPlaybooksOptions
): string[];
