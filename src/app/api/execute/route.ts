import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@auth0/nextjs-auth0";
import { getTokenFromVault } from "@/lib/token-vault";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    const { action } = await req.json();

    // Try real execution if we have a session with access token
    if (session?.accessToken) {
      const result = await executeReal(action, session.accessToken);
      if (result) return NextResponse.json(result);
    }

    // Fallback to simulation
    return NextResponse.json(await executeSimulated(action));
  } catch (e: any) {
    console.error("Execute error:", e);
    return NextResponse.json({ success: false, result: "Error: " + (e?.message ?? "unknown") });
  }
}

async function executeReal(action: any, auth0Token: string) {
  const serviceMap: Record<string, string> = {
    google: "google-oauth2",
    slack: "slack",
    github: "github",
  };

  const connection = serviceMap[action.service];
  if (!connection) return null;

  const token = await getTokenFromVault(auth0Token, action.service);
  if (!token) return null;

  switch (action.operation) {
    case "calendar_list_events":
    case "calendar_find_free_slots":
    case "cal_find": {
      const now = new Date();
      const tomorrow = new Date(now.getTime() + 86400000);
      const res = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${now.toISOString()}&timeMax=${tomorrow.toISOString()}&singleEvents=true&orderBy=startTime&maxResults=5`,
        { headers: { Authorization: `Bearer ${token.access_token}` } }
      );
      if (!res.ok) return { success: false, result: `Google Calendar error: ${res.status}` };
      const data = await res.json();
      const events = data.items?.map((e: any) => e.summary).filter(Boolean) || [];
      return { success: true, result: events.length ? `Found ${events.length} events: ${events.join(", ")}` : "No upcoming events found" };
    }

    case "slack_list_channels":
    case "slack_ch": {
      const res = await fetch("https://slack.com/api/conversations.list?limit=10", {
        headers: { Authorization: `Bearer ${token.access_token}` },
      });
      const data = await res.json();
      if (!data.ok) return { success: false, result: `Slack error: ${data.error}` };
      const channels = data.channels?.map((c: any) => `#${c.name}`).join(", ") ?? "none";
      return { success: true, result: `Channels: ${channels}` };
    }

    case "slack_post_message":
    case "slack_post": {
      const channel = action.details?.channel ?? "general";
      const text = action.details?.text ?? "Update from Mandate";
      const res = await fetch("https://slack.com/api/chat.postMessage", {
        method: "POST",
        headers: { Authorization: `Bearer ${token.access_token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ channel, text }),
      });
      const data = await res.json();
      if (!data.ok) return { success: false, result: `Slack error: ${data.error}` };
      return { success: true, result: `Posted to ${channel}` };
    }

    default:
      return null; // Fall through to simulation
  }
}

async function executeSimulated(action: any) {
  await new Promise(r => setTimeout(r, 600 + Math.random() * 600));
  const results: Record<string, string> = {
    calendar_list_events: "Found 3 events: Standup 9am, Design Review 11am, 1:1 2pm",
    cal_find: "Available: 10-11am, 12-1pm, 3-4:30pm",
    cal_create: "Event created",
    gmail_s: "Found 5 emails",
    gmail_send: "Email sent",
    slack_ch: "12 channels: #general, #engineering, #design...",
    slack_post: "Message posted",
    gh_prs: "3 open PRs: #42 auth, #38 tokens, #35 docs",
    gh_review: "Review submitted",
    gh_merge: "PR merged",
  };
  return { success: true, result: results[action.operation] ?? "Completed" };
}