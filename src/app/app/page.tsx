"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { DashboardPanel } from "@/components/dashboard/DashboardPanel";
import { Header } from "@/components/shared/Header";
import { useStore } from "@/lib/store";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

const STORAGE_KEY = "mandate_connected_services";

export default function AppPage() {
  const { user, isLoading } = useUser();
  const searchParams = useSearchParams();
  const connectService = useStore(s => s.connectService);
  const disconnectService = useStore(s => s.disconnectService);
  const services = useStore(s => s.services);
  const mobilePanel = useStore(s => s.mobilePanel);
  const setMobilePanel = useStore(s => s.setMobilePanel);

  // Load persisted connections on mount
  useEffect(() => {
    if (!user) return;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const connected: string[] = JSON.parse(saved);
        connected.forEach(id => {
          const svc = services.find(s => s.id === id);
          if (svc && !svc.connected) connectService(id as any);
        });
      }
    } catch {}
  }, [user]);

  // Handle OAuth redirect — mark service as connected
  useEffect(() => {
    if (!user) return;
    const conn = searchParams.get("connection");
    if (conn === "google-oauth2") connectService("google");
    if (conn === "slack") connectService("slack");
    if (conn === "github") connectService("github");
  }, [user, searchParams, connectService]);

  // Persist connected services whenever they change
  useEffect(() => {
    const connected = services.filter(s => s.connected).map(s => s.id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(connected));
  }, [services]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-m-void">
        <Loader2 className="h-6 w-6 text-m-copper animate-spin" />
      </div>
    );
  }

  if (!user) {
    if (typeof window !== "undefined") window.location.href = "/api/auth/login";
    return null;
  }

  return (
    <div className="app-shell flex h-screen flex-col bg-m-void">
      <Header />
      <div className="flex md:hidden border-b border-m-edge bg-m-obsidian">
        {(["chat", "dashboard"] as const).map(p => (
          <button key={p} onClick={() => setMobilePanel(p)} className={`flex-1 py-2.5 text-xs font-medium capitalize transition-colors relative ${mobilePanel === p ? "text-m-copper" : "text-m-ghost"}`}>
            {p}{mobilePanel === p && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-m-copper" />}
          </button>
        ))}
      </div>
      <div className="flex flex-1 overflow-hidden desktop-split">
        <div className={`panel-half w-full md:w-1/2 flex-col border-r border-m-edge ${mobilePanel === "chat" ? "flex" : "hidden md:flex"}`}>
          <ChatPanel />
        </div>
        <div className={`panel-half w-full md:w-1/2 flex-col ${mobilePanel === "dashboard" ? "flex" : "hidden md:flex"}`}>
          <DashboardPanel />
        </div>
      </div>
    </div>
  );
}