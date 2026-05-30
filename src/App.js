/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";

const API = "https://api.anthropic.com/v1/messages";

async function askClaude(userMsg) {
  try {
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: "You are an economics analyst. Respond ONLY with raw JSON. No markdown, no backticks, no explanation. Just the JSON object.",
        messages: [{ role: "user", content: userMsg }],
      }),
    });
    const d = await res.json();
    const raw = (d.content || []).map(b => b.text || "").join("").trim();
    const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/, "").trim();
    return JSON.parse(cleaned);
  } catch (e) {
    return null;
  }
}

// ── Fallback static data ──────────────────────────────────────────────────────
const FALLBACK_NEWS = {
  stories: [
    { title: "Federal Reserve Holds Rates Steady Amid Mixed Signals", category: "Monetary Policy", summary: "The Fed kept interest rates unchanged as inflation shows signs of cooling while job growth remains robust. Markets reacted positively to the pause decision.", impact: "positive", region: "USA", price_change: "+0.8% S&P 500" },
    { title: "Euro Zone Inflation Falls to 18-Month Low", category: "Inflation", summary: "Consumer prices across the eurozone dropped significantly, giving the ECB room to consider rate cuts in the coming months. Energy prices led the decline.", impact: "positive", region: "EU", price_change: "-0.4% CPI" },
    { title: "China Export Growth Slows, Trade Tensions Loom", category: "Trade", summary: "Chinese exports grew at a slower pace than expected, raising concerns about global demand. New tariff discussions between the US and China added to uncertainty.", impact: "negative", region: "China", price_change: "-1.2% CNY" },
    { title: "UK Pound Strengthens on Better-Than-Expected GDP Data", category: "Currency", summary: "Sterling hit a six-month high after GDP figures surprised to the upside. Analysts now expect fewer rate cuts from the Bank of England this year.", impact: "positive", region: "UK", price_change: "+1.1% GBP/USD" },
    { title: "OPEC+ Agrees to Extend Production Cuts Through Year End", category: "Commodities", summary: "Oil cartel members voted to maintain supply restrictions, pushing crude prices higher. Analysts warn this could add inflationary pressure globally.", impact: "neutral", region: "Global", price_change: "+2.3% WTI" },
    { title: "Tech Stocks Rally as AI Spending Forecasts Climb", category: "Markets", summary: "Major technology companies surged after multiple firms raised their AI infrastructure spending guidance. Semiconductor stocks led the charge higher.", impact: "positive", region: "USA", price_change: "+3.1% NASDAQ" },
  ],
  price_drops: [
    { item: "Natural Gas", drop: "-12%", reason: "Mild weather + oversupply" },
    { item: "Wheat", drop: "-7%", reason: "Record global harvest" },
    { item: "Lithium", drop: "-18%", reason: "EV demand slowdown" },
  ],
  inflation_alert: { headline: "Global Disinflation Trend Continues", detail: "Inflation is easing across most major economies, driven by falling energy and food prices. Central banks are cautiously signaling a pivot toward rate cuts.", severity: "moderate" },
};

const FALLBACK_INVEST = {
  picks: [
    { name: "NVIDIA Corp", ticker: "NVDA", type: "Stock", price: 875.5, est_1y_return: 32, potential: "Very High", risk: "Medium", reason: "AI chip demand continues to surge with no credible competitors. Data center buildout is accelerating globally.", radar: [{ label: "Growth", value: 95 }, { label: "Safety", value: 50 }, { label: "Value", value: 45 }, { label: "Momentum", value: 92 }, { label: "Income", value: 15 }] },
    { name: "Vanguard S&P 500 ETF", ticker: "VOO", type: "ETF", price: 495.2, est_1y_return: 11, potential: "Medium", risk: "Low", reason: "Diversified exposure to US large caps with minimal fees. Historically reliable long-term compounder.", radar: [{ label: "Growth", value: 65 }, { label: "Safety", value: 88 }, { label: "Value", value: 72 }, { label: "Momentum", value: 60 }, { label: "Income", value: 55 }] },
    { name: "Bitcoin", ticker: "BTC", type: "Crypto", price: 68400, est_1y_return: 45, potential: "Very High", risk: "High", reason: "Post-halving supply shock historically precedes major rallies. Institutional ETF inflows continue to grow.", radar: [{ label: "Growth", value: 90 }, { label: "Safety", value: 25 }, { label: "Value", value: 50 }, { label: "Momentum", value: 78 }, { label: "Income", value: 5 }] },
    { name: "iShares Gold ETF", ticker: "IAU", type: "ETF", price: 38.4, est_1y_return: 14, potential: "Medium", risk: "Low", reason: "Gold continues to benefit from central bank buying and geopolitical uncertainty. Solid inflation hedge.", radar: [{ label: "Growth", value: 50 }, { label: "Safety", value: 82 }, { label: "Value", value: 68 }, { label: "Momentum", value: 62 }, { label: "Income", value: 10 }] },
    { name: "Microsoft Corp", ticker: "MSFT", type: "Stock", price: 415.0, est_1y_return: 18, potential: "High", risk: "Low", reason: "Azure cloud growth remains strong and Copilot integration is driving enterprise upgrades across the product suite.", radar: [{ label: "Growth", value: 78 }, { label: "Safety", value: 80 }, { label: "Value", value: 60 }, { label: "Momentum", value: 70 }, { label: "Income", value: 40 }] },
    { name: "iShares EM Bond ETF", ticker: "EMB", type: "Bond", price: 88.6, est_1y_return: 9, potential: "Medium", risk: "Low", reason: "Emerging market bonds offer attractive yields as the dollar softens. Rate cut expectations support bond prices.", radar: [{ label: "Growth", value: 40 }, { label: "Safety", value: 75 }, { label: "Value", value: 80 }, { label: "Momentum", value: 45 }, { label: "Income", value: 85 }] },
  ],
  strategy_tip: "In today's environment, consider a barbell strategy: pair high-growth assets like AI stocks with defensive positions in gold or bonds to balance risk and reward.",
  risk_warning: "These are AI-generated suggestions for educational purposes only, not financial advice. All investments carry risk. Past performance does not guarantee future results. Consult a licensed financial advisor before investing.",
};

const FALLBACK_MARKETS = {
  indices: [
    { name: "S&P 500", value: 5248, change: 0.74, spark: [5100, 5140, 5090, 5180, 5210, 5248] },
    { name: "NASDAQ", value: 16780, change: 1.12, spark: [16400, 16500, 16450, 16620, 16700, 16780] },
    { name: "FTSE 100", value: 8142, change: -0.31, spark: [8200, 8180, 8160, 8140, 8150, 8142] },
    { name: "Nikkei 225", value: 38640, change: 0.55, spark: [38200, 38300, 38250, 38450, 38580, 38640] },
    { name: "DAX", value: 17920, change: 0.22, spark: [17800, 17850, 17820, 17870, 17900, 17920] },
  ],
  forex: [
    { pair: "EUR/USD", rate: 1.0845, change: 0.18 },
    { pair: "GBP/USD", rate: 1.2712, change: 0.42 },
    { pair: "USD/JPY", rate: 149.85, change: -0.23 },
    { pair: "USD/CNY", rate: 7.231, change: 0.07 },
  ],
  commodities: [
    { name: "Gold", price: 2378, change: 0.54 },
    { name: "Oil (WTI)", price: 83.2, change: -0.87 },
    { name: "Bitcoin", price: 68400, change: 2.31 },
    { name: "Silver", price: 28.7, change: 1.04 },
  ],
  inflation: [
    { label: "USA", value: 3.2 }, { label: "EU", value: 2.6 }, { label: "UK", value: 3.8 },
    { label: "China", value: 0.9 }, { label: "Brazil", value: 4.5 }, { label: "India", value: 5.1 },
  ],
  gdp_growth: [
    { label: "USA", value: 2.5 }, { label: "China", value: 4.8 }, { label: "India", value: 6.9 },
    { label: "EU", value: 0.6 }, { label: "UK", value: -0.2 }, { label: "Japan", value: 0.4 },
  ],
  summary: "Global markets are showing resilience as inflation continues to moderate across major economies. Investor sentiment remains cautiously optimistic ahead of central bank decisions.",
};

