"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Filter, Search, ChevronDown, ChevronUp, ExternalLink, Clock, Shield, CheckCircle, XCircle } from "lucide-react";
import { INTELLIGENCE_FEED } from "@/lib/mock-data";
import { DOMAIN_COLORS, DOMAIN_ICONS, SEVERITY_COLORS, formatTimestamp } from "@/lib/utils";
import type { Domain, Severity, IntelligenceFeedItem } from "@/types";

const SEVERITY_LABELS: Record<Severity, string> = {
  critical: "CRITICAL",
  high: "HIGH",
  medium: "MEDIUM",
  low: "LOW",
};

function FeedItem({ item, isNew }: { item: IntelligenceFeedItem; isNew?: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const domainColor = DOMAIN_COLORS[item.domain];
  const severityColor = SEVERITY_COLORS[item.severity];

  return (
    <motion.div
      layout
      initial={isNew ? { opacity: 0, x: -20, backgroundColor: "rgba(0,212,255,0.1)" } : { opacity: 1 }}
      animate={{ opacity: 1, x: 0, backgroundColor: "transparent" }}
      transition={{ duration: 0.4 }}
      className="border-b border-border last:border-0"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-3 hover:bg-muted/20 transition-colors"
      >
        <div className="flex items-start gap-2.5">
          {/* Severity indicator */}
          <div className="shrink-0 mt-0.5 flex flex-col items-center gap-1">
            <div
              className="w-2 h-2 rounded-full shrink-0"
              style={{
                background: severityColor,
                boxShadow: item.severity === "critical" ? `0 0 6px ${severityColor}` : undefined,
              }}
            />
            {item.severity === "critical" && (
              <div className="w-0.5 h-0.5 rounded-full bg-danger animate-pulse" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            {/* Title row */}
            <div className="flex items-start justify-between gap-2 mb-1">
              <h4 className="text-xs font-medium text-foreground/90 leading-tight">
                {item.title}
              </h4>
              <div className="flex items-center gap-1 shrink-0 mt-0.5">
                <span
                  className="text-[9px] font-mono px-1 py-0.5 rounded border"
                  style={{ color: severityColor, borderColor: `${severityColor}30`, background: `${severityColor}12` }}
                >
                  {SEVERITY_LABELS[item.severity]}
                </span>
              </div>
            </div>

            {/* Meta row */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="flex items-center gap-0.5 text-[10px]" style={{ color: domainColor }}>
                <span>{DOMAIN_ICONS[item.domain]}</span>
                <span className="capitalize">{item.domain}</span>
              </span>
              <span className="text-[10px] text-muted-foreground/50">·</span>
              <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground/60">
                <Clock size={8} />
                {formatTimestamp(item.timestamp)}
              </span>
              <span className="text-[10px] text-muted-foreground/50">·</span>
              {item.verified ? (
                <span className="flex items-center gap-0.5 text-[10px] text-green-400/70">
                  <CheckCircle size={8} />
                  Verified
                </span>
              ) : (
                <span className="flex items-center gap-0.5 text-[10px] text-amber-400/70">
                  <XCircle size={8} />
                  Unverified
                </span>
              )}
              <span className="text-[10px] text-muted-foreground/50">·</span>
              <span className="flex items-center gap-0.5 text-[10px]" style={{ color: item.sdiImpact >= 10 ? SEVERITY_COLORS.high : SEVERITY_COLORS.medium }}>
                <Shield size={8} />
                SDI +{item.sdiImpact}
              </span>
            </div>

            {/* Tags */}
            <div className="flex items-center gap-1 mt-1.5 flex-wrap">
              {item.entities.slice(0, 4).map((entity) => (
                <span key={entity} className="text-[9px] px-1.5 py-0.5 rounded bg-primary/10 text-primary/70 border border-primary/15 font-mono">
                  {entity}
                </span>
              ))}
            </div>
          </div>

          <div className="shrink-0 mt-1">
            {expanded ? <ChevronUp size={11} className="text-muted-foreground/40" /> : <ChevronDown size={11} className="text-muted-foreground/40" />}
          </div>
        </div>
      </button>

      {/* Expanded content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 ml-4 pl-3 border-l-2" style={{ borderColor: `${domainColor}30` }}>
              <p className="text-xs text-muted-foreground/80 leading-relaxed mb-2">
                {item.summary}
              </p>
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground/50">
                <span className="font-mono">SOURCE: {item.source}</span>
              </div>
              {item.tags.length > 0 && (
                <div className="flex items-center gap-1 mt-2 flex-wrap">
                  {item.tags.map((tag) => (
                    <span key={tag} className="text-[9px] px-1 rounded bg-muted/30 text-muted-foreground/50 font-mono">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function IntelligenceFeed() {
  const [feed, setFeed] = useState(INTELLIGENCE_FEED);
  const [filterDomain, setFilterDomain] = useState<Domain | "all">("all");
  const [filterSeverity, setFilterSeverity] = useState<Severity | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [newItemIds, setNewItemIds] = useState<Set<string>>(new Set());
  const [isPaused, setIsPaused] = useState(false);
  const feedRef = useRef<HTMLDivElement>(null);

  // Simulate real-time incoming intel
  useEffect(() => {
    if (isPaused) return;
    const NEW_ITEMS: IntelligenceFeedItem[] = [
      {
        id: `live-${Date.now()}`,
        title: "Israeli Air Force Conducts Strikes Near Damascus",
        summary: "Multiple strikes reported targeting suspected Iranian weapons transfers. Syrian air defense activates. Second strike wave detected.",
        domain: "defense",
        severity: "high",
        source: "OSINT / IDF Spokesperson",
        timestamp: new Date().toISOString(),
        entities: ["ISR", "IRN", "NATO"],
        sdiImpact: 9,
        verified: false,
        tags: ["middle-east", "airstrike", "iran"],
      },
      {
        id: `live-${Date.now() + 1}`,
        title: "India-US 2+2 Dialogue: Joint Cyber Defense Framework Announced",
        summary: "CISA and CERT-In sign bilateral cyber threat intelligence sharing MOU. Scope includes OT/ICS critical infrastructure.",
        domain: "technology",
        severity: "medium",
        source: "MEA Press Release",
        timestamp: new Date().toISOString(),
        entities: ["IND", "USA", "CYB"],
        sdiImpact: 4,
        verified: true,
        tags: ["cyber", "india-us", "diplomacy"],
      },
    ];

    const interval = setInterval(() => {
      const newItem = NEW_ITEMS[Math.floor(Math.random() * NEW_ITEMS.length)];
      const freshItem: IntelligenceFeedItem = {
        ...newItem,
        id: `live-${Date.now()}`,
        timestamp: new Date().toISOString(),
      };
      setFeed((prev) => [freshItem, ...prev.slice(0, 24)]);
      setNewItemIds((prev) => new Set([...prev, freshItem.id]));
      setTimeout(() => setNewItemIds((prev) => { const n = new Set(prev); n.delete(freshItem.id); return n; }), 3000);
    }, 18000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const filtered = feed.filter((item) => {
    if (filterDomain !== "all" && item.domain !== filterDomain) return false;
    if (filterSeverity !== "all" && item.severity !== filterSeverity) return false;
    if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase()) && !item.summary.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const domains: (Domain | "all")[] = ["all", "geopolitics", "economics", "defense", "technology", "climate", "society"];
  const severities: (Severity | "all")[] = ["all", "critical", "high", "medium", "low"];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
        <div className="flex items-center gap-2">
          <Zap size={14} className="text-pink-400" />
          <span className="font-mono text-xs font-bold text-foreground/80">INTELLIGENCE FEED</span>
          <motion.span
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-[10px] font-mono text-pink-400/80 flex items-center gap-1"
          >
            <span className="w-1 h-1 rounded-full bg-pink-400" />
            LIVE
          </motion.span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`text-[10px] font-mono px-2 py-0.5 rounded border transition-all ${isPaused ? "border-green-400/30 text-green-400 bg-green-400/10" : "border-amber-400/30 text-amber-400 bg-amber-400/10"}`}
          >
            {isPaused ? "▶ RESUME" : "⏸ PAUSE"}
          </button>
          <span className="font-mono text-[10px] text-muted-foreground/50">{filtered.length} items</span>
        </div>
      </div>

      {/* Filters */}
      <div className="shrink-0 border-b border-border">
        <div className="px-3 py-2 flex items-center gap-1.5 overflow-x-auto">
          <Filter size={10} className="text-muted-foreground/60 shrink-0" />
          {domains.map((d) => (
            <button
              key={d}
              onClick={() => setFilterDomain(d)}
              className={`px-2 py-0.5 rounded text-[10px] font-mono shrink-0 transition-all ${
                filterDomain === d
                  ? d === "all" ? "bg-primary/20 text-primary border border-primary/30" : ""
                  : "text-muted-foreground hover:text-foreground border border-transparent hover:bg-muted/30"
              }`}
              style={filterDomain === d && d !== "all" ? {
                background: `${DOMAIN_COLORS[d as Domain]}20`,
                color: DOMAIN_COLORS[d as Domain],
                border: `1px solid ${DOMAIN_COLORS[d as Domain]}40`
              } : {}}
            >
              {d === "all" ? "ALL" : `${DOMAIN_ICONS[d as Domain]} ${d.toUpperCase()}`}
            </button>
          ))}
        </div>

        <div className="px-3 py-2 flex items-center gap-2 border-t border-border/50">
          <div className="flex items-center gap-1">
            {severities.map((s) => (
              <button
                key={s}
                onClick={() => setFilterSeverity(s)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all ${
                  filterSeverity === s
                    ? s === "all" ? "bg-primary/20 text-primary border border-primary/30" : ""
                    : "text-muted-foreground hover:text-foreground border border-transparent"
                }`}
                style={filterSeverity === s && s !== "all" ? {
                  background: `${SEVERITY_COLORS[s as Severity]}15`,
                  color: SEVERITY_COLORS[s as Severity],
                  border: `1px solid ${SEVERITY_COLORS[s as Severity]}30`
                } : {}}
              >
                {s === "all" ? "ALL SEVERITY" : s.toUpperCase()}
              </button>
            ))}
          </div>
          <div className="flex-1 relative ml-auto max-w-40">
            <Search size={10} className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground/40" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search feed..."
              className="w-full pl-5 pr-2 py-0.5 text-[10px] bg-muted/20 border border-border/50 rounded focus:outline-none focus:border-primary/30 placeholder:text-muted-foreground/30"
            />
          </div>
        </div>
      </div>

      {/* Feed list */}
      <div ref={feedRef} className="flex-1 overflow-y-auto">
        <AnimatePresence initial={false}>
          {filtered.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-xs text-muted-foreground/50 font-mono">
              NO MATCHING INTELLIGENCE ITEMS
            </div>
          ) : (
            filtered.map((item) => (
              <FeedItem key={item.id} item={item} isNew={newItemIds.has(item.id)} />
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
