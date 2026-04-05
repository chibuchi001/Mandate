"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import Link from "next/link";
import { OrbitingCircles } from "@/components/shared/OrbitingCircles";

export default function LandingPage() {
  const { user } = useUser();

  return (
    <div style={{ minHeight: "100vh", background: "#06060a", color: "#d8d8e8", fontFamily: "'Figtree',system-ui,sans-serif", overflowX: "hidden" }}>

      <div className="hex-grid" />
      <div className="orb" style={{ width: 500, height: 500, background: "#e8a44a", top: "-8%", left: "-5%", opacity: .08 }} />
      <div className="orb" style={{ width: 400, height: 400, background: "#5bb8f5", bottom: "-5%", right: "-8%", opacity: .06, animationDelay: "-8s" }} />

      {/* NAV */}
      <nav className="rv d1" style={{ position: "relative", zIndex: 10, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 32px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(232,164,74,0.06)", border: "1px solid rgba(232,164,74,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#e8a44a" strokeWidth="2.5"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" /></svg>
          </div>
          <span style={{ fontSize: 16, fontWeight: 700, fontFamily: "'Bricolage Grotesque'", letterSpacing: "-.02em" }}>Mandate</span>
        </div>
        <div className="nav-links" style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <a href="#features" style={{ fontSize: 13, color: "#4a4a6a" }}>Features</a>
          <a href="#security" style={{ fontSize: 13, color: "#4a4a6a" }}>Security</a>
          {user ? (
            <Link href="/app" className="cta-m" style={{ padding: "8px 20px", fontSize: 12 }}>Open App →</Link>
          ) : (
            <a href="/api/auth/login" className="cta-m" style={{ padding: "8px 20px", fontSize: 12 }}>Sign In</a>
          )}
        </div>
      </nav>

      {/* HERO */}
      <section style={{ position: "relative", zIndex: 5, maxWidth: 1200, margin: "0 auto", padding: "80px 32px 60px", textAlign: "center" }}>
        <div className="rv d2" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(232,164,74,0.05)", border: "1px solid rgba(232,164,74,0.1)", borderRadius: 20, padding: "5px 16px", marginBottom: 28 }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#e8a44a" strokeWidth="2.5"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" /></svg>
          <span style={{ fontSize: 11, fontWeight: 500, color: "#e8a44a", letterSpacing: ".04em", fontFamily: "'IBM Plex Mono'" }}>Auth0 End-to-End · Token Vault · Grok AI</span>
        </div>

        <h1 className="rv d3 hero-t" style={{ fontFamily: "'Bricolage Grotesque'", fontSize: 58, fontWeight: 800, lineHeight: 1.06, letterSpacing: "-.04em", marginBottom: 20, background: "linear-gradient(135deg, #f0f0f8 30%, #e8a44a 85%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Define your agent&apos;s<br />authority
        </h1>

        <p className="rv d4" style={{ fontSize: 17, lineHeight: 1.65, color: "#4a4a6a", maxWidth: 520, margin: "0 auto 36px" }}>
          Mandate gives AI agents the power to act — within boundaries you set. Every permission visible. Every action auditable. Every token governed by Auth0.
        </p>

        <div className="rv d5" style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
          {user ? (
            <Link href="/app" className="cta-m" style={{ textDecoration: "none" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" /></svg>
              Open Dashboard
            </Link>
          ) : (
            <a href="/api/auth/login" className="cta-m">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" /></svg>
              Get Started with Auth0
            </a>
          )}
          <a href="https://github.com" className="cta-g">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
            View Source
          </a>
        </div>

        {/* App mockup */}
        <div className="rv d6" style={{ marginTop: 56, borderRadius: 18, border: "1px solid rgba(232,164,74,0.06)", background: "rgba(12,12,20,0.7)", backdropFilter: "blur(14px)", overflow: "hidden", maxWidth: 880, marginLeft: "auto", marginRight: "auto", boxShadow: "0 24px 80px rgba(0,0,0,0.5)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,0.03)", background: "rgba(12,12,20,0.8)" }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57" }} />
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#febc2e" }} />
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840" }} />
            <span style={{ marginLeft: 12, fontSize: 11, color: "#4a4a6a", fontFamily: "'IBM Plex Mono'" }}>mandate — /app</span>
          </div>
          <div style={{ display: "flex", minHeight: 280 }}>
            <div style={{ flex: 1, padding: 20, borderRight: "1px solid rgba(255,255,255,0.03)" }}>
              <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                <div style={{ width: 26, height: 26, borderRadius: 8, background: "rgba(91,184,245,0.06)", flexShrink: 0 }} />
                <div style={{ flex: 1, borderRadius: 12, background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.03)", padding: "8px 12px" }}>
                  <div style={{ fontSize: 11.5, color: "#7a7a9a" }}>Schedule a meeting and notify Slack.</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <div style={{ width: 26, height: 26, borderRadius: 8, background: "rgba(232,164,74,0.06)", flexShrink: 0 }} />
                <div style={{ flex: 1, borderRadius: 12, background: "rgba(232,164,74,0.02)", border: "1px solid rgba(232,164,74,0.06)", padding: "8px 12px" }}>
                  <div style={{ fontSize: 11.5, color: "#a0a0b8", marginBottom: 8 }}>Plan — 3 steps:</div>
                  <div style={{ borderRadius: 8, border: "1px solid rgba(255,255,255,0.03)", overflow: "hidden" }}>
                    {[{ l: "Find free slots", c: "#3ddba4", r: "Auto" }, { l: "Create event", c: "#5bb8f5", r: "Confirm" }, { l: "Notify #eng", c: "#5bb8f5", r: "Confirm" }].map((a, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 8px", borderLeft: `2px solid ${a.c}`, borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.02)" : "none" }}>
                        <span style={{ fontSize: 8, fontFamily: "'IBM Plex Mono'", color: "#4a4a6a" }}>{i + 1}</span>
                        <span style={{ flex: 1, fontSize: 10.5, color: "#b0b0c8" }}>{a.l}</span>
                        <span style={{ fontSize: 8, color: a.c, background: `${a.c}10`, borderRadius: 4, padding: "1px 5px" }}>{a.r}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div style={{ flex: 1, padding: 20 }}>
              <div style={{ fontSize: 9, fontWeight: 600, color: "#4a4a6a", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 12, fontFamily: "'IBM Plex Mono'" }}>Connected via Token Vault</div>
              {[{ n: "Google Workspace", i: "G", c: "#4285f4", ok: true }, { n: "Slack", i: "S", c: "#611F69", ok: true }, { n: "GitHub", i: "GH", c: "#8b949e", ok: false }].map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.03)", marginBottom: 6 }}>
                  <div style={{ width: 26, height: 26, borderRadius: 8, background: `${s.c}10`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: s.c, fontFamily: "'IBM Plex Mono'" }}>{s.i}</div>
                  <div style={{ flex: 1, fontSize: 11, fontWeight: 500, color: "#b0b0c8" }}>{s.n}</div>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: s.ok ? "#3ddba4" : "#e8a44a" }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ position: "relative", zIndex: 5, padding: "80px 0" }}>
        <div className="rv d2" style={{ textAlign: "center", marginBottom: 48, padding: "0 32px" }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: "#e8a44a", textTransform: "uppercase", letterSpacing: ".1em", fontFamily: "'IBM Plex Mono'" }}>Features</span>
          <h2 style={{ fontFamily: "'Bricolage Grotesque'", fontSize: 36, fontWeight: 700, marginTop: 8, letterSpacing: "-.03em" }}>Authorization as a first-class experience</h2>
        </div>
        {(() => {
          const row1 = [
            { icon: "⬡", title: "4-Tier Risk Model", desc: "Auto, Confirm, Approve, or Step-Up. Every action classified before execution." },
            { icon: "◈", title: "Custom Risk Rules", desc: "Override any scope's risk level. Your trust model, encoded." },
            { icon: "⊡", title: "Granular Scopes", desc: "Toggle individual permissions. Disable email sending, keep calendar." },
            { icon: "⬢", title: "Policy as Code", desc: "Define authorization rules declaratively. Version-controlled, reviewable, auditable." },
            { icon: "⊞", title: "Multi-Service Support", desc: "Connect Google, Slack, GitHub and more. One unified permission model." },
            { icon: "◫", title: "Step-Up Auth", desc: "Re-authenticate via Auth0 for sensitive actions. Identity verified every time." },
          ];
          const row2 = [
            { icon: "◉", title: "Token Health", desc: "Live indicators via Token Vault: active, expiring, revoked." },
            { icon: "▣", title: "Consent Receipts", desc: "Export your full audit trail as a PDF compliance document." },
            { icon: "↻", title: "Retry on Failure", desc: "Failed actions show errors and offer one-click retry." },
            { icon: "◎", title: "Real-time Audit Log", desc: "Every agent action logged with timestamp, scope, and outcome." },
            { icon: "⊟", title: "Scope Delegation", desc: "Grant sub-agents narrower permissions. Least-privilege by default." },
            { icon: "⬛", title: "Agent Sandboxing", desc: "Isolate each agent session. Revoke access instantly without side effects." },
          ];
          const renderRow = (items: typeof row1, reverse: boolean, key: string) => (
            <div key={key} className="marquee-outer rv d3" style={{ marginBottom: 16 }}>
              <div className={reverse ? "marquee-track marquee-reverse" : "marquee-track"}>
                {[...items, ...items, ...items, ...items].map((f, i) => (
                  <div key={i} className="fc">
                    <div style={{ fontSize: 24, marginBottom: 14, color: "#e8a44a" }}>{f.icon}</div>
                    <h3 style={{ fontSize: 15, fontWeight: 700, fontFamily: "'Bricolage Grotesque'", marginBottom: 8, color: "#f0f0f8" }}>{f.title}</h3>
                    <p style={{ fontSize: 13, lineHeight: 1.6, color: "#4a4a6a" }}>{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          );
          return <>{renderRow(row1, false, "r1")}{renderRow(row2, true, "r2")}</>;
        })()}
      </section>

      {/* SECURITY */}
      <section id="security" style={{ position: "relative", zIndex: 5, maxWidth: 1200, margin: "0 auto", padding: "40px 32px 100px" }}>
        <div className="rv d2" style={{ display: "flex", alignItems: "center", gap: 48, flexWrap: "wrap" }}>

          {/* Left: text + tier list */}
          <div style={{ flex: "1 1 340px", minWidth: 280 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: "#f5587a", textTransform: "uppercase", letterSpacing: ".1em", fontFamily: "'IBM Plex Mono'" }}>Security Model</span>
            <h2 style={{ fontFamily: "'Bricolage Grotesque'", fontSize: 36, fontWeight: 700, marginTop: 8, marginBottom: 14, letterSpacing: "-.03em" }}>Progressive trust,<br />not blind access</h2>
            <p style={{ fontSize: 14, color: "#4a4a6a", lineHeight: 1.7, marginBottom: 28, maxWidth: 400 }}>
              Every agent action is classified before execution. No blanket access — just the minimum authority needed, scoped and logged.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { l: "Auto",    c: "#3ddba4", d: "Executes immediately",        e: "Read calendar, list channels" },
                { l: "Confirm", c: "#5bb8f5", d: "One-time confirmation",        e: "Create events, post to Slack" },
                { l: "Approve", c: "#e8a44a", d: "Explicit every time",          e: "Send emails, review PRs" },
                { l: "Step-Up", c: "#f5587a", d: "Re-authenticate via Auth0",    e: "Merge PRs, admin actions" },
              ].map(t => (
                <div key={t.l} style={{ display: "flex", alignItems: "center", gap: 14, borderRadius: 12, border: `1px solid ${t.c}18`, background: `${t.c}06`, padding: "12px 16px" }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: t.c, fontFamily: "'IBM Plex Mono'", minWidth: 52, textTransform: "uppercase", letterSpacing: ".06em" }}>{t.l}</span>
                  <div style={{ width: 1, height: 28, background: `${t.c}30` }} />
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#d8d8e8" }}>{t.d}</div>
                    <div style={{ fontSize: 11, color: "#4a4a6a", marginTop: 2 }}>{t.e}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: orbiting circles */}
          <div style={{ flex: "1 1 360px", display: "flex", justifyContent: "center" }}>
            <div className="rv d4" style={{ position: "relative", width: 380, height: 380, display: "flex", alignItems: "center", justifyContent: "center" }}>

              {/* Center badge */}
              <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, borderRadius: 18, border: "1px solid rgba(232,164,74,0.14)", background: "rgba(12,12,20,0.9)", backdropFilter: "blur(12px)", padding: "18px 24px" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e8a44a" strokeWidth="2.2"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" /></svg>
                <span style={{ fontSize: 13, fontWeight: 700, fontFamily: "'Bricolage Grotesque'", color: "#f0f0f8" }}>Mandate</span>
                <span style={{ fontSize: 9, color: "#4a4a6a", fontFamily: "'IBM Plex Mono'", textTransform: "uppercase", letterSpacing: ".08em" }}>Auth0 Powered</span>
              </div>

              {/* Outer orbit — tech stack */}
              <OrbitingCircles radius={165} iconSize={44} duration={30} speed={1}>
                {[
                  { label: "Auth0",    color: "#e8a44a" },
                  { label: "Next.js",  color: "#d8d8e8" },
                  { label: "Grok AI", color: "#5bb8f5" },
                  { label: "Vault",    color: "#3ddba4" },
                  { label: "OAuth2",   color: "#f5587a" },
                  { label: "JWT",      color: "#e8a44a" },
                ].map(({ label, color }) => (
                  <div key={label} style={{ borderRadius: 10, border: `1px solid ${color}22`, background: `${color}0d`, padding: "5px 9px", backdropFilter: "blur(8px)" }}>
                    <span style={{ fontSize: 9, fontWeight: 700, color, fontFamily: "'IBM Plex Mono'", whiteSpace: "nowrap", textTransform: "uppercase", letterSpacing: ".06em" }}>{label}</span>
                  </div>
                ))}
              </OrbitingCircles>

              {/* Inner orbit — security concepts */}
              <OrbitingCircles radius={95} iconSize={40} duration={18} speed={1} reverse>
                {[
                  { label: "Step-Up", color: "#f5587a" },
                  { label: "Scopes",  color: "#5bb8f5" },
                  { label: "Audit",   color: "#3ddba4" },
                  { label: "PKCE",    color: "#e8a44a" },
                ].map(({ label, color }) => (
                  <div key={label} style={{ borderRadius: 8, border: `1px solid ${color}22`, background: `${color}0d`, padding: "4px 8px", backdropFilter: "blur(8px)" }}>
                    <span style={{ fontSize: 8, fontWeight: 700, color, fontFamily: "'IBM Plex Mono'", whiteSpace: "nowrap", textTransform: "uppercase", letterSpacing: ".06em" }}>{label}</span>
                  </div>
                ))}
              </OrbitingCircles>

            </div>
          </div>

        </div>
      </section>

      {/* CTA */}
      <section style={{ position: "relative", zIndex: 5, maxWidth: 800, margin: "0 auto", padding: "0 32px 80px", textAlign: "center" }}>
        <div className="rv d3" style={{ borderRadius: 20, border: "1px solid rgba(232,164,74,0.08)", background: "linear-gradient(135deg,rgba(232,164,74,0.03),rgba(91,184,245,0.02))", padding: "48px 40px" }}>
          <h2 style={{ fontFamily: "'Bricolage Grotesque'", fontSize: 32, fontWeight: 700, marginBottom: 12, letterSpacing: "-.02em" }}>See it in action</h2>
          <p style={{ fontSize: 14, color: "#4a4a6a", marginBottom: 24 }}>Sign in with Auth0. No additional setup needed to explore.</p>
          {user ? (
            <Link href="/app" className="cta-m" style={{ fontSize: 15, padding: "13px 32px", textDecoration: "none" }}>Open Dashboard →</Link>
          ) : (
            <a href="/api/auth/login" className="cta-m" style={{ fontSize: 15, padding: "13px 32px" }}>Sign In with Auth0 →</a>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ position: "relative", zIndex: 5, borderTop: "1px solid rgba(255,255,255,0.03)", padding: "40px 32px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 48, flexWrap: "wrap" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#e8a44a" strokeWidth="2.5"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" /></svg>
              <span style={{ fontSize: 14, fontWeight: 700, fontFamily: "'Bricolage Grotesque'" }}>Mandate</span>
            </div>
            <p style={{ fontSize: 12, color: "#4a4a6a", maxWidth: 280, lineHeight: 1.6 }}>Define your agent&apos;s authority. Auth0 end-to-end. Built for the &ldquo;Authorized to Act&rdquo; Hackathon 2026.</p>
          </div>
          <div style={{ fontSize: 11, color: "#3a3a54", fontFamily: "'IBM Plex Mono'" }}>Auth0 · Token Vault · Grok AI · Next.js 14</div>
        </div>
      </footer>
    </div>
  );
}
