"use client";
import { Layers,Activity,ScrollText,Settings2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { ServicesPanel } from "./ServicesPanel";
import { ActionsPanel } from "./ActionsPanel";
import { AuditPanel } from "./AuditPanel";
import { RiskRulesPanel } from "./RiskRulesPanel";
const T=[{id:"services" as const,l:"Services",I:Layers},{id:"actions" as const,l:"Actions",I:Activity},{id:"audit" as const,l:"Audit",I:ScrollText},{id:"rules" as const,l:"Rules",I:Settings2}];
export function DashboardPanel(){
  const tab=useStore(s=>s.activeTab),setT=useStore(s=>s.setActiveTab),plan=useStore(s=>s.currentPlan),log=useStore(s=>s.auditLog);
  const pC=plan?.actions.filter(a=>a.status==="pending_approval").length??0;
  return(<div className="flex flex-1 flex-col bg-m-void iso-grid"><div className="flex border-b border-m-edge bg-m-obsidian/80 backdrop-blur-sm flex-shrink-0 overflow-x-auto relative z-10">{T.map(t=>{const b=t.id==="actions"?pC:t.id==="audit"?log.length:0;return(<button key={t.id} onClick={()=>setT(t.id)} className={`flex items-center gap-1.5 px-3 md:px-4 py-2.5 text-[11px] font-medium relative whitespace-nowrap ${tab===t.id?"text-m-copper":"text-m-ghost hover:text-m-bone"}`}><t.I className="h-3.5 w-3.5"/><span className="hidden sm:inline">{t.l}</span>{b>0&&<span className={`ml-1 text-[9px] font-bold font-mono px-1.5 py-0.5 rounded-full ${t.id==="actions"?"bg-m-copper-dim text-m-copper border border-m-copper/10":"bg-m-edge text-m-ghost"}`}>{b}</span>}{tab===t.id&&<div className="absolute bottom-0 left-0 right-0 h-[2px] bg-m-copper rounded-full"/>}</button>);})}</div><div className="flex-1 overflow-y-auto relative z-10">{tab==="services"&&<ServicesPanel/>}{tab==="actions"&&<ActionsPanel/>}{tab==="audit"&&<AuditPanel/>}{tab==="rules"&&<RiskRulesPanel/>}</div></div>);
}
