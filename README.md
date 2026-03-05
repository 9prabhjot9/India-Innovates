# Theia — Global Ontology Engine

> *"The world does not wait for those who are unprepared."*

**Theia** is an AI-powered strategic intelligence platform that transforms fragmented geopolitical, economic, defense, and societal data into a unified, continuously updating intelligence system — delivering measurable risk indicators and actionable strategic foresight for India and the world.

> **Name Origin:** Theia (Θεία) was the Greek Titaness of sight and the shining light of the clear blue sky — the goddess who illuminated what was hidden. In planetary science, Theia is the primordial body whose collision with Earth gave rise to the Moon; a world-shaping force. Both meanings reflect this platform's purpose: to illuminate hidden geopolitical realities and reshape how nations understand the world.

---

## Architecture Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                         THEIA GOE                                │
│                  Global Ontology Engine v2.4.1                   │
└──────────────────────────────────────────────────────────────────┘
         │                     │                      │
    ┌────▼────┐           ┌────▼────┐           ┌────▼────┐
    │ INGEST  │           │ PROCESS │           │ REASON  │
    │ Apache  │──────────▶│ NLP +   │──────────▶│  LLM    │
    │  Kafka  │           │ spaCy + │           │ Scenario│
    │ 2400+   │           │ BERT    │           │ Engine  │
    │ sources │           │         │           │         │
    └─────────┘           └────┬────┘           └────┬────┘
                               │                     │
                    ┌──────────▼─────────────────────▼──────────┐
                    │           KNOWLEDGE GRAPH                   │
                    │        Neo4j + PostgreSQL                    │
                    │   27,841 Nodes · 184,293 Edges              │
                    └─────────────────────────────────────────────┘
                               │
              ┌────────────────┴─────────────────────┐
              │          INTELLIGENCE LAYERS           │
              │  • Strategic Dissonance Index (SDI)   │
              │  • Shadow Ontology Layer              │
              │  • Recursive Strategy Loop            │
              │  • Real-time Intelligence Feed        │
              └────────────────────────────────────────┘
                               │
              ┌────────────────▼─────────────────────┐
              │           DASHBOARD                    │
              │   Next.js · D3.js · Framer Motion     │
              └────────────────────────────────────────┘
