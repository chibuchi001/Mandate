import { NextRequest, NextResponse } from "next/server";
export async function POST(r: NextRequest) { const { auditLog } = await r.json(); return NextResponse.json({ success: true, count: auditLog.length }); }
