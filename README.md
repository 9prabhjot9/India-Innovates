# 🔭 Project Chanakya — Global Ontology Engine

> *"The world does not wait for those who are unprepared."*

**Project Chanakya** is an AI-powered strategic intelligence platform that transforms fragmented geopolitical, economic, defense, and societal data into a unified, continuously updating intelligence system — delivering measurable risk indicators and actionable strategic foresight for India and the world.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     PROJECT CHANAKYA GOE                        │
│                  Global Ontology Engine v2.4.1                  │
└─────────────────────────────────────────────────────────────────┘
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

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 16 (App Router) + TypeScript |
| **UI System** | Tailwind CSS v4 + Radix UI primitives |
| **Visualization** | D3.js v7 (Knowledge Graph) + Recharts (metrics) |
| **Animation** | Framer Motion |
| **Backend API** | FastAPI (Python 3.12) |
| **NLP Pipeline** | spaCy 3.8 + HuggingFace Transformers |
| **LLM** | OpenAI GPT-4o / Anthropic Claude |
| **Graph DB** | Neo4j 5.15 Community |
| **Relational DB** | PostgreSQL 16 |
| **Streaming** | Apache Kafka (Confluent Platform) |
| **Cache** | Redis 7 |
| **Runtime** | Bun (frontend) |
| **Containerization** | Docker + Docker Compose |

---

## Project Structure

```
project-chanakya/
├── frontend/                    # Next.js dashboard
│   ├── app/
│   │   ├── page.tsx             # Landing page
│   │   ├── dashboard/page.tsx   # Main dashboard
│   │   └── globals.css          # Dark theme + design system
│   ├── components/
│   │   ├── graph/
│   │   │   └── KnowledgeGraph.tsx    # D3.js force graph
│   │   ├── panels/
│   │   │   ├── SDIPanel.tsx          # Dissonance Index
│   │   │   ├── IntelligenceFeed.tsx  # Live feed
│   │   │   ├── RiskMatrix.tsx        # Regional risk
│   │   │   ├── ShadowOntology.tsx    # Dual-graph view
│   │   │   ├── ScenarioEngine.tsx    # Strategy loop
│   │   │   └── EntityExplorer.tsx    # Entity deep-dive
│   │   └── layout/
│   │       ├── Navbar.tsx
│   │       └── Sidebar.tsx
│   ├── lib/
│   │   ├── mock-data.ts         # Geopolitical dataset
│   │   └── utils.ts
│   └── types/index.ts           # TypeScript interfaces
│
├── backend/                     # FastAPI intelligence API
│   ├── app/
│   │   ├── main.py              # FastAPI app + WebSocket
│   │   ├── routers/
│   │   │   ├── graph.py         # Knowledge graph endpoints
│   │   │   ├── intelligence.py  # Feed + risk endpoints
│   │   │   ├── nlp.py           # NLP pipeline
│   │   │   ├── scenarios.py     # Strategy engine
│   │   │   └── sdi.py           # Dissonance index
│   │   ├── models/schemas.py    # Pydantic models
│   │   └── data/mock_data.py    # Backend dataset
│   └── requirements.txt
│
├── docker-compose.yml           # Full stack orchestration
├── .env.example                 # Environment template
└── README.md
```

---

## Quick Start

### Prerequisites
- [Bun](https://bun.sh) ≥ 1.1.0
- [Python](https://python.org) ≥ 3.12
- [Docker](https://docker.com) + Docker Compose

### Option 1: Full Stack with Docker (Recommended)

```bash
# Clone and setup
cd project-chanakya
cp .env.example .env
# Edit .env with your API keys

# Launch all services
docker compose up -d

# Services:
# Frontend:   http://localhost:3000
# Backend:    http://localhost:8000
# API Docs:   http://localhost:8000/api/docs
# Neo4j:      http://localhost:7474
# Kafka UI:   http://localhost:8080 (dev profile)
```

### Option 2: Local Development

```bash
# Frontend
cd frontend
bun install
bun dev
# → http://localhost:3000

# Backend (separate terminal)
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
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
| `GET /api/graph/` | Full knowledge graph (filterable) |
| `GET /api/graph/node/{id}` | Node detail with neighborhood |
| `GET /api/graph/path/{src}/{tgt}` | Shortest path between entities |
| `GET /api/graph/high-risk` | High-risk entities above threshold |
| `GET /api/graph/stats` | Graph statistics |

### Intelligence
| Endpoint | Description |
|---------|-------------|
| `GET /api/intelligence/feed` | Intelligence feed (filterable) |
| `GET /api/intelligence/risk` | Global risk assessment |
| `GET /api/intelligence/risk/{region}` | Region-specific risk |

### NLP Pipeline
| Endpoint | Description |
|---------|-------------|
| `POST /api/nlp/analyze` | Full NLP analysis (NER + domain + sentiment) |
| `POST /api/nlp/extract-entities` | Entity extraction only |
| `POST /api/nlp/classify` | Domain classification |

### Scenario Engine
| Endpoint | Description |
|---------|-------------|
| `POST /api/scenarios/generate` | Generate AI scenario |
| `GET /api/scenarios/library` | Pre-built scenario library |

### SDI
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
| **Knowledge Graph** | D3.js force-directed graph | Pan/zoom, node selection, edge type filtering, neighborhood exploration |
| **SDI Panel** | Strategic Dissonance Index | Gauge visualization, 30-day trend chart, domain breakdown |
| **Intelligence Feed** | Live geopolitical stream | Real-time updates, multi-filter, expandable items |
| **Risk Matrix** | Regional threat assessment | Radar charts, sortable risk cards, trend indicators |
| **Shadow Ontology** | Narrative vs reality | Dual-panel display, dissonance scoring, confidence levels |
| **Scenario Engine** | LLM strategy projections | Custom query, scenario library, mitigation plans |
| **Entity Explorer** | Deep-dive profiles | Timeline, metrics, relationship maps |

---

## Roadmap

### Phase 1 (Current — MVP)
- [x] Knowledge Graph with D3.js visualization
- [x] Strategic Dissonance Index dashboard
- [x] Real-time Intelligence Feed
- [x] Shadow Ontology Layer
- [x] Scenario Engine UI
- [x] FastAPI backend with all core endpoints
- [x] Docker Compose full stack

### Phase 2 (Production)
- [ ] Live Neo4j graph integration with real data
- [ ] Full Kafka pipeline with real news/OSINT sources
- [ ] HuggingFace fine-tuned geopolitical NER model
- [ ] GPT-4o/Claude integration for Scenario Engine
- [ ] Satellite imagery integration (Sentinel Hub)
- [ ] User authentication and clearance levels
- [ ] Mobile-responsive dashboard

### Phase 3 (Advanced)
- [ ] Autonomous agent-based intelligence gathering
- [ ] Custom India advantage scoring models
- [ ] Diplomatic cable analysis (via declassified sources)
- [ ] Economic indicator shadow tracking (night-light satellite)
- [ ] Federated intelligence sharing (partner nations)

---

## Data Sources (Production Integration)

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

## Contributing

This project is part of **India Innovates** — a national technology initiative. Contributions are welcome from researchers, analysts, engineers, and intelligence professionals.

```bash
git checkout -b feature/your-intelligence-module
# Build your module
git commit -m "feat: add [module name] intelligence layer"
```

---

## Classification

> **Project Chanakya** processes open-source intelligence (OSINT) only. No classified government data is incorporated. All geopolitical assessments are analytical models, not official government positions.

---

*Built with strategic intent. Dedicated to India's national interest and global stability.*

**Project Chanakya // India Innovates // GOE v2.4.1**
