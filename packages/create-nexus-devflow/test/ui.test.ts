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

test("promptConfirm returns true when pressing Enter on defaultYes=true", async () => {
  const { promptConfirm } = await import("../lib/ui.js");
  const inputStream = new PassThrough();
  const outputStream = new PassThrough();

  const promise = promptConfirm("Proceed with installation?", {
    defaultYes: true,
    input: inputStream,
    stream: outputStream as unknown as NodeJS.WriteStream
  });

  inputStream.write("\n");
  const result = await promise;
  assert.equal(result, true);
});

test("promptConfirm returns false when user types 'n' or 'no'", async () => {
  const { promptConfirm } = await import("../lib/ui.js");
  const inputStream = new PassThrough();
  const outputStream = new PassThrough();

  const promise = promptConfirm("Overwrite files?", {
    defaultYes: true,
    input: inputStream,
    stream: outputStream as unknown as NodeJS.WriteStream
  });

  inputStream.write("n\n");
  const result = await promise;
  assert.equal(result, false);
});

test("promptConfirm returns true when user types 'y' or 'yes'", async () => {
  const { promptConfirm } = await import("../lib/ui.js");
  const inputStream = new PassThrough();
  const outputStream = new PassThrough();

  const promise = promptConfirm("Install recommended skills?", {
    defaultYes: false,
    input: inputStream,
    stream: outputStream as unknown as NodeJS.WriteStream
  });

  inputStream.write("yes\n");
  const result = await promise;
  assert.equal(result, true);
});

test("promptConfirm respects bypass option", async () => {
  const { promptConfirm } = await import("../lib/ui.js");
  const result = await promptConfirm("Any question", { bypass: true });
  assert.equal(result, true);
});

test("formatVersionTransition formats upgrade correctly", async () => {
  const { formatVersionTransition, createStyle } = await import("../lib/ui.js");
  const style = createStyle(false);
  const transition = formatVersionTransition("2.17.6", "2.17.7", style);
  assert.equal(transition, "v2.17.6 ➔ v2.17.7");
});

test("formatVersionTransition formats fresh install correctly", async () => {
  const { formatVersionTransition, createStyle } = await import("../lib/ui.js");
  const style = createStyle(false);
  const transition = formatVersionTransition(null, "2.17.7", style);
  assert.equal(transition, "v2.17.7 (Fresh Setup)");
});

test("renderHeaderBox renders formatted box with title and items", async () => {
  const { renderHeaderBox, createStyle } = await import("../lib/ui.js");
  const style = createStyle(false);
  const box = renderHeaderBox({
    title: "Nexus-DevFlow v2.17.7",
    subtitle: "Next-Gen AI Agentic Workflow Layer",
    fields: [
      { label: "Target Directory", value: "D:/Projects/app" },
      { label: "Active Adapters", value: "Codex, Antigravity" }
    ],
    style
  });

  assert.ok(box.includes("Nexus-DevFlow v2.17.7"));
  assert.ok(box.includes("Next-Gen AI Agentic Workflow Layer"));
  assert.ok(box.includes("Target Directory"));
  assert.ok(box.includes("D:/Projects/app"));
  assert.ok(box.includes("┌"));
  assert.ok(box.includes("└"));
});

test("renderStepHeader formats step with icon and description", async () => {
  const { renderStepHeader, createStyle } = await import("../lib/ui.js");
  const style = createStyle(false);
  const step = renderStepHeader(1, 3, "🔍", "Analyzing workspace footprint...", style);
  assert.ok(step.includes("[1/3]"));
  assert.ok(step.includes("🔍"));
  assert.ok(step.includes("Analyzing workspace footprint..."));
});

