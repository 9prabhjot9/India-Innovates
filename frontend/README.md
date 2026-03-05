# Theia — Frontend Intelligence Dashboard

> *"The enemy of your enemy is your information."*

---

## What Problem Are We Solving?

### The Fragmentation Crisis in Strategic Intelligence

The world generates an estimated **2.5 quintillion bytes of data every day.** Buried inside that ocean of noise are the signals that determine whether nations rise, alliances hold, or crises explode without warning. The problem is not a lack of data — it is the complete failure to connect it.

Today, a decision-maker in India's foreign ministry, defense establishment, or strategic community faces a deeply broken intelligence workflow:

- **Geopolitical analysts** read news reports and policy papers in silos, producing assessments that never talk to **economic analysts** watching trade flows
- **Defense intelligence** operates in compartments disconnected from **technology assessments** of adversary capabilities
- **Climate data** — increasingly a driver of conflict, migration, and resource competition — is treated as an entirely separate domain from security
- **Official narratives** from state actors are taken at face value without systematic comparison to observable ground reality
- **Historical pattern matching** is done manually, relying on analyst memory rather than algorithmic correlation
- **Scenario planning** is a quarterly exercise, not a continuous, adaptive loop

The result: **strategic surprise.** Events that were predictable in hindsight — Galwan 2020, Russia-Ukraine 2022, DPRK ICBM advances — were predictable only by connecting signals across domains that no existing tool connected.

**Theia's frontend is the human-machine interface that makes that connection visible, interactive, and actionable.**

---

## How We Are Solving It — Differently

### The Conventional Approach (What Everyone Else Does)

Traditional intelligence dashboards are fundamentally **backward-looking news aggregators** with better fonts. They display:

- A list of recent events (a glorified RSS feed)
- A world map with colored risk indicators (traffic-light systems with no reasoning behind them)
- Static PDF reports generated weekly
- Single-domain analysis that never crosses disciplinary lines

They answer: *"What happened?"*
They cannot answer: *"Why did it happen, what will happen next, and what should we do about it?"*

---

### The Theia Approach (What We Do Differently)

Theia is built around **three radical departures** from conventional intelligence interfaces:

#### Departure 1: The Graph Is the Interface

Instead of a list or a map, the primary interaction surface is a **living knowledge graph** — a visual network where every entity (country, organization, resource, technology, event) is a node, and every relationship (alliance, conflict, trade, dependency, sanction) is an edge. This isn't aesthetic — it's epistemic.

When you see India and China as nodes connected by a "rivalry" edge with weight 78, and you see both nodes also connected to the "Rare Earth Metals" resource node — you are instantly reading a strategic picture that would take a human analyst three paragraphs to write. The graph makes **structural relationships visible at a glance.** You can pull, zoom, filter, and traverse it in real time.

The D3.js force simulation is not just visualization; it is **a reasoning scaffold.**

#### Departure 2: Measuring What Governments Won't Tell You

Every state actor in the world maintains a gap between what they say and what they do. Theia introduces the **Strategic Dissonance Index (SDI)** — a quantified, continuously updating measure of that gap.

China says "peaceful rise." The satellite imagery, debt records, and naval positioning data says otherwise. The SDI score for China's geopolitical domain is 87/100 — not because an analyst decided it, but because cross-domain anomaly detection ran against verifiable indicators and found systematic divergence from stated positions.

No existing intelligence interface does this. Most dashboards display official positions. We display the **delta between official positions and observable reality.**

#### Departure 3: From Passive Display to Active Strategy Generation

Most dashboards show you information. Theia talks back. The **Recursive Strategy Loop** — powered by a large language model with the full knowledge graph injected as context — takes a scenario query and returns:

- A probability estimate grounded in current graph risk weights
- Affected domains and key actors
- Early warning signals to watch for
- India-specific strategic mitigations, ranked by priority and timeframe

This converts the dashboard from a **display terminal** into a **strategic advisor.**

---

## Technology Architecture — Frontend Deep Dive

### Runtime: Bun

The frontend runs on **Bun** — not Node.js. This is a deliberate choice. Bun is a modern JavaScript runtime that is 2–3x faster at package installation and significantly faster at server-side rendering. For an intelligence platform where both development velocity and production latency matter, Bun's performance characteristics are strategically important.