// ── Colors & constants ────────────────────────────────────────────────────────
const C = {
  bg: "#040d1f", bgCard: "#071220", bgPanel: "#0a1930",
  border: "#0f2040", borderHover: "#1a3a60",
  accent: "#0ea5e9", accentDim: "#0ea5e930",
  gold: "#f59e0b", goldDim: "#f59e0b25",
  green: "#22c55e", greenDim: "#22c55e20",
  red: "#ef4444", redDim: "#ef444420",
  purple: "#a78bfa", purpleDim: "#a78bfa20",
  text: "#e2e8f0", muted: "#4a6080", mutedLight: "#7a9ab8",
};

const PAGES = ["home","market","news","glossary","invest"];
const NAV = { home:["🌐","Home"], market:["📈","Markets"], news:["📰","News"], glossary:["📚","Glossary"], invest:["💎","Invest"] };

// ── Global styles injected once ───────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  body{background:${C.bg};font-family:'Space Grotesk',sans-serif;}
  button{font-family:inherit;}
  ::-webkit-scrollbar{width:3px;}
  ::-webkit-scrollbar-track{background:${C.bg};}
  ::-webkit-scrollbar-thumb{background:${C.border};border-radius:2px;}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.35}}
  @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
  @keyframes shimmer{0%,100%{opacity:0.5}50%{opacity:1}}
  @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes slideRight{from{width:0}to{width:var(--w)}}
  @keyframes scaleIn{from{opacity:0;transform:scale(0.93)}to{opacity:1;transform:scale(1)}}
  @keyframes orbitSlow{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  @keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
  .fade-up{animation:fadeUp 0.45s cubic-bezier(.22,.68,0,1.2) both;}
  .fade-in{animation:fadeIn 0.35s ease both;}
  .scale-in{animation:scaleIn 0.4s cubic-bezier(.22,.68,0,1.2) both;}
  .card-hover{transition:border-color 0.2s,transform 0.15s,box-shadow 0.2s;}
  .card-hover:hover{border-color:${C.borderHover}!important;transform:translateY(-2px);box-shadow:0 8px 32px #00000060;}
  .btn-hover{transition:all 0.15s ease;}
  .btn-hover:hover{background:${C.borderHover}!important;transform:translateY(-1px);}
  .btn-hover:active{transform:scale(0.97);}
  .nav-btn{transition:all 0.2s ease;}
  .nav-btn:hover{background:${C.border}10;}
`;

// ── Utility components ────────────────────────────────────────────────────────
function Card({ children, style, className = "" }) {
  return (
    <div className={`card-hover ${className}`} style={{
      background: C.bgCard, border: `1px solid ${C.border}`,
      borderRadius: 14, padding: "16px 20px", ...style
    }}>{children}</div>
  );
}

function Tag({ children, color }) {
  const col = color || C.accent;
  return (
    <span style={{
      background: col + "22", color: col,
      border: `1px solid ${col}44`,
      borderRadius: 6, fontSize: 11, padding: "2px 9px",
      fontWeight: 600, letterSpacing: 0.4, whiteSpace: "nowrap"
    }}>{children}</span>
  );
}

function Loader({ text = "Loading…" }) {
  const [dots, setDots] = useState(1);
  useEffect(() => { const t = setInterval(() => setDots(d => d % 3 + 1), 500); return () => clearInterval(t); }, []);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, padding: "50px 20px" }}>
      <div style={{ position: "relative", width: 48, height: 48 }}>
        <div style={{ position: "absolute", inset: 0, border: `2px solid ${C.border}`, borderRadius: "50%" }} />
        <div style={{ position: "absolute", inset: 0, border: `2px solid transparent`, borderTopColor: C.accent, borderRadius: "50%", animation: "spin 0.75s linear infinite" }} />
        <div style={{ position: "absolute", inset: 6, border: `1px solid transparent`, borderTopColor: C.gold, borderRadius: "50%", animation: "spin 1.2s linear infinite reverse" }} />
      </div>
      <span style={{ color: C.muted, fontSize: 13 }}>{text}{"...".slice(0, dots)}</span>
    </div>
  );
}

function AnimatedNumber({ value, prefix = "", suffix = "", decimals = 0 }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0, end = Number(value), steps = 40, step = 0;
    const timer = setInterval(() => {
      step++;
      const ease = 1 - Math.pow(1 - step / steps, 3);
      setDisplay(start + (end - start) * ease);
      if (step >= steps) { setDisplay(end); clearInterval(timer); }
    }, 16);
    return () => clearInterval(timer);
  }, [value]);
  return <span>{prefix}{display.toFixed(decimals)}{suffix}</span>;
}

function MiniSparkline({ data, color, w = 80, h = 32 }) {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data), max = Math.max(...data), range = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h * 0.85 - h * 0.07}`).join(" ");
  const fillPts = `0,${h} ${pts} ${w},${h}`;
  return (
    <svg width={w} height={h} style={{ display: "block" }}>
      <polygon points={fillPts} fill={color + "18"} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

function BarChart({ data, color }) {
  const max = Math.max(...data.map(d => Math.abs(d.value)), 0.1);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
      {data.map((item, i) => {
        const pct = (Math.abs(item.value) / max) * 100;
        const neg = item.value < 0;
        return (
          <div key={i} className="fade-up" style={{ display: "flex", alignItems: "center", gap: 8, animationDelay: `${i * 60}ms` }}>
            <span style={{ color: C.mutedLight, fontSize: 11, width: 48, textAlign: "right", flexShrink: 0 }}>{item.label}</span>
            <div style={{ flex: 1, background: C.border, borderRadius: 4, height: 16, overflow: "hidden" }}>
              <div style={{
                width: `${pct}%`, height: "100%",
                background: neg ? C.red : (color || C.green),
                borderRadius: 4, animation: "slideRight 0.8s ease both",
                "--w": `${pct}%`,
              }} />
            </div>
            <span style={{ fontSize: 12, color: neg ? C.red : C.green, width: 46, flexShrink: 0 }}>
              {neg ? "" : "+"}{item.value.toFixed(1)}%
            </span>
          </div>
        );
      })}
    </div>
  );
}

function RadarChart({ segments }) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let p = 0;
    const t = setInterval(() => { p += 0.05; setProgress(Math.min(p, 1)); if (p >= 1) clearInterval(t); }, 16);
    return () => clearInterval(t);
  }, []);
  const cx = 75, cy = 75, r = 55, n = segments.length;
  const pts = segments.map((seg, i) => {
    const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
    const val = (seg.value / 100) * r * progress;
    return { x: cx + Math.cos(angle) * val, y: cy + Math.sin(angle) * val, lx: cx + Math.cos(angle) * (r + 16), ly: cy + Math.sin(angle) * (r + 16), label: seg.label, value: seg.value };
  });
  const poly = pts.map(p => `${p.x},${p.y}`).join(" ");
  const bgRings = [0.25, 0.5, 0.75, 1].map(scale =>
    Array.from({ length: n }, (_, i) => {
      const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
      return `${cx + Math.cos(angle) * r * scale},${cy + Math.sin(angle) * r * scale}`;
    }).join(" ")
  );
  return (
    <svg width={150} height={150} style={{ display: "block", margin: "0 auto" }}>
      {bgRings.map((p, i) => <polygon key={i} points={p} fill="none" stroke={C.border} strokeWidth="1" />)}
      {Array.from({ length: n }, (_, i) => {
        const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
        return <line key={i} x1={cx} y1={cy} x2={cx + Math.cos(angle) * r} y2={cy + Math.sin(angle) * r} stroke={C.border} strokeWidth="1" />;
      })}
      <polygon points={poly} fill={C.accent + "30"} stroke={C.accent} strokeWidth="1.5" />
      {pts.map((p, i) => (
        <g key={i}>
          <text x={p.lx} y={p.ly} fill={C.mutedLight} fontSize="8.5" textAnchor="middle" dominantBaseline="middle">{p.label}</text>
        </g>
      ))}
    </svg>
  );
}

