export interface CheckPlaybooksOptions {
  pstackBundled?: string | null;
  sharedOnly?: boolean;
  env?: Readonly<Record<string, string | undefined>>;
  homeDir?: string;
}

export function checkPlaybooks(
  root: string,
  bundled?: string,
  options?: CheckPlaybooksOptions
): string[];