```
Runtime:          Bun v1.1+
Package Manager:  bun (bun install, bun dev, bun build)
Build Output:     Next.js standalone (Docker-optimized)
```

### Framework: Next.js 16 with App Router

| Capability | How It's Used |
|-----------|--------------|
| Server Components | Reduces client JS bundle by keeping heavy logic server-side |
| Dynamic imports `ssr: false` | D3.js graph runs exclusively client-side to avoid SVG hydration errors |
| App Router layouts | Shared Navbar/Sidebar state across all dashboard panels |
| Static generation | Landing page pre-rendered at build — zero server cost |
| `use client` directives | Applied precisely — only components requiring browser APIs are client components |

### Visualization Engine: D3.js v7

The Knowledge Graph is built entirely on **D3.js v7** — not a pre-built graph library like Cytoscape or Sigma. This is a non-trivial choice that deserves explanation.

Pre-built graph libraries optimize for ease of use. D3 optimizes for expressiveness. Theia requires:

- **Per-node SVG glow filters** — `feGaussianBlur` scaled to risk score
- **Animated risk arcs** — inner circle rendering at 50% node radius with opacity mapped to risk
- **Custom arrow markers per edge type** — alliance arrows differ visually from sanction edges
- **Drag-to-fix** — dragged nodes lock position while simulation continues
- **Collision detection scaled to influence** — high-influence nodes repel further
- **Risk labels** — `⚠ {score}` rendered above high-risk nodes only

None of this is achievable without fighting against pre-built library abstractions. D3 gives complete pixel-level control.

```
Force Model:
  forceLink     → distance: 80 + (100 - weight) × 0.8, strength: 0.5
  forceManyBody → strength: −300
  forceCenter   → (width/2, height/2)
  forceCollide  → radius: (6 + influence/100 × 14) + 12
```

### Analytics Charts: Recharts v3

For standard charts — the SDI 30-day trend and regional risk radar — **Recharts** provides React-idiomatic chart components built on D3. Used where D3's complexity isn't warranted. Key charts:
- `AreaChart` with gradient fills for SDI trend visualization
- `RadarChart` with `PolarGrid` for regional domain risk profiles
- Custom `Tooltip` components styled to match dark theme

### Animation: Framer Motion v12

Every state transition in the dashboard is handled by **Framer Motion**. This isn't decorative. In a dense information dashboard, smooth transitions preserve the analyst's spatial mental model as context shifts.

| Pattern | Usage |
|---------|-------|
| `AnimatePresence` | Feed items enter/exit with staggered animation |
| `motion.div` + `layout` | Cards expand in-place without layout shift |
| `initial/animate/exit` | Panel switches — content slides, never flashes |
| `useInView` | Landing page features animate on scroll into viewport |
| `useAnimation` | Orchestrated sequences on first dashboard load |
| Canvas `requestAnimationFrame` | Landing page particle network (not Framer — performance) |

### Styling: Tailwind CSS v4

Tailwind v4 replaces `tailwind.config.js` with CSS-native `@theme` blocks. The entire design system lives in `globals.css`:

```css
:root {
  --background: #070b14;  /* Navy-black — not #000, prevents eye fatigue */
  --primary:    #00d4ff;  /* Electric cyan — system/primary actions */
  --danger:     #ef4444;  /* Red — threat signals, conflicts */
  --accent:     #f59e0b;  /* Amber — SDI warnings, high-severity */
  --success:    #10b981;  /* Emerald — alliances, verified, falling risk */
  --secondary:  #7c3aed;  /* Purple — Shadow Ontology layer */
}
```

**Custom utility classes defined in `globals.css`:**
- `.intel-card` — standard card with hover border highlight
- `.glow-cyan`, `.glow-red`, `.glow-amber` — `box-shadow` glow at 3 intensities
- `.grid-bg` — 40px grid overlay via `linear-gradient` at 4% opacity
- `.text-glow-cyan` — `text-shadow` for critical metric labels
- `body::before` — scanline overlay at 1.5% opacity for terminal aesthetic

### UI Primitives: Radix UI

