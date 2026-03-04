"""Scenario Engine API endpoints — Recursive Strategy Loop."""

import uuid
import random
from datetime import datetime, timezone
from fastapi import APIRouter
from app.models.schemas import ScenarioRequest, ScenarioResponse
from app.data.mock_data import NODES

router = APIRouter()

SCENARIO_TEMPLATES = [
    {
        "title_template": "Escalation Scenario: {query_short}",
        "domain_map": {"military": "defense", "war": "defense", "conflict": "defense", "attack": "defense"},
        "default_impact": "critical",
    }
]

def infer_domains_from_query(query: str) -> list:
    """Infer affected domains from query text."""
    query_lower = query.lower()
    domains = []
    if any(w in query_lower for w in ["military", "war", "missile", "nuclear", "attack", "conflict", "weapon"]):
        domains.append("defense")
    if any(w in query_lower for w in ["trade", "economy", "gdp", "sanction", "oil", "tariff", "currency"]):
        domains.append("economics")
    if any(w in query_lower for w in ["diplomat", "alliance", "treaty", "border", "territorial", "election"]):
        domains.append("geopolitics")
    if any(w in query_lower for w in ["semiconductor", "ai", "cyber", "tech", "chip", "satellite", "space"]):
        domains.append("technology")
    if not domains:
        domains = ["geopolitics", "defense"]
    return list(set(domains))[:4]


def infer_actors_from_query(query: str) -> list:
    """Extract likely actors from query."""
    actor_map = {
        "china": "CHN", "india": "IND", "russia": "RUS", "usa": "USA",
        "united states": "USA", "pakistan": "PAK", "iran": "IRN",
        "taiwan": "TWN", "north korea": "PRK", "nato": "NATO",
    }
    query_lower = query.lower()
    actors = [code for name, code in actor_map.items() if name in query_lower]
    if not actors:
        actors = ["IND", "CHN", "USA"]
    return actors[:5]


def generate_mitigations(domains: list, actors: list, india_focus: bool) -> list:
    """Generate strategic mitigations based on domains and actors."""
    mitigations = []

    if "defense" in domains:
        mitigations.extend([
            "Activate forward military positioning and heightened alert protocols",
            "Invoke bilateral defense partnerships for intelligence sharing and logistical support",
        ])
    if "economics" in domains:
        mitigations.extend([
            "Pre-position strategic commodity reserves (oil, semiconductors, rare earths)",
            "Activate trade diversification protocols to reduce single-source dependencies",
        ])
    if "geopolitics" in domains:
        mitigations.extend([
            "Deploy diplomatic back-channels through neutral intermediaries (UAE, Singapore, Indonesia)",
            "Engage multilateral frameworks (QUAD, BRICS, G20) for coordinated response signaling",
        ])
    if "technology" in domains:
        mitigations.extend([
            "Accelerate domestic capability development in affected technology sectors",
            "Implement emergency supply chain resilience protocols",
        ])

    if india_focus:
        mitigations.insert(0, "Activate India's Strategic Autonomy Protocol — calibrate response to preserve multi-alignment balance")

    return mitigations[:5]


def generate_early_warnings(domains: list, actors: list) -> list:
    """Generate early warning signals."""
    warnings = []
    if "CHN" in actors:
        warnings.extend([
            "Monitor PLA exercise scale relative to historical annual averages",
            "Track Chinese diplomatic recall or ambassador-level escalation signals",
        ])
    if "PAK" in actors:
        warnings.extend([
            "Watch Pakistani Army mobilization patterns from Sialkot, Rawalpindi cantonments",
            "Monitor ISI intercepts for cross-border operational planning language",
        ])
    if "RUS" in actors:
        warnings.extend([
            "Track Russian energy supply flow anomalies as pressure mechanism",
            "Monitor SWIFT transaction volumes for pre-conflict economic positioning",
        ])
    if not warnings:
        warnings = [
            "Unusual military movement detected near contested zones",
            "Diplomatic communication frequency drops between key actors",
            "Social media sentiment shifts indicating population mobilization",
            "Commodity price spikes indicating anticipated supply disruption",
        ]
    return warnings[:4]


