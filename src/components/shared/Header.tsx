"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import { Hexagon, Zap, AlertTriangle, LogOut } from "lucide-react";
import { useStore } from "@/lib/store";

export function Header() {
  const { user } = useUser();
  const services = useStore(s => s.services);
  const connected = services.filter(s => s.connected);
  const unhealthy = connected.filter(s => s.tokenHealth !== "active");

  return (
    <header className="flex h-13 items-center justify-between border-b border-m-edge bg-m-obsidian px-4 md:px-6 flex-shrink-0">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-m-copper-dim border border-m-copper/10 flex items-center justify-center">
          <Hexagon className="h-4 w-4 text-m-copper" strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="text-[13px] font-display font-bold tracking-tight text-m-white">Mandate</h1>
          <p className="text-[8px] font-mono font-medium uppercase tracking-[0.14em] text-m-ghost">define your agent&apos;s authority</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {unhealthy.length > 0 && (
          <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-m-ember-dim px-2.5 py-1 border border-m-ember/10">
            <AlertTriangle className="h-3 w-3 text-m-ember" />
            <span className="text-[10px] font-medium text-m-ember">{unhealthy.length} token{unhealthy.length > 1 ? "s" : ""} need attention</span>
          </div>
        )}
        <div className="flex items-center gap-1.5 rounded-full bg-m-void px-2.5 py-1 border border-m-edge">
          <Zap className="h-3 w-3 text-m-copper" />
          <span className="text-[10px] font-medium text-m-ghost"><span className="text-m-copper">{connected.length}</span>/{services.length}</span>
        </div>
        <div className="hidden md:flex items-center gap-1">
          {services.map(s => <div key={s.id} className={`w-2 h-2 rounded-full ${!s.connected ? "bg-m-edge" : s.tokenHealth === "active" ? "bg-m-mint" : s.tokenHealth === "expiring" ? "bg-m-copper animate-pulse" : "bg-m-rose"}`} />)}
        </div>
        {user && (
          <div className="flex items-center gap-2">
            {user.picture ? (
              <img src={user.picture} alt="" className="w-7 h-7 rounded-full ring-2 ring-m-edge" />
            ) : (
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-m-copper/30 to-m-ice/30 ring-2 ring-m-edge" />
            )}
            <span className="hidden sm:inline text-[11px] text-m-ghost truncate max-w-[100px]">{user.name ?? user.email}</span>
            <a href="/api/auth/logout" className="w-7 h-7 rounded-lg flex items-center justify-center text-m-ghost hover:text-m-rose hover:bg-m-rose-dim transition-colors" title="Sign out">
              <LogOut className="h-3.5 w-3.5" />
            </a>
          </div>
        )}
      </div>
    </header>
  );
}
