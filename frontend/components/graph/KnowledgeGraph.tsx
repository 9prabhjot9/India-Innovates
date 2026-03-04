"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as d3 from "d3";
import { motion, AnimatePresence } from "framer-motion";
import { ZoomIn, ZoomOut, RotateCcw, Filter, Search, X, Info, Globe2 } from "lucide-react";
import { GRAPH_NODES, GRAPH_EDGES } from "@/lib/mock-data";
import { NODE_COLORS, EDGE_COLORS, getRiskColor } from "@/lib/utils";
import type { GraphNode, GraphEdge, NodeType, EdgeType } from "@/types";

const NODE_TYPE_LABELS: Record<NodeType, string> = {
  country: "Country",
  organization: "Organization",
  resource: "Resource",
  event: "Event / Crisis",
  technology: "Technology",
  actor: "Actor",
};

interface SelectedNode extends GraphNode {
  connectedEdges: GraphEdge[];
  neighbors: GraphNode[];
}

export default function KnowledgeGraph() {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<SelectedNode | null>(null);
  const [filterType, setFilterType] = useState<NodeType | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<GraphNode[]>([]);
  const [showLegend, setShowLegend] = useState(true);
  const simulationRef = useRef<d3.Simulation<GraphNode, GraphEdge> | null>(null);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  const handleNodeClick = useCallback((node: GraphNode) => {
    const connectedEdges = GRAPH_EDGES.filter(
      (e) =>
        (typeof e.source === "string" ? e.source : (e.source as GraphNode).id) === node.id ||
        (typeof e.target === "string" ? e.target : (e.target as GraphNode).id) === node.id
    );
    const neighborIds = new Set<string>();
    connectedEdges.forEach((e) => {
      const srcId = typeof e.source === "string" ? e.source : (e.source as GraphNode).id;
      const tgtId = typeof e.target === "string" ? e.target : (e.target as GraphNode).id;
      if (srcId !== node.id) neighborIds.add(srcId);
      if (tgtId !== node.id) neighborIds.add(tgtId);
    });
    const neighbors = GRAPH_NODES.filter((n) => neighborIds.has(n.id));
    setSelectedNode({ ...node, connectedEdges, neighbors });
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    const q = searchQuery.toLowerCase();
    setSearchResults(GRAPH_NODES.filter((n) => n.label.toLowerCase().includes(q) || n.id.toLowerCase().includes(q)).slice(0, 6));
  }, [searchQuery]);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    svg.attr("width", width).attr("height", height);

    // Zoom
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.2, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });
    zoomRef.current = zoom;
    svg.call(zoom);

    const g = svg.append("g");

    // Defs: markers for arrows, filters
    const defs = svg.append("defs");

    // Glow filter
    const filter = defs.append("filter").attr("id", "glow");
    filter.append("feGaussianBlur").attr("stdDeviation", "3").attr("result", "coloredBlur");
    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "coloredBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    // Arrow markers
    const edgeTypes: EdgeType[] = ["trade", "alliance", "conflict", "dependency", "sanction", "information", "rivalry"];
    edgeTypes.forEach((type) => {
      defs.append("marker")
        .attr("id", `arrow-${type}`)
        .attr("viewBox", "0 -4 8 8")
        .attr("refX", 18)
        .attr("refY", 0)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M0,-4L8,0L0,4")
        .attr("fill", EDGE_COLORS[type])
        .attr("opacity", 0.7);
    });

    // Filter nodes by type
    const filteredNodes = filterType === "all"
      ? [...GRAPH_NODES]
      : GRAPH_NODES.filter((n) => n.type === filterType);
    const filteredNodeIds = new Set(filteredNodes.map((n) => n.id));
    const filteredEdges = GRAPH_EDGES.filter((e) => {
      const srcId = typeof e.source === "string" ? e.source : (e.source as GraphNode).id;
      const tgtId = typeof e.target === "string" ? e.target : (e.target as GraphNode).id;
      return filteredNodeIds.has(srcId) && filteredNodeIds.has(tgtId);
    });

    // Clone data to avoid mutation
    const nodes: GraphNode[] = filteredNodes.map((n) => ({ ...n }));
    const edges: GraphEdge[] = filteredEdges.map((e) => ({ ...e }));

    // Force simulation
    const simulation = d3.forceSimulation<GraphNode>(nodes)
      .force("link", d3.forceLink<GraphNode, GraphEdge>(edges).id((d) => d.id).distance((e) => 80 + (100 - e.weight) * 0.8).strength(0.5))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius((d) => getNodeRadius(d as GraphNode) + 12));

    simulationRef.current = simulation;

    // Edges
    const link = g.append("g")
      .selectAll<SVGLineElement, GraphEdge>("line")
      .data(edges)
      .enter()
      .append("line")
      .attr("stroke", (d) => EDGE_COLORS[d.type])
      .attr("stroke-opacity", 0.5)
      .attr("stroke-width", (d) => 0.5 + d.weight / 50)
      .attr("stroke-dasharray", (d) => d.type === "sanction" ? "4,3" : d.type === "information" ? "2,2" : null)
      .attr("marker-end", (d) => `url(#arrow-${d.type})`);

    // Edge labels (for high-weight edges only)
    const linkLabel = g.append("g")
      .selectAll<SVGTextElement, GraphEdge>("text")
      .data(edges.filter((e) => e.weight > 75))
      .enter()
      .append("text")
      .attr("font-size", 7)
      .attr("fill", (d) => EDGE_COLORS[d.type])
      .attr("opacity", 0.6)
      .attr("text-anchor", "middle")
      .text((d) => d.label || "");

    // Node groups
    const node = g.append("g")
      .selectAll<SVGGElement, GraphNode>("g")
      .data(nodes)
      .enter()
      .append("g")
      .attr("cursor", "pointer")
      .call(
        d3.drag<SVGGElement, GraphNode>()
          .on("start", (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on("end", (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      )
      .on("click", (_, d) => handleNodeClick(d));

    // Outer glow ring for high-risk nodes
    node.filter((d) => d.risk >= 70)
      .append("circle")
      .attr("r", (d) => getNodeRadius(d) + 6)
      .attr("fill", "none")
      .attr("stroke", (d) => getRiskColor(d.risk))
      .attr("stroke-width", 1)
      .attr("stroke-opacity", 0.3)
      .attr("filter", "url(#glow)");

    // Main node circle
    node.append("circle")
      .attr("r", getNodeRadius)
      .attr("fill", (d) => `${NODE_COLORS[d.type]}18`)
      .attr("stroke", (d) => NODE_COLORS[d.type])
      .attr("stroke-width", (d) => d.risk >= 70 ? 2 : 1.5)
      .attr("filter", (d) => d.influence >= 80 ? "url(#glow)" : null);

    // Risk fill arc
    node.append("circle")
      .attr("r", (d) => getNodeRadius(d) * 0.5)
      .attr("fill", (d) => getRiskColor(d.risk))
      .attr("opacity", (d) => 0.15 + (d.risk / 100) * 0.25);

    // Node labels
    node.append("text")
      .attr("dy", (d) => getNodeRadius(d) + 11)
      .attr("text-anchor", "middle")
      .attr("font-size", (d) => d.influence >= 80 ? 9 : 8)
      .attr("fill", (d) => NODE_COLORS[d.type])
      .attr("opacity", 0.85)
      .text((d) => d.label);

    // Risk label
    node.filter((d) => d.risk >= 75)
      .append("text")
      .attr("dy", (d) => -(getNodeRadius(d) + 4))
      .attr("text-anchor", "middle")
      .attr("font-size", 7)
      .attr("fill", (d) => getRiskColor(d.risk))
      .attr("opacity", 0.8)
      .text((d) => `⚠ ${d.risk}`);

    // Tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d) => (d.source as GraphNode).x ?? 0)
        .attr("y1", (d) => (d.source as GraphNode).y ?? 0)
        .attr("x2", (d) => (d.target as GraphNode).x ?? 0)
        .attr("y2", (d) => (d.target as GraphNode).y ?? 0);

      linkLabel
        .attr("x", (d) => (((d.source as GraphNode).x ?? 0) + ((d.target as GraphNode).x ?? 0)) / 2)
        .attr("y", (d) => (((d.source as GraphNode).y ?? 0) + ((d.target as GraphNode).y ?? 0)) / 2);

      node.attr("transform", (d) => `translate(${d.x ?? 0},${d.y ?? 0})`);
    });

    // Fit to view after settling
    setTimeout(() => {
      svg.transition().duration(800).call(zoom.transform, d3.zoomIdentity.translate(width / 2, height / 2).scale(0.85).translate(-width / 2, -height / 2));
    }, 800);

    return () => {
      simulation.stop();
    };
  }, [filterType, handleNodeClick]);

  function getNodeRadius(d: GraphNode): number {
    return 6 + (d.influence / 100) * 14;
  }

  const handleZoom = (direction: "in" | "out" | "reset") => {
    if (!svgRef.current || !zoomRef.current) return;
    const svg = d3.select(svgRef.current);
    if (direction === "reset") {
      svg.transition().duration(500).call(zoomRef.current.transform, d3.zoomIdentity);
    } else {
      svg.transition().duration(300).call(direction === "in" ? zoomRef.current.scaleBy : zoomRef.current.scaleBy, direction === "in" ? 1.5 : 0.67);
    }
  };

  const NODE_TYPES: (NodeType | "all")[] = ["all", "country", "organization", "resource", "event", "technology"];

  return (
    <div className="relative w-full h-full flex flex-col bg-[#070b14]">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-card/50">
        <div className="flex items-center gap-1.5">
          <Globe2 size={14} className="text-primary" />
          <span className="font-mono text-xs font-bold text-foreground/80">GLOBAL KNOWLEDGE GRAPH</span>
          <span className="font-mono text-[10px] text-muted-foreground/60 ml-2">
            {GRAPH_NODES.length} nodes · {GRAPH_EDGES.length} edges
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search size={11} className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
            <input
              type="text"
              placeholder="Search entities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-6 pr-2 py-1 text-xs bg-muted/30 border border-border rounded focus:outline-none focus:border-primary/40 text-foreground placeholder:text-muted-foreground/40 w-36"
            />
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-card border border-border rounded shadow-xl z-20">
                {searchResults.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => { handleNodeClick(n); setSearchQuery(""); setSearchResults([]); }}
                    className="w-full px-2 py-1.5 text-xs text-left hover:bg-muted/40 flex items-center gap-2"
                  >
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: NODE_COLORS[n.type] }} />
                    <span className="text-foreground/80">{n.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Zoom controls */}
          <div className="flex items-center gap-0.5">
            <button onClick={() => handleZoom("in")} className="p-1 rounded hover:bg-muted/40 text-muted-foreground hover:text-foreground transition-colors">
              <ZoomIn size={12} />
            </button>
            <button onClick={() => handleZoom("out")} className="p-1 rounded hover:bg-muted/40 text-muted-foreground hover:text-foreground transition-colors">
              <ZoomOut size={12} />
            </button>
            <button onClick={() => handleZoom("reset")} className="p-1 rounded hover:bg-muted/40 text-muted-foreground hover:text-foreground transition-colors">
              <RotateCcw size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-1 px-3 py-1.5 border-b border-border bg-card/30 overflow-x-auto">
        <Filter size={10} className="text-muted-foreground/60 shrink-0" />
        {NODE_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all shrink-0 ${
              filterType === type
                ? "bg-primary/20 text-primary border border-primary/30"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/30 border border-transparent"
            }`}
          >
            {type === "all" ? "ALL" : NODE_TYPE_LABELS[type].toUpperCase()}
          </button>
        ))}
      </div>

      {/* Graph canvas */}
      <div ref={containerRef} className="flex-1 relative overflow-hidden">
        <svg ref={svgRef} className="w-full h-full" />

        {/* Legend */}
        <AnimatePresence>
          {showLegend && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute top-3 right-3 bg-card/90 backdrop-blur-sm border border-border rounded p-3 text-[10px]"
            >
              <div className="font-mono text-muted-foreground/60 mb-2 uppercase tracking-wider">Node Types</div>
              {(Object.entries(NODE_COLORS) as [NodeType, string][]).map(([type, color]) => (
                <div key={type} className="flex items-center gap-1.5 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full border" style={{ borderColor: color, background: `${color}20` }} />
                  <span className="text-muted-foreground/70">{NODE_TYPE_LABELS[type]}</span>
                </div>
              ))}
              <div className="font-mono text-muted-foreground/60 mb-2 mt-3 uppercase tracking-wider">Edges</div>
              {(["alliance", "trade", "conflict", "rivalry", "sanction"] as EdgeType[]).map((type) => (
                <div key={type} className="flex items-center gap-1.5 mb-1">
                  <span className="w-4 h-0.5 rounded" style={{ background: EDGE_COLORS[type] }} />
                  <span className="text-muted-foreground/70 capitalize">{type}</span>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setShowLegend(!showLegend)}
          className="absolute top-3 left-3 p-1.5 rounded bg-card/80 border border-border hover:border-primary/40 text-muted-foreground hover:text-primary transition-all"
        >
          <Info size={12} />
        </button>
      </div>

      {/* Selected Node Panel */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="absolute right-0 top-0 bottom-0 w-72 bg-[#0a0f1e]/95 backdrop-blur-sm border-l border-border overflow-y-auto"
          >
            <div className="p-4">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="font-mono text-[10px] text-muted-foreground/60 uppercase tracking-wider mb-1">
                    {NODE_TYPE_LABELS[selectedNode.type]}
                  </div>
                  <h3 className="text-base font-bold" style={{ color: NODE_COLORS[selectedNode.type] }}>
                    {selectedNode.label}
                  </h3>
                </div>
                <button onClick={() => setSelectedNode(null)} className="p-1 rounded hover:bg-muted/40 text-muted-foreground transition-colors">
                  <X size={14} />
                </button>
              </div>

              {selectedNode.description && (
                <p className="text-xs text-muted-foreground/80 leading-relaxed mb-4 border-l-2 pl-2" style={{ borderColor: NODE_COLORS[selectedNode.type] }}>
                  {selectedNode.description}
                </p>
              )}

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="p-2 rounded bg-muted/20 border border-border">
                  <div className="text-[10px] text-muted-foreground/60 mb-1">Risk Score</div>
                  <div className="text-lg font-bold font-mono" style={{ color: getRiskColor(selectedNode.risk) }}>
                    {selectedNode.risk}
                  </div>
                  <div className="h-1 bg-muted rounded-full mt-1">
                    <div className="h-full rounded-full" style={{ width: `${selectedNode.risk}%`, background: getRiskColor(selectedNode.risk) }} />
                  </div>
                </div>
                <div className="p-2 rounded bg-muted/20 border border-border">
                  <div className="text-[10px] text-muted-foreground/60 mb-1">Influence</div>
                  <div className="text-lg font-bold font-mono text-primary">
                    {selectedNode.influence}
                  </div>
                  <div className="h-1 bg-muted rounded-full mt-1">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${selectedNode.influence}%` }} />
                  </div>
                </div>
              </div>

              {/* Connections */}
              <div className="mb-4">
                <div className="font-mono text-[10px] text-muted-foreground/60 uppercase tracking-wider mb-2">
                  Connections ({selectedNode.connectedEdges.length})
                </div>
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {selectedNode.neighbors.map((neighbor) => {
                    const edge = selectedNode.connectedEdges.find((e) => {
                      const srcId = typeof e.source === "string" ? e.source : (e.source as GraphNode).id;
                      const tgtId = typeof e.target === "string" ? e.target : (e.target as GraphNode).id;
                      return srcId === neighbor.id || tgtId === neighbor.id;
                    });
                    return (
                      <button
                        key={neighbor.id}
                        onClick={() => handleNodeClick(neighbor)}
                        className="w-full flex items-center gap-2 p-1.5 rounded hover:bg-muted/30 transition-colors text-left"
                      >
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ background: NODE_COLORS[neighbor.type] }} />
                        <span className="text-xs text-foreground/80 flex-1 truncate">{neighbor.label}</span>
                        {edge && (
                          <span className="text-[9px] px-1 rounded" style={{ color: EDGE_COLORS[edge.type], background: `${EDGE_COLORS[edge.type]}15` }}>
                            {edge.type}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Edge breakdown */}
              {selectedNode.connectedEdges.length > 0 && (
                <div>
                  <div className="font-mono text-[10px] text-muted-foreground/60 uppercase tracking-wider mb-2">
                    Relationship Types
                  </div>
                  {Object.entries(
                    selectedNode.connectedEdges.reduce((acc, e) => {
                      acc[e.type] = (acc[e.type] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>)
                  ).map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: EDGE_COLORS[type as EdgeType] }} />
                        <span className="text-[10px] text-muted-foreground/70 capitalize">{type}</span>
                      </div>
                      <span className="text-[10px] font-mono text-foreground/60">{count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
