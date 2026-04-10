"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Subject {
  id: string;
  name: string;
  present: string;
  total: string;
}

interface SubjectResult {
  id: string;
  name: string;
  present: number;
  total: number;
  percentage: number;
  status: Status;
  canSkip: number;
  needToAttend: number;
}

type Status = "safe" | "warning" | "critical" | "danger";

// ─── Constants ────────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<Status, { label: string; color: string; bg: string; border: string; emoji: string; desc: string }> = {
  safe:     { label: "Safe Zone",   color: "#00e5a0", bg: "rgba(0,229,160,0.08)",    border: "rgba(0,229,160,0.3)",    emoji: "✓", desc: "You're well within the limit." },
  warning:  { label: "Borderline",  color: "#f5c842", bg: "rgba(245,200,66,0.08)",   border: "rgba(245,200,66,0.3)",   emoji: "⚠", desc: "One absence could push you below." },
  critical: { label: "Critical",    color: "#ff8c42", bg: "rgba(255,140,66,0.08)",   border: "rgba(255,140,66,0.3)",   emoji: "!", desc: "Attend every remaining class." },
  danger:   { label: "Danger Zone", color: "#ff3a5c", bg: "rgba(255,58,92,0.08)",    border: "rgba(255,58,92,0.3)",    emoji: "✕", desc: "At risk of debarment." },
};

const EASE = [0.22, 1, 0.36, 1] as const;

// ─── Calculation helpers ──────────────────────────────────────────────────────
function getStatus(pct: number): Status {
  if (pct >= 85) return "safe";
  if (pct >= 75) return "warning";
  if (pct >= 60) return "critical";
  return "danger";
}

function calcSubject(s: Subject): SubjectResult | null {
  const p = parseFloat(s.present);
  const t = parseFloat(s.total);
  if (isNaN(p) || isNaN(t) || t <= 0 || p < 0 || p > t) return null;
  const pct = Math.round((p / t) * 1000) / 10;
  const status = getStatus(pct);
  const needToAttend = Math.max(0, Math.ceil((0.75 * t - p) / (1 - 0.75)));
  const canSkip = status === "safe" ? Math.floor((p - 0.75 * t) / 0.75) : 0;
  return { id: s.id, name: s.name || "Unnamed Subject", present: p, total: t, percentage: pct, status, canSkip, needToAttend };
}

// ─── Circular Arc SVG ─────────────────────────────────────────────────────────
function CircularGauge({ percentage, status, size = 200 }: { percentage: number; status: Status; size?: number }) {
  const cfg = STATUS_CONFIG[status];
  const r = size * 0.38;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;
  const dash = (percentage / 100) * circumference;
  const [animDash, setAnimDash] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimDash(dash), 100);
    return () => clearTimeout(timer);
  }, [dash]);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Track */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={size * 0.07} />
      {/* Glow filter */}
      <defs>
        <filter id={`glow-${status}`}>
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <linearGradient id={`grad-${status}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={cfg.color} stopOpacity="0.6" />
          <stop offset="100%" stopColor={cfg.color} />
        </linearGradient>
      </defs>
      {/* Arc */}
      <circle
        cx={cx} cy={cy} r={r}
        fill="none"
        stroke={`url(#grad-${status})`}
        strokeWidth={size * 0.07}
        strokeLinecap="round"
        strokeDasharray={`${animDash} ${circumference}`}
        strokeDashoffset={0}
        transform={`rotate(-90 ${cx} ${cy})`}
        style={{ transition: "stroke-dasharray 1.2s cubic-bezier(0.22,1,0.36,1)" }}
        filter={`url(#glow-${status})`}
      />
      {/* Center text */}
      <text x={cx} y={cy - size * 0.04} textAnchor="middle" fill={cfg.color}
        fontSize={size * 0.18} fontWeight="800" fontFamily="'JetBrains Mono', monospace">
        {percentage}%
      </text>
      <text x={cx} y={cy + size * 0.1} textAnchor="middle" fill="rgba(255,255,255,0.5)"
        fontSize={size * 0.07} fontWeight="600" fontFamily="'Syne', sans-serif" letterSpacing="0.05em">
        {cfg.label.toUpperCase()}
      </text>
    </svg>
  );
}

