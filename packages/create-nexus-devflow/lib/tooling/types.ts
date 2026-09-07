export interface ToolResult<T = unknown> {
  ok: boolean;
  message?: string;
  data?: T;
}

export interface ToolingOptions {
  cwd?: string;
  projectRoot?: string;
  silent?: boolean;
}

export interface ToolCommand<T = unknown> {
  name: string;
  description: string;
  run: (args: string[], options?: ToolingOptions) => Promise<ToolResult<T>>;
}

export class ToolingError extends Error {
  public readonly exitCode: number;

  constructor(message: string, exitCode: number = 1) {
    super(message);
    this.name = "ToolingError";
    this.exitCode = exitCode;
    Object.setPrototypeOf(this, ToolingError.prototype);
  }
}