```

---

## Core Intelligence Modules

### 1. Global Ontology Engine (GOE)
The central knowledge graph connecting **28,000+ entities** across domains:
- **Nodes**: Countries, Organizations, Resources, Technologies, Events, Actors
- **Edges**: Trade, Alliance, Conflict, Dependency, Sanction, Information, Rivalry
- **Storage**: Neo4j with APOC + Graph Data Science plugins
- **Update frequency**: Near real-time via Kafka pipeline

### 2. Strategic Dissonance Index (SDI)
Quantifies the gap between official narratives and ground-truth signals:
- **Algorithm**: Isolation Forest anomaly detection + BERT-based claim verification
- **Domains**: Geopolitics, Economics, Defense, Technology, Climate, Society
- **Score range**: 0 (full coherence) → 100 (maximum dissonance)
- **Current overall SDI**: 67/100 (HIGH)

### 3. Shadow Ontology Layer
Dual-graph architecture separating narrative from reality:
- **Narrative Graph**: Official statements, press releases, diplomatic language
- **Ground Graph**: Satellite data, OSINT, economic indicators, behavioral patterns
- **Output**: Dissonance signals with confidence scores and evidence trails

### 4. Recursive Strategy Loop
LLM-powered scenario generation with continuous graph weight updates:
- **Models**: GPT-4o / Claude 3.5 Sonnet (configurable)
- **Process**: Query → Graph context injection → Scenario generation → Risk weight update
- **Output**: Probability-weighted scenarios with India-focused mitigations

### 5. Real-time Intelligence Feed
Multi-source streaming ingestion pipeline:
- **Sources**: News APIs, GDELT, diplomatic cables (OSINT), satellite imagery signals
- **Processing**: Kafka → spaCy NER → Classification → Graph update
- **Latency**: <30 seconds from source to graph

---

## Complete Technology Stack

### Frontend — Intelligence Dashboard

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Runtime** | [Bun](https://bun.sh) | 1.1+ | JavaScript/TypeScript runtime — 2-3x faster than Node.js for installs and SSR |
| **Framework** | [Next.js](https://nextjs.org) | 16.1.6 | React meta-framework — App Router, Server Components, hybrid SSG/CSR rendering |
| **Language** | [TypeScript](https://typescriptlang.org) | 5.9 | Static type system — 100% coverage across all components, props, and data models |
| **UI Library** | [React](https://react.dev) | 19.2.3 | Component library — concurrent features, server components, suspense boundaries |
| **React DOM** | react-dom | 19.2.3 | DOM renderer for React 19 |
| **Styling** | [Tailwind CSS](https://tailwindcss.com) | 4.2 | Utility-first CSS — v4 with CSS-native `@theme` blocks, no config file required |
| **PostCSS** | @tailwindcss/postcss | 4.x | Tailwind PostCSS build plugin |
| **Graph Visualization** | [D3.js](https://d3js.org) | 7.9.0 | Force-directed knowledge graph — full SVG control, custom forces and glow effects |
| **D3 Types** | @types/d3 | 7.4.3 | TypeScript type definitions for D3.js |
| **Charts** | [Recharts](https://recharts.org) | 3.7.0 | SDI trend AreaChart, regional risk RadarChart |
| **Animation** | [Framer Motion](https://www.framer.com/motion/) | 12.35.0 | Panel transitions, layout animations, spring physics, AnimatePresence |
| **Icons** | [Lucide React](https://lucide.dev) | 0.577.0 | 577+ consistent stroke-based SVG icons at 10–16px dashboard density |
| **Dialog** | @radix-ui/react-dialog | 1.1.15 | ARIA-compliant accessible modal primitive |
| **Tabs** | @radix-ui/react-tabs | 1.1.13 | Accessible tab interface primitive |
| **Progress** | @radix-ui/react-progress | 1.1.8 | Accessible progress bar primitive |
| **Scroll Area** | @radix-ui/react-scroll-area | 1.2.10 | Styled custom scrollbar for dark theme |
| **Select** | @radix-ui/react-select | 2.2.6 | Accessible dropdown select primitive |
| **Switch** | @radix-ui/react-switch | 1.2.6 | Accessible toggle switch primitive |
| **Tooltip** | @radix-ui/react-tooltip | 1.2.8 | Accessible positioned tooltip primitive |
| **Separator** | @radix-ui/react-separator | 1.1.8 | Accessible visual divider primitive |
| **Slot** | @radix-ui/react-slot | 1.2.4 | Component composition utility for Radix |
| **Class Variants** | class-variance-authority | 0.7.1 | Type-safe variant management for component styling |
| **Class Merging** | clsx | 2.1.1 | Conditional className string construction |
| **Tailwind Merge** | tailwind-merge | 3.5.0 | Intelligent Tailwind class conflict resolution |
| **Linting** | ESLint | 9.x | Code quality enforcement |
| **ESLint Config** | eslint-config-next | 16.1.6 | Next.js-specific lint rules |

### Backend — Intelligence API

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Language** | Python | 3.12 | Async, type-annotated backend |
| **Framework** | [FastAPI](https://fastapi.tiangolo.com) | 0.115.5 | Async Python API — auto OpenAPI docs, Pydantic integration |
| **ASGI Server** | [Uvicorn](https://www.uvicorn.org) | 0.32.1 | Production ASGI server — HTTP/1.1 + WebSocket |
| **Validation** | [Pydantic](https://docs.pydantic.dev) | 2.10.3 | All request/response model validation via Python type annotations |
| **HTTP Client** | httpx | 0.28.0 | Async HTTP client for external API and LLM calls |
| **WebSocket** | websockets | 14.1 | Real-time intelligence feed streaming |
| **File Uploads** | python-multipart | 0.0.12 | Multipart form parsing for document uploads |
| **Env Management** | python-dotenv | 1.0.1 | `.env` file loading and secrets management |
| **Async Files** | aiofiles | 24.1.0 | Non-blocking async file I/O |

### NLP & AI Pipeline

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **NLP Framework** | [spaCy](https://spacy.io) | 3.8.3 | Industrial-strength NLP — NER, POS tagging, dependency parsing |
| **Language Model** | en_core_web_sm | latest | English spaCy model — tokenization, sentence boundaries, base NER |
| **Transformers** | [HuggingFace Transformers](https://huggingface.co) | 4.47.0 | BERT/RoBERTa for domain classification and claim verification |
| **Deep Learning** | [PyTorch](https://pytorch.org) | 2.5.1 | Tensor computation backend for Transformers inference |
| **Anomaly Detection** | [scikit-learn](https://scikit-learn.org) | 1.6.0 | Isolation Forest for SDI anomaly detection, clustering |
| **Numerics** | [NumPy](https://numpy.org) | 2.2.0 | Array operations for risk score computation |
| **Data Processing** | [Pandas](https://pandas.pydata.org) | 2.2.3 | Structured data preprocessing pipeline |
| **LLM (Primary)** | OpenAI GPT-4o | API | Scenario generation and recursive strategic reasoning |
| **LLM (Alt)** | Anthropic Claude | API | Configurable alternative LLM backend |

### Databases

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Graph Database** | [Neo4j Community](https://neo4j.com) | 5.15 | Native graph DB — stores all entity-relationship knowledge graph |
| **APOC Plugin** | Neo4j APOC | bundled | Graph utility procedures — import, refactoring, path algorithms |
| **GDS Plugin** | Neo4j Graph Data Science | bundled | PageRank, community detection, centrality algorithms |
| **Neo4j Driver** | neo4j (Python) | 5.26.0 | Official Bolt protocol driver with async support |
| **Relational DB** | [PostgreSQL](https://postgresql.org) | 16-alpine | Structured storage — time-series metrics, feed history, user data |
| **Postgres Driver** | asyncpg | 0.30.0 | High-performance async PostgreSQL driver (3x faster than psycopg2) |
| **ORM** | SQLAlchemy | 2.0.36 | Async ORM with PostgreSQL backend |
| **Cache** | [Redis](https://redis.io) | 7-alpine | In-memory cache — rate limiting, sessions, hot query caching |

### Streaming & Messaging

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Message Broker** | [Apache Kafka](https://kafka.apache.org) | 7.7.0 (Confluent) | Distributed streaming — real-time intelligence ingestion pipeline |
| **Coordination** | Apache Zookeeper | 7.7.0 (Confluent) | Kafka broker coordination and leader election |
| **Kafka Python** | aiokafka | 0.11.0 | Async Kafka consumer/producer for Python backend |
| **Topics** | Custom (4) | — | `intel-feed` (4 parts), `graph-updates` (2), `sdi-updates` (2), `scenario-requests` (2) |
| **Kafka Monitor** | Provectus Kafka UI | latest | Web UI for topic/consumer inspection (dev profile) |

### Infrastructure & DevOps

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Containerization** | Docker | latest | Isolated, reproducible service environments |
| **Orchestration** | Docker Compose | 3.9 | 9-service orchestration via single `docker compose up` |
| **Frontend Image** | oven/bun:1 | 1 | Official Bun runtime — multi-stage Next.js standalone build |
| **Backend Image** | python:3.12-slim | 3.12-slim | Minimal Python image with all NLP dependencies |
| **Reverse Proxy** | Nginx | alpine | SSL termination and load balancing (production profile) |
| **Network** | Docker Bridge | custom | Isolated `theia-net` — subnet 172.20.0.0/16 |
| **Volumes** | Docker Volumes (7) | local | Neo4j data/logs, Postgres data, Kafka data, Zookeeper, Redis |

### Design System

| Token | Value | Rationale |
|-------|-------|-----------|
| Background | `#070b14` | Navy-black — reduces eye strain vs pure black during extended analysis |
| Primary | `#00d4ff` | Electric cyan — maximum visibility on dark backgrounds |
| Danger | `#ef4444` | Red — conflict edges, critical alerts, threat signals |
| Warning | `#f59e0b` | Amber — SDI warnings, high-severity items |
| Success | `#10b981` | Emerald — alliance edges, verified items, falling risk |
| Secondary | `#7c3aed` | Purple — Shadow Ontology layer, information edges |
| Body font | Geist Sans | Optimized readability at small dashboard sizes |
| Data font | Geist Mono | Monospace digit alignment for score comparison |
| Overlay | CSS pseudo-element | 2px scanlines at 1.5% opacity — terminal aesthetic |
| Grid | CSS linear-gradient | 40px grid at 4% opacity — spatial reference |

