"""Pydantic schemas for Project Theia API."""

from typing import Optional, List, Dict, Any, Union
from enum import Enum
from datetime import datetime
from pydantic import BaseModel, Field


class DomainEnum(str, Enum):
    geopolitics = "geopolitics"
    economics = "economics"
    defense = "defense"
    technology = "technology"
    climate = "climate"
    society = "society"


class SeverityEnum(str, Enum):
    critical = "critical"
    high = "high"
    medium = "medium"
    low = "low"


class NodeTypeEnum(str, Enum):
    country = "country"
    organization = "organization"
    resource = "resource"
    event = "event"
    technology = "technology"
    actor = "actor"


class EdgeTypeEnum(str, Enum):
    trade = "trade"
    alliance = "alliance"
    conflict = "conflict"
    dependency = "dependency"
    sanction = "sanction"
    information = "information"
    rivalry = "rivalry"


# --- Graph Schemas ---
class GraphNodeResponse(BaseModel):
    id: str
    label: str
    type: NodeTypeEnum
    risk: float = Field(ge=0, le=100)
    influence: float = Field(ge=0, le=100)
    description: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None


class GraphEdgeResponse(BaseModel):
    id: str
    source: str
    target: str
    type: EdgeTypeEnum
    weight: float = Field(ge=0, le=100)
    label: Optional[str] = None
    active: bool = True


class GraphResponse(BaseModel):
    nodes: List[GraphNodeResponse]
    edges: List[GraphEdgeResponse]
    stats: Dict[str, Any]


class GraphQueryRequest(BaseModel):
    entity_ids: Optional[List[str]] = None
    node_types: Optional[List[NodeTypeEnum]] = None
    edge_types: Optional[List[EdgeTypeEnum]] = None
    min_risk: Optional[float] = Field(default=None, ge=0, le=100)
    max_depth: Optional[int] = Field(default=2, ge=1, le=5)
    limit: Optional[int] = Field(default=50, ge=1, le=200)


# --- SDI Schemas ---
class SDIDomainResponse(BaseModel):
    domain: DomainEnum
    score: float = Field(ge=0, le=100)
    trend: str
    anomalies: int
    last_update: str
    contributing_factors: Optional[List[str]] = None


class SDIResponse(BaseModel):
    overall: float = Field(ge=0, le=100)
    domains: List[SDIDomainResponse]
    alert_count: int
    last_recalculated: str
    methodology: str = "Cross-domain anomaly detection + narrative-reality correlation"


# --- Intelligence Feed Schemas ---
class IntelligenceItem(BaseModel):
    id: str
    title: str
    summary: str
    domain: DomainEnum
    severity: SeverityEnum
    source: str
    timestamp: str
    entities: List[str]
    sdi_impact: float
    verified: bool
    tags: List[str] = []


class IntelligenceFeedResponse(BaseModel):
    items: List[IntelligenceItem]
    total: int
    filtered_by: Optional[Dict[str, Any]] = None


# --- NLP Schemas ---
class NLPAnalysisRequest(BaseModel):
    text: str = Field(..., min_length=10, max_length=10000)
    extract_entities: bool = True
    detect_sentiment: bool = True
    classify_domain: bool = True
    detect_events: bool = True


class EntityMention(BaseModel):
    text: str
    label: str
    confidence: float
    start: int
    end: int


class NLPAnalysisResponse(BaseModel):
    text: str
    entities: List[EntityMention]
    sentiment: Optional[Dict[str, float]] = None
    domain: Optional[str] = None
    domain_confidence: Optional[float] = None
    key_events: Optional[List[str]] = None
    risk_signals: Optional[List[str]] = None
    processing_time_ms: float


# --- Scenario Schemas ---
class ScenarioRequest(BaseModel):
    query: str = Field(..., min_length=10, max_length=1000)
    context_entities: Optional[List[str]] = None
    timeframe: Optional[str] = "12 months"
    india_focus: bool = True


class ScenarioMitigation(BaseModel):
    action: str
    priority: str
    timeframe: str
    stakeholders: List[str]


class ScenarioResponse(BaseModel):
    id: str
    title: str
    probability: float = Field(ge=0, le=100)
    timeframe: str
    impact: SeverityEnum
    affected_domains: List[DomainEnum]
    key_actors: List[str]
    description: str
    mitigations: List[str]
    early_warning_signals: List[str]
    india_strategic_assessment: Optional[str] = None
    confidence: float = Field(ge=0, le=100)
    generated_at: str


# --- Shadow Ontology Schemas ---
class ShadowSignalResponse(BaseModel):
    id: str
    entity: str
    official_narrative: str
    ground_reality: str
    dissonance_score: float = Field(ge=0, le=100)
    domain: DomainEnum
    detected_at: str
    confidence: float = Field(ge=0, le=100)
    evidence_sources: Optional[List[str]] = None


class ShadowOntologyResponse(BaseModel):
    signals: List[ShadowSignalResponse]
    average_dissonance: float
    high_dissonance_count: int
    domains_affected: List[str]


# --- Risk Schemas ---
class RegionalRiskResponse(BaseModel):
    region: str
    country: Optional[str] = None
    risk_score: float = Field(ge=0, le=100)
    domains: Dict[str, float]
    trend: str
    active_alerts: int
    assessment: Optional[str] = None


class GlobalRiskResponse(BaseModel):
    regions: List[RegionalRiskResponse]
    global_average: float
    critical_count: int
    escalating_count: int
    last_updated: str
