import readline from "node:readline";

export interface TextStyle {
  bold: (value: string) => string;
  brightCyan: (value: string) => string;
  brightGreen: (value: string) => string;
  cyan: (value: string) => string;
  dim: (value: string) => string;
  green: (value: string) => string;
  magenta: (value: string) => string;
  red: (value: string) => string;
  yellow: (value: string) => string;
}

export function shouldUseColor(
  isTTY: boolean | undefined = process.stdout.isTTY,
  environment: NodeJS.ProcessEnv = process.env
): boolean {
  return isTTY === true && !Object.hasOwn(environment, "NO_COLOR");
}

export function createStyle(enabled: boolean = shouldUseColor()): TextStyle {
  if (!enabled) {
    return {
      bold: (value) => value,
      brightCyan: (value) => value,
      brightGreen: (value) => value,
      cyan: (value) => value,
      dim: (value) => value,
      green: (value) => value,
      magenta: (value) => value,
      red: (value) => value,
      yellow: (value) => value
    };
  }

  return {
    bold: (value) => `\x1b[1m${value}\x1b[22m`,
    brightCyan: (value) => `\x1b[96m${value}\x1b[39m`,
    brightGreen: (value) => `\x1b[92m${value}\x1b[39m`,
    cyan: (value) => `\x1b[36m${value}\x1b[39m`,
    dim: (value) => `\x1b[2m${value}\x1b[22m`,
    green: (value) => `\x1b[32m${value}\x1b[39m`,
    magenta: (value) => `\x1b[35m${value}\x1b[39m`,
    red: (value) => `\x1b[31m${value}\x1b[39m`,
    yellow: (value) => `\x1b[33m${value}\x1b[39m`
  };
}

export interface SpinnerOptions {
  stream?: NodeJS.WriteStream;
  enabled?: boolean;
  interval?: number;
}

export class Spinner {
  private static frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
  private text: string;
  private stream: NodeJS.WriteStream;
  private isInteractive: boolean;
  private intervalMs: number;
  private timer: NodeJS.Timeout | null = null;
  private frameIndex = 0;
  private style: TextStyle;

  constructor(text: string = "", options: SpinnerOptions = {}) {
    this.text = text;
    this.stream = options.stream || process.stdout;
    this.isInteractive =
      options.enabled ?? (this.stream.isTTY === true && !process.env.CI);
    this.intervalMs = options.interval || 80;
    this.style = createStyle(shouldUseColor(this.stream.isTTY));
  }

  start(text?: string): this {
    if (text) this.text = text;

    if (!this.isInteractive) {
      if (this.text) {
        this.stream.write(`${this.text}\n`);
      }
      return this;
    }

    if (this.timer) clearInterval(this.timer);

    this.frameIndex = 0;
    this.render();
    this.timer = setInterval(() => {
      this.frameIndex = (this.frameIndex + 1) % Spinner.frames.length;
      this.render();
    }, this.intervalMs);

    return this;
  }

  update(text: string): this {
    this.text = text;
    if (this.isInteractive) {
      this.render();
    }
    return this;
  }

  stop(): this {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    if (this.isInteractive) {
      this.clearLine();
    }
    return this;
  }

  succeed(text?: string): this {
    this.stop();
    const message = text || this.text;
    const icon = this.style.green("✔");
    this.stream.write(`${icon} ${this.style.bold(message)}\n`);
    return this;
  }

  fail(text?: string): this {
    this.stop();
    const message = text || this.text;
    const icon = this.style.red("✖");
    this.stream.write(`${icon} ${this.style.bold(message)}\n`);
    return this;
  }

  private render(): void {
    const frame = Spinner.frames[this.frameIndex];
    const coloredFrame = this.style.cyan(frame);
    this.clearLine();
    this.stream.write(`${coloredFrame} ${this.text}`);
  }

  private clearLine(): void {
    if (typeof readline.clearLine === "function") {
      readline.clearLine(this.stream, 0);
      readline.cursorTo(this.stream, 0);
    } else {
      this.stream.write("\r\x1b[2K");
    }
  }
}

export function createSpinner(text: string, options?: SpinnerOptions): Spinner {
  return new Spinner(text, options);
}

export interface PromptConfirmOptions {
  defaultYes?: boolean;
  bypass?: boolean;
  input?: NodeJS.ReadableStream;
  stream?: NodeJS.WriteStream;
  style?: TextStyle;
}

