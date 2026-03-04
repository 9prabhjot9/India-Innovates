"use client";

import { useState, useCallback, Suspense, lazy } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import SDIPanel from "@/components/panels/SDIPanel";
import IntelligenceFeed from "@/components/panels/IntelligenceFeed";
import RiskMatrix from "@/components/panels/RiskMatrix";
import ShadowOntology from "@/components/panels/ShadowOntology";
import ScenarioEngine from "@/components/panels/ScenarioEngine";
import EntityExplorer from "@/components/panels/EntityExplorer";
import { Brain, Activity, Zap, AlertTriangle, Layers, Globe2, Network } from "lucide-react";

// D3 graph must be client-side only
const KnowledgeGraph = dynamic(() => import("@/components/graph/KnowledgeGraph"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-[#070b14]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        <span className="font-mono text-xs text-muted-foreground/60">LOADING KNOWLEDGE GRAPH...</span>
      </div>
    </div>
  ),
});

const PANEL_TITLES: Record<string, { title: string; subtitle: string; icon: React.ElementType; color: string }> = {
  graph: { title: "Global Knowledge Graph", subtitle: "Entity-relationship intelligence map", icon: Network, color: "#00d4ff" },
  sdi: { title: "Strategic Dissonance Index", subtitle: "Narrative vs reality quantification", icon: Activity, color: "#f59e0b" },
  feed: { title: "Intelligence Feed", subtitle: "Real-time geopolitical signal stream", icon: Zap, color: "#ec4899" },
  risk: { title: "Regional Risk Matrix", subtitle: "Threat assessment by geography", icon: AlertTriangle, color: "#ef4444" },
  shadow: { title: "Shadow Ontology Layer", subtitle: "Dual-graph misinformation detector", icon: Layers, color: "#7c3aed" },
  scenario: { title: "Recursive Strategy Engine", subtitle: "LLM-powered scenario modeling", icon: Brain, color: "#10b981" },
  entity: { title: "Entity Intelligence Explorer", subtitle: "Deep-dive profile analysis", icon: Globe2, color: "#00d4ff" },
};

// Top metrics bar
const TOP_METRICS = [
  { label: "Global SDI", value: "67", unit: "/100", color: "#f59e0b", trend: "↑ +3" },
  { label: "Active Crises", value: "14", unit: "", color: "#ef4444", trend: "↑ +2" },
  { label: "Tracked Entities", value: "27,841", unit: "", color: "#00d4ff", trend: "stable" },
  { label: "Data Sources Live", value: "2,412", unit: "", color: "#10b981", trend: "↑ +8" },
  { label: "Graph Edges", value: "184,293", unit: "", color: "#7c3aed", trend: "↑ +512" },
  { label: "High-Risk Regions", value: "6", unit: "", color: "#ef4444", trend: "↑ +1" },
];

export default function DashboardPage() {
  const [activePanel, setActivePanel] = useState("graph");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  }, []);

  const panelInfo = PANEL_TITLES[activePanel];

  const renderPanel = () => {
    switch (activePanel) {
      case "graph": return <KnowledgeGraph />;
      case "sdi": return <SDIPanel />;
      case "feed": return <IntelligenceFeed />;
      case "risk": return <RiskMatrix />;
      case "shadow": return <ShadowOntology />;
      case "scenario": return <ScenarioEngine />;
      case "entity": return <EntityExplorer />;
      default: return <KnowledgeGraph />;
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#070b14]">
      <Navbar alertCount={14} onRefresh={handleRefresh} isRefreshing={isRefreshing} />

      {/* Top metrics ticker */}
      <div className="flex items-center gap-0 bg-[#0a0f1e]/80 border-b border-border overflow-x-auto shrink-0">
        {TOP_METRICS.map((metric, i) => (
          <div
            key={metric.label}
            className={`flex items-center gap-3 px-4 py-2 shrink-0 ${i < TOP_METRICS.length - 1 ? "border-r border-border" : ""}`}
          >
            <div>
              <div className="font-mono text-[9px] text-muted-foreground/50 uppercase tracking-wider">{metric.label}</div>
              <div className="flex items-baseline gap-1">
                <span className="font-mono text-sm font-bold" style={{ color: metric.color }}>{metric.value}</span>
                {metric.unit && <span className="font-mono text-[10px] text-muted-foreground/50">{metric.unit}</span>}
              </div>
            </div>
            <span
              className="font-mono text-[9px] px-1 rounded"
              style={{
                color: metric.trend.startsWith("↑") ? "#ef4444" : metric.trend.startsWith("↓") ? "#10b981" : "#8892a4",
                background: metric.trend.startsWith("↑") ? "rgba(239,68,68,0.1)" : metric.trend.startsWith("↓") ? "rgba(16,185,129,0.1)" : "transparent",
              }}
            >
              {metric.trend}
            </span>
          </div>
        ))}
      </div>

      {/* Main layout: Sidebar + Content */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activePanel={activePanel} onPanelChange={setActivePanel} />

        {/* Main content area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Panel header */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-card/30 shrink-0">
            <div className="flex items-center gap-2">
              {panelInfo && (
                <>
                  <panelInfo.icon size={14} style={{ color: panelInfo.color }} />
                  <span className="text-sm font-semibold text-foreground/90">{panelInfo.title}</span>
                  <span className="text-xs text-muted-foreground/50">/</span>
                  <span className="text-xs text-muted-foreground/60">{panelInfo.subtitle}</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-3 text-[10px] font-mono text-muted-foreground/50">
              <span className="flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-green-400 animate-pulse" />
                LIVE
              </span>
              <span>CHANAKYA GOE v2.4.1</span>
            </div>
          </div>

          {/* Panel content */}
          <div className="flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activePanel}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                {renderPanel()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
