"use client";
import { useState } from "react";
import { Check,X,Play,Loader2,Zap,Clock,AlertTriangle,ShieldAlert,CheckCircle2,XCircle,Hexagon,RotateCcw } from "lucide-react";
import { useStore } from "@/lib/store";
import { executeToolAction } from "@/lib/token-vault";
import type { AgentAction,RiskLevel } from "@/types";
import { RISK_META } from "@/types";
const ri=(r:RiskLevel)=>({auto:<Zap className="h-3.5 w-3.5"/>,confirm:<Clock className="h-3.5 w-3.5"/>,approve:<AlertTriangle className="h-3.5 w-3.5"/>,stepup:<ShieldAlert className="h-3.5 w-3.5"/>})[r];
export function ActionsPanel(){
  const plan=useStore(s=>s.currentPlan),upd=useStore(s=>s.updateAction),addA=useStore(s=>s.addAudit);
  const[ex,setEx]=useState<Set<string>>(new Set()),[su,setSu]=useState<string|null>(null);
  if(!plan)return<div className="flex flex-col items-center justify-center p-10 text-center"><div className="w-14 h-14 rounded-2xl bg-m-obsidian border border-m-edge flex items-center justify-center mb-4"><Hexagon className="h-6 w-6 text-m-ghost"/></div><p className="text-sm font-display font-semibold text-m-bone">No Active Plan</p><p className="text-[11px] text-m-ghost max-w-[220px] mt-1">Give Mandate a task.</p></div>;
  const run=async(a:AgentAction)=>{
  setEx(s=>new Set(s).add(a.id));upd(a.id,{status:"executing"});
  try{
    const res=await fetch("/api/execute",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:a})});
    const data=await res.json();
    if(data.success){
      upd(a.id,{status:"completed",result:data.result,executedAt:new Date().toISOString()});
      addA("action_approved","Executed: "+a.label+" → "+data.result,{service:a.service,scope:a.scope,riskLevel:a.riskLevel});
    }else{
      upd(a.id,{status:"failed",error:data.result,retryCount:a.retryCount+1});
      addA("action_failed","Failed: "+a.label,{service:a.service});
    }
  }catch(e){
    upd(a.id,{status:"failed",error:"Network error",retryCount:a.retryCount+1});
    addA("action_failed","Failed: "+a.label,{service:a.service});
  }
  setEx(s=>{const n=new Set(s);n.delete(a.id);return n;});
};
  const app=async(a:AgentAction)=>{if(a.riskLevel==="stepup"){setSu(a.id);return;}await run(a);};
  const rej=(a:AgentAction)=>{upd(a.id,{status:"rejected"});addA("action_rejected","Rejected: "+a.label,{service:a.service});};
  const rty=async(a:AgentAction)=>{addA("action_retried","Retry: "+a.label,{service:a.service});await run(a);};
  const csu=async()=>{if(!su||!plan)return;const a=plan.actions.find(x=>x.id===su);if(!a)return;setSu(null);addA("stepup_auth_triggered","Step-up: "+a.label,{service:a.service,riskLevel:"stepup"});await run(a);};
  const appAll=async()=>{for(const a of plan.actions.filter(x=>x.status==="pending_approval"&&x.riskLevel!=="stepup"))await app(a);};
  const pC=plan.actions.filter(a=>a.status==="pending_approval").length,dC=plan.actions.filter(a=>a.status==="completed").length;
  return(<div className="p-4 md:p-5 space-y-3">
    <div className="rounded-xl border border-m-edge bg-m-obsidian p-3.5"><div className="flex items-center justify-between"><div><p className="text-xs font-display font-semibold text-m-white">{plan.task}</p><p className="text-[10px] text-m-ghost mt-0.5">{dC}/{plan.actions.length} done · {pC} pending</p></div>{pC>0&&<button onClick={appAll} className="flex items-center gap-1 rounded-lg bg-m-copper-dim border border-m-copper/10 px-2.5 py-1.5 text-[11px] font-medium text-m-copper"><Play className="h-3 w-3"/>Approve All</button>}</div><div className="mt-2.5 h-1.5 rounded-full bg-m-edge overflow-hidden"><div className="h-full rounded-full bg-m-copper transition-all duration-500" style={{width:`${(dC/plan.actions.length)*100}%`}}/></div></div>
    {plan.actions.map((a,i)=>{const rm=RISK_META[a.riskLevel],isE=ex.has(a.id),dn=a.status==="completed",rj=a.status==="rejected",fl=a.status==="failed",pn=a.status==="pending_approval";return(
      <div key={a.id} className={`risk-bar risk-${a.riskLevel} rounded-xl border bg-m-obsidian overflow-hidden ${dn?"border-m-mint/12 opacity-60":rj?"border-m-rose/12 opacity-35":fl?"border-m-rose/20":isE?"border-m-copper/25":"border-m-edge"}`}>
        {isE&&<div className="exec-pulse h-0.5"/>}
        <div className="flex items-center gap-2.5 p-3 pl-4"><span className="text-[10px] font-mono text-m-ghost w-4">{i+1}</span><div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{background:rm.bg}}>{isE?<Loader2 className="h-3.5 w-3.5 animate-spin" style={{color:rm.color}}/>:dn?<CheckCircle2 className="h-3.5 w-3.5 text-m-mint"/>:rj?<XCircle className="h-3.5 w-3.5 text-m-rose"/>:fl?<AlertTriangle className="h-3.5 w-3.5 text-m-rose"/>:<span style={{color:rm.color}}>{ri(a.riskLevel)}</span>}</div><div className="flex-1 min-w-0"><p className={`text-xs font-medium ${dn||rj?"line-through text-m-ghost":"text-m-bone"}`}>{a.label}</p><p className="text-[9px] font-mono text-m-ghost mt-0.5">{a.service} · {a.scope} · <span style={{color:rm.color}}>{rm.label}</span>{fl&&<span className="text-m-rose"> · {a.error}</span>}</p></div>
          {pn&&!isE&&<div className="flex gap-1"><button onClick={()=>app(a)} className="w-7 h-7 rounded-lg bg-m-mint-dim border border-m-mint/10 text-m-mint flex items-center justify-center"><Check className="h-3.5 w-3.5"/></button><button onClick={()=>rej(a)} className="w-7 h-7 rounded-lg bg-m-rose-dim border border-m-rose/10 text-m-rose flex items-center justify-center"><X className="h-3.5 w-3.5"/></button></div>}
          {fl&&!isE&&<button onClick={()=>rty(a)} className="flex items-center gap-1 rounded-lg bg-m-copper-dim border border-m-copper/10 px-2 py-1 text-[10px] font-medium text-m-copper"><RotateCcw className="h-3 w-3"/>Retry</button>}
          {dn&&a.result&&<span className="text-[9px] text-m-mint max-w-[130px] truncate">{a.result}</span>}
        </div></div>);})}
    {su&&<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm"><div className="w-full max-w-sm mx-4 rounded-2xl border border-m-rose/20 bg-m-obsidian p-6 glow-rose animate-fade-up"><div className="flex items-center gap-3 mb-4"><div className="w-10 h-10 rounded-xl bg-m-rose-dim border border-m-rose/10 flex items-center justify-center"><ShieldAlert className="h-5 w-5 text-m-rose"/></div><div><p className="text-sm font-display font-semibold text-m-white">Step-Up Authentication</p><p className="text-[10px] text-m-ghost">Re-verify via Auth0 Token Vault</p></div></div><p className="text-xs text-m-ghost mb-5">Critical operation. Token Vault triggers MFA in production.</p><div className="flex gap-2"><button onClick={()=>setSu(null)} className="flex-1 py-2 rounded-lg border border-m-edge bg-m-void text-xs text-m-ghost">Cancel</button><button onClick={csu} className="flex-1 py-2 rounded-lg bg-m-rose-dim border border-m-rose/10 text-xs text-m-rose">Verify & Execute</button></div></div></div>}
  </div>);
}
