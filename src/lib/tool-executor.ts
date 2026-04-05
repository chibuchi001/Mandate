// =============================================================================
// Tool Executor — bridges agent actions to real APIs via Token Vault
// =============================================================================
// When Auth0 credentials are configured, actions call real external APIs
// using tokens from Token Vault. Otherwise falls back to simulation.
// =============================================================================

import type { AgentAction } from "@/types";
import {
  getTokenFromVault,
  googleCalendarListEvents,
  slackPostMessage,
  githubListPRs,
} from "./token-vault";

const HAS_AUTH0 = () => !!process.env.AUTH0_DOMAIN && !!process.env.AUTH0_CLIENT_ID;

// ---------------------------------------------------------------------------
// Execute an action — real API if Token Vault configured, else simulate
// ---------------------------------------------------------------------------
export async function executeAction(
  action: AgentAction,
  auth0AccessToken?: string
): Promise<{ success: boolean; result: string }> {

  // If Token Vault is configured AND we have a user token, use real APIs
  if (HAS_AUTH0() && auth0AccessToken) {
    try {
      return await executeReal(action, auth0AccessToken);
    } catch (err) {
      console.error(`Real execution failed for ${action.operation}:`, err);
      return { success: false, result: `API error: ${(err as Error).message}` };
    }
  }

  // Otherwise simulate
  return executeSimulated(action);
}

// ---------------------------------------------------------------------------
// Real execution via Token Vault
// ---------------------------------------------------------------------------
async function executeReal(
  action: AgentAction,
  auth0Token: string
): Promise<{ success: boolean; result: string }> {
  switch (action.operation) {
    case "calendar_list_events":
    case "calendar_find_free_slots": {
      const now = new Date();
      const tomorrow = new Date(now.getTime() + 86400000);
      const data = await googleCalendarListEvents(
        auth0Token,
        now.toISOString(),
        tomorrow.toISOString()
      );
      if (!data) return { success: false, result: "Failed to fetch calendar — token may be missing" };
      const items = data.items || [];
      return { success: true, result: `Found ${items.length} events: ${items.slice(0, 3).map((e: any) => e.summary).join(", ")}` };
    }

    case "slack_list_channels": {
      const token = await getTokenFromVault(auth0Token, "slack");
      if (!token) return { success: false, result: "No Slack token available" };
      const res = await fetch("https://slack.com/api/conversations.list?limit=10", {
        headers: { Authorization: `Bearer ${token.access_token}` },
      });
      const data = await res.json();
      if (!data.ok) return { success: false, result: `Slack error: ${data.error}` };
      const channels = data.channels?.map((c: any) => `#${c.name}`).join(", ") ?? "none";
      return { success: true, result: `Channels: ${channels}` };
    }

    case "slack_post_message": {
      const channel = (action.details as any)?.channel ?? "general";
      const text = (action.details as any)?.text ?? "Update from Mandate";
      const data = await slackPostMessage(auth0Token, channel, text);
      if (!data?.ok) return { success: false, result: `Slack post failed: ${data?.error}` };
      return { success: true, result: `Posted to ${channel}` };
    }

    case "github_list_prs": {
      const repo = (action.details as any)?.repo ?? "owner/repo";
      const data = await githubListPRs(auth0Token, repo);
      if (!data) return { success: false, result: "Failed to fetch PRs" };
      return { success: true, result: `${data.length} open PRs: ${data.slice(0, 3).map((p: any) => `#${p.number} ${p.title}`).join(", ")}` };
    }

    case "github_review_pr": {
      const token = await getTokenFromVault(auth0Token, "github");
      if (!token) return { success: false, result: "No GitHub token" };
      const repo = (action.details as any)?.repo ?? "owner/repo";
      const pr = (action.details as any)?.pr_number ?? 1;
      const res = await fetch(`https://api.github.com/repos/${repo}/pulls/${pr}/reviews`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token.access_token}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ body: "Review from Mandate agent", event: "COMMENT" }),
      });
      if (!res.ok) return { success: false, result: `GitHub review failed: ${res.status}` };
      return { success: true, result: `Review submitted on PR #${pr}` };
    }

    case "github_merge_pr": {
      const token = await getTokenFromVault(auth0Token, "github");
      if (!token) return { success: false, result: "No GitHub token" };
      const repo = (action.details as any)?.repo ?? "owner/repo";
      const pr = (action.details as any)?.pr_number ?? 1;
      const res = await fetch(`https://api.github.com/repos/${repo}/pulls/${pr}/merge`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token.access_token}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ merge_method: "squash" }),
      });
      if (!res.ok) return { success: false, result: `Merge failed: ${res.status}` };
      return { success: true, result: `PR #${pr} merged (squash)` };
    }

    default:
      return executeSimulated(action);
  }
}

// ---------------------------------------------------------------------------
// Simulated execution (demo mode)
// ---------------------------------------------------------------------------
async function executeSimulated(
  action: AgentAction
): Promise<{ success: boolean; result: string }> {
  await new Promise((r) => setTimeout(r, 600 + Math.random() * 600));

  // 10% random failure for retry demo
  if (Math.random() < 0.1) {
    return { success: false, result: "Temporary API error — service returned 503" };
  }

  const results: Record<string, string> = {
    calendar_list_events: "Found 3 events: Standup 9am, Design Review 11am, 1:1 2pm",
    calendar_find_free_slots: "Available: 10-11am, 12-1pm, 3-4:30pm",
    calendar_create_event: "Event created — invitations sent",
    gmail_search: "Found 5 matching emails",
    gmail_send: "Email sent successfully",
    slack_list_channels: "12 channels: #general, #engineering, #design...",
    slack_read_messages: "Read 10 recent messages",
    slack_post_message: "Message posted",
    github_list_prs: "3 open PRs: #42 auth flow, #38 token refresh, #35 README",
    github_create_issue: "Issue created",
    github_review_pr: "Review submitted",
    github_merge_pr: "PR merged (squash)",
  };

  return {
    success: true,
    result: results[action.operation] ?? "Completed",
  };
}
