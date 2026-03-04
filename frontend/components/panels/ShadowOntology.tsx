"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Layers, AlertTriangle, Eye, EyeOff, ArrowRight, Info } from "lucide-react";
import { SHADOW_ONTOLOGY_SIGNALS } from "@/lib/mock-data";
import { DOMAIN_COLORS, DOMAIN_ICONS, formatTimestamp } from "@/lib/utils";
import type { ShadowOntologySignal } from "@/types";

function DissonanceMeter({ score, confidence }: { score: number; confidence: number }) {
  const color = score >= 80 ? "#ef4444" : score >= 60 ? "#f59e0b" : "#00d4ff";
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-[10px]">
        <span className="text-muted-foreground/60 font-mono">DISSONANCE</span>
        <span className="font-bold font-mono" style={{ color }}>{score}%</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}60, ${color})` }}
        />
      </div>
      <div className="flex items-center justify-between text-[10px]">
        <span className="text-muted-foreground/60 font-mono">CONFIDENCE</span>
        <span className="font-mono text-green-400/80">{confidence}%</span>
      </div>
      <div className="h-1 bg-muted rounded-full overflow-hidden">
        <div className="h-full bg-green-400/60 rounded-full" style={{ width: `${confidence}%` }} />
      </div>
    </div>
  );
}

function SignalCard({ signal }: { signal: ShadowOntologySignal }) {
  const [expanded, setExpanded] = useState(false);
  const domainColor = DOMAIN_COLORS[signal.domain];
  const dissonanceColor = signal.dissonanceScore >= 80 ? "#ef4444" : signal.dissonanceScore >= 60 ? "#f59e0b" : "#00d4ff";

  return (
    <motion.div
      layout
      className="border border-border rounded overflow-hidden bg-card hover:border-border/80 transition-colors"
    >
      {/* Card header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-3"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-sm">{DOMAIN_ICONS[signal.domain]}</span>
            <span className="font-semibold text-xs text-foreground/90">{signal.entity}</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border"
              style={{ color: dissonanceColor, borderColor: `${dissonanceColor}30`, background: `${dissonanceColor}12` }}
            >
              ∆{signal.dissonanceScore}
            </span>
            <span className="text-[10px] font-mono capitalize" style={{ color: domainColor }}>
              {signal.domain}
            </span>
          </div>
        </div>

        {/* Dual layer visualization */}
        <div className="grid grid-cols-2 gap-1.5">
          <div className="p-2 rounded bg-green-400/5 border border-green-400/15">
            <div className="flex items-center gap-1 mb-1">
              <Eye size={8} className="text-green-400/70" />
              <span className="text-[9px] font-mono text-green-400/70">OFFICIAL</span>
            </div>
            <p className="text-[10px] text-foreground/70 leading-tight line-clamp-2">{signal.officialNarrative}</p>
          </div>
          <div className="p-2 rounded bg-danger/5 border border-danger/15">
            <div className="flex items-center gap-1 mb-1">
              <EyeOff size={8} className="text-danger/70" />
              <span className="text-[9px] font-mono text-danger/70">REALITY</span>
            </div>
            <p className="text-[10px] text-foreground/70 leading-tight line-clamp-2">{signal.groundReality}</p>
          </div>
        </div>
      </button>

      {/* Expanded metrics */}
      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="px-3 pb-3 border-t border-border/50 pt-3"
        >
          <DissonanceMeter score={signal.dissonanceScore} confidence={signal.confidence} />
          <div className="mt-2 text-[10px] text-muted-foreground/50 font-mono">
            Detected: {formatTimestamp(signal.detectedAt)}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default function ShadowOntology() {
  const sorted = [...SHADOW_ONTOLOGY_SIGNALS].sort((a, b) => b.dissonanceScore - a.dissonanceScore);
  const avgDissonance = Math.round(sorted.reduce((s, sig) => s + sig.dissonanceScore, 0) / sorted.length);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
        <div className="flex items-center gap-2">
          <Layers size={14} className="text-secondary" style={{ color: "#7c3aed" }} />
          <span className="font-mono text-xs font-bold text-foreground/80">SHADOW ONTOLOGY LAYER</span>
        </div>
        <span className="text-[10px] font-mono text-muted-foreground/60">
          {sorted.length} signals · avg ∆{avgDissonance}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Explanation */}
        <div className="mx-4 mt-4 p-3 rounded border border-purple-500/20 bg-purple-500/5">
          <div className="flex items-start gap-2">
            <Info size={11} className="text-purple-400/70 mt-0.5 shrink-0" />
            <p className="text-[10px] text-muted-foreground/70 leading-relaxed">
              The Shadow Ontology Layer maintains a dual-graph architecture that separates{" "}
              <span className="text-green-400/80">official narrative signals</span> from{" "}
              <span className="text-danger/80">ground truth indicators</span>. The Dissonance Score (∆)
              quantifies strategic misalignment, misinformation, and policy-reality gaps detected
              via cross-domain correlation and anomaly detection.
            </p>
          </div>
        </div>

        {/* Summary row */}
        <div className="px-4 pt-4 pb-2 grid grid-cols-3 gap-2">
          <div className="p-2 rounded bg-muted/20 border border-border text-center">
            <div className="text-xl font-bold font-mono text-danger">{sorted.filter(s => s.dissonanceScore >= 80).length}</div>
            <div className="text-[9px] text-muted-foreground/60">Critical ∆</div>
          </div>
          <div className="p-2 rounded bg-muted/20 border border-border text-center">
            <div className="text-xl font-bold font-mono text-accent">{avgDissonance}</div>
            <div className="text-[9px] text-muted-foreground/60">Avg Dissonance</div>
          </div>
          <div className="p-2 rounded bg-muted/20 border border-border text-center">
            <div className="text-xl font-bold font-mono text-purple-400">
              {Math.round(sorted.reduce((s, sig) => s + sig.confidence, 0) / sorted.length)}%
            </div>
            <div className="text-[9px] text-muted-foreground/60">Avg Confidence</div>
          </div>
        </div>

        {/* Signals */}
        <div className="px-4 pb-4 space-y-3">
          <div className="font-mono text-[10px] text-muted-foreground/60 uppercase tracking-wider">
            Active Dissonance Signals
          </div>
          {sorted.map((signal) => (
            <SignalCard key={signal.id} signal={signal} />
          ))}
        </div>
      </div>
    </div>
  );
}
