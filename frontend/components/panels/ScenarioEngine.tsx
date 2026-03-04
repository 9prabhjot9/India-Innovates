"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain, Play, ChevronDown, ChevronUp, AlertTriangle,
  Target, Shield, Clock, Users, Lightbulb, Radio, Loader2
} from "lucide-react";
import { SCENARIO_RESULTS } from "@/lib/mock-data";
import { DOMAIN_COLORS, DOMAIN_ICONS, SEVERITY_COLORS } from "@/lib/utils";
import type { ScenarioResult, Domain, Severity } from "@/types";

const SCENARIO_PROMPTS = [
  "What happens if China blockades Taiwan in Q3 2025?",
  "Analyze India-Pakistan escalation post Balakot 2.0",
  "Model global impact of oil embargo on Iran",
  "Project DPRK nuclear test impact on Korean peninsula",
  "Assess India's strategic options if China dams Brahmaputra",
  "Simulate SWIFT disconnection of China",
];

function ProbabilityBar({ probability }: { probability: number }) {
  const color = probability >= 50 ? "#ef4444" : probability >= 30 ? "#f59e0b" : "#10b981";
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] text-muted-foreground/60 font-mono">PROBABILITY</span>
        <span className="text-xs font-mono font-bold" style={{ color }}>{probability}%</span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${probability}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}60, ${color})` }}
        />
      </div>
    </div>
  );
}

function ScenarioCard({ scenario }: { scenario: ScenarioResult }) {
  const [expanded, setExpanded] = useState(false);
  const impactColor = SEVERITY_COLORS[scenario.impact];

  return (
    <motion.div layout className="rounded border border-border bg-card overflow-hidden">
      <button onClick={() => setExpanded(!expanded)} className="w-full text-left p-4 hover:bg-muted/10 transition-colors">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 pr-2">
            <h3 className="text-sm font-semibold text-foreground/90 mb-1">{scenario.title}</h3>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="flex items-center gap-1 text-[10px]" style={{ color: impactColor }}>
                <AlertTriangle size={9} />
                <span className="font-mono">{scenario.impact.toUpperCase()} IMPACT</span>
              </span>
              <span className="text-[10px] text-muted-foreground/50">·</span>
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground/60">
                <Clock size={9} />
                {scenario.timeframe}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="text-right">
              <div className="text-lg font-bold font-mono" style={{ color: scenario.probability >= 50 ? "#ef4444" : scenario.probability >= 30 ? "#f59e0b" : "#10b981" }}>
                {scenario.probability}%
              </div>
              <div className="text-[9px] text-muted-foreground/50">probability</div>
            </div>
            {expanded ? <ChevronUp size={12} className="text-muted-foreground/40" /> : <ChevronDown size={12} className="text-muted-foreground/40" />}
          </div>
        </div>

        {/* Affected domains */}
        <div className="flex items-center gap-1 flex-wrap mb-3">
          {scenario.affectedDomains.map((domain) => (
            <span
              key={domain}
              className="text-[9px] px-1.5 py-0.5 rounded font-mono"
              style={{ color: DOMAIN_COLORS[domain], background: `${DOMAIN_COLORS[domain]}15`, border: `1px solid ${DOMAIN_COLORS[domain]}30` }}
            >
              {DOMAIN_ICONS[domain]} {domain}
            </span>
          ))}
        </div>

        <ProbabilityBar probability={scenario.probability} />
      </button>

      {/* Expanded detail */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-border"
          >
            <div className="p-4 space-y-4">
              {/* Description */}
              <div>
                <div className="font-mono text-[10px] text-muted-foreground/60 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Target size={10} />
                  Scenario Analysis
                </div>
                <p className="text-xs text-muted-foreground/80 leading-relaxed">{scenario.description}</p>
              </div>

              {/* Key actors */}
              <div>
                <div className="font-mono text-[10px] text-muted-foreground/60 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Users size={10} />
                  Key Actors
                </div>
                <div className="flex items-center gap-1 flex-wrap">
                  {scenario.keyActors.map((actor) => (
                    <span key={actor} className="text-[10px] px-2 py-0.5 rounded bg-primary/10 text-primary/80 border border-primary/20 font-mono">
                      {actor}
                    </span>
                  ))}
                </div>
              </div>

              {/* Early warning signals */}
              <div>
                <div className="font-mono text-[10px] text-muted-foreground/60 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Radio size={10} className="text-amber-400/70" />
                  <span className="text-amber-400/70">Early Warning Signals</span>
                </div>
                <ul className="space-y-1">
                  {scenario.earlyWarningSignals.map((sig, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-[11px] text-muted-foreground/70">
                      <span className="text-amber-400/60 mt-0.5 shrink-0">◆</span>
                      {sig}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Mitigations */}
              <div>
                <div className="font-mono text-[10px] text-muted-foreground/60 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Shield size={10} className="text-green-400/70" />
                  <span className="text-green-400/70">India Strategic Mitigations</span>
                </div>
                <ul className="space-y-1">
                  {scenario.mitigations.map((m, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-[11px] text-muted-foreground/70">
                      <span className="text-green-400/60 mt-0.5 shrink-0">→</span>
                      {m}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function ScenarioEngine() {
  const [query, setQuery] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedScenario, setGeneratedScenario] = useState<ScenarioResult | null>(null);
  const [results] = useState(SCENARIO_RESULTS);

  const handleGenerate = async () => {
    if (!query.trim()) return;
    setIsGenerating(true);
    setGeneratedScenario(null);

    // Simulate LLM processing
    await new Promise((r) => setTimeout(r, 2800));

    setGeneratedScenario({
      id: "gen-1",
      title: query.length > 60 ? query.slice(0, 60) + "..." : query,
      probability: 25 + Math.floor(Math.random() * 45),
      timeframe: ["3-6 months", "6-12 months", "12-24 months"][Math.floor(Math.random() * 3)],
      impact: (["critical", "high", "medium"] as Severity[])[Math.floor(Math.random() * 3)],
      affectedDomains: (["geopolitics", "defense", "economics", "technology"] as Domain[]).slice(0, 2 + Math.floor(Math.random() * 3)),
      keyActors: ["IND", "CHN", "USA", "RUS"].slice(0, 2 + Math.floor(Math.random() * 3)),
      description: "AI-generated scenario analysis based on current knowledge graph state, historical precedent matching, and cross-domain correlation modeling. This scenario was generated using the Recursive Strategy Loop engine with real-time graph risk weights.",
      mitigations: [
        "Activate diplomatic back-channels through neutral intermediaries (UAE, Indonesia)",
        "Pre-position strategic reserves and activate continuity protocols",
        "Coordinate with QUAD partners for information-sharing and joint contingency planning",
        "Accelerate domestic capability build-up in affected sectors",
      ],
      earlyWarningSignals: [
        "Monitor satellite imagery of key military installations",
        "Track diplomatic recall patterns in embassies",
        "Watch for unusual financial flows and commodity purchases",
        "Analyze social media sentiment shifts in affected populations",
      ],
    });
    setIsGenerating(false);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
        <div className="flex items-center gap-2">
          <Brain size={14} className="text-success" style={{ color: "#10b981" }} />
          <span className="font-mono text-xs font-bold text-foreground/80">RECURSIVE STRATEGY ENGINE</span>
        </div>
        <span className="text-[10px] font-mono text-muted-foreground/60">LLM-Powered · GPT-4o</span>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Scenario Generator */}
        <div className="p-4 border-b border-border">
          <div className="font-mono text-[10px] text-muted-foreground/60 uppercase tracking-wider mb-3 flex items-center gap-1">
            <Lightbulb size={10} />
            Generate New Scenario
          </div>

          <div className="relative mb-2">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Describe a geopolitical event or query (e.g., 'What if China seizes Taiwan in 2025?')"
              className="w-full px-3 py-2 text-xs bg-muted/20 border border-border rounded focus:outline-none focus:border-primary/40 text-foreground placeholder:text-muted-foreground/40 resize-none h-20 font-sans"
            />
          </div>

          {/* Quick prompts */}
          <div className="flex flex-wrap gap-1 mb-3">
            {SCENARIO_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => setQuery(prompt)}
                className="text-[9px] px-2 py-0.5 rounded border border-border text-muted-foreground/60 hover:border-primary/30 hover:text-primary/70 transition-all font-mono"
              >
                {prompt.slice(0, 35)}...
              </button>
            ))}
          </div>

          <button
            onClick={handleGenerate}
            disabled={!query.trim() || isGenerating}
            className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 text-green-400 text-xs font-mono rounded hover:bg-green-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <Loader2 size={12} className="animate-spin" />
                GENERATING SCENARIO...
              </>
            ) : (
              <>
                <Play size={12} />
                RUN RECURSIVE STRATEGY LOOP
              </>
            )}
          </button>
        </div>

        {/* Generated scenario */}
        <AnimatePresence>
          {generatedScenario && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-4 border-b border-border"
            >
              <div className="font-mono text-[10px] text-green-400/70 uppercase tracking-wider mb-3 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Generated Scenario
              </div>
              <ScenarioCard scenario={generatedScenario} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pre-built scenarios */}
        <div className="p-4">
          <div className="font-mono text-[10px] text-muted-foreground/60 uppercase tracking-wider mb-3">
            Strategic Scenario Library
          </div>
          <div className="space-y-3">
            {results.map((scenario) => (
              <ScenarioCard key={scenario.id} scenario={scenario} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
