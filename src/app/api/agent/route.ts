import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@auth0/nextjs-auth0";
import { buildSystemPrompt, callGrok, parseGrokResponse } from "@/lib/grok-agent";

export async function POST(req: NextRequest) {
  try {
    let session = null;
    try {
      session = await getSession();
    } catch {
      // Session fetch failed — continue without it
    }

    const { message, services, riskOverrides, conversationHistory } = await req.json();

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ message: "Demo mode — no Grok API key.", plan: null, demo: true });
    }

    const sys = buildSystemPrompt(services, riskOverrides);
    const msgs: any[] = [
      { role: "system", content: sys },
      ...conversationHistory.slice(-16).map((m: any) => ({ role: m.role, content: m.content })),
      { role: "user", content: message },
    ];

    const raw = await callGrok(msgs);
    return NextResponse.json(parseGrokResponse(raw, message, riskOverrides));
  } catch (e: any) {
    console.error("Agent API error:", e);
    return NextResponse.json({ message: "Something went wrong: " + (e?.message ?? "unknown error"), plan: null, error: e?.message }, { status: 500 });
  }
}