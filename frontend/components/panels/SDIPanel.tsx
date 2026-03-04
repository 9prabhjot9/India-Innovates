"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity, TrendingUp, TrendingDown, Minus, AlertTriangle,
  RefreshCw, ChevronRight, Info
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { SDI_METRICS, SDI_HISTORY } from "@/lib/mock-data";
import { DOMAIN_COLORS, DOMAIN_ICONS, formatTimestamp } from "@/lib/utils";
import type { Domain, SDIDomain } from "@/types";

const DOMAIN_DESCRIPTIONS: Record<Domain, string> = {
  geopolitics: "Narrative vs diplomatic action gap",
  economics: "GDP/trade official vs shadow data",
  defense: "Disclosed capability vs assessed reality",
  technology: "Patent/export policy vs actual transfers",
  climate: "Emission pledges vs satellite measurements",
  society: "Official stability metrics vs ground sentiment",
};

function SDIGauge({ score, size = 140 }: { score: number; size?: number }) {
  const radius = size / 2 - 16;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (score / 100) * (circumference * 0.75);
  const startAngle = -225;

  const color = score >= 80 ? "#ef4444" : score >= 60 ? "#f59e0b" : score >= 40 ? "#00d4ff" : "#10b981";

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="absolute">
        {/* Background arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#1e2d45"
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
          transform={`rotate(${startAngle} ${size / 2} ${size / 2})`}
        />
        {/* Score arc */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
          strokeDashoffset={dashOffset}
          transform={`rotate(${startAngle} ${size / 2} ${size / 2})`}
          initial={{ strokeDashoffset: circumference * 0.75 }}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          filter="url(#sdi-glow)"
        />
        <defs>
          <filter id="sdi-glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Tick marks */}
        {[0, 25, 50, 75, 100].map((tick) => {
          const angle = (startAngle + (tick / 100) * 270) * (Math.PI / 180);
          const innerR = radius - 12;
          const outerR = radius + 2;
          return (
            <line
              key={tick}
              x1={size / 2 + innerR * Math.cos(angle)}
              y1={size / 2 + innerR * Math.sin(angle)}
              x2={size / 2 + outerR * Math.cos(angle)}
              y2={size / 2 + outerR * Math.sin(angle)}
              stroke="#1e2d45"
              strokeWidth={tick % 50 === 0 ? 2 : 1}
            />
          );
        })}
      </svg>
      <div className="text-center z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-3xl font-bold font-mono"
          style={{ color }}
        >
          {score}
        </motion.div>
        <div className="text-[10px] font-mono text-muted-foreground/60 tracking-widest">SDI</div>
      </div>
    </div>
  );
}

