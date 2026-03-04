"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import Link from "next/link";
import {
  Brain, Globe2, Shield, TrendingUp, Zap, Network,
  ArrowRight, Activity, Lock, Eye, ChevronRight, Layers
} from "lucide-react";

const TYPING_STRINGS = [
  "Detecting Strategic Dissonance...",
  "Mapping Global Knowledge Graph...",
  "Running Recursive Strategy Loop...",
  "Analyzing Shadow Ontology Layer...",
  "Processing Real-time Intelligence Feeds...",
  "Generating Scenario Projections...",
];

function TypingEffect() {
  const [currentStr, setCurrentStr] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [typing, setTyping] = useState(true);

  useEffect(() => {
    const str = TYPING_STRINGS[currentStr];
    if (typing) {
      if (displayed.length < str.length) {
        const t = setTimeout(() => setDisplayed(str.slice(0, displayed.length + 1)), 40);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setTyping(false), 1800);
        return () => clearTimeout(t);
      }
    } else {
      if (displayed.length > 0) {
        const t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 20);
        return () => clearTimeout(t);
      } else {
        setCurrentStr((c) => (c + 1) % TYPING_STRINGS.length);
        setTyping(true);
      }
    }
  }, [displayed, typing, currentStr]);

  return (
    <div className="font-mono text-sm text-primary/80 h-6 flex items-center gap-1">
      <span className="text-primary/50">$</span>
      <span>{displayed}</span>
      <span className="inline-block w-2 h-4 bg-primary animate-pulse ml-0.5" />
    </div>
  );
}

const FEATURES = [
  {
    icon: Network,
    title: "Global Ontology Engine",
    color: "#00d4ff",
    description: "Unified knowledge graph connecting 10,000+ entities across geopolitics, economics, defense, and society with live relationship mapping.",
  },
  {
    icon: Activity,
    title: "Strategic Dissonance Index",
    color: "#f59e0b",
    description: "Quantifies the gap between official narratives and ground reality using anomaly detection and cross-domain correlation algorithms.",
  },
  {
    icon: Layers,
    title: "Shadow Ontology Layer",
    color: "#7c3aed",
    description: "Dual-graph architecture separating narrative signals from ground indicators to detect misinformation and strategic misalignment at scale.",
  },
  {
    icon: Brain,
    title: "Recursive Strategy Loop",
    color: "#10b981",
    description: "LLM-powered scenario generation that continuously updates graph risk weights and produces actionable strategic mitigation plans.",
  },
  {
    icon: Eye,
    title: "Real-time Intelligence Feed",
    color: "#ec4899",
    description: "Multi-source ingestion from structured databases, unstructured news, policy documents, and live geospatial feeds via Kafka pipelines.",
  },
  {
    icon: Shield,
    title: "National Advantage Module",
    color: "#ef4444",
    description: "India-centric strategic assessment layer providing decision support for defense, trade, diplomacy, and technology sovereignty.",
  },
];

const STATS = [
  { label: "Entities Tracked", value: "10,000+", icon: Globe2 },
  { label: "Data Sources", value: "2,400+", icon: Network },
  { label: "Domains Covered", value: "6", icon: Layers },
  { label: "Update Latency", value: "<30s", icon: Zap },
];

