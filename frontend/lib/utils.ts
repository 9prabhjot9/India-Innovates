import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Domain, Severity, NodeType, EdgeType } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const DOMAIN_COLORS: Record<Domain, string> = {
  geopolitics: '#00d4ff',
  economics: '#10b981',
  defense: '#ef4444',
  technology: '#7c3aed',
  climate: '#22c55e',
  society: '#f59e0b',
};

export const DOMAIN_ICONS: Record<Domain, string> = {
  geopolitics: '🌐',
  economics: '📈',
  defense: '⚔️',
  technology: '⚡',
  climate: '🌿',
  society: '👥',
};

export const NODE_COLORS: Record<NodeType, string> = {
  country: '#00d4ff',
  organization: '#7c3aed',
  resource: '#10b981',
  event: '#ef4444',
  technology: '#f59e0b',
  actor: '#ec4899',
};

export const EDGE_COLORS: Record<EdgeType, string> = {
  trade: '#10b981',
  alliance: '#00d4ff',
  conflict: '#ef4444',
  dependency: '#f59e0b',
  sanction: '#f97316',
  information: '#7c3aed',
  rivalry: '#ec4899',
};

export const SEVERITY_COLORS: Record<Severity, string> = {
  critical: '#ef4444',
  high: '#f59e0b',
  medium: '#00d4ff',
  low: '#10b981',
};

export function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

export function getRiskLevel(score: number): Severity {
  if (score >= 80) return 'critical';
  if (score >= 60) return 'high';
  if (score >= 40) return 'medium';
  return 'low';
}

export function getRiskColor(score: number): string {
  return SEVERITY_COLORS[getRiskLevel(score)];
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

export function clampRisk(val: number): number {
  return Math.max(0, Math.min(100, val));
}
