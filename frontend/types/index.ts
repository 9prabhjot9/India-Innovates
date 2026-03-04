export type Domain = 'geopolitics' | 'economics' | 'defense' | 'technology' | 'climate' | 'society';
export type Severity = 'critical' | 'high' | 'medium' | 'low';
export type NodeType = 'country' | 'organization' | 'resource' | 'event' | 'technology' | 'actor';
export type EdgeType = 'trade' | 'alliance' | 'conflict' | 'dependency' | 'sanction' | 'information' | 'rivalry';

export interface GraphNode {
  id: string;
  label: string;
  type: NodeType;
  risk: number; // 0-100
  influence: number; // 0-100
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
  vx?: number;
  vy?: number;
  description?: string;
  metadata?: Record<string, string | number | boolean>;
}

export interface GraphEdge {
  id: string;
  source: string | GraphNode;
  target: string | GraphNode;
  type: EdgeType;
  weight: number; // 0-100
  label?: string;
  active: boolean;
}

export interface SDIDomain {
  domain: Domain;
  score: number; // 0-100, higher = more dissonance
  trend: 'rising' | 'falling' | 'stable';
  anomalies: number;
  lastUpdate: string;
}

export interface SDIMetrics {
  overall: number;
  domains: SDIDomain[];
  alertCount: number;
  lastRecalculated: string;
}

export interface IntelligenceFeedItem {
  id: string;
  title: string;
  summary: string;
  domain: Domain;
  severity: Severity;
  source: string;
  timestamp: string;
  entities: string[];
  sdiImpact: number;
  verified: boolean;
  tags: string[];
}

export interface RiskIndicator {
  region: string;
  country?: string;
  riskScore: number;
  domains: Partial<Record<Domain, number>>;
  trend: 'escalating' | 'de-escalating' | 'stable';
  activeAlerts: number;
}

export interface ScenarioResult {
  id: string;
  title: string;
  probability: number;
  timeframe: string;
  impact: Severity;
  affectedDomains: Domain[];
  keyActors: string[];
  description: string;
  mitigations: string[];
  earlyWarningSignals: string[];
}

export interface EntityDetail {
  id: string;
  name: string;
  type: NodeType;
  description: string;
  riskScore: number;
  influenceScore: number;
  connections: number;
  relatedEntities: { id: string; name: string; relation: string; weight: number }[];
  timeline: { date: string; event: string; impact: Severity }[];
  metrics: { label: string; value: string | number; trend?: 'up' | 'down' | 'stable' }[];
}

export interface ShadowOntologySignal {
  id: string;
  entity: string;
  officialNarrative: string;
  groundReality: string;
  dissonanceScore: number;
  domain: Domain;
  detectedAt: string;
  confidence: number;
}

export interface ChronicleEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  domain: Domain;
  severity: Severity;
  relatedEntities: string[];
}