function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: { x: number; y: number; vx: number; vy: number; size: number; opacity: number }[] = [];
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.5 + 0.1,
      });
    }

    let animId: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 212, 255, ${p.opacity})`;
        ctx.fill();

        particles.slice(i + 1).forEach((p2) => {
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(0, 212, 255, ${(1 - dist / 120) * 0.15})`;
            ctx.stroke();
          }
        });
      });
      animId = requestAnimationFrame(draw);
    };

    draw();
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />;
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const featuresRef = useRef(null);
  const featuresInView = useInView(featuresRef, { once: true, margin: "-100px" });

  return (
    <div className="min-h-screen bg-[#070b14] text-foreground overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 grid-bg">
        {mounted && <ParticleCanvas />}

        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-4 z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded border border-primary/40 flex items-center justify-center bg-primary/10">
              <Brain size={16} className="text-primary" />
            </div>
            <span className="font-mono text-sm font-bold tracking-[0.2em] text-primary/90">
              PROJECT CHANAKYA
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs text-green-400/80 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              SYSTEM ONLINE
            </div>
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono border border-primary/40 text-primary hover:bg-primary/10 transition-all rounded"
            >
              ENTER DASHBOARD <ChevronRight size={12} />
            </Link>
          </div>
        </div>

        {/* Main hero content */}
        <div className="relative z-10 text-center max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-4 flex items-center justify-center"
          >
            <span className="px-3 py-1 text-xs font-mono border border-primary/30 text-primary/70 rounded-full bg-primary/5 tracking-widest">
              CLASSIFIED // INDIA STRATEGIC INTELLIGENCE INITIATIVE
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="mb-2"
          >
            <span className="font-mono text-xs text-primary/50 tracking-[0.4em] uppercase">
              Global Ontology Engine · v2.4.1
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
          >
            <span className="text-glow-cyan text-primary">Project</span>
            <br />
            <span className="bg-gradient-to-r from-foreground via-foreground/90 to-foreground/60 bg-clip-text text-transparent">
              Chanakya
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto mb-6 leading-relaxed"
          >
            An AI-powered strategic intelligence platform that transforms fragmented geopolitical,
            economic, defense, and societal data into a unified, continuously updating knowledge
            graph — delivering measurable risk indicators and actionable strategic foresight for
            India and the world.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex justify-center mb-8"
          >
            <TypingEffect />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/dashboard"
              className="group flex items-center gap-2 px-6 py-3 bg-primary text-[#070b14] font-bold text-sm rounded hover:bg-primary/90 transition-all glow-cyan"
            >
              <Eye size={16} />
              ENTER INTELLIGENCE DASHBOARD
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="flex items-center gap-2 px-6 py-3 border border-border text-muted-foreground text-sm rounded hover:border-primary/40 hover:text-foreground transition-all">
              <Lock size={14} />
              REQUEST ACCESS CLEARANCE
            </button>
          </motion.div>
        </div>

        {/* Bottom status bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-0 right-0 flex items-center justify-center gap-8 text-xs font-mono text-muted-foreground"
        >
          {STATS.map((stat) => (
            <div key={stat.label} className="flex items-center gap-2">
              <stat.icon size={12} className="text-primary/60" />
              <span className="text-foreground/60">{stat.label}:</span>
              <span className="text-primary">{stat.value}</span>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0d1526]/50 to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="font-mono text-xs text-primary/60 tracking-widest mb-3">
              CORE INTELLIGENCE MODULES
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Built for{" "}
              <span className="text-primary">Strategic Supremacy</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Six interconnected intelligence layers that process global complexity into
              actionable strategic foresight.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group intel-card p-6 cursor-pointer"
              >
                <div
                  className="w-10 h-10 rounded flex items-center justify-center mb-4"
                  style={{ background: `${feature.color}15`, border: `1px solid ${feature.color}30` }}
                >
                  <feature.icon size={20} style={{ color: feature.color }} />
                </div>
                <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture Section */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="font-mono text-xs text-primary/60 tracking-widest mb-3">SYSTEM ARCHITECTURE</div>
            <h2 className="text-3xl font-bold mb-3">How Chanakya Works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-0">
            {[
              { step: "01", title: "Ingest", desc: "Kafka pipelines ingest structured & unstructured data from 2,400+ sources in real-time", icon: Activity },
              { step: "02", title: "Process", desc: "NLP + HuggingFace Transformers extract entities, events, and relationships at scale", icon: Brain },
              { step: "03", title: "Connect", desc: "Neo4j knowledge graph organizes all intelligence into dynamic entity-relationship maps", icon: Network },
              { step: "04", title: "Reason", desc: "LLM recursive strategy loop generates scenarios, detects anomalies, and updates risk scores", icon: TrendingUp },
            ].map((item, i) => (
              <div key={item.step} className="flex flex-col items-center text-center p-6 relative">
                {i < 3 && (
                  <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 text-primary/20 z-10">
                    <ChevronRight size={20} />
                  </div>
                )}
                <div className="font-mono text-xs text-primary/40 mb-2">{item.step}</div>
                <div className="w-12 h-12 rounded-full border border-primary/30 flex items-center justify-center mb-3 bg-primary/5">
                  <item.icon size={20} className="text-primary" />
                </div>
                <div className="font-semibold mb-2">{item.title}</div>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="intel-card gradient-border p-12">
            <div className="font-mono text-xs text-primary/60 tracking-widest mb-4">
              STRATEGIC INTELLIGENCE AWAITS
            </div>
            <h2 className="text-3xl font-bold mb-4">
              The World Will Not Wait.
              <br />
              <span className="text-primary">Neither Should India.</span>
            </h2>
            <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
              Every minute of delay is intelligence lost. Project Chanakya processes
              the global signal — transforming noise into national advantage.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-[#070b14] font-bold text-sm rounded hover:bg-primary/90 transition-all glow-cyan"
            >
              <Brain size={16} />
              ACCESS CHANAKYA DASHBOARD
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Brain size={14} className="text-primary" />
            <span className="font-mono text-xs text-muted-foreground">
              PROJECT CHANAKYA // INDIA INNOVATES
            </span>
          </div>
          <div className="font-mono text-xs text-muted-foreground/50">
            Classification: STRATEGIC // Handle With Discretion
          </div>
        </div>
      </footer>
    </div>
  );
}
