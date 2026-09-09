#!/usr/bin/env node

import { pathToFileURL, fileURLToPath } from "node:url";
import path from "node:path";

let cliModule;
try {
  cliModule = await import("@jakkrichm/create-nexus-devflow/dist/bin/create-nexus-devflow.js");
} catch (err) {
  try {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const localTarget = path.resolve(__dirname, "../../create-nexus-devflow/dist/bin/create-nexus-devflow.js");
    cliModule = await import(pathToFileURL(localTarget).href);
  } catch (innerErr) {
    throw new Error(
      `Failed to load @jakkrichm/create-nexus-devflow: ${err?.message || err}\nLocal fallback failed: ${innerErr?.message || innerErr}`
    );
  }
}

if (typeof cliModule.main === "function") {
  await cliModule.main();
}
