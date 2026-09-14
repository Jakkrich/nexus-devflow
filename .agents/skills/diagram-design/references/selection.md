# Diagram selection

Paths in commands and inline code remain relative to the skill directory unless stated otherwise.

## 2. When to Use

Use for any of the 39 visual types ([section 3](selection.md)) when a reader will learn more from a visual than from prose, a table, or a bulleted list.

**Don't use for:**

- Quick unicode diagrams → use **wiretext**.
- Lists of things → table or bullets.
- Simple before/after → table.
- One-shape "diagrams" → just write the sentence.

Before drawing, ask: *Would the reader learn more from this than from a well-written paragraph?* If no, don't draw.

---


## 3. Selection: semantic pattern, then visual type

When behavior, state, enforcement, or risk carries the meaning, first load [`references/semantic-patterns.md`](semantic-patterns.md) and choose one primary pattern. Then choose the nearest visual type for layout. If no pattern matches, choose the type directly.

| Behavioral trigger | Semantic pattern → nearest type |
|---|---|
| Fan-in, queue depth, finite capacity, bottleneck | **Fan-in queue / bottleneck** → Data flow |
| Repeated Question / Input / Governance / Output slots across stages | **Stage framework with semantic slots** → Process |
| Conversation or loose input becomes a structured durable artifact | **Unstructured input → structured artifact** → Data flow |
| Two rule traces need pass/fail/skipped/not-reached and first divergence | **Paired policy-evaluation traces** → Flowchart |
| Trust boundaries plus permitted/forbidden ingress or deploy paths | **Secure paved road** → Architecture |
| Controls grouped by where they are enforced | **Governance / control catalog** → Layer stack |
| Defenses compensate for prior gaps and residual risk propagates | **Compensating security layers** → Layer stack |
| Hierarchical, ID-addressable decomposition needing per-block I/O, constraints, and a code link | **Traceable block decomposition** → Tree |

The pattern owns semantic primitives and its tighter budget; the type owns layout grammar. Use [`references/animation.md`](animation.md) only when motion is requested or materially clarifies ordered change; static remains the default.

### Visual-type guide (39)

| If you're showing… | Use | Reference |
|---|---|---|
| Components + connections in a system | **Architecture** | [type-architecture.md](type-architecture.md) |
| Legacy IT landscape grouped by phase/department; documents the *before* state in modernization proposals | **IT current-state** | [type-it-state.md](type-it-state.md) |
| Decision logic with branches | **Flowchart** | [type-flowchart.md](type-flowchart.md) |
| Time-ordered messages between actors | **Sequence** | [type-sequence.md](type-sequence.md) |
| States + transitions + guards | **State machine** | [type-state.md](type-state.md) |
| Entities + fields + relationships | **ER / data model** | [type-er.md](type-er.md) |
| Events positioned in time | **Timeline** | [type-timeline.md](type-timeline.md) |
| Cross-functional process with handoffs | **Swimlane** | [type-swimlane.md](type-swimlane.md) |
| Two-axis positioning / prioritization | **Quadrant** | [type-quadrant.md](type-quadrant.md) |
| Multiple entities scored across 3–5 quantitative criteria | **Radar / Spider** | [type-radar.md](type-radar.md) |
| One quantitative series across cyclic categories; angle=category, radius=magnitude | **Polar chart** | [type-polar.md](type-polar.md) |
| Reinforcing cycle / flywheel where the last step feeds the first and a shared hub accumulates state | **Loop** | [type-loop.md](type-loop.md) |
| Hierarchy through containment / scope | **Nested** | [type-nested.md](type-nested.md) |
| Parent → children relationships | **Tree** | [type-tree.md](type-tree.md) |
| Human/agent/team ownership, reporting, routing, escalation | **Org chart** | [type-org-chart.md](type-org-chart.md) |
| Stacked abstraction levels | **Layer stack** | [type-layers.md](type-layers.md) |
| Overlap between sets | **Venn** | [type-venn.md](type-venn.md) |
| Ranked hierarchy or conversion drop-off | **Pyramid / funnel** | [type-pyramid.md](type-pyramid.md) |
| Quantitative comparison across categories | **Bar chart** | [type-bar.md](type-bar.md) |
| Part-of-whole where the relative sizes are the story | **Treemap** | [type-treemap.md](type-treemap.md) |
| Continuous trends over time, change between exactly two states (slopegraph), one distribution per series (ridgeline), or rank movement across several snapshots (bump) | **Line chart** | [type-line.md](type-line.md) |
| Tasks and phases on a timeline | **Gantt** | [type-gantt.md](type-gantt.md) |
| Distribution and correlation between two variables, three with area-sized marks (bubble), or one variable with a dot per item (beeswarm) | **Scatter plot** | [type-scatter.md](type-scatter.md) |
| End-to-end data stack on a container cluster | **High-Level** | [type-high-level.md](type-high-level.md) |
| Multi-actor sequential process with data handoffs | **Process** | [type-process.md](type-process.md) |
| Multi-tier data storage with quality levels and access policies | **Medallion** | [type-medallion.md](type-medallion.md) |
| Role-scoped data flow: who does what at each pipeline step | **Data flow** | [type-data-flow.md](type-data-flow.md) |
| Integration topology of a data platform — sources → core → consumers | **DP integration** | [type-dp-integration.md](type-dp-integration.md) |
| Per-role / per-component access permissions matrix | **DP security matrix** | [type-dp-security-matrix.md](type-dp-security-matrix.md) |
| A quantity splitting and merging across stages, band width = amount | **Sankey** | [type-sankey.md](type-sankey.md) |
| Causes of one observed effect, grouped by category (root-cause analysis) | **Fishbone** | [type-fishbone.md](type-fishbone.md) |
| Value chain against evolution — what to build, buy, and what is moving | **Wardley map** | [type-wardley.md](type-wardley.md) |
| Work-in-progress by state, with WIP limits and blocked items | **Kanban** | [type-kanban.md](type-kanban.md) |
| What a person does across stages of an experience, and how it feels | **User journey** | [type-journey.md](type-journey.md) |
| Where software runs — zones, hosts, artifacts, replicas, ports | **Deployment** | [type-deployment.md](type-deployment.md) |
| What depends on what, with fan-in and cycles a tree cannot express | **Dependency graph** | [type-dependency.md](type-dependency.md) |
| Classes with operations, inheritance, composition (other UML routes elsewhere) | **UML class** | [type-uml-class.md](type-uml-class.md) |
| Narrative backbone sliced into releases, with the cut line | **Story map** | [type-story-map.md](type-story-map.md) |
| Physical tables: SQL types, constraints, indexes, column-level FKs | **Database schema** | [type-db-schema.md](type-db-schema.md) |

Rules of thumb:

- If a 3-column table communicates the same thing, pick the table.
- If two types seem useful, pick the dominant axis; a semantic pattern may add behavior-specific primitives, not a second layout grammar.
- If you're past the complexity budget ([section 7](layout.md)), split into an overview + detail.

**Always load the chosen type reference linked in the guide before drawing.** When routed above, also load `semantic-patterns.md`; when animation is chosen, load `animation.md`.

### Confirm before drawing

Before rendering, state the plan in one short message: the chosen visual type (and semantic pattern, if routed), the size preset, and anything the complexity budget ([section 7](layout.md)) will force out. Use the requested type, size, and content when provided; otherwise proceed with suitable defaults and state them. Ask only if an unresolved choice materially changes the intended meaning or required output.

---