// ─── Horizontal bar ───────────────────────────────────────────────────────────
function ProgressBar({ percentage, status }: { percentage: number; status: Status }) {
  const cfg = STATUS_CONFIG[status];
  const [width, setWidth] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (inView) setTimeout(() => setWidth(percentage), 150);
  }, [inView, percentage]);

  return (
    <div ref={ref} style={{ height: 10, background: "rgba(255,255,255,0.06)", borderRadius: 99, overflow: "hidden", position: "relative" }}>
      <div style={{
        height: "100%", borderRadius: 99,
        background: `linear-gradient(90deg, ${cfg.color}88, ${cfg.color})`,
        width: `${width}%`,
        transition: "width 1.1s cubic-bezier(0.22,1,0.36,1)",
        boxShadow: `0 0 12px ${cfg.color}66`,
      }} />
      {/* Threshold markers */}
      {[60, 75, 85].map(t => (
        <div key={t} style={{ position: "absolute", top: 0, bottom: 0, left: `${t}%`, width: 1, background: "rgba(255,255,255,0.2)" }} />
      ))}
    </div>
  );
}

// ─── Radar / Spider chart ─────────────────────────────────────────────────────
function RadarChart({ results }: { results: SubjectResult[] }) {
  const size = 280;
  const cx = size / 2;
  const cy = size / 2;
  const maxR = size * 0.38;
  const n = results.length;
  if (n < 3) return null;

  const angle = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2;
  const point = (i: number, r: number) => ({
    x: cx + r * Math.cos(angle(i)),
    y: cy + r * Math.sin(angle(i)),
  });

  const rings = [25, 50, 75, 100];
  const dataPath = results.map((r, i) => {
    const p = point(i, (r.percentage / 100) * maxR);
    return `${i === 0 ? "M" : "L"}${p.x},${p.y}`;
  }).join(" ") + "Z";

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id="radarFill">
          <stop offset="0%" stopColor="#ff3a5c" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#ff3a5c" stopOpacity="0.05" />
        </radialGradient>
      </defs>
      {/* Grid rings */}
      {rings.map(ring => {
        const ringPath = results.map((_, i) => {
          const p = point(i, (ring / 100) * maxR);
          return `${i === 0 ? "M" : "L"}${p.x},${p.y}`;
        }).join(" ") + "Z";
        return <path key={ring} d={ringPath} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />;
      })}
      {/* Spokes */}
      {results.map((_, i) => {
        const p = point(i, maxR);
        return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />;
      })}
      {/* Data polygon */}
      <path d={dataPath} fill="url(#radarFill)" stroke="#ff3a5c" strokeWidth="2" />
      {/* Data points */}
      {results.map((r, i) => {
        const p = point(i, (r.percentage / 100) * maxR);
        const cfg = STATUS_CONFIG[r.status];
        return <circle key={r.id} cx={p.x} cy={p.y} r="5" fill={cfg.color} stroke="#080c14" strokeWidth="2" />;
      })}
      {/* Labels */}
      {results.map((r, i) => {
        const p = point(i, maxR + 24);
        return (
          <text key={r.id} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle"
            fill="rgba(255,255,255,0.6)" fontSize="11" fontFamily="'Syne',sans-serif" fontWeight="600">
            {r.name.length > 10 ? r.name.slice(0, 9) + "…" : r.name}
          </text>
        );
      })}
      {/* Ring labels */}
      <text x={cx + 4} y={cy - maxR * 0.75 + 4} fill="rgba(255,255,255,0.25)" fontSize="9" fontFamily="'JetBrains Mono',monospace">75%</text>
    </svg>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CalculatePage() {
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: "1", name: "", present: "", total: "" },
    { id: "2", name: "", present: "", total: "" },
    { id: "3", name: "", present: "", total: "" },
  ]);
  const [results, setResults] = useState<SubjectResult[] | null>(null);
  const [calculated, setCalculated] = useState(false);
  const [targetPct, setTargetPct] = useState("75");
  const resultsRef = useRef<HTMLDivElement>(null);

  const addSubject = () => {
    if (subjects.length >= 10) return;
    setSubjects(prev => [...prev, { id: Date.now().toString(), name: "", present: "", total: "" }]);
  };

  const removeSubject = (id: string) => {
    if (subjects.length <= 1) return;
    setSubjects(prev => prev.filter(s => s.id !== id));
  };

  const updateSubject = (id: string, field: keyof Subject, value: string) => {
    setSubjects(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const calculate = () => {
    const res = subjects.map(calcSubject).filter(Boolean) as SubjectResult[];
    if (res.length === 0) return;
    setResults(res);
    setCalculated(true);
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  };

  const reset = () => {
    setResults(null);
    setCalculated(false);
    setSubjects([
      { id: "1", name: "", present: "", total: "" },
      { id: "2", name: "", present: "", total: "" },
      { id: "3", name: "", present: "", total: "" },
    ]);
  };

  // Overall stats
  const overall = results ? (() => {
    const totalPresent = results.reduce((a, r) => a + r.present, 0);
    const totalClasses = results.reduce((a, r) => a + r.total, 0);
    const pct = Math.round((totalPresent / totalClasses) * 1000) / 10;
    return { pct, status: getStatus(pct), totalPresent, totalClasses };
  })() : null;

  return (
    <div style={{ fontFamily: "'Syne', sans-serif", background: "#080c14", color: "#f0f2f8", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --red: #ff3a5c; --amber: #f5c842; --green: #00e5a0; --blue: #4d9fff;
          --bg: #080c14; --bg2: #0e1420; --bg3: #131b2e; --border: rgba(255,255,255,0.08); --muted: #8892a4;
        }
        html { scroll-behavior: smooth; }
        input { outline: none; font-family: inherit; }
        button { cursor: pointer; border: none; font-family: inherit; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: var(--bg); }
        ::-webkit-scrollbar-thumb { background: #1e2a42; border-radius: 3px; }
        .grid-bg {
          background-image: linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 48px 48px;
        }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes spin-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes pulse { 0%,100%{opacity:.6;transform:scale(1)} 50%{opacity:1;transform:scale(1.05)} }
        .subject-row { transition: border-color .2s, box-shadow .2s; }
        .subject-row:focus-within { border-color: rgba(255,58,92,.4) !important; box-shadow: 0 0 0 1px rgba(255,58,92,.15); }
        input:focus { border-color: var(--red) !important; }
        @media (max-width: 640px) {
          .subject-grid { grid-template-columns: 1fr 1fr !important; }
          .subject-name { grid-column: 1 / -1 !important; }
          .results-grid { grid-template-columns: 1fr !important; }
          .overall-grid { grid-template-columns: 1fr 1fr !important; }
          .radar-hide { display: none !important; }
          .page-pad { padding: 80px 4% 60px !important; }
          .hero-title { font-size: 28px !important; }
          .calc-card { padding: 20px !important; }
        }
        @media (max-width: 900px) {
          .radar-hide { display: none !important; }
        }
      `}</style>

      {/* ── NAV ── */}
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: EASE }}
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          background: "rgba(8,12,20,0.9)", backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 5%", height: 64,
        }}
      >
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 30, height: 30, background: "var(--red)", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 15 }}>A</div>
          <span style={{ fontWeight: 800, fontSize: 17 }}>Attend<span style={{ color: "var(--red)" }}>X</span></span>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <Link href="/" style={{ fontSize: 14, color: "var(--muted)", fontWeight: 600, transition: "color .2s" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--muted)")}
          >← Home</Link>
          <div style={{ fontSize: 13, color: "var(--red)", background: "rgba(255,58,92,.12)", border: "1px solid rgba(255,58,92,.3)", padding: "5px 14px", borderRadius: 100, fontWeight: 700 }}>
            Calculator
          </div>
        </div>
      </motion.nav>

      {/* ── HERO ── */}
      <div className="grid-bg page-pad" style={{ paddingTop: 120, paddingBottom: 60, paddingLeft: "5%", paddingRight: "5%", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "20%", left: "5%", width: 320, height: 320, background: "radial-gradient(circle, rgba(255,58,92,.12) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: 0, right: "10%", width: 240, height: 240, background: "radial-gradient(circle, rgba(0,229,160,.07) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,58,92,.1)", border: "1px solid rgba(255,58,92,.25)", borderRadius: 100, padding: "5px 16px", fontSize: 12, fontWeight: 700, color: "var(--red)", marginBottom: 20, letterSpacing: "0.05em" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--red)", display: "inline-block" }} />
            LIVE ATTENDANCE CALCULATOR
          </div>
          <h1 className="hero-title" style={{ fontSize: "clamp(26px, 5vw, 52px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.05, marginBottom: 16 }}>
            Know Exactly Where<br /><span style={{ color: "var(--red)" }}>You Stand</span>
          </h1>
          <p style={{ color: "var(--muted)", fontSize: "clamp(14px, 2vw, 17px)", maxWidth: 520, margin: "0 auto", lineHeight: 1.7 }}>
            Enter your classes for each subject. Get instant percentage, risk level, graphical breakdown, and a recovery plan.
          </p>
        </motion.div>
      </div>

      {/* ── INPUT SECTION ── */}
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 4% 80px" }}>

        {/* Target threshold selector */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.5, ease: EASE }}
          style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 16, padding: "18px 24px", marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}
        >
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>Attendance Threshold</div>
            <div style={{ color: "var(--muted)", fontSize: 13 }}>Set your institution's minimum requirement</div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            {["60", "75", "85"].map(t => (
              <button key={t} onClick={() => setTargetPct(t)}
                style={{
                  padding: "8px 20px", borderRadius: 10, fontWeight: 700, fontSize: 14,
                  background: targetPct === t ? "var(--red)" : "var(--bg3)",
                  color: targetPct === t ? "#fff" : "var(--muted)",
                  border: `1px solid ${targetPct === t ? "transparent" : "var(--border)"}`,
                  transition: "all .2s",
                }}
              >{t}%</button>
            ))}
          </div>
        </motion.div>

        {/* Subject rows */}
        <AnimatePresence>
          {subjects.map((subject, idx) => (
            <motion.div key={subject.id}
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.96 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="subject-row calc-card"
              style={{
                background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 16,
                padding: 24, marginBottom: 14,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 28, height: 28, background: "rgba(255,58,92,.12)", border: "1px solid rgba(255,58,92,.25)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: "var(--red)", fontFamily: "'JetBrains Mono',monospace" }}>
                    {String(idx + 1).padStart(2, "0")}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--muted)" }}>Subject</span>
                </div>
                {subjects.length > 1 && (
                  <button onClick={() => removeSubject(subject.id)}
                    style={{ background: "rgba(255,58,92,.1)", color: "var(--red)", border: "1px solid rgba(255,58,92,.2)", borderRadius: 8, width: 28, height: 28, fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
                  >×</button>
                )}
              </div>

              <div className="subject-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 12 }}>
                <div className="subject-name">
                  <label style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600, marginBottom: 6, display: "block", textTransform: "uppercase", letterSpacing: "0.05em" }}>Subject Name</label>
                  <input type="text" placeholder="e.g. Mathematics" value={subject.name}
                    onChange={e => updateSubject(subject.id, "name", e.target.value)}
                    style={{ width: "100%", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 10, padding: "11px 14px", color: "#fff", fontSize: 15, transition: "border-color .2s" }}
                  />
                </div>
                {[["Classes Attended", "present", "0"], ["Total Classes", "total", "0"]].map(([label, field, ph]) => (
                  <div key={field}>
                    <label style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600, marginBottom: 6, display: "block", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</label>
                    <input type="number" min="0" placeholder={ph}
                      value={subject[field as "present" | "total"]}
                      onChange={e => updateSubject(subject.id, field as "present" | "total", e.target.value)}
                      style={{ width: "100%", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 10, padding: "11px 14px", color: "#fff", fontSize: 18, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace", transition: "border-color .2s" }}
                    />
                  </div>
                ))}
              </div>

              {/* Inline preview */}
              {subject.present && subject.total && (() => {
                const res = calcSubject(subject);
                if (!res) return null;
                const cfg = STATUS_CONFIG[res.status];
                return (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} style={{ marginTop: 14 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ flex: 1 }}><ProgressBar percentage={res.percentage} status={res.status} /></div>
                      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 800, fontSize: 15, color: cfg.color, minWidth: 52, textAlign: "right" }}>{res.percentage}%</div>
                      <div style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color, borderRadius: 8, padding: "3px 10px", fontSize: 12, fontWeight: 700 }}>{cfg.label}</div>
                    </div>
                  </motion.div>
                );
              })()}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Add subject + Calculate buttons */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          style={{ display: "flex", gap: 12, marginBottom: 32, flexWrap: "wrap" }}
        >
          {subjects.length < 10 && (
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={addSubject}
              style={{ flex: 1, minWidth: 160, background: "var(--bg2)", border: "1px dashed rgba(255,58,92,.35)", color: "var(--red)", borderRadius: 14, padding: "14px", fontSize: 14, fontWeight: 700, transition: "background .2s" }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,58,92,.06)")}
              onMouseLeave={e => (e.currentTarget.style.background = "var(--bg2)")}
            >+ Add Subject {subjects.length}/10</motion.button>
          )}
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }}
            onClick={calculate}
            style={{ flex: 2, minWidth: 200, background: "var(--red)", color: "#fff", borderRadius: 14, padding: "14px 32px", fontSize: 16, fontWeight: 800, letterSpacing: "0.02em", boxShadow: "0 8px 32px rgba(255,58,92,.3)" }}
          >
            Calculate Attendance →
          </motion.button>
        </motion.div>

        {/* ── RESULTS ── */}
        <AnimatePresence>
          {calculated && results && results.length > 0 && (
            <motion.div ref={resultsRef}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              {/* ── Overall Overview ── */}
              {overall && (
                <div style={{ marginBottom: 32 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>Overall Summary</div>
                  <div style={{
                    background: "var(--bg2)", border: `1px solid ${STATUS_CONFIG[overall.status].border}`,
                    borderRadius: 20, padding: "32px 28px", position: "relative", overflow: "hidden",
                  }}>
                    {/* Background glow */}
                    <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 30% 50%, ${STATUS_CONFIG[overall.status].color}10 0%, transparent 60%)`, pointerEvents: "none" }} />

                    <div style={{ display: "flex", alignItems: "center", gap: 32, flexWrap: "wrap", position: "relative" }}>
                      {/* Big gauge */}
                      <div style={{ flexShrink: 0 }}>
                        <CircularGauge percentage={overall.pct} status={overall.status} size={160} />
                      </div>

                      {/* Stats */}
                      <div style={{ flex: 1, minWidth: 200 }}>
                        <div style={{ fontSize: "clamp(22px,4vw,36px)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 6 }}>
                          {STATUS_CONFIG[overall.status].label}
                        </div>
                        <div style={{ color: "var(--muted)", fontSize: 14, marginBottom: 20, lineHeight: 1.7 }}>
                          {overall.totalPresent} attended out of {overall.totalClasses} total classes across {results.length} subject{results.length > 1 ? "s" : ""}
                        </div>
                        <div className="overall-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
                          {[
                            ["Subjects", results.length.toString(), "#fff"],
                            ["Attended", overall.totalPresent.toString(), STATUS_CONFIG[overall.status].color],
                            ["Total", overall.totalClasses.toString(), "var(--muted)"],
                          ].map(([label, val, color]) => (
                            <div key={label} style={{ background: "var(--bg3)", borderRadius: 12, padding: "12px 16px" }}>
                              <div style={{ fontSize: "clamp(18px,3vw,26px)", fontWeight: 800, color, fontFamily: "'JetBrains Mono',monospace" }}>{val}</div>
                              <div style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600, marginTop: 2 }}>{label}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Radar (hidden on small) */}
                      {results.length >= 3 && (
                        <div className="radar-hide" style={{ flexShrink: 0 }}>
                          <RadarChart results={results} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ── Per-Subject Cards ── */}
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>Subject Breakdown</div>
              <div className="results-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 16, marginBottom: 32 }}>
                {results.map((r, idx) => {
                  const cfg = STATUS_CONFIG[r.status];
                  return (
                    <motion.div key={r.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.06, duration: 0.4, ease: EASE }}
                      style={{ background: "var(--bg2)", border: `1px solid ${cfg.border}`, borderRadius: 18, padding: 24, position: "relative", overflow: "hidden" }}
                    >
                      {/* Status corner badge */}
                      <div style={{ position: "absolute", top: 0, right: 0, background: cfg.color, color: "#000", padding: "6px 14px", borderRadius: "0 18px 0 14px", fontSize: 11, fontWeight: 800, letterSpacing: "0.05em" }}>
                        {cfg.emoji} {cfg.label}
                      </div>

                      {/* Subject name + number */}
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, paddingRight: 80 }}>
                        <div style={{ width: 32, height: 32, background: `${cfg.color}20`, border: `1px solid ${cfg.border}`, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: cfg.color, fontFamily: "'JetBrains Mono',monospace", flexShrink: 0 }}>
                          {String(idx + 1).padStart(2, "0")}
                        </div>
                        <div style={{ fontWeight: 700, fontSize: 16, lineHeight: 1.2 }}>{r.name}</div>
                      </div>

                      {/* Mini gauge + bar */}
                      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
                        <CircularGauge percentage={r.percentage} status={r.status} size={88} />
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--muted)", marginBottom: 6 }}>
                            <span>Attendance</span>
                            <span style={{ fontFamily: "'JetBrains Mono',monospace", color: cfg.color, fontWeight: 700 }}>{r.present}/{r.total}</span>
                          </div>
                          <ProgressBar percentage={r.percentage} status={r.status} />
                          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 10, color: "rgba(255,255,255,0.2)" }}>
                            <span>0%</span><span>60</span><span>75</span><span>85</span><span>100%</span>
                          </div>
                        </div>
                      </div>

                      {/* Recovery/Skip info */}
                      <div style={{ background: "var(--bg3)", borderRadius: 12, padding: "12px 14px" }}>
                        {r.status === "safe" ? (
                          <div style={{ fontSize: 13, color: "var(--green)", fontWeight: 600 }}>
                            ✓ You can skip up to <span style={{ fontFamily: "'JetBrains Mono',monospace" }}>{r.canSkip}</span> more class{r.canSkip !== 1 ? "es" : ""} safely.
                          </div>
                        ) : (
                          <div style={{ fontSize: 13, color: cfg.color, fontWeight: 600 }}>
                            ⚠ Attend <span style={{ fontFamily: "'JetBrains Mono',monospace" }}>{r.needToAttend}</span> consecutive class{r.needToAttend !== 1 ? "es" : ""} to reach 75%.
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* ── Comparison Bar Chart ── */}
              {results.length > 1 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5, ease: EASE }}
                  style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 20, padding: 28, marginBottom: 32 }}
                >
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 24 }}>Subject Comparison</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {[...results].sort((a, b) => b.percentage - a.percentage).map((r, i) => {
                      const cfg = STATUS_CONFIG[r.status];
                      return (
                        <div key={r.id} style={{ display: "grid", gridTemplateColumns: "140px 1fr 56px", gap: 14, alignItems: "center" }}>
                          <div style={{ fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.name}</div>
                          <div style={{ height: 10, background: "rgba(255,255,255,0.05)", borderRadius: 99, overflow: "hidden", position: "relative" }}>
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${r.percentage}%` }}
                              transition={{ duration: 1, delay: i * 0.08, ease: EASE }}
                              style={{ height: "100%", borderRadius: 99, background: `linear-gradient(90deg, ${cfg.color}88, ${cfg.color})`, boxShadow: `0 0 10px ${cfg.color}55` }}
                            />
                            {/* Threshold line */}
                            <div style={{ position: "absolute", top: 0, bottom: 0, left: `${parseFloat(targetPct)}%`, width: 1, background: "rgba(255,255,255,0.3)" }} />
                          </div>
                          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: 14, color: cfg.color, textAlign: "right" }}>{r.percentage}%</div>
                        </div>
                      );
                    })}
                    {/* Legend */}
                    <div style={{ display: "flex", gap: 24, marginTop: 8, paddingTop: 12, borderTop: "1px solid var(--border)", flexWrap: "wrap" }}>
                      {(["safe", "warning", "critical", "danger"] as Status[]).map(s => {
                        const cfg = STATUS_CONFIG[s];
                        return (
                          <div key={s} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--muted)" }}>
                            <div style={{ width: 10, height: 10, borderRadius: 3, background: cfg.color }} />
                            {cfg.label}
                          </div>
                        );
                      })}
                      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--muted)" }}>
                        <div style={{ width: 1, height: 14, background: "rgba(255,255,255,0.3)" }} />
                        {targetPct}% threshold
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── Action Buttons ── */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                style={{ display: "flex", gap: 12, flexWrap: "wrap" }}
              >
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  onClick={reset}
                  style={{ flex: 1, minWidth: 160, background: "var(--bg2)", border: "1px solid var(--border)", color: "var(--muted)", borderRadius: 14, padding: "14px", fontSize: 15, fontWeight: 700 }}
                >↺ Reset & Recalculate</motion.button>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  onClick={() => window.print()}
                  style={{ flex: 1, minWidth: 160, background: "rgba(77,159,255,.1)", border: "1px solid rgba(77,159,255,.3)", color: "var(--blue)", borderRadius: 14, padding: "14px", fontSize: 15, fontWeight: 700 }}
                >⬇ Save Report</motion.button>
                <Link href="/" style={{ flex: 1, minWidth: 160 }}>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    style={{ background: "var(--red)", color: "#fff", borderRadius: 14, padding: "14px", fontSize: 15, fontWeight: 700, textAlign: "center" }}
                  >← Back to Home</motion.div>
                </Link>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── FOOTER ── */}
      <div style={{ borderTop: "1px solid var(--border)", padding: "24px 5%", display: "flex", justifyContent: "space-between", alignItems: "center", color: "var(--muted)", fontSize: 13, flexWrap: "wrap", gap: 12 }}>
        <span>© 2026 AttendX — Built for students</span>
        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12 }}>75% threshold · All calculations are local</span>
      </div>
    </div>
  );
}
