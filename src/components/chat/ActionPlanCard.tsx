"use client";
import { Zap,Clock,AlertTriangle,ShieldAlert } from "lucide-react";
import type { ActionPlan,RiskLevel } from "@/types";
import { RISK_META } from "@/types";
const ic:Record<RiskLevel,React.ReactNode>={auto:<Zap className="h-2.5 w-2.5"/>,confirm:<Clock className="h-2.5 w-2.5"/>,approve:<AlertTriangle className="h-2.5 w-2.5"/>,stepup:<ShieldAlert className="h-2.5 w-2.5"/>};
export function ActionPlanCard({plan}:{plan:ActionPlan}) {
  return (<div className="mt-2.5 rounded-xl border border-m-edge bg-m-void/50 overflow-hidden"><div className="flex items-center gap-2 border-b border-m-edge/60 bg-m-obsidian/50 px-3 py-1.5"><div className="h-1.5 w-1.5 rounded-full bg-m-copper animate-glow-pulse"/><span className="text-[10px] font-mono font-medium text-m-ghost">Plan — {plan.actions.length} steps</span></div>{plan.actions.map((a,i)=>{const m=RISK_META[a.riskLevel];return(<div key={a.id} className={`risk-bar risk-${a.riskLevel} flex items-center gap-2.5 px-3 py-1.5 pl-4 ${i<plan.actions.length-1?"border-b border-m-edge/30":""}`}><span className="text-[9px] font-mono text-m-ghost w-3">{i+1}</span><span className="flex-1 text-[11px] text-m-bone truncate">{a.label}</span><span className="flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-medium" style={{color:m.color,background:m.bg}}>{ic[a.riskLevel]}{m.label}</span></div>);})}</div>);
}
