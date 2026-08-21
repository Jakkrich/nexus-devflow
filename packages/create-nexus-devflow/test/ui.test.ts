import assert from "node:assert/strict";
import test from "node:test";
import { PassThrough } from "node:stream";
import { createSpinner, createStyle, shouldUseColor } from "../lib/ui.js";

test("createStyle returns ANSI escape codes when enabled", () => {
  const style = createStyle(true);
  assert.equal(style.bold("test"), "\x1b[1mtest\x1b[22m");
  assert.equal(style.cyan("test"), "\x1b[36mtest\x1b[39m");
  assert.equal(style.brightCyan("test"), "\x1b[96mtest\x1b[39m");
  assert.equal(style.green("test"), "\x1b[32mtest\x1b[39m");
  assert.equal(style.red("test"), "\x1b[31mtest\x1b[39m");
  assert.equal(style.yellow("test"), "\x1b[33mtest\x1b[39m");
});

test("createStyle returns plain text when disabled", () => {
  const style = createStyle(false);
  assert.equal(style.bold("test"), "test");
  assert.equal(style.cyan("test"), "test");
  assert.equal(style.brightCyan("test"), "test");
  assert.equal(style.green("test"), "test");
});

test("shouldUseColor respects NO_COLOR env", () => {
  assert.equal(shouldUseColor(true, { NO_COLOR: "1" }), false);
  assert.equal(shouldUseColor(true, {}), true);
  assert.equal(shouldUseColor(false, {}), false);
});

test("Spinner writes plain text messages in non-interactive streams", () => {
  const stream = new PassThrough();
  const chunks: string[] = [];
  stream.on("data", (chunk) => chunks.push(chunk.toString()));

  const spinner = createSpinner("Loading files...", {
    stream: stream as unknown as NodeJS.WriteStream,
    enabled: false
  });

  spinner.start();
  spinner.succeed("Files loaded successfully!");

  const output = chunks.join("");
  assert.ok(output.includes("Loading files..."));
  assert.ok(output.includes("Files loaded successfully!"));
});
