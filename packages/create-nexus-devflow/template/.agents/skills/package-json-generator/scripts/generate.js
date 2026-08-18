const fs = require('fs');
const path = require('path');

const targetDir = process.argv[2] || process.cwd();
const packageJsonPath = path.join(targetDir, 'package.json');
const tasksJsonPath = path.join(targetDir, '.vscode', 'tasks.json');

// Initialize or read package.json
let pkg = {};
if (fs.existsSync(packageJsonPath)) {
  try {
    pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  } catch (e) {
    console.error(JSON.stringify({ status: 'error', message: 'Invalid package.json format' }));
    process.exit(1);
  }
} else {
  pkg = {
    name: path.basename(path.resolve(targetDir)),
    version: '1.0.0',
    description: '',
    main: 'index.js',
    scripts: {}
  };
}

if (!pkg.scripts) pkg.scripts = {};

let scriptsAdded = 0;

// Read .vscode/tasks.json if exists
if (fs.existsSync(tasksJsonPath)) {
  try {
    const tasksContent = fs.readFileSync(tasksJsonPath, 'utf8');
    // Basic JSON parse (Note: tasks.json often contains comments, so we use a simple regex to strip them)
    const jsonWithoutComments = tasksContent.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '$1');
    const tasksData = JSON.parse(jsonWithoutComments);

    const tasks = tasksData.tasks || [];
    const inputs = tasksData.inputs || [];

    // Helper to find input description
    const getInputDefaultOrDesc = (inputId) => {
      const input = inputs.find(i => i.id === inputId);
      return input ? (input.description || input.default || inputId) : inputId;
    };

    tasks.forEach(task => {
      if (task.command) {
        // Convert label to script name (e.g. "🚀 [Docker] Start Project" -> "docker:start")
        let scriptName = task.label
          .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '') // Remove emojis
          .replace(/\[(.*?)\]/g, '$1') // Remove brackets
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-'); // Replace spaces/specials with dash
        
        // Shorten some common prefixes
        scriptName = scriptName.replace(/^docker-/, 'docker:');
        scriptName = scriptName.replace(/^db-/, 'db:');

        let cmd = task.command;

        // Append args if any
        if (task.args && Array.isArray(task.args)) {
          cmd += ' ' + task.args.join(' ');
        }

        // Convert ${input:xxx} to PowerShell Read-Host
        const inputMatches = cmd.match(/\$\{input:([a-zA-Z0-9_-]+)\}/g);
        if (inputMatches) {
          let psCommands = [];
          let currentCmd = cmd;
          
          inputMatches.forEach(match => {
            const inputId = match.replace('${input:', '').replace('}', '');
            const prompt = getInputDefaultOrDesc(inputId);
            psCommands.push(`$${inputId} = Read-Host '${prompt}'`);
            currentCmd = currentCmd.replace(match, `$${inputId}`);
          });

          // Wrap the command in PowerShell
          cmd = `powershell -Command "${psCommands.join('; ')}; if (${inputMatches.map(m => '$'+m.replace('${input:','').replace('}','')).join(' -and ')}) { ${currentCmd} }"`;
        }

        // Don't overwrite existing scripts unless necessary, or just add if not exist
        if (!pkg.scripts[scriptName]) {
          pkg.scripts[scriptName] = cmd;
          scriptsAdded++;
        }
      }
    });

  } catch (e) {
    // Ignore parse errors for tasks.json
  }
}

// Ensure default scripts exist
const defaultScripts = {
  "start": "node index.js"
};

for (const [key, value] of Object.entries(defaultScripts)) {
  if (!pkg.scripts[key] && Object.keys(pkg.scripts).length === 0) {
    pkg.scripts[key] = value;
    scriptsAdded++;
  }
}

fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2) + '\n');

console.log(JSON.stringify({
  status: 'success',
  message: 'Generated package.json successfully',
  data: {
    scriptsAdded,
    path: packageJsonPath
  }
}));
