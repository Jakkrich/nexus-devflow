const DASHBOARD_PAGE_HTML = `<!doctype html>
<html lang="th">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Nexus-DevFlow Enterprise Dashboard</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=Noto+Sans+Thai:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">
  <style>
    :root{
      --font-display:"Google Sans Thai","Google Sans","Noto Sans Thai","Space Grotesk",sans-serif;
      --font-sans:"Google Sans Thai","Google Sans","Noto Sans Thai",sans-serif;
      --font-mono:"IBM Plex Mono",monospace;
      --bg:#0a2540;--bg-deep:#061a2e;--panel:rgba(255,255,255,.04);--panel-strong:#0c2b49;
      --ink:#edf6ff;--soft:#b7d3ef;--muted:#7598ba;--line:rgba(191,224,255,.17);--line-strong:rgba(191,224,255,.36);
      --cyan:#7dd8ff;--mint:#6fe3b4;--gold:#f2c14e;--red:#ff7061;--violet:#b8a4ff;
      --mint-soft:rgba(111,227,180,.14);--gold-soft:rgba(242,193,78,.14);--red-soft:rgba(255,112,97,.14);--violet-soft:rgba(184,164,255,.14);
    }
    *{box-sizing:border-box}
    html{color-scheme:dark}
    body{margin:0;min-height:100vh;background-color:var(--bg);color:var(--ink);font-family:var(--font-sans);-webkit-font-smoothing:antialiased;background-image:linear-gradient(rgba(125,216,255,.065) 1px,transparent 1px),linear-gradient(90deg,rgba(125,216,255,.065) 1px,transparent 1px),radial-gradient(circle at 8% -5%,rgba(125,216,255,.16),transparent 42rem);background-size:34px 34px,34px 34px,auto}
    button,input{font:inherit}
    code{font-family:var(--font-mono);color:var(--cyan)}
    .sheet{width:min(1180px,calc(100% - 40px));margin:0 auto;padding:34px 0 64px}
    .titleblock{display:flex;align-items:flex-end;justify-content:space-between;gap:26px;padding-bottom:20px;border-bottom:1px solid var(--line-strong);flex-wrap:wrap}
    .eyebrow,.label{font:600 10px/1 var(--font-mono);letter-spacing:.13em;text-transform:uppercase;color:var(--cyan)}
    .eyebrow{display:flex;align-items:center;gap:8px;margin-bottom:12px}.eyebrow:before{content:"";width:20px;height:1px;background:var(--cyan)}
    h1{margin:0 0 6px;font:700 clamp(32px,4vw,48px)/1.05 var(--font-display);letter-spacing:-.03em}
    .path,.muted{color:var(--muted);font-size:12px;line-height:1.65}.path{font-family:var(--font-mono)}
    .badges{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}.badge,.pill{padding:4px 9px;border:1px solid var(--line-strong);border-radius:3px;background:rgba(255,255,255,.025);color:var(--muted);font:600 10px/1.5 var(--font-mono);text-transform:uppercase}
    .ok,.healthy,.current,.ready,.idle{border-color:rgba(111,227,180,.42)!important;color:var(--mint)!important;background:var(--mint-soft)!important}
    .warning,.available,.offline,.blocked,.fail{border-color:rgba(255,112,97,.42)!important;color:var(--red)!important;background:var(--red-soft)!important}
    .active,.deep,.fast,.configured{border-color:rgba(184,164,255,.42)!important;color:var(--violet)!important;background:var(--violet-soft)!important}
    .meta{display:grid;grid-template-columns:auto auto;gap:4px 20px;margin:0;font:11px/1.55 var(--font-mono)}.meta dt{color:var(--muted);text-transform:uppercase}.meta dd{margin:0;color:var(--soft);text-align:right}
    .live{display:flex;align-items:center;gap:8px;margin:14px 0 24px;font:11px var(--font-mono);color:var(--muted)}.live-dot{width:7px;height:7px;border-radius:50%;background:var(--gold)}.live-dot.on{background:var(--mint);box-shadow:0 0 0 4px rgba(111,227,180,.12)}
    .panel,.card{position:relative;min-width:0;border:1px solid var(--line);border-radius:4px;background:var(--panel)}
    #dual-track{overflow:hidden}
    .stepper{justify-content:center}.step{display:flex;flex-direction:column;align-items:center;text-align:center}.step-icon{display:grid;place-items:center;width:30px;height:30px;margin:10px auto 8px;border:1px solid currentColor;border-radius:8px;background:rgba(255,255,255,.035)}.icon-glyph{display:block;font-size:17px;line-height:1}.step.flow-0,.step.flow-4{color:var(--cyan)}.step.flow-1,.step.flow-5{color:var(--violet)}.step.flow-2,.step.flow-6{color:var(--gold)}.step.flow-3,.step.flow-7{color:var(--mint)}.step .step-name{color:currentColor}.step .step-cmd{color:var(--muted)}
    .panel{padding:24px 26px;margin-bottom:20px}.panel-head,.card-head{display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap}.panel-head{margin-bottom:20px}.card-head{margin-bottom:17px}
    .track-tabs{display:flex;gap:7px;flex-wrap:wrap}.tab{display:inline-flex;align-items:center;gap:7px;padding:7px 13px;border:1px solid var(--line-strong);border-radius:99px;background:transparent;color:var(--muted);font:600 10px var(--font-mono);cursor:pointer}.tab:hover,.tab:focus-visible{border-color:var(--cyan);color:var(--cyan);outline:none}.tab.on{background:var(--cyan);border-color:var(--cyan);color:var(--bg-deep)}.tab-active-dot{display:none;padding:2px 6px;border-radius:99px;font:700 8px/1 var(--font-mono);letter-spacing:.05em;text-transform:uppercase;background:var(--mint);color:var(--bg-deep)}.tab.is-active-track .tab-active-dot{display:inline-flex;align-items:center;gap:3px;box-shadow:0 0 0 2px rgba(111,227,180,.25)}.tab.on.is-active-track .tab-active-dot{background:var(--bg-deep);color:var(--mint)}
    .track-view{display:none;min-width:0}.track-view.on{display:block}.stepper{display:flex;width:100%;max-width:100%;overflow-x:auto;padding:4px 0 7px}.step{flex:1 1 0;min-width:104px;position:relative;padding-right:12px}.step-line{position:absolute;top:10px;left:21px;right:0;height:1px;background:var(--line-strong)}.step:last-child .step-line{display:none}.step.done .step-line{background:var(--mint)}
    .step-dot{position:relative;z-index:1;width:21px;height:21px;border-radius:50%;display:grid;place-items:center;border:2px solid var(--line-strong);background:var(--bg-deep);color:var(--muted);font:700 8px var(--font-mono)}.step.done .step-dot{border-color:var(--mint);color:var(--mint)}.step.active .step-dot{border-color:var(--gold);color:var(--gold);box-shadow:0 0 0 4px rgba(242,193,78,.16)}
    .step-name{margin-top:9px;color:var(--soft);font:600 10px/1.35 var(--font-mono)}.step.active .step-name{color:var(--gold)}.step.done .step-name{color:var(--mint)}.step-cmd{margin-top:3px;color:var(--muted);font:9px/1.4 var(--font-mono)}.track-note{margin-top:12px;padding-top:12px;border-top:1px dashed var(--line);color:var(--muted);font:11px/1.65 var(--font-mono)}
    .next-action{background:var(--bg-deep);border-color:var(--line-strong)}.next-head{display:flex;justify-content:space-between;gap:12px;align-items:center}.command{margin:8px 0 6px;color:var(--gold);font:700 clamp(22px,3vw,30px)/1.3 var(--font-mono)}.copy{padding:7px 12px;border:1px solid var(--cyan);border-radius:3px;background:transparent;color:var(--cyan);font:600 10px var(--font-mono);cursor:pointer}.copy:hover,.copy:focus-visible{background:var(--cyan);color:var(--bg-deep);outline:none}
    .stats{display:grid;grid-template-columns:repeat(5,1fr);gap:1px;margin:0 0 20px;border:1px solid var(--line);border-radius:4px;overflow:hidden;background:var(--line)}.stat{padding:16px 18px;background:var(--bg-deep)}.stat-value{font:700 25px/1 var(--font-display)}.stat-label{margin-top:6px;color:var(--muted);font:10px var(--font-mono);text-transform:uppercase;letter-spacing:.08em}
    .grid{display:grid;grid-template-columns:repeat(12,1fr);gap:20px;margin-bottom:20px}.card{grid-column:span 4;min-width:0;padding:clamp(20px,2.4vw,28px)}.card.wide{grid-column:span 8}.card.full{grid-column:1/-1}.value{font:700 18px/1.4 var(--font-display)}
    .facts{display:grid;gap:10px}.fact{display:flex;justify-content:space-between;gap:16px;padding-bottom:10px;border-bottom:1px dashed var(--line)}.fact:last-child{padding-bottom:0;border:0}.fact span:first-child{color:var(--muted);font-size:11px}.fact span:last-child{color:var(--soft);font:11px var(--font-mono);text-align:right;overflow-wrap:anywhere}
    .progress{height:6px;margin:14px 0 9px;border-radius:99px;background:rgba(255,255,255,.07);overflow:hidden}.progress span{display:block;height:100%;width:0;background:var(--gold);transition:width .35s ease}
    ul{list-style:none;margin:0;padding:0}li{padding:10px 0;border-bottom:1px dashed var(--line);color:var(--soft);font-size:12px;line-height:1.55}li:last-child{border:0}.empty{color:var(--muted)}
    .severity{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.sev{padding:9px 6px;border:1px solid var(--line);border-radius:3px;text-align:center}.sev b{display:block;font:700 17px var(--font-display)}.sev small{color:var(--muted);font:9px var(--font-mono)}
    .commands{display:flex;flex-wrap:wrap;gap:10px}.cmd{position:relative;padding:8px 13px;border:1px solid var(--line-strong);border-radius:3px;background:rgba(255,255,255,.025);color:var(--soft);font:11px var(--font-mono);cursor:pointer}.cmd:hover,.cmd:focus-visible,.cmd:focus{border-color:var(--cyan);color:var(--cyan);outline:2px solid rgba(125,216,255,.2);outline-offset:2px}.cmd:after{content:attr(data-tip);position:absolute;z-index:30;left:50%;bottom:calc(100% + 10px);width:max-content;max-width:min(300px,80vw);padding:9px 11px;border:1px solid var(--line-strong);border-radius:3px;background:#031421;color:var(--soft);font:10px/1.5 var(--font-mono);white-space:normal;text-align:left;opacity:0;visibility:hidden;transform:translate(-50%,5px);box-shadow:0 12px 30px rgba(0,0,0,.4);transition:.15s;pointer-events:none}.cmd:hover:after,.cmd:focus-visible:after,.cmd:focus:after{opacity:1;visibility:visible;transform:translate(-50%,0)}
    .adapters,.roster-grid,.mcp-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.adapter,.roster-card,.mcp-card{padding:15px;border:1px solid var(--line);border-radius:4px;background:rgba(255,255,255,.02)}.adapter strong,.roster-card strong,.mcp-card strong{display:block;margin-bottom:6px;text-transform:capitalize}.adapter-path,.roster-desc,.mcp-desc{color:var(--muted);font:10px var(--font-mono);line-height:1.4}.adapter-state{margin-top:9px;font:10px var(--font-mono)}
    .mcp-grid{grid-template-columns:repeat(3,1fr)}
    .search-row{display:flex;gap:10px;margin-bottom:16px}.search-input{flex:1;padding:10px 14px;background:var(--bg-deep);border:1px solid var(--line-strong);border-radius:4px;color:var(--ink);font-family:var(--font-mono);font-size:12px}.search-btn{padding:10px 18px;border:1px solid var(--cyan);border-radius:4px;background:var(--cyan);color:var(--bg-deep);font-weight:700;cursor:pointer}
    .blast-result{padding:16px;border:1px solid var(--line-strong);border-radius:4px;background:var(--bg-deep);margin-top:12px;display:none}
    .section-note{margin:-2px 0 14px;color:var(--muted);font:10px/1.5 var(--font-mono)}.record-list{display:grid;gap:8px}.record-item{display:grid;grid-template-columns:38px minmax(0,1fr) auto;gap:13px;align-items:center;padding:13px 15px;border:1px solid var(--line);border-left:3px solid var(--record-color,var(--cyan));border-radius:3px;background:rgba(255,255,255,.02)}.record-icon{display:grid;place-items:center;width:31px;height:31px;border-radius:8px;background:color-mix(in srgb,var(--record-color,var(--cyan)) 14%,transparent)}.record-body{min-width:0}.record-meta{color:var(--record-color,var(--cyan));font:700 10px var(--font-mono);letter-spacing:.06em;text-transform:uppercase}.record-title{margin-top:3px;color:var(--ink);font-weight:650}.record-desc{margin-top:3px;color:var(--soft);font-size:12px}.record-desc:empty{display:none}.record-title strong,.record-desc strong{color:var(--record-color,var(--cyan));font-weight:750}.record-title em,.record-desc em{color:var(--gold)}.record-title code,.record-desc code{padding:1px 4px;border:1px solid var(--line);border-radius:3px;color:var(--cyan);font:10px var(--font-mono)}.record-title a,.record-desc a{color:var(--cyan);text-decoration:underline}.record-actions{display:flex;align-items:center;justify-content:flex-end;gap:7px;flex-wrap:wrap}.record-action{border:1px solid var(--record-color,var(--cyan));border-radius:3px;padding:8px 11px;background:transparent;color:var(--record-color,var(--cyan));font:700 10px var(--font-mono);cursor:pointer}.record-action:hover,.record-action:focus-visible{background:var(--record-color,var(--cyan));color:var(--bg)}.record-badge{align-self:start;border:1px solid rgba(111,227,180,.36);border-radius:99px;padding:4px 8px;background:var(--mint-soft);color:var(--mint);font:700 9px var(--font-mono);letter-spacing:.04em;text-transform:uppercase}.record-item.tone-cyan{--record-color:var(--cyan)}.record-item.tone-mint{--record-color:var(--mint)}.record-item.tone-gold{--record-color:var(--gold)}.record-item.tone-red{--record-color:var(--red)}.record-item.tone-violet{--record-color:var(--violet)}.stepper{gap:0;justify-content:center}.step{padding-right:0;overflow:visible}.step-line{left:calc(50% + 10px);right:calc(-50% + 10px);width:auto}#sev-p0{color:var(--red)}#sev-p1{color:var(--gold)}#sev-p2{color:var(--violet)}#sev-p3{color:var(--cyan)}#stat-runs.tone{color:var(--mint)}#stat-findings.tone-ok{color:var(--mint)}#stat-findings.tone-alert{color:var(--red)}#stat-ideas.tone-ok{color:var(--mint)}#stat-ideas.tone-pending{color:var(--gold)}#stat-adapters.tone-ok{color:var(--mint)}#stat-adapters.tone-partial{color:var(--gold)}#stat-state.tone-idle{color:var(--cyan)}#stat-state.tone-active{color:var(--violet)}#stat-state.tone-blocked{color:var(--red)}
    footer{display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-top:26px;padding-top:17px;border-top:1px solid var(--line);color:var(--muted);font:10px var(--font-mono)}
    @media(max-width:920px){.grid .card,.grid .card.wide{grid-column:1/-1}.stats{grid-template-columns:repeat(2,1fr)}.adapters,.roster-grid,.mcp-grid{grid-template-columns:repeat(2,1fr)}.titleblock{align-items:flex-start;flex-direction:column}.meta dd{text-align:left}.stepper{gap:0}.cmd:after{position:fixed;left:12px;right:12px;bottom:16px;width:auto;max-width:none;transform:translateY(5px)}.cmd:hover:after,.cmd:focus-visible:after,.cmd:focus:after{transform:none}}
    @media(max-width:560px){.sheet{width:calc(100% - 24px);padding-top:22px}.panel,.card{padding:18px}.grid{gap:14px;margin-bottom:14px}.stats{margin-bottom:14px}.adapters,.roster-grid,.mcp-grid{grid-template-columns:1fr}.cmd:after{position:fixed;left:12px;right:12px;bottom:16px;width:auto;max-width:none;transform:translateY(5px)}.cmd:hover:after,.cmd:focus-visible:after,.cmd:focus:after{transform:none}.meta{grid-template-columns:1fr}.track-tabs{width:100%}.tab{flex:1}.fact{align-items:flex-start}.record-item{grid-template-columns:34px minmax(0,1fr)}.record-action{grid-column:2;justify-self:start}}
    @media(prefers-reduced-motion:reduce){*,*:before,*:after{animation-duration:.001ms!important;transition-duration:.001ms!important}}
  </style>
</head>
<body>
  <main class="sheet">
    <header class="titleblock">
      <div>
        <div class="eyebrow">Nexus-DevFlow · Enterprise Workspace Status</div>
        <h1 id="project-name">Nexus-DevFlow</h1>
        <div class="path" id="project-path">Connecting...</div>
        <div class="badges">
          <span class="badge" id="version-badge">v2.5.0</span>
          <span class="badge" id="health-badge">health</span>
          <span class="badge" id="gate-badge">Gate: checking</span>
          <span class="badge" id="drift-badge">Drift: checking</span>
          <span class="badge" id="track-badge">track</span>
        </div>
      </div>
      <dl class="meta">
        <dt>Package</dt><dd id="package-name">@jakkrichm/create-nexus-devflow</dd>
        <dt>Adapters</dt><dd id="adapter-count">-</dd>
        <dt>Branch</dt><dd id="header-branch">-</dd>
        <dt>Snapshot</dt><dd id="generated-at">-</dd>
      </dl>
    </header>
    <div class="live"><span class="live-dot" id="live-dot"></span><span id="live-label">Connecting to local dashboard...</span></div>

    <section class="panel" id="dual-track">
      <div class="panel-head">
        <span class="label">Unified Living Spec Model (DevFlow 2.5.0)</span>
        <div class="track-tabs" role="tablist" aria-label="Delivery tracks">
          <button class="tab on" id="tab-preflight" role="tab" aria-selected="true" aria-controls="view-preflight" data-track="preflight"><span>🔮 Pre-Flight Discovery</span><span class="tab-active-dot">● ACTIVE</span></button>
          <button class="tab" id="tab-fast" role="tab" aria-selected="false" aria-controls="view-fast" data-track="fast"><span>⚡ Living Spec · 4 steps</span><span class="tab-active-dot">● ACTIVE</span></button>
          <button class="tab" id="tab-swarm" role="tab" aria-selected="false" aria-controls="view-swarm" data-track="swarm"><span>🤖 Multi-Agent Swarm</span></button>
          <button class="tab" id="tab-graph" role="tab" aria-selected="false" aria-controls="view-graph" data-track="graph"><span>🗺️ Code Graph</span></button>
        </div>
      </div>
      <div class="track-view on" id="view-preflight" role="tabpanel" aria-labelledby="tab-preflight">
        <div class="stepper" id="pipeline-preflight"></div>
        <div class="track-note" id="note-preflight">Pre-Flight Discovery & Architectural Alignment (/idea, /grill, /brainstorm, /discovery).</div>
      </div>
      <div class="track-view" id="view-fast" role="tabpanel" aria-labelledby="tab-fast">
        <div class="stepper" id="pipeline-fast"></div>
        <div class="track-note" id="note-fast">Single Living Spec (/feature, /implement, /check, /complete) with TDD Discipline & QA Matrix.</div>
      </div>
      <div class="track-view" id="view-swarm" role="tabpanel" aria-labelledby="tab-swarm">
        <div class="section-note">Role-based specialized AI Subagents roster & execution matrix</div>
        <div class="roster-grid" id="swarm-roster"></div>
      </div>
      <div class="track-view" id="view-graph" role="tabpanel" aria-labelledby="tab-graph">
        <div class="section-note">Semantic dependency graph & instant Blast Radius analyzer</div>
        <div class="search-row">
          <input class="search-input" id="graph-file-input" placeholder="Type file path (e.g. packages/create-nexus-devflow/lib/code-graph.ts)..." />
          <button class="search-btn" id="graph-search-btn" type="button">Analyze Impact</button>
        </div>
        <div class="blast-result" id="blast-result"></div>
      </div>
    </section>

    <section class="panel next-action" id="next-panel">
      <div class="next-head"><span class="label">Next Action</span><button class="copy" id="next-copy" type="button">Copy command</button></div>
      <div class="command" id="next-command" aria-live="polite">Loading...</div>
      <div class="muted" id="next-reason"></div>
    </section>

    <section class="stats" aria-label="Workspace summary">
      <div class="stat"><div class="stat-value" id="stat-runs">-</div><div class="stat-label">Runs released</div></div>
      <div class="stat"><div class="stat-value" id="stat-findings">-</div><div class="stat-label">Active findings</div></div>
      <div class="stat"><div class="stat-value" id="stat-ideas">-</div><div class="stat-label">Pending ideas</div></div>
      <div class="stat"><div class="stat-value" id="stat-mcp">-</div><div class="stat-label">MCP Tools Ready</div></div>
      <div class="stat"><div class="stat-value" id="stat-state">-</div><div class="stat-label">Current state</div></div>
    </section>

    <section class="grid">
      <article class="card"><div class="card-head"><span class="label">Nexus-DevFlow</span><span class="pill" id="update-pill">checking</span></div><div class="facts"><div class="fact"><span>Installed / latest</span><span id="installed-latest">-</span></div><div class="fact"><span>Health</span><span id="system-health">-</span></div><div class="fact"><span>Architecture</span><span>3-Pillars + Swarm RAG</span></div></div></article>
      <article class="card wide"><div class="card-head"><span class="label">Current Work</span><span class="pill" id="work-pill">loading</span></div><div class="value" id="work-title">Loading...</div><div class="progress"><span id="work-progress"></span></div><div class="muted" id="work-meta"></div></article>
      <article class="card"><div class="card-head"><span class="label">Git & Drift</span><span class="pill" id="git-pill">loading</span></div><div class="facts"><div class="fact"><span>Branch</span><span id="git-branch">-</span></div><div class="fact"><span>Working tree</span><span id="git-changed">-</span></div><div class="fact"><span>Drift Status</span><span id="git-drift">-</span></div><div class="fact"><span>Last commit</span><span id="git-commit">-</span></div></div></article>
      <article class="card"><div class="card-head"><span class="label">Findings Ledger</span><span class="value" id="findings-count">-</span></div><div class="severity"><div class="sev"><b id="sev-p0">0</b><small>P0</small></div><div class="sev"><b id="sev-p1">0</b><small>P1</small></div><div class="sev"><b id="sev-p2">0</b><small>P2</small></div><div class="sev"><b id="sev-p3">0</b><small>P3</small></div></div><ul id="findings-list"></ul></article>
      <article class="card"><div class="card-head"><span class="label">Completion & Gate</span><span class="pill" id="completion-pill">-</span></div><ul id="completion-list"></ul></article>
      <article class="card"><div class="card-head"><span class="label">Warnings</span><span class="value" id="warnings-count">-</span></div><ul id="warnings-list"></ul></article>
    </section>

    <section class="card full panel"><div class="card-head"><span class="label">Model Context Protocol (MCP) Tools Hub</span><span class="value" id="mcp-count">12 Tools</span></div><div class="section-note">Typed JSON-RPC tools exposed to AI Coding Assistants</div><div class="mcp-grid" id="mcp-list"></div></section>
    <section class="card full panel"><div class="card-head"><span class="label">Quick Commands</span><span class="muted">hover or focus for help · click to copy</span></div><div class="commands" id="command-list"></div></section>
    <section class="grid"><article class="card full"><div class="card-head"><span class="label">Doctor · Health Check</span><span class="pill" id="doctor-pill">-</span></div><div class="record-list" id="doctor-list"></div></article></section>
    <section class="card full panel"><div class="card-head"><span class="label">Discoveries</span><span class="value" id="discovery-count">-</span></div><div class="record-list" id="discovery-list"></div></section>
    <section class="card full panel"><div class="card-head"><span class="label">Idea Inbox & Backlog</span><span class="value" id="ideas-count">-</span></div><div class="section-note">From devflow/ideas.md · start a selected item with /feature IDEA-xxx</div><div class="record-list" id="ideas-list"></div></section>
    <section class="card full panel"><div class="card-head"><span class="label">Completed Work Archive</span><span class="value" id="history-count">-</span></div><div class="section-note">Categorized delivery history · features, fixes and rollbacks</div><div class="record-list" id="history-list"></div></section>
    <footer><span>Nexus-DevFlow 2.5.0 Enterprise Dashboard · refreshes every 2 seconds</span><span id="footer-revision">snapshot pending</span></footer>
  </main>
  <script>
    const byId = (id) => document.getElementById(id);
    const text = (id, value) => { const node = byId(id); if (node) node.textContent = value == null ? '-' : String(value); };
    const pill = (id, state, label) => { const node = byId(id); if (!node) return; node.className = 'pill ' + (state || 'configured'); node.textContent = label || state || '-'; };
    const list = (id, values, empty) => { const node = byId(id); if (!node) return; node.replaceChildren(); const rows = values.length ? values : [empty]; rows.forEach((value) => { const li = document.createElement('li'); li.textContent = value; if (!values.length) li.className = 'empty'; node.append(li); }); };
    const titleCase = (value) => String(value || '').replaceAll('_',' ').replace(/\b\w/g, (c) => c.toUpperCase());
    const FLOW_ICON_NAMES = ['target','code','shield','package'];
    const EMOJI_ICONS = { compass:'🔎',discovery:'🔎',target:'🎯',document:'📄',list:'🧩',code:'⚙️',shield:'🧪',report:'📊',package:'📦',bulb:'💡',check:'✅',wrench:'🛠️',rollback:'↩️',search:'🔍',alert:'⚠️',grill:'🔥',brainstorm:'💭',idea:'💡' };
    function iconImage(name) { const icon = document.createElement('span'); icon.className = 'icon-glyph'; icon.setAttribute('aria-hidden','true'); icon.textContent = EMOJI_ICONS[name] || '📄'; return icon; }
    function decoratePipeline(id) { byId(id)?.querySelectorAll('.step').forEach((step,index) => { step.classList.add('flow-' + index); const icon = document.createElement('span'); icon.className = 'step-icon'; icon.setAttribute('aria-hidden','true'); const cmd = step.querySelector('.step-cmd')?.textContent?.replace('/','').split(' ')[0] || ''; const iconKey = id.includes('preflight') ? (cmd || ['idea','grill','brainstorm','discovery'][index] || 'search') : (FLOW_ICON_NAMES[index] || 'document'); icon.append(iconImage(iconKey)); const name = step.querySelector('.step-name'); step.insertBefore(icon,name || null); }); }
    function richText(root,value) { const source = String(value || ''); let cursor = 0; const plain = (end) => { if (end > cursor) root.append(document.createTextNode(source.slice(cursor,end))); cursor = end; }; while (cursor < source.length) { if (source.startsWith('**',cursor)) { const end = source.indexOf('**',cursor + 2); if (end > cursor + 2) { const node = document.createElement('strong'); node.textContent = source.slice(cursor + 2,end); root.append(node); cursor = end + 2; continue; } } if (source[cursor] === '*') { const end = source.indexOf('*',cursor + 1); if (end > cursor + 1) { const node = document.createElement('em'); node.textContent = source.slice(cursor + 1,end); root.append(node); cursor = end + 1; continue; } } if (source.charCodeAt(cursor) === 96) { const end = source.indexOf(String.fromCharCode(96),cursor + 1); if (end > cursor + 1) { const node = document.createElement('code'); node.textContent = source.slice(cursor + 1,end); root.append(node); cursor = end + 1; continue; } } const next = [source.indexOf('**',cursor + 1),source.indexOf('*',cursor + 1),source.indexOf(String.fromCharCode(96),cursor + 1)].filter((index) => index >= 0).sort((a,b) => a-b)[0] ?? source.length; plain(next > cursor ? next : cursor + 1); } }
    function recordCard(options) { const card = document.createElement('article'); card.className = 'record-item tone-' + (options.tone || 'cyan'); const icon = document.createElement('span'); icon.className = 'record-icon'; icon.append(iconImage(options.icon || 'document')); const body = document.createElement('div'); body.className = 'record-body'; const meta = document.createElement('div'); meta.className = 'record-meta'; richText(meta,options.meta); const title = document.createElement('div'); title.className = 'record-title'; richText(title,options.title); const desc = document.createElement('div'); desc.className = 'record-desc'; richText(desc,options.description); body.append(meta,title,desc); card.append(icon,body); if (options.badge) { const badge = document.createElement('span'); badge.className = 'record-badge'; badge.textContent = options.badge; card.append(badge); } return card; }
    function renderRecords(id,items,empty,mapper) { const root = byId(id); root.replaceChildren(); if (!items?.length) { const node = document.createElement('div'); node.className = 'empty'; node.textContent = empty; root.append(node); return; } items.forEach((item,index) => root.append(recordCard(mapper(item,index)))); }
    function renderIdeas(items) { renderRecords('ideas-list',items,'No pending ideas',(item) => ({ icon:'bulb',tone:'gold',meta:item.id,title:item.title,description:(item.description || '⚡') + ' · ' + (item.feasibility || 'Not scored') })); }
    function renderHistory(items) { const map = { feature:{icon:'package',tone:'cyan'},fix:{icon:'wrench',tone:'gold'},rollback:{icon:'rollback',tone:'red'} }; renderRecords('history-list',(items || []).slice(0,10),'No completed work in history archive',(item) => { const type = String(item.type || 'other').toLowerCase(); const style = map[type] || {icon:'report',tone:'violet'}; return { ...style,meta:type + ' ' + (item.buildPlanItem || ''),title:item.title,description:'',badge:'Released' }; }); }
    function renderDoctor(items) { renderRecords('doctor-list',items,'No doctor checks available',(item) => ({ icon:item.status === 'pass' ? 'check' : 'alert',tone:item.status === 'pass' ? 'mint' : item.status === 'warn' ? 'gold' : 'red',meta:item.status,title:item.name,description:item.message })); }
    function renderDiscoveries(items) { renderRecords('discovery-list',items,'No discoveries recorded',(item) => ({ icon:'search',tone:'mint',meta:item.id,title:item.title,description:'',badge:'Decision: ' + (item.decision || 'Pending') })); }

    function renderPipeline(id, nodes) {
      const root = byId(id); root.replaceChildren();
      (nodes || []).forEach((node, index) => {
        const step = document.createElement('div'); step.className = 'step ' + node.state;
        const line = document.createElement('span'); line.className = 'step-line';
        const dot = document.createElement('span'); dot.className = 'step-dot'; dot.textContent = node.state === 'done' ? '✓' : String(index + 1).padStart(nodes.length > 4 ? 2 : 1, '0');
        const name = document.createElement('div'); name.className = 'step-name'; name.textContent = node.label;
        const command = document.createElement('div'); command.className = 'step-cmd'; command.textContent = node.command;
        step.append(line, dot, name, command); root.append(step);
      });
    }

    let userHasSwitchedTab = false;
    function selectTrack(track) {
      document.querySelectorAll('.tab').forEach((node) => { const on = node.dataset.track === track; node.classList.toggle('on', on); node.setAttribute('aria-selected', String(on)); });
      document.querySelectorAll('.track-view').forEach((node) => node.classList.toggle('on', node.id === 'view-' + track));
    }

    function wireCopy(button, getValue) {
      button.addEventListener('click', async () => {
        const original = button.textContent;
        button.textContent = 'Copied!';
        try { await navigator.clipboard.writeText(getValue()); }
        catch { button.textContent = 'Copy unavailable'; }
        setTimeout(() => { button.textContent = original; }, 1100);
      });
    }

    document.querySelectorAll('.tab').forEach((node) => node.addEventListener('click', () => { userHasSwitchedTab = true; selectTrack(node.dataset.track); }));
    wireCopy(byId('next-copy'), () => byId('next-command').textContent.trim());

    function renderCommands(commands) {
      const root = byId('command-list'); root.replaceChildren();
      const allCommands = [...(commands || [])];
      ['nexus-devflow check-gate', 'nexus-devflow drift', 'nexus-devflow reconcile --fix', 'nexus-devflow slice --stage implement', 'nexus-devflow swarm', 'nexus-devflow studio'].forEach(c => {
        if (!allCommands.some(item => item.command === c)) {
          allCommands.push({ name: c.replace('nexus-devflow ', ''), command: c, family: 'companion', description: 'Run ' + c });
        }
      });
      allCommands.forEach((item) => {
        const button = document.createElement('button'); button.type = 'button'; button.className = 'cmd'; button.textContent = item.name; button.dataset.tip = item.description; wireCopy(button, () => item.command); root.append(button);
      });
    }

    function renderSwarm(swarm) {
      const root = byId('swarm-roster'); if (!root) return; root.replaceChildren();
      (swarm?.agentRoster || []).forEach(agent => {
        const card = document.createElement('div'); card.className = 'roster-card';
        card.innerHTML = '<strong>' + agent.avatar + ' ' + agent.name + '</strong><div class="roster-desc">' + agent.responsibility + '</div>';
        root.append(card);
      });
    }

    function renderMcp(tools) {
      const root = byId('mcp-list'); if (!root) return; root.replaceChildren();
      (tools || []).forEach(t => {
        const card = document.createElement('div'); card.className = 'mcp-card';
        card.innerHTML = '<strong>⚙️ ' + t.name + '</strong><div class="mcp-desc">' + t.description + '</div>';
        root.append(card);
      });
    }

    byId('graph-search-btn')?.addEventListener('click', async () => {
      const input = byId('graph-file-input'); const res = byId('blast-result');
      if (!input || !res) return;
      const file = input.value.trim();
      if (!file) return;
      res.style.display = 'block'; res.innerHTML = 'Analyzing Blast Radius...';
      try {
        const resp = await fetch('/api/graph?file=' + encodeURIComponent(file));
        const data = await resp.json();
        if (data.error) { res.innerHTML = '<span style="color:var(--red)">' + data.error + '</span>'; return; }
        let html = '<strong>Impact Score: <span style="color:var(--gold)">' + data.impactScore + '</span> | Total Affected: ' + data.totalAffected + ' files</strong><br/><br/>';
        if (data.directDependents?.length) {
          html += '<strong>Direct Dependents:</strong><ul>' + data.directDependents.map(d => '<li>' + d + '</li>').join('') + '</ul>';
        }
        if (data.transitiveDependents?.length) {
          html += '<br/><strong>Transitive Dependents:</strong><ul>' + data.transitiveDependents.map(t => '<li>' + t + '</li>').join('') + '</ul>';
        }
        res.innerHTML = html;
      } catch (e) {
        res.innerHTML = '<span style="color:var(--red)">Error: ' + e.message + '</span>';
      }
    });

    function renderSnapshot(data) {
      const status = data.status || {}; const project = status.project || {}; const devflow = status.devflow || {}; const work = status.currentWork || {}; const git = status.git || {}; const findings = status.findings || { active: [], blockers: [] }; const workflow = data.workflow || {}; const update = data.update || {}; const doctor = data.doctor || { checks: [] }; const discoveries = data.discoveries || { recent: [] }; const history = data.history || { items: [], total: 0 }; const ideas = status.ideas || { pending: [], totalPending: 0 }; const gate = data.gatekeeper || { passed: true }; const drift = data.drift || { hasDrift: false };

      text('project-name', project.name || 'Nexus-DevFlow'); text('project-path', project.root || ''); text('version-badge', 'v' + (devflow.version || '2.5.0'));
      pill('health-badge', status.health, status.health === 'ok' ? 'Health OK' : 'Health warning');
      pill('gate-badge', gate.passed ? 'ok' : 'blocked', gate.passed ? '✔ Gate Passed' : '✖ Gate Blocked');
      pill('drift-badge', !drift.hasDrift ? 'ok' : 'warning', !drift.hasDrift ? '✔ In Sync' : '⚠ Drift Detected');
      pill('track-badge', workflow.track, 'Track ' + titleCase(workflow.track || 'idle'));

      text('adapter-count', (devflow.adapters || []).length + ' configured'); text('header-branch', git.branch || 'unknown'); text('generated-at', new Date(data.generatedAt).toLocaleTimeString()); text('footer-revision', 'snapshot ' + data.generatedAt);
      renderPipeline('pipeline-preflight', workflow.deep || workflow.preflight); renderPipeline('pipeline-fast', workflow.fast); decoratePipeline('pipeline-preflight'); decoratePipeline('pipeline-fast');
      if (!userHasSwitchedTab) {
        if (work.state === 'active' || workflow.track === 'fast') {
          selectTrack('fast');
        } else {
          selectTrack('preflight');
        }
      }
      renderSwarm(data.swarm); renderMcp(data.mcpTools); text('stat-mcp', (data.mcpTools || []).length + ' Ready');

      const nextCommand = data.nextAction?.command || status.nextAction?.command || '/feature'; text('next-command', nextCommand); text('next-reason', data.nextAction?.reason || 'Ready for new work.');
      text('stat-runs', history.total || 0); text('stat-findings', (findings.active || []).length); text('stat-ideas', ideas.totalPending || 0); text('stat-state', titleCase(work.state || 'idle'));
      pill('update-pill', update.state, update.state === 'current' ? 'up to date' : update.state); text('installed-latest', (update.installedVersion || '2.5.0') + ' / ' + (update.latestVersion || '2.5.0')); text('system-health', status.health || 'ok');
      pill('work-pill', work.state, work.state || 'idle'); text('work-title', work.title || 'No active delivery run'); const pct = work.total > 0 ? Math.round((work.completed / work.total) * 100) : 0; byId('work-progress').style.width = pct + '%'; text('work-meta', work.state === 'active' ? work.completed + ' of ' + work.total + ' steps completed' : 'Ready');
      pill('git-pill', git.clean ? 'ok' : 'warning', git.clean ? 'clean' : (git.changedFiles || 0) + ' changed'); text('git-branch', git.branch || 'unknown'); text('git-changed', git.clean ? 'clean' : (git.changedFiles || 0) + ' changed files'); text('git-drift', drift.clean ? 'In Sync' : 'Drift detected'); text('git-commit', git.lastCommit || '-');
      text('findings-count', findings.total || 0); ['P0','P1','P2','P3'].forEach((severity) => text('sev-' + severity.toLowerCase(), (findings.active || []).filter((item) => item.severity === severity).length)); list('findings-list', (findings.active || []).map((item) => item.id + ' · ' + item.title), 'No active findings');
      pill('completion-pill', status.completion?.state, status.completion?.state || 'unknown'); list('completion-list', status.completion?.blockers || [], work.state === 'idle' ? 'No active run to complete' : 'All readiness checks passed'); text('warnings-count', (status.warnings || []).length); list('warnings-list', (status.warnings || []).map((item) => item.message), 'No active warnings or drift');
      pill('doctor-pill', doctor.failCount ? 'fail' : doctor.warnCount ? 'warning' : 'ok', doctor.passCount + '/' + doctor.totalChecks + ' pass'); renderDoctor(doctor.checks || []);
      text('discovery-count', discoveries.total || 0); renderDiscoveries(discoveries.recent || []); renderCommands(data.commands);
      text('ideas-count', (ideas.totalPending || 0) + ' pending'); renderIdeas(ideas.pending || []); text('history-count', (history.total || 0) + ' released'); renderHistory(history.items || []);
    }

    window.__INITIAL_SNAPSHOT__ = null;
    if (window.__INITIAL_SNAPSHOT__) {
      try {
        renderSnapshot(window.__INITIAL_SNAPSHOT__);
        byId('live-dot').classList.add('on');
        text('live-label','Connected · live snapshot every 2 seconds');
      } catch (e) {
        console.error('Initial hydration error:', e);
      }
    }

    let refreshing = false;
    async function refresh() { if (refreshing) return; refreshing = true; try { const response = await fetch('/api/dashboard'); if (!response.ok) throw new Error('HTTP ' + response.status); renderSnapshot(await response.json()); byId('live-dot').classList.add('on'); text('live-label','Connected · live snapshot every 2 seconds'); } catch (error) { byId('live-dot').classList.remove('on'); text('live-label','Disconnected · ' + error.message); } finally { refreshing = false; } }
    if (!window.__INITIAL_SNAPSHOT__) { refresh(); }
    setInterval(refresh, 2000);
  </script>
</body>
</html>`;

export { DASHBOARD_PAGE_HTML };
