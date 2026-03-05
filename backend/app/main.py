"""
Project Theia — Global Ontology Engine
FastAPI Backend — Core Intelligence API
"""

import os
import asyncio
import random
import uuid
from datetime import datetime, timezone
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.routers import graph, intelligence, nlp, scenarios, sdi
from app.data.mock_data import NODES, EDGES, FEED_ITEMS


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events."""
    print("🔍 Project Theia GOE — Starting Intelligence Engine...")
    print("✅ Neo4j connection simulated")
    print("✅ PostgreSQL connection simulated")
    print("✅ Kafka consumer pipeline active")
    print("✅ NLP pipeline initialized")
    print("✅ LLM service connected")
    yield
    print("⚠️  Shutting down intelligence pipelines...")


app = FastAPI(
    title="Project Theia — Global Ontology Engine",
    description=(
        "AI-powered strategic intelligence platform for geopolitical analysis, "
        "defense assessment, and strategic foresight. Powers the Theia Dashboard."
    ),
    version="2.4.1",
    lifespan=lifespan,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

# CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://frontend:3000",
        "https://*.railway.app",
        "https://*.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(graph.router, prefix="/api/graph", tags=["Knowledge Graph"])
app.include_router(intelligence.router, prefix="/api/intelligence", tags=["Intelligence Feed"])
app.include_router(nlp.router, prefix="/api/nlp", tags=["NLP Pipeline"])
app.include_router(scenarios.router, prefix="/api/scenarios", tags=["Scenario Engine"])
app.include_router(sdi.router, prefix="/api/sdi", tags=["Strategic Dissonance Index"])


@app.get("/", tags=["System"])
async def root():
    return {
        "system": "Project Theia — Global Ontology Engine",
        "version": "2.4.1",
        "status": "operational",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "endpoints": {
            "graph": "/api/graph",
            "intelligence": "/api/intelligence",
            "nlp": "/api/nlp",
            "scenarios": "/api/scenarios",
            "sdi": "/api/sdi",
            "websocket": "/ws/feed",
            "docs": "/api/docs",
        },
    }


@app.get("/health", tags=["System"])
async def health():
    return {
        "status": "healthy",
        "services": {
            "api": "up",
            "neo4j": "up",
            "postgresql": "up",
            "kafka": "up",
            "nlp_pipeline": "up",
            "llm_service": "up",
        },
        "graph_stats": {
            "total_nodes": len(NODES),
            "total_edges": len(EDGES),
            "last_update": datetime.now(timezone.utc).isoformat(),
        },
    }


# WebSocket for real-time intelligence feed
class ConnectionManager:
    def __init__(self):
        self.active: list[WebSocket] = []

    async def connect(self, ws: WebSocket):
        await ws.accept()
        self.active.append(ws)

    def disconnect(self, ws: WebSocket):
        self.active.remove(ws)

    async def broadcast(self, data: dict):
        for connection in self.active[:]:
            try:
                await connection.send_json(data)
            except Exception:
                self.active.remove(connection)


manager = ConnectionManager()


@app.websocket("/ws/feed")
async def websocket_feed(websocket: WebSocket):
    """Real-time intelligence feed via WebSocket."""
    await manager.connect(websocket)
    try:
        # Send initial state
        await websocket.send_json({
            "type": "init",
            "data": {
                "feed": FEED_ITEMS[:10],
                "sdi": 67,
                "active_alerts": 14,
            }
        })

        # Stream live updates
        while True:
            await asyncio.sleep(15)
            # Simulate incoming intelligence
            live_item = {
                "id": str(uuid.uuid4()),
                "title": random.choice([
                    "Satellite imagery detects unusual military activity near LAC",
                    "OSINT: Chinese naval drills exceed annual average by 3x",
                    "India-US bilateral defense framework expanded",
                    "Pakistan ISI intercepts suggest cross-border operation planning",
                    "Economic indicators: China GDP growth revised down 0.4%",
                    "DPRK launches ballistic missile into East Sea",
                ]),
                "domain": random.choice(["defense", "geopolitics", "economics", "technology"]),
                "severity": random.choice(["critical", "high", "medium"]),
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "sdiImpact": random.randint(3, 15),
                "entities": random.sample(["IND", "CHN", "USA", "RUS", "PAK"], k=random.randint(1, 3)),
                "verified": random.choice([True, False]),
                "source": "OSINT Composite / Theia Pipeline",
            }
            await websocket.send_json({"type": "intel_update", "data": live_item})
    except WebSocketDisconnect:
        manager.disconnect(websocket)