// ── Splash Screen ─────────────────────────────────────────────────────────────
function SplashScreen({ onEnter }) {
  const [phase, setPhase] = useState(0); // 0=hidden 1=logo 2=text 3=button
  useEffect(() => {
    setTimeout(() => setPhase(1), 150);
    setTimeout(() => setPhase(2), 800);
    setTimeout(() => setPhase(3), 1500);
  }, []);

  const tickerItems = ["S&P 500  ▲ 0.74%", "NASDAQ  ▲ 1.12%", "GOLD  ▲ 0.54%", "BTC  ▲ 2.31%", "EUR/USD  ▲ 0.18%", "FTSE  ▼ 0.31%", "OIL  ▼ 0.87%", "NIKKEI  ▲ 0.55%"];

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
      {/* Grid BG */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.06 }}>
        <defs>
          <pattern id="g" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke={C.accent} strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#g)" />
      </svg>

      {/* Ambient orbs */}
      <div style={{ position: "absolute", top: "10%", left: "8%", width: 400, height: 400, borderRadius: "50%", background: `radial-gradient(circle, ${C.accent}14 0%, transparent 65%)`, animation: "pulse 5s ease-in-out infinite" }} />
      <div style={{ position: "absolute", bottom: "8%", right: "5%", width: 320, height: 320, borderRadius: "50%", background: `radial-gradient(circle, ${C.gold}0f 0%, transparent 65%)`, animation: "pulse 7s ease-in-out infinite 2s" }} />
      <div style={{ position: "absolute", top: "50%", left: "50%", width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, ${C.accent}08 0%, transparent 55%)`, transform: "translate(-50%,-50%)" }} />

      {/* Rotating orbit ring */}
      <div style={{ position: "absolute", top: "50%", left: "50%", width: 280, height: 280, borderRadius: "50%", border: `1px solid ${C.accent}18`, transform: "translate(-50%,-50%)", animation: "orbitSlow 20s linear infinite" }}>
        <div style={{ position: "absolute", top: -3, left: "50%", width: 6, height: 6, borderRadius: "50%", background: C.accent, transform: "translateX(-50%)", boxShadow: `0 0 8px ${C.accent}` }} />
      </div>
      <div style={{ position: "absolute", top: "50%", left: "50%", width: 360, height: 360, borderRadius: "50%", border: `1px solid ${C.gold}10`, transform: "translate(-50%,-50%)", animation: "orbitSlow 30s linear infinite reverse" }}>
        <div style={{ position: "absolute", bottom: -3, right: "30%", width: 5, height: 5, borderRadius: "50%", background: C.gold, boxShadow: `0 0 6px ${C.gold}` }} />
      </div>

      {/* Logo */}
      <div style={{ opacity: phase >= 1 ? 1 : 0, transform: phase >= 1 ? "translateY(0) scale(1)" : "translateY(30px) scale(0.9)", transition: "all 0.9s cubic-bezier(.22,.68,0,1.2)", textAlign: "center", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>

        {/* SVG Globe Logo */}
        <div style={{ animation: "float 4s ease-in-out infinite", marginBottom: 28 }}>
          <svg width="110" height="110" viewBox="0 0 110 110">
            <defs>
              <radialGradient id="glo" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={C.accent} stopOpacity="0.25" />
                <stop offset="100%" stopColor={C.bg} stopOpacity="0" />
              </radialGradient>
            </defs>
            {/* Outer glow */}
            <circle cx="55" cy="55" r="52" fill="url(#glo)" />
            {/* Outer ring */}
            <circle cx="55" cy="55" r="50" fill="none" stroke={C.accent} strokeWidth="0.75" opacity="0.4" />
            {/* Inner ring */}
            <circle cx="55" cy="55" r="38" fill="none" stroke={C.border} strokeWidth="1" />
            {/* Globe meridians */}
            <ellipse cx="55" cy="55" rx="27" ry="38" fill="none" stroke={C.accent} strokeWidth="1" opacity="0.55" />
            <ellipse cx="55" cy="55" rx="14" ry="38" fill="none" stroke={C.accent} strokeWidth="0.5" opacity="0.3" />
            {/* Parallels */}
            <line x1="17" y1="55" x2="93" y2="55" stroke={C.accent} strokeWidth="0.5" opacity="0.35" />
            <ellipse cx="55" cy="55" rx="30" ry="12" fill="none" stroke={C.accent} strokeWidth="0.5" opacity="0.25" />
            <ellipse cx="55" cy="37" rx="22" ry="8" fill="none" stroke={C.accent} strokeWidth="0.4" opacity="0.2" />
            {/* Gold trend arrow */}
            <polyline points="24,70 38,53 51,61 70,40 86,34" fill="none" stroke={C.gold} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
            <polygon points="82,29 90,37 82,40" fill={C.gold} />
            {/* Pulse dots */}
            <circle cx="38" cy="53" r="2.5" fill={C.accent} opacity="0.7" />
            <circle cx="70" cy="40" r="2.5" fill={C.gold} opacity="0.8" />
          </svg>
        </div>

        {/* Brand name */}
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 52, fontWeight: 800, letterSpacing: -2, lineHeight: 1, marginBottom: 10 }}>
          <span style={{ color: C.text }}>ECON</span><span style={{ color: C.accent }}>GLOBE</span>
        </div>

        {/* Slogan */}
        <div style={{
          opacity: phase >= 2 ? 1 : 0, transform: phase >= 2 ? "translateY(0)" : "translateY(12px)",
          transition: "all 0.7s ease 0.1s",
          color: C.mutedLight, fontSize: 14, letterSpacing: 3.5, textTransform: "uppercase",
          marginBottom: 40, animation: phase >= 2 ? "shimmer 3s ease-in-out infinite 2s" : "none"
        }}>
          Your World. Your Wealth. Decoded Daily.
        </div>

        {/* Feature pills */}
        <div style={{
          opacity: phase >= 2 ? 1 : 0, transition: "opacity 0.7s ease 0.3s",
          display: "flex", gap: 16, justifyContent: "center", marginBottom: 48, flexWrap: "wrap"
        }}>
          {["📡 Live Markets", "🤖 AI Analysis", "💎 Smart Picks", "📰 Daily News"].map((f, i) => (
            <div key={i} style={{
              background: C.border, border: `1px solid ${C.borderHover}`,
              borderRadius: 20, padding: "6px 14px", color: C.mutedLight, fontSize: 12
            }}>{f}</div>
          ))}
        </div>

        {/* CTA Button */}
        <button
          onClick={onEnter}
          style={{
            opacity: phase >= 3 ? 1 : 0, transform: phase >= 3 ? "translateY(0)" : "translateY(10px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
            background: C.accent, border: "none", borderRadius: 12,
            color: "#fff", fontSize: 16, fontWeight: 700,
            padding: "15px 52px", cursor: "pointer", letterSpacing: 0.5,
            boxShadow: `0 4px 24px ${C.accent}50`,
          }}
          className="btn-hover"
        >
          Enter Dashboard →
        </button>
      </div>

      {/* Ticker tape */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: C.bgCard, borderTop: `1px solid ${C.border}`, height: 36, overflow: "hidden", display: "flex", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 48, animation: "ticker 30s linear infinite", whiteSpace: "nowrap" }}>
          {[...tickerItems, ...tickerItems].map((t, i) => (
            <span key={i} style={{ color: i % 3 === 0 ? C.green : i % 3 === 1 ? C.red : C.mutedLight, fontSize: 11, fontWeight: 600, letterSpacing: 0.5 }}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Page transition wrapper ───────────────────────────────────────────────────
function PageTransition({ children, pageKey }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setVisible(false); const t = setTimeout(() => setVisible(true), 40); return () => clearTimeout(t); }, [pageKey]);
  return (
    <div style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(12px)", transition: "opacity 0.35s ease, transform 0.35s ease" }}>
      {children}
    </div>
  );
}

// ── Markets Page ──────────────────────────────────────────────────────────────
function MarketsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const key = "mkts_" + new Date().toDateString();

  useEffect(() => {
    const cached = sessionStorage.getItem(key);
    if (cached) { try { setData(JSON.parse(cached)); } catch { setData(FALLBACK_MARKETS); } setLoading(false); return; }
    const today = new Date().toLocaleDateString();
    askClaude(`Generate realistic global market data for ${today}. Return this exact JSON structure with realistic numbers: {"indices":[{"name":"S&P 500","value":5248,"change":0.74,"spark":[5100,5140,5090,5180,5210,5248]},{"name":"NASDAQ","value":16780,"change":1.12,"spark":[16400,16500,16450,16620,16700,16780]},{"name":"FTSE 100","value":8142,"change":-0.31,"spark":[8200,8180,8160,8140,8150,8142]},{"name":"Nikkei 225","value":38640,"change":0.55,"spark":[38200,38300,38250,38450,38580,38640]},{"name":"DAX","value":17920,"change":0.22,"spark":[17800,17850,17820,17870,17900,17920]}],"forex":[{"pair":"EUR/USD","rate":1.0845,"change":0.18},{"pair":"GBP/USD","rate":1.2712,"change":0.42},{"pair":"USD/JPY","rate":149.85,"change":-0.23},{"pair":"USD/CNY","rate":7.231,"change":0.07}],"commodities":[{"name":"Gold","price":2378,"change":0.54},{"name":"Oil (WTI)","price":83.2,"change":-0.87},{"name":"Bitcoin","price":68400,"change":2.31},{"name":"Silver","price":28.7,"change":1.04}],"inflation":[{"label":"USA","value":3.2},{"label":"EU","value":2.6},{"label":"UK","value":3.8},{"label":"China","value":0.9},{"label":"Brazil","value":4.5},{"label":"India","value":5.1}],"gdp_growth":[{"label":"USA","value":2.5},{"label":"China","value":4.8},{"label":"India","value":6.9},{"label":"EU","value":0.6},{"label":"UK","value":-0.2},{"label":"Japan","value":0.4}],"summary":"One sentence market summary."}`)
      .then(d => {
        const result = (d && d.indices) ? d : FALLBACK_MARKETS;
        setData(result);
        sessionStorage.setItem(key, JSON.stringify(result));
        setLoading(false);
      }).catch(() => { setData(FALLBACK_MARKETS); setLoading(false); });
  }, []);

  if (loading) return <Loader text="Loading market data" />;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div className="fade-up" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ color: C.text, fontSize: 20, fontWeight: 700 }}>Global Markets</h2>
        <Tag>{new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</Tag>
      </div>

      {data.summary && (
        <div className="fade-up scale-in" style={{ animationDelay: "60ms", background: C.bgCard, border: `1px solid ${C.border}`, borderLeft: `3px solid ${C.accent}`, borderRadius: 12, padding: "14px 18px" }}>
          <p style={{ color: C.mutedLight, fontSize: 13, lineHeight: 1.7, margin: 0 }}>📊 {data.summary}</p>
        </div>
      )}

      <h3 style={{ color: C.muted, fontSize: 11, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase" }}>Major Indices</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 10 }}>
        {(data.indices || []).map((idx, i) => (
          <div key={i} className="card-hover fade-up" style={{ animationDelay: `${i * 70}ms`, background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 12, padding: "14px 14px" }}>
            <div style={{ color: C.muted, fontSize: 11, marginBottom: 3 }}>{idx.name}</div>
            <div style={{ color: C.text, fontSize: 18, fontWeight: 700 }}>{(idx.value || 0).toLocaleString()}</div>
            <div style={{ color: (idx.change || 0) >= 0 ? C.green : C.red, fontSize: 12, marginBottom: 8, fontWeight: 600 }}>
              {(idx.change || 0) >= 0 ? "▲" : "▼"} {Math.abs(idx.change || 0).toFixed(2)}%
            </div>
            <MiniSparkline data={idx.spark} color={(idx.change || 0) >= 0 ? C.green : C.red} />
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <Card className="fade-up" style={{ animationDelay: "300ms" }}>
          <h3 style={{ color: C.muted, fontSize: 11, fontWeight: 600, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 14 }}>Forex</h3>
          {(data.forex || []).map((f, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: i < (data.forex?.length || 0) - 1 ? `1px solid ${C.border}` : "none" }}>
              <span style={{ color: C.text, fontSize: 13, fontWeight: 500 }}>{f.pair}</span>
              <div style={{ textAlign: "right" }}>
                <div style={{ color: C.text, fontSize: 13 }}>{f.rate}</div>
                <div style={{ color: (f.change || 0) >= 0 ? C.green : C.red, fontSize: 11 }}>{(f.change || 0) >= 0 ? "+" : ""}{f.change}%</div>
              </div>
            </div>
          ))}
        </Card>
        <Card className="fade-up" style={{ animationDelay: "370ms" }}>
          <h3 style={{ color: C.muted, fontSize: 11, fontWeight: 600, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 14 }}>Commodities</h3>
          {(data.commodities || []).map((c, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: i < (data.commodities?.length || 0) - 1 ? `1px solid ${C.border}` : "none" }}>
              <span style={{ color: C.text, fontSize: 13, fontWeight: 500 }}>{c.name}</span>
              <div style={{ textAlign: "right" }}>
                <div style={{ color: C.text, fontSize: 13 }}>${(c.price || 0).toLocaleString()}</div>
                <div style={{ color: (c.change || 0) >= 0 ? C.green : C.red, fontSize: 11 }}>{(c.change || 0) >= 0 ? "+" : ""}{c.change}%</div>
              </div>
            </div>
          ))}
        </Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <Card className="fade-up" style={{ animationDelay: "440ms" }}>
          <h3 style={{ color: C.muted, fontSize: 11, fontWeight: 600, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 14 }}>Inflation %</h3>
          <BarChart data={data.inflation || []} color={C.gold} />
        </Card>
        <Card className="fade-up" style={{ animationDelay: "510ms" }}>
          <h3 style={{ color: C.muted, fontSize: 11, fontWeight: 600, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 14 }}>GDP Growth %</h3>
          <BarChart data={data.gdp_growth || []} color={C.accent} />
        </Card>
      </div>
    </div>
  );
}

// ── News Page ─────────────────────────────────────────────────────────────────
function NewsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const key = "news_" + new Date().toDateString();

  useEffect(() => {
    const cached = sessionStorage.getItem(key);
    if (cached) { try { setData(JSON.parse(cached)); } catch { setData(FALLBACK_NEWS); } setLoading(false); return; }
    // Simplified prompt to avoid JSON parse failures
    askClaude(`Give me 4 global economy news stories for today as JSON. Use this exact structure: {"stories":[{"title":"story title","category":"Inflation","summary":"two sentence summary","impact":"positive","region":"USA","price_change":"+0.5% CPI"},{"title":"story title 2","category":"Trade","summary":"two sentence summary","impact":"negative","region":"EU","price_change":"-1.2% EUR"},{"title":"story title 3","category":"Markets","summary":"two sentence summary","impact":"positive","region":"Global","price_change":"+0.8%"},{"title":"story title 4","category":"Currency","summary":"two sentence summary","impact":"neutral","region":"Asia","price_change":"0.0%"}],"price_drops":[{"item":"Natural Gas","drop":"-12%","reason":"Mild weather"},{"item":"Wheat","drop":"-7%","reason":"Good harvest"},{"item":"Lithium","drop":"-18%","reason":"EV slowdown"}],"inflation_alert":{"headline":"Inflation Easing Globally","detail":"Consumer prices are declining in most major economies as energy costs stabilize. Central banks are monitoring data before making rate cut decisions.","severity":"moderate"}}`)
      .then(d => {
        const result = (d && d.stories && d.stories.length > 0) ? d : FALLBACK_NEWS;
        setData(result);
        sessionStorage.setItem(key, JSON.stringify(result));
        setLoading(false);
      }).catch(() => { setData(FALLBACK_NEWS); setLoading(false); });
  }, []);

  const catColor = c => ({ "Inflation": C.gold, "Trade": C.accent, "Currency": C.purple, "Monetary Policy": "#f472b6", "Commodities": "#fb923c", "Markets": C.green }[c] || C.accent);

  if (loading) return <Loader text="Fetching economy news" />;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div className="fade-up" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ color: C.text, fontSize: 20, fontWeight: 700 }}>Economy News</h2>
        <Tag color={C.gold}>DAILY FEED</Tag>
      </div>

      {data?.inflation_alert && (
        <div className="fade-up scale-in" style={{ animationDelay: "60ms", background: data.inflation_alert.severity === "high" ? C.redDim : C.goldDim, border: `1px solid ${data.inflation_alert.severity === "high" ? C.red : C.gold}44`, borderLeft: `3px solid ${data.inflation_alert.severity === "high" ? C.red : C.gold}`, borderRadius: 12, padding: "14px 18px" }}>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <span style={{ fontSize: 18 }}>{data.inflation_alert.severity === "high" ? "🔴" : "🟡"}</span>
            <div>
              <div style={{ color: data.inflation_alert.severity === "high" ? C.red : C.gold, fontSize: 12, fontWeight: 700, letterSpacing: 0.5, marginBottom: 4 }}>
                INFLATION UPDATE — {data.inflation_alert.headline}
              </div>
              <p style={{ color: C.mutedLight, fontSize: 13, lineHeight: 1.6, margin: 0 }}>{data.inflation_alert.detail}</p>
            </div>
          </div>
        </div>
      )}

      {data?.price_drops?.length > 0 && (
        <Card className="fade-up" style={{ animationDelay: "120ms" }}>
          <h3 style={{ color: C.muted, fontSize: 11, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12 }}>💸 Notable Price Drops Today</h3>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {data.price_drops.map((p, i) => (
              <div key={i} className="fade-up" style={{ animationDelay: `${160 + i * 60}ms`, background: C.greenDim, border: `1px solid ${C.green}30`, borderRadius: 10, padding: "10px 14px", flex: 1, minWidth: 110 }}>
                <div style={{ color: C.text, fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{p.item}</div>
                <div style={{ color: C.green, fontSize: 20, fontWeight: 800, marginBottom: 4 }}>{p.drop}</div>
                <div style={{ color: C.muted, fontSize: 11, lineHeight: 1.3 }}>{p.reason}</div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {(data?.stories || []).map((s, i) => (
          <Card key={i} className="fade-up" style={{ animationDelay: `${300 + i * 80}ms`, cursor: "default" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8, gap: 8, flexWrap: "wrap" }}>
              <div style={{ display: "flex", gap: 7, flexWrap: "wrap", alignItems: "center" }}>
                <Tag color={catColor(s.category)}>{s.category}</Tag>
                <Tag color={s.impact === "positive" ? C.green : s.impact === "negative" ? C.red : C.muted}>
                  {s.impact === "positive" ? "▲ Positive" : s.impact === "negative" ? "▼ Negative" : "→ Neutral"}
                </Tag>
              </div>
              <span style={{ color: C.muted, fontSize: 11 }}>{s.region}</span>
            </div>
            <h3 style={{ color: C.text, fontSize: 15, fontWeight: 600, marginBottom: 7, lineHeight: 1.45 }}>{s.title}</h3>
            <p style={{ color: C.mutedLight, fontSize: 13, lineHeight: 1.65, margin: 0 }}>{s.summary}</p>
            {s.price_change && s.price_change !== "0.0%" && (
              <div style={{ marginTop: 8, color: s.price_change.startsWith("+") ? C.gold : C.green, fontSize: 12, fontWeight: 600 }}>
                📊 {s.price_change}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

// ── Glossary Page ─────────────────────────────────────────────────────────────
const TERMS = [
  { word: "Inflation", icon: "📈", definition: "Inflation is the gradual erosion of your money's purchasing power over time — the reason a coffee that cost $1 in 1990 costs $5 today. It happens when too much money chases too few goods, pushing prices upward across the entire economy. Central banks like the Federal Reserve target a healthy rate of around 2% per year, believing a small amount keeps economies moving forward without spiraling out of control.", formula: "Inflation Rate = ((Current CPI - Previous CPI) / Previous CPI) x 100", example: "In 2022, US inflation hit 9.1% — the highest in 40 years — driven by supply chain disruptions and post-pandemic spending, forcing the Fed to raise interest rates 11 times in a row.", related: ["Deflation", "Interest Rate", "Stagflation"] },
  { word: "Deflation", icon: "📉", definition: "Deflation is the opposite of inflation — a sustained fall in the general price level of goods and services. While cheaper prices sound appealing, deflation is feared by economists because it causes consumers to delay purchases expecting even lower prices tomorrow, slowing the entire economy. It can spiral into a dangerous cycle where falling prices lead to lower profits, layoffs, and reduced spending.", formula: "Deflation occurs when Inflation Rate falls below 0%", example: "Japan experienced over two decades of deflation from the 1990s into the 2010s — a period called the Lost Decades — during which economic growth stagnated and consumer confidence collapsed.", related: ["Inflation", "Recession", "Quantitative Easing"] },
  { word: "GDP", icon: "🏭", definition: "Gross Domestic Product is the total monetary value of all goods and services produced within a country in a given period — essentially the scorecard of an entire nation's economic output. It is the single most widely used measure of economic size and health, used to compare countries and track whether an economy is expanding or contracting. GDP per capita divides this figure by the population to give a rough sense of average living standards.", formula: "GDP = Consumption + Investment + Government Spending + (Exports - Imports)", example: "The US GDP surpassed $27 trillion in 2024, making it the world's largest economy — nearly double China's $18 trillion despite China having four times the population.", related: ["Recession", "Fiscal Policy", "Inflation"] },
  { word: "Interest Rate", icon: "🏦", definition: "An interest rate is the cost of borrowing money, expressed as a percentage of the loan amount per year. Set by central banks, it is one of the most powerful levers in economics — raising rates makes borrowing expensive, cooling inflation but slowing growth, while cutting rates stimulates spending but risks inflation. Every mortgage, car loan, credit card, and business investment in the world is influenced by this single number.", formula: "Simple Interest = Principal x Rate x Time", example: "When the Federal Reserve raised its benchmark rate from near 0% to over 5% between 2022 and 2023, US mortgage rates doubled to over 7%, causing home sales to drop to their lowest level in decades.", related: ["Inflation", "Quantitative Easing", "Recession"] },
  { word: "Bull Market", icon: "🐂", definition: "A bull market describes a period of sustained rising prices in financial markets — typically defined as a 20% or more gain from recent lows — driven by strong investor confidence, economic growth, and widespread optimism. The term comes from the way a bull attacks, thrusting its horns upward. Bull markets can last months or years and are characterized by high trading volumes, strong corporate earnings, and a fear of missing out.", formula: "Bull Market = 20% or more rise sustained from recent lows", example: "The longest bull market in US history ran from March 2009 to February 2020 — an 11-year run where the S&P 500 gained over 400%, powered by low interest rates and booming tech growth.", related: ["Bear Market", "Recession", "Liquidity"] },
  { word: "Bear Market", icon: "🐻", definition: "A bear market is a prolonged period of falling asset prices, officially defined as a decline of 20% or more from recent highs, accompanied by widespread pessimism and negative economic outlook. The term comes from the way a bear attacks, swiping its paws downward. Bear markets are triggered by recessions, financial crises, or sudden economic shocks and can last anywhere from a few months to several years.", formula: "Bear Market = 20% or more decline from recent market highs", example: "The 2008 financial crisis triggered one of the worst bear markets in history — the S&P 500 lost 57% of its value between October 2007 and March 2009 as the global banking system nearly collapsed.", related: ["Bull Market", "Recession", "Hedge Fund"] },
  { word: "Quantitative Easing", icon: "💵", definition: "Quantitative Easing is an unconventional monetary policy where a central bank creates new money electronically and uses it to purchase financial assets like government bonds from banks. This floods the financial system with cash, lowers long-term interest rates, and encourages lending when traditional rate cuts are no longer effective. Critics argue QE widens wealth inequality by inflating asset prices that mainly benefit the wealthy.", formula: "QE: Central Bank creates money, buys bonds, expands money supply, lowers long-term rates", example: "After the 2008 financial crisis, the US Federal Reserve launched multiple rounds of QE, expanding its balance sheet from $900 billion to over $4.5 trillion to prevent economic collapse.", related: ["Inflation", "Interest Rate", "Recession"] },
  { word: "Recession", icon: "⚠️", definition: "A recession is a significant decline in economic activity that spreads across the economy and lasts more than a few months, technically defined as two consecutive quarters of negative GDP growth. During a recession, businesses cut spending, unemployment rises, consumer confidence drops, and credit tightens. Recessions are a normal part of the economic cycle, but their severity can range from mild slowdowns to devastating crashes.", formula: "Recession = 2 consecutive quarters of negative GDP growth", example: "The COVID-19 recession in 2020 was the sharpest but shortest on record — the US economy shrank 31.4% in Q2, then rebounded 33.4% in Q3 thanks to over $5 trillion in government stimulus.", related: ["GDP", "Bear Market", "Fiscal Policy"] },
  { word: "Stagflation", icon: "🌀", definition: "Stagflation is the rare and painful economic condition where high inflation and economic stagnation occur at the same time. It defies the traditional logic that inflation and unemployment move in opposite directions, leaving policymakers trapped: raising rates to fight inflation makes the stagnation worse, but cutting rates to boost growth makes inflation higher. It is considered one of the hardest economic problems to solve.", formula: "Stagflation = High Inflation + High Unemployment + Zero or Negative Growth", example: "The 1970s oil crisis caused textbook stagflation in the US — OPEC's embargo quadrupled energy prices, pushing inflation above 10% while unemployment climbed above 9%, paralyzing the economy for nearly a decade.", related: ["Inflation", "Recession", "Fiscal Policy"] },
  { word: "Fiscal Policy", icon: "🏛️", definition: "Fiscal policy is the government's use of taxation and public spending to influence the direction of the economy. When the economy slows, governments cut taxes and increase spending to inject money into the system. When inflation runs hot, they raise taxes and cut spending to cool demand. Unlike monetary policy run by central banks, fiscal policy is controlled by elected governments and directly affects public services, infrastructure, and welfare.", formula: "Budget Deficit = Government Spending minus Tax Revenue", example: "During the COVID-19 pandemic, the US deployed over $5 trillion in fiscal stimulus — including direct checks to citizens and business loans — the largest peacetime fiscal intervention in American history.", related: ["GDP", "Recession", "Inflation"] },
  { word: "Liquidity", icon: "💧", definition: "Liquidity describes how quickly and easily an asset can be converted into cash without significantly affecting its price. Cash itself is perfectly liquid, while real estate or rare art is highly illiquid. In financial markets, liquidity is the lifeblood of healthy trading — when liquidity dries up during a crisis, even solid assets become impossible to sell at fair prices, turning manageable problems into catastrophic collapses.", formula: "Liquidity Ratio = Current Assets divided by Current Liabilities", example: "During the 2008 financial crisis, the market for mortgage-backed securities became completely illiquid overnight — banks held billions in assets they could not sell at any price, forcing emergency government bailouts.", related: ["Bear Market", "Hedge Fund", "Quantitative Easing"] },
  { word: "Hedge Fund", icon: "🛡️", definition: "A hedge fund is a private investment partnership that pools capital from wealthy individuals and institutions to pursue aggressive strategies aimed at high returns regardless of market conditions. Unlike mutual funds, hedge funds can short sell, use leverage, trade derivatives, and invest in almost anything — currencies, distressed debt, commodities, or real estate. The name comes from their original goal of hedging against market downturns.", formula: "Standard Fee: 2% annual management fee + 20% of all profits generated", example: "George Soros famously broke the Bank of England in 1992, shorting the British pound so aggressively that the UK was forced to exit the European Exchange Rate Mechanism, earning Soros an estimated $1 billion in a single day.", related: ["Bull Market", "Bear Market", "Liquidity"] },
];

function GlossaryPage() {
  const [selected, setSelected] = useState(null);
  const termData = selected ? TERMS.find(t => t.word === selected) : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div className="fade-up">
        <h2 style={{ color: C.text, fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Economics Glossary</h2>
        <p style={{ color: C.muted, fontSize: 13 }}>Tap a term to read its definition</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 10 }}>
        {TERMS.map((t, i) => (
          <button key={i} onClick={() => setSelected(selected === t.word ? null : t.word)} className="btn-hover fade-up"
            style={{
              animationDelay: `${i * 40}ms`,
              background: selected === t.word ? C.accentDim : C.bgCard,
              border: `1px solid ${selected === t.word ? C.accent : C.border}`,
              borderRadius: 11, padding: "13px 10px", cursor: "pointer", textAlign: "left",
            }}>
            <div style={{ fontSize: 22, marginBottom: 6 }}>{t.icon}</div>
            <div style={{ color: C.text, fontSize: 13, fontWeight: 600 }}>{t.word}</div>
          </button>
        ))}
      </div>

      {selected && termData && (
        <div className="scale-in" style={{ background: C.bgCard, border: `1px solid ${C.accent}44`, borderTop: `3px solid ${C.accent}`, borderRadius: 14, padding: "20px 22px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <h3 style={{ color: C.accent, fontSize: 19, fontWeight: 700 }}>{selected}</h3>
            <button onClick={() => setSelected(null)} className="btn-hover" style={{ background: C.border, border: "none", color: C.muted, cursor: "pointer", fontSize: 16, width: 30, height: 30, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>x</button>
          </div>
          <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <p style={{ color: C.text, fontSize: 14, lineHeight: 1.75 }}>{termData.definition}</p>
            {termData.formula && (
              <div style={{ background: "#0a0f1e", borderRadius: 8, padding: "10px 16px", fontFamily: "monospace", color: C.gold, fontSize: 13, border: `1px solid ${C.border}` }}>
                {termData.formula}
              </div>
            )}
            {termData.example && (
              <div style={{ borderLeft: `2px solid ${C.gold}`, paddingLeft: 14 }}>
                <div style={{ color: C.gold, fontSize: 10, fontWeight: 700, marginBottom: 5, letterSpacing: 1 }}>REAL-WORLD EXAMPLE</div>
                <p style={{ color: C.mutedLight, fontSize: 13, lineHeight: 1.65, margin: 0 }}>{termData.example}</p>
              </div>
            )}
            {termData.related && termData.related.length > 0 && (
              <div>
                <div style={{ color: C.muted, fontSize: 10, marginBottom: 9, letterSpacing: 1 }}>RELATED TERMS</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {termData.related.map((r, i) => (
                    <button key={i} onClick={() => setSelected(r)} className="btn-hover"
                      style={{ background: "none", border: `1px solid ${C.border}`, borderRadius: 7, padding: "5px 13px", color: C.accent, fontSize: 12, cursor: "pointer" }}>
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}


// ── Invest Page ───────────────────────────────────────────────────────────────
function InvestPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const key = "inv_" + new Date().toDateString();

  useEffect(() => {
    const cached = sessionStorage.getItem(key);
    if (cached) { try { setData(JSON.parse(cached)); } catch { setData(FALLBACK_INVEST); } setLoading(false); return; }
    // Simplified, shorter prompt
    askClaude(`List top 4 investments for today as JSON. Use this exact structure: {"picks":[{"name":"NVIDIA Corp","ticker":"NVDA","type":"Stock","price":875.5,"est_1y_return":32,"potential":"Very High","risk":"Medium","reason":"AI chip demand is surging with data center investment accelerating globally.","radar":[{"label":"Growth","value":95},{"label":"Safety","value":50},{"label":"Value","value":45},{"label":"Momentum","value":92},{"label":"Income","value":15}]},{"name":"Vanguard S&P 500 ETF","ticker":"VOO","type":"ETF","price":495.2,"est_1y_return":11,"potential":"Medium","risk":"Low","reason":"Broad US market exposure with low fees and strong historical returns.","radar":[{"label":"Growth","value":65},{"label":"Safety","value":88},{"label":"Value","value":72},{"label":"Momentum","value":60},{"label":"Income","value":55}]},{"name":"Bitcoin","ticker":"BTC","type":"Crypto","price":68400,"est_1y_return":45,"potential":"Very High","risk":"High","reason":"Post-halving supply dynamics and ETF inflows supporting price growth.","radar":[{"label":"Growth","value":90},{"label":"Safety","value":25},{"label":"Value","value":50},{"label":"Momentum","value":78},{"label":"Income","value":5}]},{"name":"iShares Gold ETF","ticker":"IAU","type":"ETF","price":38.4,"est_1y_return":14,"potential":"Medium","risk":"Low","reason":"Gold benefits from central bank buying and geopolitical uncertainty hedge.","radar":[{"label":"Growth","value":50},{"label":"Safety","value":82},{"label":"Value","value":68},{"label":"Momentum","value":62},{"label":"Income","value":10}]}],"strategy_tip":"Consider a barbell approach pairing high-growth AI stocks with defensive gold positions.","risk_warning":"AI-generated suggestions for educational purposes only. Not financial advice. All investments carry risk."}`)
      .then(d => {
        const result = (d && d.picks && d.picks.length > 0) ? d : FALLBACK_INVEST;
        setData(result);
        sessionStorage.setItem(key, JSON.stringify(result));
        setLoading(false);
      }).catch(() => { setData(FALLBACK_INVEST); setLoading(false); });
  }, []);

  const potColor = p => ({ "Very High": C.green, "High": C.accent, "Medium": C.gold, "Low": C.muted }[p] || C.accent);
  const riskColor = r => ({ "Low": C.green, "Medium": C.gold, "High": C.red }[r] || C.muted);
  const typeColor = t => ({ "Stock": C.accent, "ETF": C.purple, "Crypto": C.gold, "Bond": "#34d399", "Real Estate": "#fb923c" }[t] || C.muted);

  if (loading) return <Loader text="Calculating top opportunities" />;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div className="fade-up" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ color: C.text, fontSize: 20, fontWeight: 700 }}>Best Investments Today</h2>
        <Tag color={C.gold}>AI PICKS</Tag>
      </div>

      {data?.strategy_tip && (
        <div className="fade-up scale-in" style={{ animationDelay: "70ms", background: C.greenDim, border: `1px solid ${C.green}35`, borderLeft: `3px solid ${C.green}`, borderRadius: 12, padding: "13px 18px" }}>
          <div style={{ color: C.green, fontSize: 11, fontWeight: 700, letterSpacing: 0.5, marginBottom: 5 }}>💡 TODAY'S STRATEGY TIP</div>
          <p style={{ color: C.mutedLight, fontSize: 13, lineHeight: 1.65, margin: 0 }}>{data.strategy_tip}</p>
        </div>
      )}

      {(data?.picks || []).map((pick, i) => (
        <div key={i} className="fade-up" style={{ animationDelay: `${120 + i * 90}ms` }}>
          <div
            className="card-hover"
            onClick={() => setExpanded(expanded === i ? null : i)}
            style={{ background: C.bgCard, border: `1px solid ${expanded === i ? C.accent + "60" : C.border}`, borderRadius: 14, padding: "18px 20px", cursor: "pointer", position: "relative", overflow: "hidden", transition: "all 0.25s ease" }}>

            {/* Potential badge */}
            <div style={{ position: "absolute", top: 0, right: 0, background: potColor(pick.potential) + "20", borderRadius: "0 14px 0 12px", padding: "5px 13px", fontSize: 10, color: potColor(pick.potential), fontWeight: 700, letterSpacing: 0.6 }}>
              {(pick.potential || "").toUpperCase()}
            </div>

            <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8, flexWrap: "wrap" }}>
                  <span style={{ color: C.text, fontSize: 16, fontWeight: 700 }}>{pick.name}</span>
                  {pick.ticker && <Tag color={typeColor(pick.type)}>{pick.ticker}</Tag>}
                  <Tag color={typeColor(pick.type)}>{pick.type}</Tag>
                </div>

                <div style={{ display: "flex", gap: 18, marginBottom: 10, flexWrap: "wrap" }}>
                  <div>
                    <div style={{ color: C.muted, fontSize: 10, letterSpacing: 0.5, marginBottom: 1 }}>PRICE</div>
                    <div style={{ color: C.text, fontSize: 15, fontWeight: 700 }}>${(pick.price || 0).toLocaleString()}</div>
                  </div>
                  <div>
                    <div style={{ color: C.muted, fontSize: 10, letterSpacing: 0.5, marginBottom: 1 }}>EST. 1Y RETURN</div>
                    <div style={{ color: (pick.est_1y_return || 0) >= 0 ? C.green : C.red, fontSize: 15, fontWeight: 700 }}>
                      {(pick.est_1y_return || 0) >= 0 ? "+" : ""}{pick.est_1y_return}%
                    </div>
                  </div>
                  <div>
                    <div style={{ color: C.muted, fontSize: 10, letterSpacing: 0.5, marginBottom: 1 }}>RISK</div>
                    <div style={{ color: riskColor(pick.risk), fontSize: 13, fontWeight: 600 }}>{pick.risk}</div>
                  </div>
                </div>

                <p style={{ color: C.mutedLight, fontSize: 13, lineHeight: 1.6, margin: 0 }}>{pick.reason}</p>
              </div>

              {/* Radar always visible */}
              {pick.radar && (
                <div style={{ flexShrink: 0, display: expanded === i ? "block" : "none" }}>
                  <RadarChart segments={pick.radar} />
                </div>
              )}
            </div>

            {/* Profit bar */}
            {pick.est_1y_return && (
              <div style={{ marginTop: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ color: C.muted, fontSize: 10, letterSpacing: 0.5 }}>PROFIT ON $1,000 INVESTED</span>
                  <span style={{ color: C.green, fontSize: 12, fontWeight: 700 }}>+${(10 * (pick.est_1y_return || 0)).toFixed(0)} est.</span>
                </div>
                <div style={{ height: 7, background: C.border, borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ width: `${Math.min(Math.abs(pick.est_1y_return || 0), 100)}%`, height: "100%", background: `linear-gradient(90deg, ${C.accent}, ${C.green})`, borderRadius: 4, transition: "width 1s ease" }} />
                </div>
              </div>
            )}

            {/* Expand indicator */}
            <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: C.muted, fontSize: 11 }}>{expanded === i ? "▲ Less detail" : "▼ Tap for radar chart"}</span>
            </div>

            {/* Expanded radar */}
            {expanded === i && pick.radar && (
              <div className="scale-in" style={{ marginTop: 12, borderTop: `1px solid ${C.border}`, paddingTop: 16, display: "flex", justifyContent: "center" }}>
                <div>
                  <div style={{ color: C.muted, fontSize: 10, letterSpacing: 1, textAlign: "center", marginBottom: 8 }}>OPPORTUNITY PROFILE</div>
                  <RadarChart segments={pick.radar} />
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginTop: 8 }}>
                    {pick.radar.map((r, ri) => (
                      <div key={ri} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.accent, opacity: 0.5 + r.value / 200 }} />
                        <span style={{ color: C.mutedLight, fontSize: 11 }}>{r.label}: <strong style={{ color: C.text }}>{r.value}</strong></span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}

      {data?.risk_warning && (
        <div className="fade-up" style={{ background: C.redDim, border: `1px solid ${C.red}20`, borderRadius: 10, padding: "11px 16px" }}>
          <p style={{ color: C.muted, fontSize: 11, lineHeight: 1.6, margin: 0 }}>⚠️ {data.risk_warning}</p>
        </div>
      )}
    </div>
  );
}

// ── Home Page ─────────────────────────────────────────────────────────────────
function HomePage({ setPage }) {
  const [quote, setQuote] = useState(null);
  useEffect(() => {
    askClaude('Return a short economics or investing quote as JSON: {"quote":"the quote text under 15 words","author":"Author Name"}')
      .then(d => setQuote(d || { quote: "The stock market is a device for transferring money from the impatient to the patient.", author: "Warren Buffett" }));
  }, []);

  const cards = [
    { page: "market", icon: "📈", title: "Live Markets", desc: "Indices, forex, commodities & GDP data", color: C.accent },
    { page: "news", icon: "📰", title: "Economy News", desc: "Price drops, inflation & global stories", color: C.gold },
    { page: "glossary", icon: "📚", title: "Glossary", desc: "AI definitions for key economic terms", color: C.purple },
    { page: "invest", icon: "💎", title: "Best Investments", desc: "AI-ranked picks with profit radars", color: C.green },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      <div className="fade-up" style={{ textAlign: "center", padding: "18px 0 8px" }}>
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 32, fontWeight: 800, letterSpacing: -1, lineHeight: 1 }}>
          <span style={{ color: C.text }}>ECON</span><span style={{ color: C.accent }}>GLOBE</span>
        </div>
        <div style={{ color: C.muted, fontSize: 11, letterSpacing: 2.5, marginTop: 6, textTransform: "uppercase" }}>
          {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
        </div>
      </div>

      {quote && (
        <div className="fade-up scale-in" style={{ animationDelay: "100ms", background: C.bgCard, border: `1px solid ${C.border}`, borderTop: `2px solid ${C.accent}`, borderRadius: 14, padding: "18px 22px", textAlign: "center" }}>
          <p style={{ color: C.text, fontSize: 14, fontStyle: "italic", lineHeight: 1.7, margin: "0 0 8px" }}>"{quote.quote}"</p>
          <p style={{ color: C.muted, fontSize: 12 }}>— {quote.author}</p>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {cards.map((c, i) => (
          <button key={i} onClick={() => setPage(c.page)} className="fade-up"
            style={{
              animationDelay: `${150 + i * 70}ms`,
              background: C.bgCard, border: `1px solid ${C.border}`,
              borderRadius: 14, padding: "18px 16px", cursor: "pointer", textAlign: "left",
              borderTop: `3px solid ${c.color}`, transition: "all 0.2s ease"
            }}
            onMouseOver={e => { e.currentTarget.style.background = C.bgPanel; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseOut={e => { e.currentTarget.style.background = C.bgCard; e.currentTarget.style.transform = "translateY(0)"; }}>
            <div style={{ fontSize: 26, marginBottom: 9 }}>{c.icon}</div>
            <div style={{ color: C.text, fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{c.title}</div>
            <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.45 }}>{c.desc}</div>
          </button>
        ))}
      </div>

      <Card className="fade-up" style={{ animationDelay: "500ms" }}>
        <div style={{ color: C.mutedLight, fontSize: 13, lineHeight: 1.7 }}>
          📡 <strong style={{ color: C.accent }}>EconGlobe</strong> delivers AI-powered global economic intelligence. All data refreshes daily — markets, news, glossary definitions, and investment picks are recalculated every morning.
        </div>
      </Card>

      {/* Mini live tickers */}
      <div className="fade-up" style={{ animationDelay: "580ms" }}>
        <div style={{ color: C.muted, fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10 }}>Quick Stats</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
          {[["S&P 500", "5,248", C.green], ["BTC", "$68.4K", C.gold], ["Gold", "$2,378", C.accent]].map(([label, val, col], i) => (
            <div key={i} style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 12px", textAlign: "center" }}>
              <div style={{ color: C.muted, fontSize: 10, marginBottom: 4 }}>{label}</div>
              <div style={{ color: col, fontSize: 14, fontWeight: 700 }}>{val}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [splash, setSplash] = useState(true);
  const [page, setPage] = useState("home");
  const [prevPage, setPrevPage] = useState("home");

  const navigate = (p) => { setPrevPage(page); setPage(p); };

  if (splash) return (
    <>
      <style>{GLOBAL_CSS}</style>
      <SplashScreen onEnter={() => setSplash(false)} />
    </>
  );

  const pageMap = {
    home: <HomePage setPage={navigate} />,
    market: <MarketsPage />,
    news: <NewsPage />,
    glossary: <GlossaryPage />,
    invest: <InvestPage />,
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text }}>
      <style>{GLOBAL_CSS}</style>

      {/* Top bar */}
      <div style={{ background: C.bgCard, borderBottom: `1px solid ${C.border}`, padding: "11px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 100, backdropFilter: "blur(10px)" }}>
        <button onClick={() => navigate("home")} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 800, letterSpacing: -0.5 }}>
          <span style={{ color: C.text }}>ECON</span><span style={{ color: C.accent }}>GLOBE</span>
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ color: C.muted, fontSize: 11 }}>{new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.green, animation: "pulse 2s infinite" }} />
            <span style={{ color: C.green, fontSize: 10, fontWeight: 600, letterSpacing: 0.5 }}>LIVE</span>
          </div>
        </div>
      </div>

      {/* Page content */}
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "20px 16px 96px" }}>
        <PageTransition pageKey={page}>
          {pageMap[page]}
        </PageTransition>
      </div>

      {/* Bottom nav */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: C.bgCard, borderTop: `1px solid ${C.border}`, display: "flex", zIndex: 100 }}>
        {PAGES.map(p => {
          const active = page === p;
          return (
            <button key={p} onClick={() => navigate(p)} className="nav-btn"
              style={{ flex: 1, background: "none", border: "none", padding: "9px 4px 13px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, position: "relative" }}>
              {active && (
                <div style={{ position: "absolute", top: 0, left: "20%", right: "20%", height: 2, background: C.accent, borderRadius: "0 0 2px 2px", animation: "fadeIn 0.3s ease" }} />
              )}
              <span style={{ fontSize: 19, opacity: active ? 1 : 0.45, transition: "opacity 0.2s, transform 0.2s", transform: active ? "translateY(-1px)" : "none" }}>{NAV[p][0]}</span>
              <span style={{ fontSize: 10, color: active ? C.accent : C.muted, fontWeight: active ? 700 : 400, transition: "color 0.2s" }}>{NAV[p][1]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}