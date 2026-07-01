#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { spawn, execSync } from 'node:child_process';

const HANDOFF_PATH = path.join('.agent', 'state', 'handoff.md');
const RESET_KEYWORD = '[TVA_LOOP_RESET_READY]';

const DEFAULT_TEMPLATE = `# O.B. Overnight Maintenance Handoff

## 📊 Active State
- **Current Task Branch**: \`none\`
- **Last Active Stage**: \`Status 00\`
- **Loop Cycle Count**: 0
- **Status**: \`running\`

## 📂 Pending Backlog (Status 00 Scans Find)
- [ ] Scanning queue is empty.

## 🟩 Completed Tasks (Status 70 Certified)
*(None yet)*

## 🟥 Morning Queue (Requires Human Intervention)
*(None yet)*

## 📑 Current Execution Log
- Loop initialized.
`;

function ensureHandoffExists() {
  const dir = path.dirname(HANDOFF_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(HANDOFF_PATH)) {
    fs.writeFileSync(HANDOFF_PATH, DEFAULT_TEMPLATE, 'utf8');
    console.log(`[TVA Time-Keeper] Initialized new handoff file at ${HANDOFF_PATH}`);
  }
}

function parseArgs() {
  const args = process.argv.slice(2);
  let cmd = process.env.AGENT_CLI_CMD || 'codex';
  
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--cmd' || args[i] === '-c') {
      cmd = args[i + 1];
      i++;
    }
  }
  return { cmd };
}

function killProcessTree(child) {
  if (process.platform === 'win32') {
    try {
      execSync(`taskkill /F /T /PID ${child.pid}`, { stdio: 'ignore' });
    } catch (e) {
      try { child.kill('SIGKILL'); } catch (_) {}
    }
  } else {
    try {
      process.kill(-child.pid, 'SIGKILL');
    } catch (e) {
      try { child.kill('SIGKILL'); } catch (_) {}
    }
  }
}

function runSession(cmd) {
  return new Promise((resolve, reject) => {
    console.log(`\n================================================================`);
    console.log(`[TVA Time-Keeper] Starting new O.B. Agent session using: ${cmd}`);
    console.log(`[TVA Time-Keeper] Reading context from ${HANDOFF_PATH}`);
    console.log(`================================================================\n`);

    const promptMessage = `Please load the agent profile at .agent/agents/ob-loop-engineer.md and run the overnight maintenance loop. Restore status/state using the handoff file at .agent/state/handoff.md.`;

    const cmdParts = cmd.split(/\s+/);
    const executable = cmdParts[0];
    const args = cmdParts.slice(1);
    
    const finalArgs = [...args];
    if (executable === 'codex' && !finalArgs.includes('--agent')) {
      finalArgs.push('--agent', '.agent/agents/ob-loop-engineer.md');
    }

    console.log(`[TVA Time-Keeper] Spawning process: ${executable} ${finalArgs.join(' ')}`);
    
    const child = spawn(executable, finalArgs, {
      stdio: ['pipe', 'pipe', 'pipe'],
      shell: process.platform === 'win32',
      detached: process.platform !== 'win32'
    });

    child.stdin.write(promptMessage + '\n');

    let outputBuffer = '';
    let killedByKeeper = false;

    child.stdout.on('data', (data) => {
      const chunk = data.toString();
      process.stdout.write(chunk);
      outputBuffer += chunk;

      if (outputBuffer.length > 2048) {
        outputBuffer = outputBuffer.slice(-1024);
      }

      if (outputBuffer.includes(RESET_KEYWORD)) {
        console.log(`\n\n[TVA Time-Keeper] 💥 Reset keyword '${RESET_KEYWORD}' detected!`);
        console.log(`[TVA Time-Keeper] Terminating session to reset token context...`);
        killedByKeeper = true;
        killProcessTree(child);
        resolve({ reset: true });
      }
    });

    child.stderr.on('data', (data) => {
      process.stderr.write(data);
    });

    child.on('close', (code) => {
      if (killedByKeeper) {
        return;
      }
      console.log(`\n[TVA Time-Keeper] Agent process exited with code ${code}`);
      resolve({ reset: false, code });
    });

    child.on('error', (err) => {
      console.error(`[TVA Time-Keeper] Failed to start agent process:`, err.message);
      reject(err);
    });
  });
}

async function startLoop() {
  const { cmd } = parseArgs();
  ensureHandoffExists();

  let loopCount = 1;
  let running = true;

  while (running) {
    console.log(`\n--- TVA TIME-KEEPER: CYCLE #${loopCount} START ---`);
    try {
      const result = await runSession(cmd);
      if (result.reset) {
        console.log(`\n[TVA Time-Keeper] Cycle #${loopCount} completed successfully. Cleaning context for Cycle #${loopCount + 1}...`);
        loopCount++;
        await new Promise((r) => setTimeout(r, 2000));
      } else {
        console.log(`\n[TVA Time-Keeper] Agent exited naturally. Stopping loop.`);
        running = false;
      }
    } catch (error) {
      console.error(`\n[TVA Time-Keeper] Critical error in execution loop:`, error.message);
      running = false;
      process.exit(1);
    }
  }

  console.log(`\n================================================================`);
  console.log(`[TVA Time-Keeper] Overnight Maintenance Loop Stopped.`);
  console.log(`[TVA Time-Keeper] Please check .agent/state/handoff.md for final log.`);
  console.log(`================================================================\n`);
}

startLoop();