export async function promptConfirm(
  question: string,
  options: PromptConfirmOptions = {}
): Promise<boolean> {
  const { defaultYes = true, bypass = false } = options;
  if (bypass) return true;

  const isInteractive = options.input
    ? true
    : Boolean(process.stdin.isTTY && !process.env.CI);

  if (!isInteractive && !options.input) {
    return defaultYes;
  }

  const rl = readline.createInterface({
    input: (options.input as NodeJS.ReadableStream) || process.stdin,
    output: options.stream || process.stdout
  });

  const promptHint = defaultYes ? "[Y/n]" : "[y/N]";
  const query = `${question} ${promptHint} `;

  return new Promise<boolean>((resolve) => {
    rl.question(query, (answer) => {
      rl.close();
      const trimmed = answer.trim().toLowerCase();
      if (trimmed === "") {
        resolve(defaultYes);
      } else if (trimmed === "y" || trimmed === "yes") {
        resolve(true);
      } else if (trimmed === "n" || trimmed === "no") {
        resolve(false);
      } else {
        resolve(defaultYes);
      }
    });
  });
}

export function stripAnsi(text: string): string {
  return text.replace(/\x1b\[[0-9;]*m/g, "");
}

export function formatVersionTransition(
  oldVersion: string | null | undefined,
  newVersion: string,
  style: TextStyle = createStyle(shouldUseColor())
): string {
  if (!oldVersion || oldVersion === "legacy") {
    return `${style.bold(style.brightGreen(`v${newVersion}`))} ${style.dim("(Fresh Setup)")}`;
  }
  if (oldVersion === newVersion) {
    return style.bold(style.cyan(`v${newVersion}`));
  }
  return `${style.dim(`v${oldVersion}`)} ${style.bold(style.cyan("➔"))} ${style.bold(style.brightGreen(`v${newVersion}`))}`;
}

export interface HeaderBoxField {
  label: string;
  value: string;
}

export interface HeaderBoxOptions {
  title: string;
  subtitle?: string;
  fields?: HeaderBoxField[];
  style?: TextStyle;
  minWidth?: number;
}

export function renderHeaderBox(options: HeaderBoxOptions): string {
  const style = options.style || createStyle(shouldUseColor());
  const lines: string[] = [];

  const rawTitle = `⚡ ${options.title}`;
  const rawSubtitle = options.subtitle ? options.subtitle : "";
  const rawFields = (options.fields || []).map((f) => `  ${f.label.padEnd(16)}: ${f.value}`);

  const allRawLines = [rawTitle, ...(rawSubtitle ? [rawSubtitle] : []), ...rawFields];
  const maxLen = Math.max(
    options.minWidth || 64,
    ...allRawLines.map((l) => stripAnsi(l).length + 4)
  );

  const topBorder = style.cyan(`┌${"─".repeat(maxLen)}┐`);
  const bottomBorder = style.cyan(`└${"─".repeat(maxLen)}┘`);
  const vertical = style.cyan("│");

  lines.push(topBorder);

  // Title Line
  const titlePad = maxLen - stripAnsi(rawTitle).length - 2;
  lines.push(`${vertical}  ${style.bold(style.brightCyan(rawTitle))}${" ".repeat(Math.max(0, titlePad))}${vertical}`);

  // Subtitle Line
  if (options.subtitle) {
    const subPad = maxLen - stripAnsi(rawSubtitle).length - 2;
    lines.push(`${vertical}  ${style.dim(rawSubtitle)}${" ".repeat(Math.max(0, subPad))}${vertical}`);
  }

  // Divider
  if (options.fields && options.fields.length > 0) {
    lines.push(style.cyan(`├${"─".repeat(maxLen)}┤`));
    for (const field of options.fields) {
      const rawLine = `  ${field.label.padEnd(16)}: ${field.value}`;
      const styledLine = `  ${style.dim(field.label.padEnd(16))} : ${style.bold(field.value)}`;
      const fieldPad = maxLen - stripAnsi(rawLine).length - 2;
      lines.push(`${vertical}${styledLine}${" ".repeat(Math.max(0, fieldPad))}${vertical}`);
    }
  }

  lines.push(bottomBorder);
  return lines.join("\n");
}

export function renderStepHeader(
  current: number,
  total: number,
  icon: string,
  title: string,
  style: TextStyle = createStyle(shouldUseColor())
): string {
  const badge = style.bold(style.cyan(`[${current}/${total}]`));
  const heading = style.bold(title);
  return `\n${badge} ${icon} ${heading}`;
}