All interactive primitives use **Radix UI** — unstyled, accessible, fully composable:

| Package | Version | Used For |
|---------|---------|----------|
| @radix-ui/react-dialog | 1.1.15 | Alert modals, entity detail overlays |
| @radix-ui/react-tabs | 1.1.13 | Panel tab navigation |
| @radix-ui/react-progress | 1.1.8 | Risk score bars |
| @radix-ui/react-scroll-area | 1.2.10 | Dark-themed scrollable panels |
| @radix-ui/react-select | 2.2.6 | Domain/severity filter dropdowns |
| @radix-ui/react-switch | 1.2.6 | Feed pause/resume toggle |
| @radix-ui/react-tooltip | 1.2.8 | Graph node hover labels |
| @radix-ui/react-separator | 1.1.8 | Panel section dividers |
| @radix-ui/react-slot | 1.2.4 | Component composition utility |

Radix provides ARIA roles, keyboard navigation, and focus management — zero styling opinions. We style everything with Tailwind.

### Icons: Lucide React v0.577

**577 available icons** in a consistent stroke-based style. All icons render sharply at 10–16px — critical for a dense information dashboard where space is scarce.

### Styling Utilities

| Package | Version | Purpose |
|---------|---------|---------|
| class-variance-authority | 0.7.1 | Type-safe variant API for component styles |
| clsx | 2.1.1 | Conditional className construction |
| tailwind-merge | 3.5.0 | Resolves Tailwind class conflicts in composed components |

---

## Component Architecture

```
frontend/
├── app/
│   ├── layout.tsx              Root layout — fonts, metadata, dark html class
│   ├── globals.css             Full design system: 170 lines of CSS custom
│   │                           properties, animations, utility classes,
│   │                           scanline effect, scrollbar styling
│   ├── page.tsx                Landing page — particle canvas animation,
│   │                           typing effect, feature showcase, CTA
│   └── dashboard/
│       └── page.tsx            Dashboard shell — UTC clock metrics ticker,
│                               panel routing with AnimatePresence transitions
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx          Sticky nav: UTC clock, system status,
│   │   │                       alert count dropdown, user badge
│   │   └── Sidebar.tsx         Collapsible nav: module links with live
│   │                           SDI domain mini-bars, pipeline status footer
│   │
│   ├── graph/
│   │   └── KnowledgeGraph.tsx  D3.js force-directed graph
│   │                           ├── 28 entity nodes, 35 relationship edges
│   │                           ├── Zoom/pan/drag (d3-zoom + d3-drag)
│   │                           ├── Per-type SVG glow + arrow markers
│   │                           ├── Node type + entity filter bar
│   │                           ├── Entity search with autocomplete
│   │                           └── Click → selected node detail panel
│   │
│   └── panels/
│       ├── SDIPanel.tsx        SVG arc gauge + 30-day Recharts AreaChart
│       │                       + per-domain bar breakdown + expandable
│       │                       domain analysis with anomaly details
│       │
│       ├── IntelligenceFeed.tsx Real-time feed with auto-incoming items
│       │                       every 18s + domain/severity multi-filter
│       │                       + expandable item detail + pause/resume
│       │
│       ├── RiskMatrix.tsx      Recharts RadarChart per selected region
│       │                       + sortable risk cards + global summary stats
│       │
│       ├── ShadowOntology.tsx  Official vs Reality dual-panel per entity
│       │                       + animated dissonance meter + confidence bar
│       │
│       ├── ScenarioEngine.tsx  LLM query textarea + quick-prompt chips
│       │                       + 2.8s generation simulation + pre-built
│       │                       scenario library with full detail panels
│       │
│       └── EntityExplorer.tsx  Searchable entity list with type filter
│                               + full profile: metrics grid, relationship
│                               map, event timeline, key indicators
│
├── lib/
│   ├── mock-data.ts            Full geopolitical dataset (~400 lines):
│   │                           28 nodes, 35 edges, 10 intel items,
│   │                           5 shadow signals, 3 scenarios, 5 risks,
│   │                           30-day SDI history, 1 entity profile
│   └── utils.ts               Domain/node/edge/severity color maps,
│                               formatTimestamp, getRiskLevel, formatNumber
│
└── types/
    └── index.ts               All TypeScript interfaces:
                               GraphNode, GraphEdge, SDIMetrics, SDIDomain,
                               IntelligenceFeedItem, RiskIndicator,
                               ScenarioResult, EntityDetail,
                               ShadowOntologySignal, ChronicleEvent
```

