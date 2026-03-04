"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Network, Activity, AlertTriangle, Brain, Layers,
  Globe2, Shield, TrendingUp, Database, Settings,
  ChevronLeft, ChevronRight, Map, Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activePanel: string;
  onPanelChange: (panel: string) => void;
}

const NAV_ITEMS = [
  {
    id: "graph",
    label: "Knowledge Graph",
    icon: Network,
    color: "#00d4ff",
    description: "Entity-relationship mapping",
  },
  {
    id: "sdi",
    label: "Dissonance Index",
    icon: Activity,
    color: "#f59e0b",
    description: "Narrative vs reality gap",
    badge: "SDI",
  },
  {
    id: "feed",
    label: "Intelligence Feed",
    icon: Zap,
    color: "#ec4899",
    description: "Live geopolitical signals",
  },
  {
    id: "risk",
    label: "Risk Matrix",
    icon: AlertTriangle,
    color: "#ef4444",
    description: "Regional threat assessment",
  },
  {
    id: "shadow",
    label: "Shadow Ontology",
    icon: Layers,
    color: "#7c3aed",
    description: "Dual-graph narrative detector",
  },
  {
    id: "scenario",
    label: "Scenario Engine",
    icon: Brain,
    color: "#10b981",
    description: "LLM strategic projections",
  },
  {
    id: "entity",
    label: "Entity Explorer",
    icon: Globe2,
    color: "#00d4ff",
    description: "Deep-dive entity profiles",
  },
];

const DOMAIN_INDICATORS = [
  { domain: "Geopolitics", value: 74, color: "#00d4ff" },
  { domain: "Defense", value: 81, color: "#ef4444" },
  { domain: "Economics", value: 58, color: "#10b981" },
  { domain: "Technology", value: 65, color: "#7c3aed" },
  { domain: "Climate", value: 42, color: "#22c55e" },
  { domain: "Society", value: 53, color: "#f59e0b" },
];

export default function Sidebar({ activePanel, onPanelChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 52 : 220 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="shrink-0 flex flex-col bg-[#0a0f1e] border-r border-border overflow-hidden relative"
    >
      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-5 z-10 w-6 h-6 rounded-full bg-card border border-border flex items-center justify-center hover:border-primary/40 transition-all"
      >
        {collapsed ? <ChevronRight size={10} className="text-muted-foreground" /> : <ChevronLeft size={10} className="text-muted-foreground" />}
      </button>

      {/* Navigation */}
      <nav className="flex-1 pt-2 pb-4 overflow-y-auto overflow-x-hidden">
        {!collapsed && (
          <div className="px-3 py-2">
            <span className="font-mono text-[9px] text-muted-foreground/50 tracking-widest uppercase">
              Intelligence Modules
            </span>
          </div>
        )}

        <div className="space-y-0.5 px-1.5">
          {NAV_ITEMS.map((item) => {
            const isActive = activePanel === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onPanelChange(item.id)}
                className={cn(
                  "w-full flex items-center gap-2.5 px-2.5 py-2 rounded text-left transition-all group relative",
                  isActive
                    ? "bg-primary/10 border border-primary/20"
                    : "hover:bg-muted/40 border border-transparent"
                )}
                title={collapsed ? item.label : undefined}
              >
                <div
                  className="shrink-0 w-6 h-6 rounded flex items-center justify-center"
                  style={{
                    background: isActive ? `${item.color}20` : "transparent",
                  }}
                >
                  <item.icon
                    size={13}
                    style={{ color: isActive ? item.color : undefined }}
                    className={!isActive ? "text-muted-foreground group-hover:text-foreground/80" : ""}
                  />
                </div>

                <AnimatePresence>
                  {!collapsed && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="flex-1 min-w-0"
                    >
                      <div className={cn("text-xs font-medium leading-none mb-0.5 truncate", isActive ? "text-foreground" : "text-foreground/70")}>
                        {item.label}
                      </div>
                      <div className="text-[10px] text-muted-foreground/50 truncate leading-none">
                        {item.description}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {isActive && (
                  <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-full"
                    style={{ background: item.color }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* SDI Domain indicators */}
        {!collapsed && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-4 mx-3 p-3 rounded border border-border bg-card/50"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-[9px] text-muted-foreground/60 tracking-widest uppercase">
                  SDI by Domain
                </span>
                <span className="font-mono text-[9px] text-accent">LIVE</span>
              </div>
              <div className="space-y-2">
                {DOMAIN_INDICATORS.map((d) => (
                  <div key={d.domain}>
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[10px] text-muted-foreground/70">{d.domain}</span>
                      <span className="text-[10px] font-mono" style={{ color: d.color }}>
                        {d.value}
                      </span>
                    </div>
                    <div className="h-0.5 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${d.value}%` }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="h-full rounded-full"
                        style={{ background: d.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </nav>

      {/* Bottom system info */}
      {!collapsed && (
        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-1.5 mb-1">
            <Database size={10} className="text-primary/60" />
            <span className="font-mono text-[9px] text-muted-foreground/50">Neo4j · PostgreSQL · Kafka</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-green-400 animate-pulse" />
            <span className="font-mono text-[9px] text-green-400/70">ALL PIPELINES ACTIVE</span>
          </div>
        </div>
      )}
    </motion.aside>
  );
}
