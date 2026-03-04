"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, TrendingUp, TrendingDown, Minus, Globe2, ArrowUpRight } from "lucide-react";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from "recharts";
import { RISK_INDICATORS } from "@/lib/mock-data";
import { DOMAIN_COLORS, getRiskColor, getRiskLevel } from "@/lib/utils";
import type { RiskIndicator } from "@/types";

const TREND_ICONS = {
  escalating: TrendingUp,
  "de-escalating": TrendingDown,
  stable: Minus,
};
const TREND_COLORS = {
  escalating: "#ef4444",
  "de-escalating": "#10b981",
  stable: "#8892a4",
};

function RiskCard({ indicator, onClick, isSelected }: { indicator: RiskIndicator; onClick: () => void; isSelected: boolean }) {
  const TIcon = TREND_ICONS[indicator.trend];
  const tColor = TREND_COLORS[indicator.trend];
  const riskColor = getRiskColor(indicator.riskScore);
  const level = getRiskLevel(indicator.riskScore);

  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      onClick={onClick}
      className={`w-full text-left p-3 rounded border transition-all ${
        isSelected ? "border-primary/40 bg-primary/5" : "border-border hover:border-border/80 bg-card"
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="text-xs font-semibold text-foreground/90 mb-0.5">{indicator.region}</div>
          {indicator.country && (
            <div className="text-[10px] font-mono text-muted-foreground/60">{indicator.country}</div>
          )}
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="text-lg font-bold font-mono leading-none" style={{ color: riskColor }}>
            {indicator.riskScore}
          </div>
          <div
            className="text-[9px] font-mono px-1.5 py-0.5 rounded border"
            style={{ color: riskColor, borderColor: `${riskColor}30`, background: `${riskColor}12` }}
          >
            {level.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Risk bar */}
      <div className="h-1.5 bg-muted rounded-full mb-2 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${indicator.riskScore}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${riskColor}60, ${riskColor})` }}
        />
      </div>

      {/* Domain bars */}
      <div className="grid grid-cols-3 gap-1.5 mb-2">
        {Object.entries(indicator.domains).map(([domain, value]) => (
          <div key={domain}>
            <div className="text-[9px] text-muted-foreground/50 truncate capitalize mb-0.5">{domain}</div>
            <div className="h-0.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{ width: `${value}%`, background: DOMAIN_COLORS[domain as keyof typeof DOMAIN_COLORS] || "#888" }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <TIcon size={9} style={{ color: tColor }} />
          <span className="text-[10px] capitalize" style={{ color: tColor }}>{indicator.trend}</span>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground/50">
          <AlertTriangle size={8} style={{ color: indicator.activeAlerts >= 5 ? "#ef4444" : "#f59e0b" }} />
          <span>{indicator.activeAlerts} alerts</span>
        </div>
      </div>
    </motion.button>
  );
}

export default function RiskMatrix() {
  const [selected, setSelected] = useState<RiskIndicator | null>(RISK_INDICATORS[0]);

  const radarData = selected
    ? Object.entries(selected.domains).map(([domain, value]) => ({
        domain: domain.charAt(0).toUpperCase() + domain.slice(1, 4),
        value,
        fullMark: 100,
      }))
    : [];

  const sortedIndicators = [...RISK_INDICATORS].sort((a, b) => b.riskScore - a.riskScore);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
        <div className="flex items-center gap-2">
          <AlertTriangle size={14} className="text-danger" />
          <span className="font-mono text-xs font-bold text-foreground/80">REGIONAL RISK MATRIX</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground/60">
          <span>{RISK_INDICATORS.filter((r) => r.riskScore >= 80).length} CRITICAL</span>
          <span>·</span>
          <span>{RISK_INDICATORS.filter((r) => r.trend === "escalating").length} ESCALATING</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Global Risk Summary */}
        <div className="p-4 border-b border-border">
          <div className="grid grid-cols-4 gap-2 mb-4">
            {[
              { label: "Global Risk Avg", value: Math.round(RISK_INDICATORS.reduce((s, r) => s + r.riskScore, 0) / RISK_INDICATORS.length), color: "#f59e0b" },
              { label: "Critical Regions", value: RISK_INDICATORS.filter(r => r.riskScore >= 80).length, color: "#ef4444" },
              { label: "Escalating", value: RISK_INDICATORS.filter(r => r.trend === "escalating").length, color: "#ef4444" },
              { label: "Stable/Cooling", value: RISK_INDICATORS.filter(r => r.trend !== "escalating").length, color: "#10b981" },
            ].map((stat) => (
              <div key={stat.label} className="p-2 rounded bg-muted/20 border border-border text-center">
                <div className="text-lg font-bold font-mono" style={{ color: stat.color }}>{stat.value}</div>
                <div className="text-[9px] text-muted-foreground/60 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Selected region radar */}
          {selected && radarData.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10px] text-muted-foreground/60 uppercase">
                  {selected.region} — Domain Risk Profile
                </span>
                <span className="font-mono text-[10px]" style={{ color: getRiskColor(selected.riskScore) }}>
                  {selected.riskScore}/100
                </span>
              </div>
              <ResponsiveContainer width="100%" height={160}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#1e2d45" />
                  <PolarAngleAxis dataKey="domain" tick={{ fontSize: 9, fill: "#8892a4" }} />
                  <Radar
                    name={selected.region}
                    dataKey="value"
                    stroke={getRiskColor(selected.riskScore)}
                    fill={getRiskColor(selected.riskScore)}
                    fillOpacity={0.15}
                    strokeWidth={1.5}
                  />
                  <Tooltip
                    contentStyle={{ background: "#0d1526", border: "1px solid #1e2d45", borderRadius: 4, fontSize: 10, fontFamily: "monospace" }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Risk cards grid */}
        <div className="p-4">
          <div className="font-mono text-[10px] text-muted-foreground/60 uppercase tracking-wider mb-3">
            Regional Hotspot Assessment
          </div>
          <div className="grid grid-cols-1 gap-2">
            {sortedIndicators.map((indicator) => (
              <RiskCard
                key={indicator.region}
                indicator={indicator}
                isSelected={selected?.region === indicator.region}
                onClick={() => setSelected(selected?.region === indicator.region ? null : indicator)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
