"""Strategic Dissonance Index (SDI) API endpoints."""

import random
from datetime import datetime, timezone, timedelta
from fastapi import APIRouter, Query
from typing import Optional
from app.data.mock_data import SDI_DATA, SHADOW_SIGNALS

router = APIRouter()


@router.get("/", summary="Get current SDI metrics")
async def get_sdi():
    """Returns the current Strategic Dissonance Index across all domains."""
    return SDI_DATA


@router.get("/domain/{domain}", summary="Get domain-specific SDI")
async def get_domain_sdi(domain: str):
    """Returns SDI breakdown for a specific domain."""
    domain_data = next(
        (d for d in SDI_DATA["domains"] if d["domain"] == domain),
        None
    )
    if not domain_data:
        return {"error": f"Domain '{domain}' not found", "available": [d["domain"] for d in SDI_DATA["domains"]]}

    return {
        **domain_data,
        "analysis": get_domain_analysis(domain),
        "anomaly_details": get_anomaly_details(domain),
        "trend_30d": [
            {
                "date": (datetime.now(timezone.utc) - timedelta(days=30 - i)).strftime("%Y-%m-%d"),
                "score": round(domain_data["score"] + random.uniform(-15, 15), 1),
            }
            for i in range(31)
        ],
    }


@router.get("/shadow", summary="Get Shadow Ontology signals")
async def get_shadow_signals(
    min_dissonance: float = Query(0, ge=0, le=100),
    domain: Optional[str] = Query(None),
):
    """Returns Shadow Ontology Layer signals — narrative vs reality gaps."""
    signals = SHADOW_SIGNALS.copy()
    if min_dissonance:
        signals = [s for s in signals if s["dissonance_score"] >= min_dissonance]
    if domain:
        signals = [s for s in signals if s["domain"] == domain]

    avg_dissonance = sum(s["dissonance_score"] for s in signals) / max(len(signals), 1)

    return {
        "signals": signals,
        "average_dissonance": round(avg_dissonance, 1),
        "high_dissonance_count": sum(1 for s in signals if s["dissonance_score"] >= 80),
        "domains_affected": list({s["domain"] for s in signals}),
    }


@router.post("/recalculate", summary="Trigger SDI recalculation")
async def recalculate_sdi():
    """
    Triggers a full SDI recalculation across all domains.
    In production: Processes latest feed, re-runs anomaly detection, updates graph weights.
    """
    new_overall = round(SDI_DATA["overall"] + random.uniform(-3, 5), 1)
    new_overall = max(0, min(100, new_overall))

    return {
        "status": "recalculated",
        "previous_overall": SDI_DATA["overall"],
        "new_overall": new_overall,
        "delta": round(new_overall - SDI_DATA["overall"], 1),
        "recalculated_at": datetime.now(timezone.utc).isoformat(),
        "methodology": {
            "anomaly_detection": "Isolation Forest + Z-score cross-domain correlation",
            "narrative_analysis": "BERT-based claim verification against ground indicators",
            "risk_propagation": "PageRank-weighted graph traversal with decay factors",
        },
    }


def get_domain_analysis(domain: str) -> str:
    analyses = {
        "defense": "Significant gap between official military capability disclosures and satellite/OSINT assessments. Key actors: Russia (+19), China (+12), DPRK (+8).",
        "geopolitics": "Diplomatic narratives diverge sharply from observed state actions. Alliance signaling inconsistent with actual force posture.",
        "economics": "Shadow economy indicators show significant divergence from official GDP and trade statistics in Russia, China, and emerging markets.",
        "technology": "Export control compliance gap widening. AI capability disclosures lag estimated capabilities by 12-18 months.",
        "climate": "NDC commitments vs satellite methane measurements show 3 major emitter discrepancies. India broadly consistent.",
        "society": "Social stability metrics diverge from suppressed protest data and migration pressure indicators.",
    }
    return analyses.get(domain, "Analysis not available.")


def get_anomaly_details(domain: str) -> list:
    anomalies = {
        "defense": [
            {"entity": "Russia", "description": "Undisclosed hypersonic program progress", "confidence": 0.92},
            {"entity": "China", "description": "Naval build-up exceeds disclosed figures by ~18%", "confidence": 0.87},
        ],
        "geopolitics": [
            {"entity": "China", "description": "Belt & Road debt terms inconsistent with official statements", "confidence": 0.89},
            {"entity": "Pakistan", "description": "Counter-terrorism claims contradict ISI operational patterns", "confidence": 0.85},
        ],
        "economics": [
            {"entity": "China", "description": "Official GDP growth vs satellite night-light data divergence", "confidence": 0.78},
        ],
        "technology": [
            {"entity": "China", "description": "AI chip self-sufficiency ahead of official timeline", "confidence": 0.82},
        ],
    }
    return anomalies.get(domain, [])