### Dependency Summary

| Layer | Direct Packages | Dev Packages | Docker Services |
|-------|----------------|-------------|----------------|
| Frontend | 18 | 8 | 1 |
| Backend | 16 | — | 1 |
| Databases | — | — | 3 (Neo4j, Postgres, Redis) |
| Streaming | — | — | 3 (Kafka, Zookeeper, Kafka UI) |
| Proxy | — | — | 1 (Nginx, production) |
| **Total** | **34 packages** | **8 dev packages** | **9 containers** |

---

## Project Structure

```
project-chanakya/              ← folder name kept for continuity
├── README.md
├── docker-compose.yml         9-service full-stack orchestration
├── .env.example               Environment template
├── docs/
│   └── DOCUMENTATION.md       Complete technical documentation (944 lines)
│
├── frontend/                  Next.js 16 + Bun
│   ├── README.md              Frontend-specific documentation
│   ├── Dockerfile             Multi-stage Bun/Next.js build
│   ├── app/
│   │   ├── layout.tsx         Root layout, fonts, metadata
│   │   ├── globals.css        Design system — colors, animations, utilities
│   │   ├── page.tsx           Landing page — particle canvas, typing effect
│   │   └── dashboard/page.tsx Dashboard shell — metrics ticker, panel routing
│   ├── components/
│   │   ├── graph/
│   │   │   └── KnowledgeGraph.tsx   D3.js force-directed graph
│   │   ├── panels/
│   │   │   ├── SDIPanel.tsx         Strategic Dissonance Index
│   │   │   ├── IntelligenceFeed.tsx Real-time intelligence feed
│   │   │   ├── RiskMatrix.tsx       Regional risk assessment
│   │   │   ├── ShadowOntology.tsx   Dual-graph narrative detector
│   │   │   ├── ScenarioEngine.tsx   LLM strategy loop
│   │   │   └── EntityExplorer.tsx   Entity deep-dive profiles
│   │   └── layout/
│   │       ├── Navbar.tsx
│   │       └── Sidebar.tsx
│   ├── lib/
│   │   ├── mock-data.ts       Full geopolitical dataset
│   │   └── utils.ts           Color maps, formatters, helpers
│   └── types/index.ts         All TypeScript interfaces
│
└── backend/                   FastAPI + Python 3.12
    ├── Dockerfile
    ├── requirements.txt       16 Python packages
    └── app/
        ├── main.py            FastAPI app + WebSocket
        ├── routers/
        │   ├── graph.py       Knowledge graph endpoints
        │   ├── intelligence.py Feed + risk endpoints
        │   ├── nlp.py         NLP pipeline
        │   ├── scenarios.py   Recursive strategy engine
        │   └── sdi.py         Dissonance index
        ├── models/schemas.py  25 Pydantic models
        └── data/mock_data.py  Geopolitical dataset
```