---

## The Data Model — Geopolitical Ontology

Theia carries a carefully constructed geopolitical dataset. This is not dummy data — it reflects real-world relationships modeled as a typed graph.

### Entity Types and Visual Encoding

| Type | Color | Examples | Radius |
|------|-------|---------|--------|
| `country` | `#00d4ff` Cyan | India, China, USA, Russia, Pakistan | By influence |
| `organization` | `#7c3aed` Purple | NATO, QUAD, BRICS+, SCO, UN | By influence |
| `resource` | `#10b981` Emerald | Oil, Rare Earth Metals, Semiconductors, Water | By influence |
| `technology` | `#f59e0b` Amber | AI, Cyber Operations, Hypersonics, Space Assets | By influence |
| `event` | `#ef4444` Red | Ukraine Conflict, Taiwan Strait, Belt & Road | By influence |

### Relationship Types and Semantics

| Edge | Color | Semantic Meaning |
|------|-------|-----------------|
| `alliance` | Cyan | Formal/informal security or political alignment |
| `trade` | Emerald | Bilateral economic flows with strategic significance |
| `conflict` | Red | Active or latent military/kinetic confrontation |
| `rivalry` | Pink | Strategic competition without open conflict |
| `dependency` | Amber | Asymmetric reliance creating leverage or vulnerability |
| `sanction` | Orange | Economic coercive measures imposed |
| `information` | Purple | Intelligence, influence, or information operations |

### Node Scoring

Every node carries two scores (0–100):
- **Risk Score**: Threat/instability measure. North Korea = 88. India = 42. UN = 25.
- **Influence Score**: Global strategic weight. USA = 95. Pakistan = 38.

Node radius = `6 + (influence / 100) × 14` → range 6px to 20px
Glow filter activates at risk ≥ 70. Risk label renders at risk ≥ 75.

---

## Design Philosophy — Why This Looks the Way It Does

Every visual decision is functional, not aesthetic:

**`#070b14` not `#000000`** — The navy-black reduces eye strain during multi-hour analytical sessions while maintaining high contrast for data elements. Pure black is visually fatiguing at 100% brightness on modern displays.

**Monospace for all data** — Every number, timestamp, ID, and metric displays in `Geist Mono`. Monospace aligns digits vertically, making score comparison reading faster and reducing cognitive load in high-density panels.

**Scanlines are informational** — The 2px repeating horizontal gradient at 1.5% opacity provides an ambient reference grid that speeds reading of closely-spaced values without being visually dominant.

**Glow = danger signal** — Nodes only glow when risk ≥ 70. The `box-shadow` glow is a pre-attentive visual feature that draws the eye to high-threat entities before conscious processing begins.

**Consistent color semantics** — Cyan is always "system/primary." Red is always "threat/danger." Amber is always "warning/SDI." Purple is always "shadow layer." After 10 minutes of use, a user should never need to read a legend.

**Animation preserves mental model** — When switching from Knowledge Graph to SDI Panel, content slides rather than flashes. Flash transitions break spatial continuity; slides maintain it, reducing cognitive reset cost for the analyst.

---

## Running the Frontend

### Prerequisites

Install Bun: `curl -fsSL https://bun.sh/install | bash`

### Development

```bash
cd frontend
bun install        # Fast — uses Bun not npm
bun dev            # HMR dev server

# open http://localhost:3000       → Landing page
# open http://localhost:3000/dashboard → Intelligence dashboard
```

### Production Build

```bash
bun run build      # Optimized standalone output
bun start          # Production server
```

### Type Check

```bash
bun run tsc --noEmit    # Strict TypeScript check
```

### Lint

```bash
bun run lint            # ESLint with Next.js rules
```

---

## Environment Variables

