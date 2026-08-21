import readline from "node:readline";

export interface TextStyle {
  bold: (value: string) => string;
  brightCyan: (value: string) => string;
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