---

## Quick Start

### Prerequisites
- [Bun](https://bun.sh) ≥ 1.1.0
- [Python](https://python.org) ≥ 3.12
- [Docker](https://docker.com) + Docker Compose

### Option 1: Full Stack with Docker (Recommended)

```bash
cd project-chanakya
cp .env.example .env
# Add API keys to .env

docker compose up -d

# Services available:
# Dashboard:  http://localhost:3000
# API:        http://localhost:8000
# API Docs:   http://localhost:8000/api/docs
# Neo4j:      http://localhost:7474
# Kafka UI:   http://localhost:8080  (dev profile only)
```

### Option 2: Local Development

```bash
# Frontend (terminal 1)
cd frontend
bun install
bun dev
# → http://localhost:3000

# Backend (terminal 2)
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python -m spacy download en_core_web_sm
uvicorn app.main:app --reload --port 8000
# → http://localhost:8000/api/docs
```

---

## API Reference

### Knowledge Graph
| Endpoint | Description |
|---------|-------------|
| `GET /api/graph/` | Full graph with optional filters |
| `GET /api/graph/node/{id}` | Node + neighborhood |
| `GET /api/graph/path/{src}/{tgt}` | Shortest entity path |
| `GET /api/graph/high-risk` | Entities above risk threshold |
| `GET /api/graph/stats` | Graph statistics |

### Intelligence Feed & Risk
| Endpoint | Description |
|---------|-------------|
| `GET /api/intelligence/feed` | Intelligence feed (filterable) |
| `GET /api/intelligence/risk` | Global risk assessment |
| `GET /api/intelligence/risk/{region}` | Regional risk detail |

### NLP Pipeline
| Endpoint | Description |
|---------|-------------|
| `POST /api/nlp/analyze` | Full analysis — NER + domain + sentiment |
| `POST /api/nlp/extract-entities` | Entity extraction only |
| `POST /api/nlp/classify` | Domain classification |

### Scenario Engine
| Endpoint | Description |
|---------|-------------|
| `POST /api/scenarios/generate` | AI scenario generation |
| `GET /api/scenarios/library` | Pre-built scenario library |

### Strategic Dissonance Index
| Endpoint | Description |
|---------|-------------|
| `GET /api/sdi/` | Current SDI metrics |
| `GET /api/sdi/domain/{domain}` | Domain-specific SDI |
| `GET /api/sdi/shadow` | Shadow Ontology signals |
| `POST /api/sdi/recalculate` | Trigger recalculation |

### WebSocket
| Endpoint | Description |
|---------|-------------|
| `WS /ws/feed` | Real-time intelligence stream |

---

## Dashboard Modules

| Module | Description | Key Features |
|--------|-------------|--------------|
| **Knowledge Graph** | D3.js force-directed graph | Pan/zoom, node click, edge filtering, neighborhood exploration |
| **SDI Panel** | Strategic Dissonance Index | SVG gauge, 30-day trend chart, domain analysis |
| **Intelligence Feed** | Live geopolitical stream | Real-time updates, multi-filter, pause/resume |
| **Risk Matrix** | Regional threat assessment | Radar charts, sortable risk cards, trend indicators |
| **Shadow Ontology** | Narrative vs reality | Dual-panel dissonance display, confidence scoring |
| **Scenario Engine** | LLM strategy projections | Custom query, scenario library, mitigation plans |
| **Entity Explorer** | Deep-dive entity profiles | Timeline, metrics grid, relationship map |

---

## Roadmap

### Phase 1 — MVP (Complete)
- [x] Knowledge Graph with D3.js visualization
- [x] Strategic Dissonance Index dashboard
- [x] Real-time Intelligence Feed
- [x] Shadow Ontology Layer
- [x] Recursive Scenario Engine
- [x] FastAPI backend with all core endpoints
- [x] Docker Compose full-stack deployment

### Phase 2 — Production (3–6 months)
- [ ] Live Neo4j graph integration
- [ ] Kafka pipeline with real OSINT sources
- [ ] Fine-tuned geopolitical NER model
- [ ] GPT-4o / Claude live scenario generation
- [ ] Satellite imagery integration (Sentinel Hub)
- [ ] User authentication and clearance tiers
- [ ] Mobile-responsive dashboard

### Phase 3 — Advanced (6–24 months)
- [ ] Geospatial intelligence layer (Mapbox)
- [ ] Temporal replay engine
- [ ] Autonomous entity monitoring agents
- [ ] Conversational natural language graph queries
- [ ] Federated intelligence sharing (QUAD partners)

---

## Data Sources (Production)

| Category | Sources |
|----------|---------|
| News | GDELT, NewsAPI, Reuters, AP, Al Jazeera |
| Government | MEA, PMO, PIB, Ministry of Defense, CIA World Factbook |
| Financial | World Bank, IMF, Alpha Vantage, Quandl |
| Military | Jane's, SIPRI, IISS Military Balance |
| Satellite | Sentinel Hub, Planet Labs, NOAA |
| Social | Twitter/X API, Reddit OSINT communities |
| Academic | JSTOR, SSRN, think-tank publications |

---

## Classification

> **Theia** processes open-source intelligence (OSINT) only. No classified government data is incorporated. All geopolitical assessments are analytical models, not official government positions.

---

*Built with strategic intent. Dedicated to India's national interest and global stability.*

**Theia — India Innovates // GOE v2.4.1**