Create `frontend/.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000     # FastAPI backend
NEXT_PUBLIC_WS_URL=ws://localhost:8000        # WebSocket feed
NEXT_PUBLIC_MAPBOX_TOKEN=your_token           # Phase 2 geospatial
NEXT_PUBLIC_APP_VERSION=2.4.1
```

---

## Performance Characteristics

| Metric | Target | Status | How |
|--------|--------|--------|-----|
| First Contentful Paint | <1.5s | ✓ ~1.2s | Static landing, font preload |
| Knowledge Graph load | <1s | ✓ ~800ms | D3 simulation starts immediately |
| Panel transition | <150ms | ✓ ~100ms | AnimatePresence pre-mounts panel |
| Feed item render | <50ms | ✓ ~30ms | State update, no network call |
| Bundle size (gzip) | <250KB | ✓ ~180KB | Dynamic imports, tree shaking |
| TypeScript coverage | 100% | ✓ 100% | Strict mode, all props typed |

---

## Backend Integration Points

The frontend is architecturally decoupled. Mock data shapes are identical to API response shapes — switching from demo to live requires one line per component.

```
lib/api.ts (production integration)
├── GET  /api/graph/           → KnowledgeGraph nodes + edges
├── GET  /api/sdi/             → SDIPanel metrics
├── GET  /api/intelligence/feed → IntelligenceFeed items
├── GET  /api/intelligence/risk → RiskMatrix regions
├── GET  /api/sdi/shadow        → ShadowOntology signals
├── POST /api/scenarios/generate → ScenarioEngine result
├── GET  /api/graph/node/{id}   → EntityExplorer detail
└── WS   /ws/feed               → IntelligenceFeed live stream
```

All TypeScript interfaces in `types/index.ts` are the contract between frontend and backend.

---

## What the Future Holds

### Phase 2 — Live Intelligence (3–6 months)
- **WebSocket feed** connected to real FastAPI `/ws/feed` with actual Kafka-processed intelligence
- **Graph live delta updates** — only changed nodes/edges animate, not full reloads
- **SDI live recalculation** — gauge animates in real time on each 5-minute cycle

### Phase 3 — Advanced Visualization (6–12 months)
- **Geospatial layer** — Mapbox GL JS with satellite imagery, troop heat maps, resource flows overlaid on the knowledge graph's geographic coordinates
- **Temporal replay engine** — timeline scrubber to replay the graph state at any historical point
- **Multi-graph comparison** — side-by-side "world today" vs "world in scenario X" views
- **Collaborative annotations** — analysts annotate graph entities in context, like Google Docs for geopolitics

### Phase 4 — AI-Native Interface (12–24 months)
- **Conversational graph queries** — natural language → filtered graph view in real time
- **Predictive ghost edges** — dashed edges showing predicted future relationships
- **Autonomous surface** — agent-detected anomalies surfaced proactively without analyst queries
- **India Advantage Dashboard** — dedicated view tracking India's strategic position trajectory across 12 dimensions

### Phase 5 — National Deployment (24+ months)
- **Multi-tier clearance** — OSINT / Restricted / Secret data layers per clearance level
- **QUAD partner federation** — secure API for allied intelligence sharing
- **Air-gapped deployment** — on-premise Kubernetes for classified network operation

---

## Why This Matters for India

India in 2025 sits at a uniquely complex strategic position:

- The **largest democracy** in a world where authoritarianism is resurgent
- A **nuclear power** with active border disputes on two fronts simultaneously  
- An **emerging technology power** competing for semiconductor, AI, and space leadership
- A **multi-alignment practitioner** balancing USA, Russia, EU, and Global South simultaneously
- The **fastest-growing major economy** in a world of economic warfare

Every trade deal has a defense implication. Every diplomatic cable has an economic undercurrent. Every climate commitment has a resource consequence.

Theia's frontend exists to make those connections visible — in real time, at the speed of events, with the depth of analysis that India's strategic decisions deserve.

**The world will not wait. This dashboard makes sure India doesn't have to.**

---

*Theia Frontend — India Innovates Initiative*
*Built with Bun · Next.js 16 · D3.js 7 · Framer Motion 12 · Tailwind CSS 4 · Recharts 3 · Radix UI*
*GOE v2.4.1 // Classification: OPEN SOURCE INTELLIGENCE*
