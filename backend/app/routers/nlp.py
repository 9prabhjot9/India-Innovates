"""NLP Pipeline API endpoints — Entity Extraction, Classification, Sentiment Analysis."""

import time
import re
from typing import List
from fastapi import APIRouter
from app.models.schemas import NLPAnalysisRequest, NLPAnalysisResponse, EntityMention

router = APIRouter()

# Geopolitical entity dictionary for rule-based extraction
GEOPOLITICAL_ENTITIES = {
    # Countries
    "india": ("IND", "COUNTRY"), "china": ("CHN", "COUNTRY"),
    "russia": ("RUS", "COUNTRY"), "united states": ("USA", "COUNTRY"),
    "pakistan": ("PAK", "COUNTRY"), "iran": ("IRN", "COUNTRY"),
    "israel": ("ISR", "COUNTRY"), "north korea": ("PRK", "COUNTRY"),
    "south korea": ("KOR", "COUNTRY"), "japan": ("JPN", "COUNTRY"),
    "ukraine": ("UKR", "COUNTRY"), "taiwan": ("TWN", "COUNTRY"),
    # Organizations
    "nato": ("NATO", "ORG"), "un": ("UN", "ORG"),
    "united nations": ("UN", "ORG"), "quad": ("QUAD", "ORG"),
    "brics": ("BRICS", "ORG"), "sco": ("SCO", "ORG"), "opec": ("OIL", "ORG"),
    # Concepts
    "semiconductor": ("SEM", "TECHNOLOGY"), "hypersonic": ("HYP", "TECHNOLOGY"),
    "artificial intelligence": ("AI", "TECHNOLOGY"), "ai": ("AI", "TECHNOLOGY"),
    "cyber": ("CYB", "TECHNOLOGY"), "rare earth": ("REM", "RESOURCE"),
}

DOMAIN_KEYWORDS = {
    "defense": ["military", "weapon", "nuclear", "missile", "troop", "war", "attack", "bomb", "drone", "navy", "army", "air force", "hypersonic", "icbm"],
    "geopolitics": ["diplomat", "sanction", "treaty", "alliance", "border", "territorial", "sovereignty", "election", "government", "regime", "coup"],
    "economics": ["trade", "gdp", "tariff", "inflation", "export", "import", "debt", "currency", "bank", "investment", "oil", "commodity"],
    "technology": ["semiconductor", "ai", "cyber", "satellite", "5g", "quantum", "space", "hack", "software", "chip", "algorithm"],
    "climate": ["climate", "carbon", "emission", "flood", "drought", "temperature", "renewable", "fossil", "deforestation", "glacier"],
    "society": ["protest", "human rights", "migration", "refugee", "poverty", "corruption", "election", "media", "freedom", "social"],
}

RISK_PHRASES = [
    "military escalation", "nuclear threat", "cyber attack", "sanctions", "conflict",
    "border dispute", "missile test", "naval blockade", "territorial claim", "proxy war",
    "arms race", "intelligence operation", "regime change", "economic coercion",
]


def extract_entities_rule_based(text: str) -> List[EntityMention]:
    """Simple rule-based NER for geopolitical entities."""
    text_lower = text.lower()
    found: List[EntityMention] = []
    seen_spans = set()

    for term, (entity_id, label) in sorted(GEOPOLITICAL_ENTITIES.items(), key=lambda x: -len(x[0])):
        for match in re.finditer(re.escape(term), text_lower):
            span = (match.start(), match.end())
            if not any(s[0] <= span[0] and s[1] >= span[1] for s in seen_spans):
                seen_spans.add(span)
                found.append(EntityMention(
                    text=text[match.start():match.end()],
                    label=f"{label}:{entity_id}",
                    confidence=0.85 + (0.1 if len(term) > 5 else 0),
                    start=match.start(),
                    end=match.end(),
                ))

    return found


def classify_domain(text: str) -> tuple[str, float]:
    """Classify text into geopolitical domain."""
    text_lower = text.lower()
    scores = {}
    for domain, keywords in DOMAIN_KEYWORDS.items():
        score = sum(1 for kw in keywords if kw in text_lower)
        if score > 0:
            scores[domain] = score

    if not scores:
        return "geopolitics", 0.4

    top_domain = max(scores, key=scores.get)
    total = sum(scores.values())
    confidence = min(0.95, scores[top_domain] / total + 0.3)
    return top_domain, round(confidence, 3)


def analyze_sentiment(text: str) -> dict:
    """Simple rule-based sentiment analysis for geopolitical text."""
    text_lower = text.lower()
    negative_words = ["attack", "threat", "crisis", "war", "conflict", "sanction", "collapse", "fail", "danger", "hostile", "aggression", "invasion"]
    positive_words = ["cooperation", "agreement", "peace", "alliance", "partnership", "growth", "stability", "progress", "resolve", "diplomatic"]
    neutral_words = ["meeting", "statement", "report", "analysis", "data", "assessment"]

    neg_count = sum(1 for w in negative_words if w in text_lower)
    pos_count = sum(1 for w in positive_words if w in text_lower)
    total = neg_count + pos_count + 1

    return {
        "negative": round(neg_count / total, 3),
        "positive": round(pos_count / total, 3),
        "neutral": round(1 - (neg_count + pos_count) / total, 3),
        "overall": "negative" if neg_count > pos_count else "positive" if pos_count > neg_count else "neutral",
    }


def detect_risk_signals(text: str) -> List[str]:
    """Detect high-risk phrases in text."""
    text_lower = text.lower()
    return [phrase for phrase in RISK_PHRASES if phrase in text_lower]


@router.post("/analyze", summary="Analyze text with NLP pipeline", response_model=NLPAnalysisResponse)
async def analyze_text(request: NLPAnalysisRequest):
    """
    Full NLP analysis pipeline:
    - Named Entity Recognition (geopolitical entities)
    - Domain classification
    - Sentiment analysis
    - Risk signal detection
    - Event extraction
    """
    start = time.time()

    entities = extract_entities_rule_based(request.text) if request.extract_entities else []
    domain, domain_conf = classify_domain(request.text) if request.classify_domain else (None, None)
    sentiment = analyze_sentiment(request.text) if request.detect_sentiment else None
    risk_signals = detect_risk_signals(request.text)

    # Extract key events (simple sentence-based extraction)
    sentences = [s.strip() for s in re.split(r'[.!?]', request.text) if len(s.strip()) > 30]
    key_events = sentences[:3] if request.detect_events else None

    elapsed = round((time.time() - start) * 1000, 2)

    return NLPAnalysisResponse(
        text=request.text,
        entities=entities,
        sentiment=sentiment,
        domain=domain,
        domain_confidence=domain_conf,
        key_events=key_events,
        risk_signals=risk_signals,
        processing_time_ms=elapsed,
    )


@router.post("/extract-entities", summary="Extract entities only")
async def extract_entities(text: str):
    """Extract geopolitical entities from text."""
    start = time.time()
    entities = extract_entities_rule_based(text)
    return {
        "entities": entities,
        "count": len(entities),
        "processing_time_ms": round((time.time() - start) * 1000, 2),
    }


@router.post("/classify", summary="Classify domain of text")
async def classify_text(text: str):
    """Classify text into geopolitical domain."""
    domain, confidence = classify_domain(text)
    return {"domain": domain, "confidence": confidence}
