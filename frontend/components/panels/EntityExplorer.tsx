"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe2, Search, TrendingUp, TrendingDown, Minus, ArrowRight, Clock, AlertTriangle } from "lucide-react";
import { GRAPH_NODES } from "@/lib/mock-data";
import { ENTITY_DETAILS } from "@/lib/mock-data";
import { NODE_COLORS, getRiskColor, SEVERITY_COLORS, formatTimestamp } from "@/lib/utils";
import type { GraphNode, NodeType } from "@/types";

const NODE_TYPE_LABELS: Record<NodeType, string> = {
  country: "Country",
  organization: "Organization",
  resource: "Resource",
  event: "Event",
  technology: "Technology",
  actor: "Actor",
};

function EntityCard({ node, onClick, isSelected }: { node: GraphNode; onClick: () => void; isSelected: boolean }) {
  const color = NODE_COLORS[node.type];
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2 rounded transition-all flex items-center gap-2.5 ${
        isSelected ? "bg-primary/10 border border-primary/20" : "hover:bg-muted/30 border border-transparent"
      }`}
    >
      <div className="w-6 h-6 rounded shrink-0 flex items-center justify-center" style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
        <span className="text-[9px] font-mono font-bold" style={{ color }}>{node.id.slice(0, 3)}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-medium text-foreground/80 truncate">{node.label}</div>
        <div className="text-[9px] text-muted-foreground/50 capitalize">{NODE_TYPE_LABELS[node.type]}</div>
      </div>
      <div className="flex flex-col items-end gap-0.5 shrink-0">
        <span className="text-[10px] font-mono" style={{ color: getRiskColor(node.risk) }}>{node.risk}</span>
        <div className="w-8 h-0.5 bg-muted rounded-full overflow-hidden">
          <div className="h-full rounded-full" style={{ width: `${node.risk}%`, background: getRiskColor(node.risk) }} />
        </div>
      </div>
    </button>
  );
}

export default function EntityExplorer() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<NodeType | "all">("all");
  const [selectedId, setSelectedId] = useState<string>("IND");

  const filtered = GRAPH_NODES.filter((n) => {
    if (typeFilter !== "all" && n.type !== typeFilter) return false;
    if (search && !n.label.toLowerCase().includes(search.toLowerCase()) && !n.id.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }).sort((a, b) => b.risk - a.risk);

  const detail = selectedId ? ENTITY_DETAILS[selectedId] : null;
  const selectedNode = GRAPH_NODES.find((n) => n.id === selectedId);

  const nodeTypes: (NodeType | "all")[] = ["all", "country", "organization", "resource", "technology", "event"];

  return (
    <div className="flex h-full">
      {/* Left: entity list */}
      <div className="w-64 shrink-0 flex flex-col border-r border-border">
        <div className="p-3 border-b border-border">
          <div className="flex items-center gap-2 mb-2">
            <Globe2 size={12} className="text-primary" />
            <span className="font-mono text-xs font-bold text-foreground/80">ENTITY EXPLORER</span>
          </div>
          <div className="relative">
            <Search size={10} className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground/40" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search entities..."
              className="w-full pl-5 pr-2 py-1.5 text-[11px] bg-muted/20 border border-border rounded focus:outline-none focus:border-primary/30 placeholder:text-muted-foreground/30"
            />
          </div>
        </div>

        {/* Type filter */}
        <div className="px-2 py-1.5 border-b border-border flex flex-wrap gap-0.5">
          {nodeTypes.map((type) => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`px-1.5 py-0.5 rounded text-[9px] font-mono transition-all ${
                typeFilter === type ? "bg-primary/20 text-primary" : "text-muted-foreground/60 hover:text-foreground"
              }`}
            >
              {type === "all" ? "ALL" : type.toUpperCase().slice(0, 4)}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto py-1">
          <div className="space-y-0.5 px-1">
            {filtered.map((node) => (
              <EntityCard
                key={node.id}
                node={node}
                isSelected={selectedId === node.id}
                onClick={() => setSelectedId(node.id)}
              />
            ))}
          </div>
        </div>

        <div className="p-2 border-t border-border text-center">
          <span className="font-mono text-[9px] text-muted-foreground/40">{filtered.length} entities</span>
        </div>
      </div>

      {/* Right: entity detail */}
      <div className="flex-1 overflow-y-auto">
        {selectedNode && (
          <div className="p-4">
            {/* Entity header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="font-mono text-[10px] text-muted-foreground/60 uppercase tracking-wider mb-1">
                  {NODE_TYPE_LABELS[selectedNode.type]}
                </div>
                <h2 className="text-xl font-bold mb-1" style={{ color: NODE_COLORS[selectedNode.type] }}>
                  {selectedNode.label}
                </h2>
                {selectedNode.description && (
                  <p className="text-xs text-muted-foreground/70 leading-relaxed max-w-lg">{selectedNode.description}</p>
                )}
              </div>
              <div className="shrink-0 w-16 h-16 rounded border flex items-center justify-center" style={{ borderColor: `${NODE_COLORS[selectedNode.type]}40`, background: `${NODE_COLORS[selectedNode.type]}10` }}>
                <span className="font-mono text-lg font-bold" style={{ color: NODE_COLORS[selectedNode.type] }}>{selectedNode.id}</span>
              </div>
            </div>

            {/* Key metrics */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 rounded border border-border bg-card">
                <div className="text-[10px] text-muted-foreground/60 mb-1">Risk Score</div>
                <div className="text-2xl font-bold font-mono mb-1" style={{ color: getRiskColor(selectedNode.risk) }}>
                  {selectedNode.risk}
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${selectedNode.risk}%`, background: getRiskColor(selectedNode.risk) }} />
                </div>
              </div>
              <div className="p-3 rounded border border-border bg-card">
                <div className="text-[10px] text-muted-foreground/60 mb-1">Global Influence</div>
                <div className="text-2xl font-bold font-mono text-primary mb-1">{selectedNode.influence}</div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${selectedNode.influence}%` }} />
                </div>
              </div>
            </div>

            {/* Full entity detail if available */}
            {detail ? (
              <>
                {/* Metrics grid */}
                <div className="mb-4">
                  <div className="font-mono text-[10px] text-muted-foreground/60 uppercase tracking-wider mb-2">Key Indicators</div>
                  <div className="grid grid-cols-3 gap-2">
                    {detail.metrics.map((m) => (
                      <div key={m.label} className="p-2 rounded bg-muted/20 border border-border">
                        <div className="text-[9px] text-muted-foreground/50 mb-0.5">{m.label}</div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-bold text-foreground/80">{m.value}</span>
                          {m.trend && (
                            <span className="text-[10px]" style={{ color: m.trend === "up" ? "#10b981" : m.trend === "down" ? "#ef4444" : "#8892a4" }}>
                              {m.trend === "up" ? "↑" : m.trend === "down" ? "↓" : "→"}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Related entities */}
                <div className="mb-4">
                  <div className="font-mono text-[10px] text-muted-foreground/60 uppercase tracking-wider mb-2">
                    Key Relations ({detail.relatedEntities.length})
                  </div>
                  <div className="space-y-1.5">
                    {detail.relatedEntities.map((rel) => (
                      <button
                        key={rel.id}
                        onClick={() => setSelectedId(rel.id)}
                        className="w-full flex items-center gap-2 p-2 rounded hover:bg-muted/20 border border-border hover:border-border/80 transition-all text-left"
                      >
                        <span className="font-mono text-[10px] text-primary/80 w-10 shrink-0">{rel.id}</span>
                        <span className="text-xs text-foreground/70 flex-1 truncate">{rel.name}</span>
                        <span className="text-[9px] text-muted-foreground/50">{rel.relation}</span>
                        <div className="w-12 h-0.5 bg-muted rounded overflow-hidden">
                          <div className="h-full bg-primary/50 rounded" style={{ width: `${rel.weight}%` }} />
                        </div>
                        <ArrowRight size={10} className="text-muted-foreground/30 shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Timeline */}
                <div>
                  <div className="font-mono text-[10px] text-muted-foreground/60 uppercase tracking-wider mb-2">
                    Recent Timeline
                  </div>
                  <div className="relative pl-4 border-l border-border space-y-3">
                    {detail.timeline.map((event, i) => (
                      <div key={i} className="relative">
                        <div
                          className="absolute -left-5 top-1 w-2.5 h-2.5 rounded-full border-2 border-card"
                          style={{ background: SEVERITY_COLORS[event.impact] }}
                        />
                        <div className="font-mono text-[9px] text-muted-foreground/50 mb-0.5">{event.date}</div>
                        <div className="text-xs text-foreground/80">{event.event}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="p-4 rounded border border-border bg-muted/10 text-xs text-muted-foreground/60 font-mono text-center">
                Detailed profile not available for this entity.
                <br />
                <span className="text-[10px] opacity-60">Select a high-priority entity for full intelligence profile.</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
