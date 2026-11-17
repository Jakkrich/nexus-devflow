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

export interface CheckboxOption<T = string> {
  label: string;
  value: T;
  description?: string;
  checked?: boolean;
  badge?: string;
}

export interface PromptCheckboxOptions<T = string> {
  choices: readonly CheckboxOption<T>[];
  input?: NodeJS.ReadableStream;
  stream?: NodeJS.WriteStream;
  style?: TextStyle;
  isInteractive?: boolean;
}

function truncateText(text: string, maxLen: number): string {
  if (maxLen <= 3 || text.length <= maxLen) return text;
  return `${text.slice(0, maxLen - 3)}...`;
}

function renderCheckboxBlock<T>(
  question: string,
  choices: readonly CheckboxOption<T>[],
  selected: readonly boolean[],
  cursor: number,
  style: TextStyle,
  columns?: number
): string[] {
  const hint = style.dim("(↑/↓ move, Space toggle, a all, Enter confirm, Esc skip)");
  const maxWidth = columns && columns > 20 ? columns - 1 : Number.POSITIVE_INFINITY;
  const headerRaw = `  ${question} (↑/↓ move, Space toggle, a all, Enter confirm, Esc skip)`;
  const headerLine =
    headerRaw.length > maxWidth ? `  ${style.bold(truncateText(question, maxWidth - 2))}` : `  ${style.bold(question)} ${hint}`;
  const lines: string[] = [headerLine];
  const labelWidth = Math.max(...choices.map((c) => c.label.length), 12);

  for (let i = 0; i < choices.length; i++) {
    const item = choices[i];
    const isFocused = i === cursor;
    const isChecked = selected[i];
    const pointer = isFocused ? style.brightCyan("❯") : " ";
    const box = isChecked ? style.brightGreen("[x]") : style.dim("[ ]");
    const paddedLabel = item.label.padEnd(labelWidth);
    const labelText = isFocused
      ? style.bold(style.brightCyan(paddedLabel))
      : isChecked
      ? style.bold(paddedLabel)
      : paddedLabel;
    const badgeRaw = item.badge ? ` [${item.badge}]` : "";
    const badgeText = item.badge ? ` ${style.cyan(`[${item.badge}]`)}` : "";
    const prefixPlainLen = `  ❯ [x] ${paddedLabel}${badgeRaw}`.length;
    const availableForDesc = maxWidth - prefixPlainLen - 3;
    const descText =
      item.description && availableForDesc > 8
        ? ` ${style.dim(`- ${truncateText(item.description, availableForDesc)}`)}`
        : "";
    lines.push(`  ${pointer} ${box} ${labelText}${badgeText}${descText}`);
  }

  return lines;
}

export async function promptCheckbox<T = string>(
  question: string,
  options: PromptCheckboxOptions<T>
): Promise<T[]> {
  const { choices } = options;
  if (choices.length === 0) return [];

  const isInteractive =
    options.isInteractive ??
    (options.input ? true : Boolean(process.stdin.isTTY && !process.env.CI));

  if (!isInteractive && !options.input) {
    return choices.filter((c) => c.checked).map((c) => c.value);
  }

  const input = (options.input || process.stdin) as NodeJS.ReadStream;
  const stream = options.stream || process.stdout;
  const style = options.style || createStyle(shouldUseColor(stream.isTTY));
  const selected = choices.map((c) => Boolean(c.checked));
  let cursor = 0;
  let renderedLineCount = 0;

  const writeLines = (lines: string[]) => {
    if (renderedLineCount > 0 && stream.isTTY) {
      stream.write(`\x1b[${renderedLineCount}A\r\x1b[J`);
    }
    if (renderedLineCount === 0 || stream.isTTY) {
      stream.write(`${lines.join("\n")}\n`);
      renderedLineCount = lines.length;
    }
  };

  if (stream.isTTY) {
    stream.write("\x1b[?25l");
  }
  writeLines(renderCheckboxBlock(question, choices, selected, cursor, style, stream.columns));

  readline.emitKeypressEvents(input);
  const previousRawMode = typeof input.isRaw === "boolean" ? input.isRaw : undefined;
  if (typeof input.setRawMode === "function") {
    input.setRawMode(true);
  }
  if (typeof input.resume === "function") {
    input.resume();
  }

  return new Promise<T[]>((resolve) => {
    let settled = false;

    const cleanup = () => {
      input.removeListener("keypress", onKeypress);
      input.removeListener("end", onEnd);
      if (typeof input.setRawMode === "function") {
        input.setRawMode(Boolean(previousRawMode));
      }
      if (typeof input.pause === "function" && !options.input) {
        input.pause();
      }
      if (stream.isTTY) {
        stream.write("\x1b[?25h");
      }
    };

    const finish = (cancelled: boolean) => {
      if (settled) return;
      settled = true;
      cleanup();

      const result = cancelled
        ? []
        : choices.filter((_, index) => selected[index]).map((item) => item.value);

      if (stream.isTTY && renderedLineCount > 0) {
        stream.write(`\x1b[${renderedLineCount}A\r\x1b[J`);
        const summary =
          result.length > 0
            ? choices
                .filter((_, index) => selected[index])
                .map((item) => style.cyan(item.label))
                .join(", ")
            : style.dim("none");
        stream.write(`  ${style.bold(question)} ${summary}\n`);
      }

      resolve(result);
    };

    const onEnd = () => finish(true);

    const onKeypress = (str: string, key: readline.Key = {}) => {
      if ((key.ctrl && key.name === "c") || key.name === "escape" || str === "\x03") {
        finish(true);
        return;
      }

      if (key.name === "return" || key.name === "enter" || str === "\r" || str === "\n") {
        finish(false);
        return;
      }

      if (key.name === "up" || key.name === "k" || str === "k") {
        cursor = (cursor - 1 + choices.length) % choices.length;
      } else if (key.name === "down" || key.name === "j" || str === "j") {
        cursor = (cursor + 1) % choices.length;
      } else if (key.name === "space" || str === " ") {
        selected[cursor] = !selected[cursor];
      } else if (key.name === "a" || str === "a") {
        const allSelected = selected.every(Boolean);
        for (let i = 0; i < selected.length; i++) {
          selected[i] = !allSelected;
        }
      } else {
        return;
      }

      writeLines(renderCheckboxBlock(question, choices, selected, cursor, style, stream.columns));
    };

    input.on("keypress", onKeypress);
    input.on("end", onEnd);
  });
}

