import OpenAI from "openai";
import type { ConnectedService, AgentAction, ActionPlan, RiskLevel, ServiceId } from "@/types";

const getClient = () => new OpenAI({
  apiKey: process.env.GROQ_API_KEY || "",
  baseURL: "https://api.groq.com/openai/v1",
});

export const AGENT_TOOLS = [
  { name:"calendar_list_events", service:"google" as ServiceId, scope:"cal.read", defaultRisk:"auto" as RiskLevel, description:"List calendar events" },
  { name:"calendar_find_free_slots", service:"google" as ServiceId, scope:"cal.read", defaultRisk:"auto" as RiskLevel, description:"Find free slots" },
  { name:"calendar_create_event", service:"google" as ServiceId, scope:"cal.write", defaultRisk:"confirm" as RiskLevel, description:"Create event" },
  { name:"gmail_search", service:"google" as ServiceId, scope:"mail.read", defaultRisk:"auto" as RiskLevel, description:"Search emails" },
  { name:"gmail_send", service:"google" as ServiceId, scope:"mail.send", defaultRisk:"approve" as RiskLevel, description:"Send email" },
  { name:"slack_list_channels", service:"slack" as ServiceId, scope:"ch.read", defaultRisk:"auto" as RiskLevel, description:"List channels" },
  { name:"slack_read_messages", service:"slack" as ServiceId, scope:"msg.read", defaultRisk:"auto" as RiskLevel, description:"Read messages" },
  { name:"slack_post_message", service:"slack" as ServiceId, scope:"msg.write", defaultRisk:"confirm" as RiskLevel, description:"Post message" },
  { name:"github_list_prs", service:"github" as ServiceId, scope:"repo.read", defaultRisk:"auto" as RiskLevel, description:"List PRs" },
  { name:"github_create_issue", service:"github" as ServiceId, scope:"iss.write", defaultRisk:"confirm" as RiskLevel, description:"Create issue" },
  { name:"github_review_pr", service:"github" as ServiceId, scope:"pr.review", defaultRisk:"approve" as RiskLevel, description:"Review PR" },
  { name:"github_merge_pr", service:"github" as ServiceId, scope:"pr.merge", defaultRisk:"stepup" as RiskLevel, description:"Merge PR (critical)" },
];

export function buildSystemPrompt(services: ConnectedService[], ov: Record<string, RiskLevel>): string {
  const conn = services.filter(s => s.connected);
  const tools = AGENT_TOOLS.filter(t => conn.some(s => s.id === t.service));
  const list = tools.map(t => `- ${t.name} [${t.service}/${t.scope}] (risk: ${ov[`${t.service}.${t.scope}`] ?? t.defaultRisk}): ${t.description}`).join("\n");
  const disabled = conn.flatMap(s => s.scopes.filter(sc => !sc.enabled).map(sc => `${s.id}/${sc.id}`));
  return `You are Mandate, an AI agent operating within explicit permission boundaries.\nCONNECTED: ${conn.map(s=>s.name).join(", ")||"None"}\n${disabled.length?`DISABLED: ${disabled.join(", ")}`:""}\nTOOLS:\n${list||"None."}\nRULES: 1) Show plan before acting 2) Show risk per action 3) Never bypass permissions 4) Remember context\nRespond ONLY with JSON: { "message": "...", "actions": [{ "tool": "...", "label": "...", "parameters": {} }] }\nOmit "actions" if none needed.`;
}

export async function callGrok(msgs: { role: "system"|"user"|"assistant"; content: string }[]): Promise<string> {
  const r = await getClient().chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: msgs,
    max_tokens: 1024,
    temperature: 0.7,
  });
  return r.choices[0]?.message?.content ?? "";
}

const uid = () => Math.random().toString(36).slice(2, 9);

export function parseGrokResponse(raw: string, task: string, ov: Record<string, RiskLevel>): { message: string; plan: ActionPlan | null } {
  try {
    const p = JSON.parse(raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim());
    if (!p.actions?.length) return { message: p.message || raw, plan: null };
    const actions: AgentAction[] = p.actions.map((a: any) => {
      const d = AGENT_TOOLS.find(t => t.name === a.tool);
      const r = d ? ov[`${d.service}.${d.scope}`] ?? d.defaultRisk : ("approve" as RiskLevel);
      return { id: uid(), service: (d?.service ?? "google") as ServiceId, operation: a.tool, label: a.label, riskLevel: r, status: r === "auto" ? "approved" : "pending_approval", scope: d?.scope ?? "", details: a.parameters, retryCount: 0, createdAt: new Date().toISOString() } as AgentAction;
    });
    return { message: p.message, plan: { id: uid(), task, actions, createdAt: new Date().toISOString() } };
  } catch { return { message: raw, plan: null }; }
}