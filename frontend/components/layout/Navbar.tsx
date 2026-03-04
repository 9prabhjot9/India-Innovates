"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Brain, Bell, Settings, RefreshCw, AlertTriangle, ChevronDown, LogOut } from "lucide-react";
import Link from "next/link";

interface NavbarProps {
  alertCount?: number;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export default function Navbar({ alertCount = 14, onRefresh, isRefreshing }: NavbarProps) {
  const [time, setTime] = useState(new Date());
  const [showAlerts, setShowAlerts] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const QUICK_ALERTS = [
    { text: "PLA Naval Deployment — Taiwan Strait", severity: "critical", age: "8m ago" },
    { text: "APT41 Cyberattack on Indian Grid", severity: "critical", age: "1h ago" },
    { text: "DPRK ICBM Test Confirmed", severity: "critical", age: "45m ago" },
    { text: "SDI Defense Domain +12pts", severity: "high", age: "2h ago" },
  ];

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-4 py-2.5 bg-[#070b14]/95 backdrop-blur-md border-b border-border">
      {/* Left: Logo + System Status */}
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded border border-primary/40 flex items-center justify-center bg-primary/10 group-hover:bg-primary/20 transition-colors">
            <Brain size={14} className="text-primary" />
          </div>
          <div>
            <div className="font-mono text-xs font-bold tracking-[0.15em] text-primary leading-none">
              CHANAKYA
            </div>
            <div className="font-mono text-[9px] text-muted-foreground/60 leading-none tracking-widest">
              GOE v2.4.1
            </div>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-3 pl-3 border-l border-border">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="font-mono text-xs text-green-400/80">ALL SYSTEMS NOMINAL</span>
          </div>
          <span className="text-border">·</span>
          <div className="flex items-center gap-1 text-xs font-mono text-muted-foreground/60">
            <span>INGESTION:</span>
            <span className="text-primary">ACTIVE</span>
          </div>
          <span className="text-border">·</span>
          <div className="flex items-center gap-1 text-xs font-mono text-muted-foreground/60">
            <span>GRAPH:</span>
            <span className="text-primary">27,841 NODES</span>
          </div>
        </div>
      </div>

      {/* Center: UTC Clock */}
      <div className="hidden md:flex flex-col items-center">
        <div className="font-mono text-sm text-foreground/80">
          {time.toLocaleTimeString("en-US", { hour12: false, timeZone: "UTC" })} UTC
        </div>
        <div className="font-mono text-[10px] text-muted-foreground/50">
          {time.toLocaleDateString("en-US", { weekday: "short", year: "numeric", month: "short", day: "numeric" })}
        </div>
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={onRefresh}
          className="p-1.5 rounded border border-border hover:border-primary/40 text-muted-foreground hover:text-primary transition-all"
          title="Refresh Intelligence Feed"
        >
          <RefreshCw size={14} className={isRefreshing ? "animate-spin text-primary" : ""} />
        </button>

        {/* Alert Bell */}
        <div className="relative">
          <button
            onClick={() => setShowAlerts(!showAlerts)}
            className="relative p-1.5 rounded border border-border hover:border-primary/40 text-muted-foreground hover:text-primary transition-all"
          >
            <Bell size={14} />
            {alertCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-danger text-white text-[9px] font-bold flex items-center justify-center">
                {alertCount > 9 ? "9+" : alertCount}
              </span>
            )}
          </button>

          {showAlerts && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8 }}
              className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded shadow-2xl z-50"
            >
              <div className="p-3 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={12} className="text-danger" />
                  <span className="text-xs font-mono font-bold text-foreground">ACTIVE ALERTS</span>
                </div>
                <span className="text-[10px] font-mono text-muted-foreground">{alertCount} TOTAL</span>
              </div>
              <div className="py-1">
                {QUICK_ALERTS.map((alert, i) => (
                  <div key={i} className="px-3 py-2 hover:bg-muted/30 cursor-pointer flex items-start gap-2">
                    <span className={`mt-1 w-1.5 h-1.5 rounded-full shrink-0 ${alert.severity === 'critical' ? 'bg-danger' : 'bg-accent'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-foreground/90 truncate">{alert.text}</p>
                      <span className="text-[10px] text-muted-foreground font-mono">{alert.age}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-2 border-t border-border">
                <button className="w-full text-xs text-primary/70 hover:text-primary transition-colors font-mono">
                  VIEW ALL ALERTS →
                </button>
              </div>
            </motion.div>
          )}
        </div>

        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-border cursor-pointer hover:border-primary/30 transition-all group">
          <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-[9px] font-bold text-primary">IA</span>
          </div>
          <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">Analyst</span>
          <ChevronDown size={10} className="text-muted-foreground" />
        </div>
      </div>
    </nav>
  );
}
