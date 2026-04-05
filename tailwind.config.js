/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: { extend: {
    colors: { m: { void:"#06060a",obsidian:"#0c0c14",slate:"#14141f",edge:"#1c1c2c",ghost:"#4a4a6a",bone:"#d8d8e8",white:"#f0f0f8",copper:"#e8a44a","copper-dim":"rgba(232,164,74,0.08)",ember:"#ff6b3d","ember-dim":"rgba(255,107,61,0.08)",ice:"#5bb8f5","ice-dim":"rgba(91,184,245,0.08)",mint:"#3ddba4","mint-dim":"rgba(61,219,164,0.08)",rose:"#f5587a","rose-dim":"rgba(245,88,122,0.08)" } },
    fontFamily: { display:['"Bricolage Grotesque"',"system-ui"],body:['"Figtree"',"system-ui"],mono:['"IBM Plex Mono"',"monospace"] },
    keyframes: { "fade-up":{"0%":{opacity:0,transform:"translateY(8px)"},"100%":{opacity:1,transform:"translateY(0)"}},"glow-pulse":{"0%,100%":{opacity:.3},"50%":{opacity:1}},"exec-flow":{"0%":{backgroundPosition:"200% 0"},"100%":{backgroundPosition:"-200% 0"}},"orbit":{"0%":{transform:"rotate(calc(var(--angle)*1deg)) translateX(calc(var(--radius)*1px)) rotate(calc(var(--angle)*-1deg))"},"100%":{transform:"rotate(calc(var(--angle)*1deg + 360deg)) translateX(calc(var(--radius)*1px)) rotate(calc(var(--angle)*-1deg - 360deg))"}} },
    animation: { "fade-up":"fade-up .35s ease-out","glow-pulse":"glow-pulse 2s ease-in-out infinite","exec-flow":"exec-flow 2s linear infinite","orbit":"orbit calc(var(--duration)*1s) linear infinite" },
  }},
  plugins: [],
};
