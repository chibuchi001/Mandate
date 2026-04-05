"use client";
import { useState,useRef,useEffect } from "react";
import { Send,Hexagon,User,Loader2,WifiOff } from "lucide-react";
import { useStore } from "@/lib/store";
import { ActionPlanCard } from "./ActionPlanCard";
import type { ActionPlan,AgentAction,ConnectedService,ServiceId,RiskLevel } from "@/types";
const uid=()=>Math.random().toString(36).slice(2,9),now=()=>new Date().toISOString();
export function ChatPanel(){
  const[inp,setInp]=useState("");const[api,setApi]=useState(true);const end=useRef<HTMLDivElement>(null);
  const msgs=useStore(s=>s.messages),add=useStore(s=>s.addMessage),thk=useStore(s=>s.thinking),setThk=useStore(s=>s.setThinking);
  const svcs=useStore(s=>s.services),ov=useStore(s=>s.riskOverrides),setP=useStore(s=>s.setPlan),addA=useStore(s=>s.addAudit);
  const setTab=useStore(s=>s.setActiveTab),setMob=useStore(s=>s.setMobilePanel),getH=useStore(s=>s.getHistory);
  useEffect(()=>{end.current?.scrollIntoView({behavior:"smooth"});},[msgs,thk]);
  const send=async()=>{const t=inp.trim();if(!t||thk)return;setInp("");add({role:"user",content:t});setThk(true);
    let r:{message:string;plan:ActionPlan|null};
    if(api){try{const res=await fetch("/api/agent",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:t,services:svcs,riskOverrides:ov,conversationHistory:getH()})});const d=await res.json();if(d.demo){setApi(false);r=sim(t,svcs,ov);}else if(d.error==="rate_limit")r={message:d.message,plan:null};else r={message:d.message,plan:d.plan??null};}catch{setApi(false);r=sim(t,svcs,ov);}}
    else{await new Promise(x=>setTimeout(x,800+Math.random()*700));r=sim(t,svcs,ov);}
    add({role:"assistant",content:r.message,plan:r.plan??undefined});
    if(r.plan){
  // Auto-execute via API for real data
  for(const a of r.plan.actions){
    if(a.riskLevel==="auto"){
      try{
        const res=await fetch("/api/execute",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:a})});
        const data=await res.json();
        a.status="completed";a.result=data.result||"Auto-executed";a.executedAt=now();
        addA("action_auto_executed","Auto: "+a.label+" → "+a.result,{service:a.service,scope:a.scope,riskLevel:"auto"});
      }catch{
        a.status="completed";a.result="Auto-executed (demo)";a.executedAt=now();
        addA("action_auto_executed","Auto: "+a.label,{service:a.service,scope:a.scope,riskLevel:"auto"});
      }
    }
  }
  setP({...r.plan});setTab("actions");setMob("dashboard");
  addA("action_auto_executed",`Plan: "${r.plan.task}"`);
}
    setThk(false);};
  return(<div className="flex flex-1 flex-col">
    <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 space-y-3">
      {msgs.map(m=><div key={m.id} className={`flex gap-2.5 animate-fade-up ${m.role==="user"?"flex-row-reverse":""}`}><div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${m.role==="user"?"bg-m-ice-dim border border-m-ice/10":"bg-m-copper-dim border border-m-copper/10"}`}>{m.role==="user"?<User className="h-3.5 w-3.5 text-m-ice"/>:<Hexagon className="h-3.5 w-3.5 text-m-copper" strokeWidth={2.5}/>}</div><div className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 ${m.role==="user"?"bg-m-ice-dim border border-m-ice/10":"bg-m-slate border border-m-edge"} text-m-bone`}><p className="text-[13px] leading-relaxed whitespace-pre-wrap">{m.content}</p>{m.plan&&<ActionPlanCard plan={m.plan}/>}<span className="mt-1.5 block text-[9px] font-mono text-m-ghost">{new Date(m.timestamp).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}</span></div></div>)}
      {thk&&<div className="flex gap-2.5 animate-fade-up"><div className="w-7 h-7 rounded-lg bg-m-copper-dim border border-m-copper/10 flex items-center justify-center flex-shrink-0"><Hexagon className="h-3.5 w-3.5 text-m-copper" strokeWidth={2.5}/></div><div className="flex items-center gap-1.5 rounded-2xl border border-m-edge bg-m-slate px-4 py-2.5">{[0,1,2].map(i=><div key={i} className="w-1.5 h-1.5 rounded-full bg-m-copper/50" style={{animation:`bounce-dot 1.4s ease-in-out ${i*.2}s infinite`}}/>)}</div></div>}
      <div ref={end}/>
    </div>
    <div className="border-t border-m-edge bg-m-obsidian p-3 md:p-4"><div className="flex items-center gap-2.5 rounded-xl border border-m-edge bg-m-void px-3 py-1.5 focus-within:border-m-copper/30 transition-colors"><input type="text" value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&send()} placeholder="Give Mandate a task…" className="flex-1 bg-transparent text-sm text-m-bone placeholder:text-m-ghost outline-none font-body" disabled={thk}/>{!api&&<WifiOff className="h-3 w-3 text-m-ghost"/>}<button onClick={send} disabled={!inp.trim()||thk} className="w-8 h-8 rounded-lg bg-m-copper-dim border border-m-copper/10 text-m-copper flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed">{thk?<Loader2 className="h-4 w-4 animate-spin"/>:<Send className="h-4 w-4"/>}</button></div><p className="mt-1.5 text-center text-[9px] font-mono text-m-ghost">{api?"grok ai":"demo"} · mandate shows its plan before acting</p></div>
  </div>);
}
function mk(o:string,l:string,s:ServiceId,r:RiskLevel,sc:string):AgentAction{return{id:uid(),service:s,operation:o,label:l,riskLevel:r,status:r==="auto"?"approved":"pending_approval",scope:sc,retryCount:0,createdAt:now()};}
function ef(s:ServiceId,sc:string,ov:Record<string,RiskLevel>,f:RiskLevel):RiskLevel{return ov[`${s}.${sc}`]??f;}
function sim(i:string,sv:ConnectedService[],ov:Record<string,RiskLevel>):{message:string;plan:ActionPlan|null}{
  const l=i.toLowerCase(),gc=sv.find(s=>s.id==="google")?.connected,sc=sv.find(s=>s.id==="slack")?.connected,gh=sv.find(s=>s.id==="github")?.connected;
  if(l.match(/schedule|meeting|calendar|free|availab/)){if(!gc)return{message:"I need Google Workspace →",plan:null};const a=[mk("cal_find","Find slots","google",ef("google","cal.read",ov,"auto"),"cal.read"),mk("cal_create","Create event","google",ef("google","cal.write",ov,"confirm"),"cal.write")];if(sc&&l.match(/notify|slack|tell|post|let/))a.push(mk("slack_post","Notify #engineering","slack",ef("slack","msg.write",ov,"confirm"),"msg.write"));return{message:"Plan ready. Auto steps execute immediately.",plan:{id:uid(),task:"Schedule meeting",actions:a,createdAt:now()}};}
  if(l.match(/slack|post|message|channel/)&&!l.match(/calendar|meeting/)){if(!sc)return{message:"Slack not connected →",plan:null};return{message:"List channels (auto), then post (confirm).",plan:{id:uid(),task:"Post to Slack",actions:[mk("ch","List channels","slack",ef("slack","ch.read",ov,"auto"),"ch.read"),mk("post","Post to #engineering","slack",ef("slack","msg.write",ov,"confirm"),"msg.write")],createdAt:now()}};}
  if(l.match(/github|pr |pull request|merge|review|repo|issue/)){if(!gh)return{message:"I need GitHub →",plan:null};const a=[mk("prs","List open PRs","github",ef("github","repo.read",ov,"auto"),"repo.read")];if(l.match(/review/))a.push(mk("rev","Review PR #42","github",ef("github","pr.review",ov,"approve"),"pr.review"));if(l.match(/merge/))a.push(mk("mrg","Merge PR #42 (step-up)","github",ef("github","pr.merge",ov,"stepup"),"pr.merge"));return{message:l.match(/merge/)?"Step-up required:":"Listing PRs.",plan:{id:uid(),task:l.match(/merge/)?"Merge PR":"Review PRs",actions:a,createdAt:now()}};}
  if(l.match(/email|mail|send/)){if(!gc)return{message:"Need Google Workspace →",plan:null};return{message:"Email requires approval:",plan:{id:uid(),task:"Send email",actions:[mk("search","Search emails","google",ef("google","mail.read",ov,"auto"),"mail.read"),mk("send","Send email","google",ef("google","mail.send",ov,"approve"),"mail.send")],createdAt:now()}};}
  const cn=sv.filter(s=>s.connected).map(s=>s.name);if(!cn.length)return{message:"Connect services to define my authority.\n\nThen: \"Schedule a meeting\" or \"Review PRs\"",plan:null};
  return{message:`Connected: ${cn.join(", ")}.\n\nTry:\n• "Schedule a meeting"\n• "Post to Slack"\n• "Review and merge PR #42"`,plan:null};
}