function DomainRow({ domain, onClick }: { domain: SDIDomain; onClick: () => void }) {
  const color = DOMAIN_COLORS[domain.domain];
  const TrendIcon = domain.trend === "rising" ? TrendingUp : domain.trend === "falling" ? TrendingDown : Minus;
  const trendColor = domain.trend === "rising" ? "#ef4444" : domain.trend === "falling" ? "#10b981" : "#8892a4";

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-2.5 rounded hover:bg-muted/30 transition-all group text-left"
    >
      <span className="text-base w-5 shrink-0">{DOMAIN_ICONS[domain.domain]}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium capitalize text-foreground/80">{domain.domain}</span>
          <div className="flex items-center gap-1.5">
            {domain.anomalies > 0 && (
              <span className="text-[10px] px-1 py-0.5 rounded font-mono text-amber-400 bg-amber-400/10 border border-amber-400/20">
                {domain.anomalies}⚠
              </span>
            )}
            <TrendIcon size={11} style={{ color: trendColor }} />
            <span className="text-xs font-mono font-bold" style={{ color }}>
              {domain.score}
            </span>
          </div>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${domain.score}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, ${color}80, ${color})` }}
          />
        </div>
        <div className="text-[9px] text-muted-foreground/40 mt-0.5">{DOMAIN_DESCRIPTIONS[domain.domain]}</div>
      </div>
      <ChevronRight size={10} className="text-muted-foreground/30 group-hover:text-muted-foreground/60 transition-colors shrink-0" />
    </button>
  );
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded p-2 shadow-xl text-[10px] font-mono">
      <div className="text-muted-foreground/70 mb-1">{label}</div>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-1.5 mb-0.5">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: entry.color }} />
          <span style={{ color: entry.color }}>{entry.name}: {entry.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function SDIPanel() {
  const [metrics] = useState(SDI_METRICS);
  const [activeDomain, setActiveDomain] = useState<Domain | null>(null);
  const [showChart, setShowChart] = useState(true);
  const [lastUpdate] = useState(new Date());

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Activity size={14} className="text-accent" />
          <span className="font-mono text-xs font-bold text-foreground/80">STRATEGIC DISSONANCE INDEX</span>
          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-accent/15 text-accent border border-accent/30">LIVE</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowChart(!showChart)}
            className="text-[10px] font-mono text-muted-foreground hover:text-primary transition-colors"
          >
            {showChart ? "HIDE CHART" : "SHOW CHART"}
          </button>
          <span className="font-mono text-[10px] text-muted-foreground/50">
            Updated {formatTimestamp(metrics.lastRecalculated)}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Top section: Gauge + Summary */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-6">
            <SDIGauge score={metrics.overall} />
            <div className="flex-1">
              <div className="mb-3">
                <div className="text-xs text-muted-foreground/60 mb-1">Overall Dissonance Level</div>
                <div className="text-xl font-bold text-foreground/90">
                  {metrics.overall >= 80 ? "CRITICAL" : metrics.overall >= 60 ? "HIGH" : metrics.overall >= 40 ? "MODERATE" : "LOW"}
                </div>
                <div className="text-xs text-muted-foreground/60 mt-1">
                  Cross-domain narrative gap quantified across {metrics.domains.length} intelligence domains
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="p-2 rounded bg-muted/20 border border-border text-center">
                  <div className="text-lg font-bold font-mono text-danger">{metrics.alertCount}</div>
                  <div className="text-[10px] text-muted-foreground/60">Active Alerts</div>
                </div>
                <div className="p-2 rounded bg-muted/20 border border-border text-center">
                  <div className="text-lg font-bold font-mono text-accent">
                    {metrics.domains.filter((d) => d.trend === "rising").length}
                  </div>
                  <div className="text-[10px] text-muted-foreground/60">Rising Domains</div>
                </div>
                <div className="p-2 rounded bg-muted/20 border border-border text-center">
                  <div className="text-lg font-bold font-mono text-primary">
                    {metrics.domains.reduce((s, d) => s + d.anomalies, 0)}
                  </div>
                  <div className="text-[10px] text-muted-foreground/60">Anomalies</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Domain breakdown */}
        <div className="p-4 border-b border-border">
          <div className="font-mono text-[10px] text-muted-foreground/60 uppercase tracking-wider mb-3">
            Dissonance by Domain
          </div>
          <div className="space-y-0.5">
            {metrics.domains.map((domain) => (
              <DomainRow
                key={domain.domain}
                domain={domain}
                onClick={() => setActiveDomain(activeDomain === domain.domain ? null : domain.domain)}
              />
            ))}
          </div>
        </div>

        {/* Domain detail panel */}
        <AnimatePresence>
          {activeDomain && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="border-b border-border overflow-hidden"
            >
              <div className="p-4 bg-muted/10">
                <div className="flex items-center gap-2 mb-3">
                  <Info size={12} style={{ color: DOMAIN_COLORS[activeDomain] }} />
                  <span className="font-mono text-xs font-bold capitalize" style={{ color: DOMAIN_COLORS[activeDomain] }}>
                    {activeDomain} — Analysis
                  </span>
                </div>
                <div className="text-xs text-muted-foreground/70 leading-relaxed">
                  {activeDomain === "defense" && "Significant gap detected between official military capability disclosures and satellite/OSINT assessments. Key actors: Russia (+19pts), China (+12pts), North Korea (+8pts). Anomalies include undisclosed hypersonic program progress and submarine fleet movements inconsistent with stated doctrine."}
                  {activeDomain === "geopolitics" && "Diplomatic narratives diverge sharply from observed actions. Alliance signaling inconsistent with actual force posture. Major contributors: China Taiwan messaging (+15pts), Pakistan counter-terrorism claims (+11pts), Iran JCPOA statements (+9pts)."}
                  {activeDomain === "economics" && "Shadow economy indicators show significant divergence from official GDP and trade statistics in Russia, China, and several emerging markets. Currency manipulation signals detected in 4 jurisdictions."}
                  {activeDomain === "technology" && "Export control compliance gap widening. AI capability disclosures significantly lag estimated capabilities by at least 18 months for China, 12 months for Russia. Semiconductor trade circumvention pathways detected via intermediary states."}
                  {activeDomain === "climate" && "NDC commitments tracked against satellite methane and CO2 measurements. 3 major emitters show persistent underreporting. India deforestation data broadly consistent with claims — lowest dissonance actor."}
                  {activeDomain === "society" && "Social stability metrics diverge from suppressed protest data and migration pressure indicators. Myanmar, Pakistan, and Sahel show highest internal narrative-reality gaps."}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Historical chart */}
        <AnimatePresence>
          {showChart && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4"
            >
              <div className="font-mono text-[10px] text-muted-foreground/60 uppercase tracking-wider mb-3">
                30-Day SDI Trend
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={SDI_HISTORY}>
                  <defs>
                    {(["defense", "geopolitics", "economics"] as const).map((key) => (
                      <linearGradient key={key} id={`grad-${key}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={DOMAIN_COLORS[key]} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={DOMAIN_COLORS[key]} stopOpacity={0} />
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid strokeDasharray="2 2" stroke="#1e2d45" />
                  <XAxis dataKey="date" tick={{ fontSize: 8 }} tickLine={false} stroke="#1e2d45" interval={6} />
                  <YAxis tick={{ fontSize: 8 }} tickLine={false} stroke="#1e2d45" domain={[20, 100]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="defense" stroke={DOMAIN_COLORS.defense} fill={`url(#grad-defense)`} strokeWidth={1.5} dot={false} name="Defense" />
                  <Area type="monotone" dataKey="geopolitics" stroke={DOMAIN_COLORS.geopolitics} fill={`url(#grad-geopolitics)`} strokeWidth={1.5} dot={false} name="Geopolitics" />
                  <Area type="monotone" dataKey="overall" stroke="#ffffff" fill="none" strokeWidth={1} strokeDasharray="3 2" dot={false} name="Overall" />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