@router.post("/generate", summary="Generate AI strategic scenario", response_model=ScenarioResponse)
async def generate_scenario(request: ScenarioRequest):
    """
    Recursive Strategy Loop: Generate a scenario-based analysis using the knowledge graph
    state and LLM reasoning. Returns probability assessment, impact analysis, and
    India-focused strategic mitigations.
    
    In production: This calls GPT-4o/Claude with graph context injection.
    In demo: Returns structured response based on query analysis.
    """
    domains = infer_domains_from_query(request.query)
    actors = infer_actors_from_query(request.query)

    # Probability based on current risk scores of involved actors
    involved_nodes = [n for n in NODES if n["id"] in actors]
    base_risk = sum(n["risk"] for n in involved_nodes) / max(len(involved_nodes), 1)
    probability = min(85, max(5, base_risk * 0.6 + random.uniform(-10, 15)))

    impact_levels = ["critical", "high", "medium"]
    impact = impact_levels[0] if probability > 50 else impact_levels[1] if probability > 25 else impact_levels[2]

    timeframes = ["3-6 months", "6-12 months", "12-18 months", "18-24 months"]
    timeframe = random.choice(timeframes)

    description = (
        f"Recursive Strategy Loop analysis of '{request.query[:100]}' based on current "
        f"knowledge graph state. Affected entities: {', '.join(actors[:3])}. "
        f"Cross-domain correlation identifies {', '.join(domains)} as primary impact vectors. "
        f"Graph risk propagation model projects {round(probability, 1)}% probability within {timeframe}. "
        f"Shadow Ontology Layer detects {'significant' if probability > 50 else 'moderate'} narrative-reality "
        f"dissonance in key actor positions."
    )

    india_assessment = (
        f"India's strategic exposure: {'HIGH' if 'IND' in actors or probability > 50 else 'MODERATE'}. "
        f"Primary vectors: {', '.join(domains[:2])}. "
        f"Recommended posture: {'Defensive preparation with diplomatic outreach' if probability > 50 else 'Monitoring with contingency planning'}."
    ) if request.india_focus else None

    return ScenarioResponse(
        id=str(uuid.uuid4()),
        title=f"Strategic Scenario: {request.query[:60]}{'...' if len(request.query) > 60 else ''}",
        probability=round(probability, 1),
        timeframe=timeframe,
        impact=impact,
        affected_domains=domains,
        key_actors=actors,
        description=description,
        mitigations=generate_mitigations(domains, actors, request.india_focus),
        early_warning_signals=generate_early_warnings(domains, actors),
        india_strategic_assessment=india_assessment,
        confidence=round(65 + random.uniform(-10, 20), 1),
        generated_at=datetime.now(timezone.utc).isoformat(),
    )


@router.get("/library", summary="Get pre-built scenario library")
async def get_scenario_library():
    """Returns the strategic scenario library."""
    return {
        "scenarios": [
            {
                "id": "s1",
                "title": "Taiwan Strait Military Escalation",
                "probability": 34,
                "impact": "critical",
                "timeframe": "12-18 months",
                "domains": ["defense", "economics", "technology", "geopolitics"],
            },
            {
                "id": "s2",
                "title": "India-China Himalayan Conflict Escalation",
                "probability": 28,
                "impact": "critical",
                "timeframe": "6-24 months",
                "domains": ["defense", "geopolitics", "economics"],
            },
            {
                "id": "s3",
                "title": "Global Semiconductor Supply Shock",
                "probability": 52,
                "impact": "high",
                "timeframe": "3-9 months",
                "domains": ["technology", "economics", "defense"],
            },
            {
                "id": "s4",
                "title": "Russia-NATO Direct Confrontation",
                "probability": 18,
                "impact": "critical",
                "timeframe": "24-36 months",
                "domains": ["defense", "geopolitics", "economics"],
            },
        ],
        "last_updated": datetime.now(timezone.utc).isoformat(),
    }
