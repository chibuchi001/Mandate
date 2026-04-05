export type ServiceId = "google"|"slack"|"github";
export type RiskLevel = "auto"|"confirm"|"approve"|"stepup";
export type ActionStatus = "planned"|"pending_approval"|"approved"|"executing"|"completed"|"rejected"|"failed"|"retrying";
export type TokenHealth = "active"|"expiring"|"expired"|"revoked"|"missing";
export type AuditEventType = "service_connected"|"service_disconnected"|"scope_granted"|"scope_revoked"|"action_auto_executed"|"action_approved"|"action_rejected"|"action_failed"|"action_retried"|"stepup_auth_triggered"|"token_refreshed"|"token_expired"|"risk_rule_changed"|"consent_receipt_exported";
export const RISK_META: Record<RiskLevel,{label:string;color:string;bg:string;border:string;desc:string}> = {
  auto:{label:"Auto",color:"#3ddba4",bg:"rgba(61,219,164,.07)",border:"rgba(61,219,164,.2)",desc:"Read-only, auto-executes"},
  confirm:{label:"Confirm",color:"#5bb8f5",bg:"rgba(91,184,245,.07)",border:"rgba(91,184,245,.2)",desc:"Write op, confirm once"},
  approve:{label:"Approve",color:"#e8a44a",bg:"rgba(232,164,74,.07)",border:"rgba(232,164,74,.2)",desc:"Sensitive, always approve"},
  stepup:{label:"Step-Up",color:"#f5587a",bg:"rgba(245,88,122,.07)",border:"rgba(245,88,122,.2)",desc:"Critical, re-authenticate"},
};
export interface ServiceScope {id:string;label:string;description:string;defaultRisk:RiskLevel;userRisk?:RiskLevel;enabled:boolean}
export interface ConnectedService {id:ServiceId;name:string;icon:string;description:string;gradient:string;iconColor:string;connected:boolean;connectedAt?:string;scopes:ServiceScope[];tokenHealth:TokenHealth;tokenExpiresAt?:string}
export interface AgentAction {id:string;service:ServiceId;operation:string;label:string;riskLevel:RiskLevel;status:ActionStatus;scope:string;details?:Record<string,unknown>;result?:string;error?:string;retryCount:number;createdAt:string;executedAt?:string}
export interface ActionPlan {id:string;task:string;actions:AgentAction[];createdAt:string}
export interface AuditEntry {id:string;type:AuditEventType;message:string;service?:ServiceId;scope?:string;riskLevel?:RiskLevel;timestamp:string}
export interface ChatMessage {id:string;role:"user"|"assistant"|"system";content:string;plan?:ActionPlan;timestamp:string}
