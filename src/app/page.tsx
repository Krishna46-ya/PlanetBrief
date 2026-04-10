"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView, useScroll, useTransform } from "framer-motion";

// ─── Types ───────────────────────────────────────────────────────────────────
interface AttendanceResult {
  percentage: number;
  status: "safe" | "warning" | "critical" | "danger";
  label: string;
  message: string;
}

interface FAQ {
  q: string;
  a: string;
}

interface Testimonial {
  name: string;
  role: string;
  quote: string;
  rating: number;
  avatar: string;
}

interface PricingTier {
  name: string;
  price: string;
  period: string;
  features: string[];
  highlighted: boolean;
  cta: string;
}

// ─── Calculator Logic ─────────────────────────────────────────────────────────
function calcAttendance(present: number, total: number): AttendanceResult {
  if (total === 0) return { percentage: 0, status: "danger", label: "No Data", message: "Enter valid class data." };
  const pct = Math.round((present / total) * 100 * 10) / 10;
  if (pct >= 85) return { percentage: pct, status: "safe", label: "Safe Zone", message: "You're well within the required attendance limit. Keep it up!" };
  if (pct >= 75) return { percentage: pct, status: "warning", label: "Borderline", message: "You're just at the threshold. One more absence could put you at risk." };
  if (pct >= 60) return { percentage: pct, status: "critical", label: "Critical", message: "You're below the minimum. Attend all remaining classes immediately." };
  return { percentage: pct, status: "danger", label: "Danger Zone", message: "Severe shortage. Consult your institution about debarment risk." };
}

// ─── Animation Variants ───────────────────────────────────────────────────────
const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1, ease: EASE } }),
};

const stagger = { visible: { transition: { staggerChildren: 0.08 } } };

// ─── Reusable Section Wrapper ─────────────────────────────────────────────────
function Section({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={stagger}
      className={className}
    >
      {children}
    </motion.section>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const faqs: FAQ[] = [
  { q: "What is the minimum attendance required?", a: "Most institutions require a minimum of 75% attendance. However, some colleges enforce 85% or higher for exams eligibility. Always check your institution's specific policy." },
  { q: "How does AttendX calculate my attendance?", a: "We divide your attended classes by total held classes and multiply by 100. The result is color-coded to indicate your risk level instantly." },
  { q: "Can I still pass if I'm below 75%?", a: "Some institutions allow medical or emergency exemptions. You should contact your academic coordinator immediately if you're below the threshold." },
  { q: "How many classes can I skip safely?", a: "Our calculator shows you exactly how many classes you can afford to miss while staying above your institution's required percentage." },
  { q: "Is my data stored anywhere?", a: "No. All calculations happen locally in your browser. We never store or transmit your attendance data." },
  { q: "Does AttendX work for all types of institutions?", a: "Yes — whether it's school, college, university, or corporate training programs, our tool adapts to any attendance-based system." },
];

const testimonials: Testimonial[] = [
  { name: "Priya Sharma", role: "B.Tech Student, IIT Delhi", quote: "AttendX saved my semester. I was heading toward debarment and didn't even know it. The real-time alerts changed everything.", rating: 5, avatar: "PS" },
  { name: "Rahul Menon", role: "MBA Student, IIM Bangalore", quote: "Clean, fast, and actually useful. I check my attendance every Monday now. Best academic tool I've found.", rating: 5, avatar: "RM" },
  { name: "Dr. Anita Verma", role: "Professor, Delhi University", quote: "I recommend AttendX to all my students at the start of each semester. It creates accountability from day one.", rating: 5, avatar: "AV" },
  { name: "Karan Patel", role: "Class XII Student", quote: "Super easy to use. Even my parents check it now to see how I'm doing. Transparency at its best.", rating: 4, avatar: "KP" },
];

const pricingTiers: PricingTier[] = [
  { name: "Student", price: "Free", period: "forever", features: ["Attendance Calculator", "Basic Risk Alerts", "Up to 5 Subjects", "Browser-Based (No Storage)"], highlighted: false, cta: "Get Started Free" },
  { name: "Pro", price: "₹199", period: "per month", features: ["Everything in Student", "Multi-Subject Tracking", "Smart Notifications", "Historical Analytics", "Priority Support"], highlighted: true, cta: "Start Free Trial" },
  { name: "Institution", price: "₹4999", period: "per month", features: ["Everything in Pro", "Bulk Student Management", "Admin Dashboard", "API Access", "Dedicated Account Manager", "Custom Branding"], highlighted: false, cta: "Contact Sales" },
];

const blogPosts = [
  { title: "The Hidden Cost of Low Attendance: What Nobody Tells You", tag: "Research", date: "Apr 2, 2026", excerpt: "Studies show a direct correlation between attendance and academic performance. Here's what the data says." },
  { title: "5 Ways to Manage Your Schedule and Never Miss Class Again", tag: "Tips", date: "Mar 28, 2026", excerpt: "Simple, practical strategies used by top students to stay ahead of the attendance curve." },
  { title: "When Your Attendance is Below 60%: A Survival Guide", tag: "Crisis", date: "Mar 15, 2026", excerpt: "It's not over yet. Here's a step-by-step guide to recover from a critical attendance shortfall." },
];

const logos = ["Delhi University", "IIT Mumbai", "VIT Vellore", "Amity", "Symbiosis", "BITS Pilani"];

const steps = [
  { num: "01", title: "Enter Your Data", desc: "Input the number of classes held and how many you attended for each subject." },
  { num: "02", title: "Instant Calculation", desc: "Our engine instantly computes your attendance percentage with color-coded risk status." },
  { num: "03", title: "Understand Your Risk", desc: "See exactly how many classes you can skip before hitting the danger zone." },
  { num: "04", title: "Plan & Recover", desc: "Use our smart planner to figure out how many consecutive classes you need to attend to recover." },
];

// ─── Main Page Component ──────────────────────────────────────────────────────
export default function AttendanceCrisisPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [present, setPresent] = useState("");
  const [total, setTotal] = useState("");
  const [result, setResult] = useState<AttendanceResult | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  const statusColors: Record<string, string> = {
    safe: "#00e5a0",
    warning: "#f5c842",
    critical: "#ff8c42",
    danger: "#ff3a5c",
  };

  const handleCalc = () => {
    const p = parseFloat(present);
    const t = parseFloat(total);
    if (isNaN(p) || isNaN(t) || p < 0 || t <= 0 || p > t) {
      setResult({ percentage: 0, status: "danger", label: "Invalid Input", message: "Please enter valid numbers. Present classes cannot exceed total classes." });
      return;
    }
    setResult(calcAttendance(p, t));
  };

  const classesNeeded = (() => {
    const p = parseFloat(present);
    const t = parseFloat(total);
    if (isNaN(p) || isNaN(t) || t <= 0) return null;
    const target = 0.75;
    const needed = Math.ceil((target * t - p) / (1 - target));
    return needed > 0 ? needed : 0;
  })();

  return (
    <div style={{ fontFamily: "'Syne', sans-serif", background: "#080c14", color: "#f0f2f8", minHeight: "100vh", overflowX: "hidden" }}>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --red: #ff3a5c;
          --amber: #f5c842;
          --green: #00e5a0;
          --blue: #4d9fff;
          --bg: #080c14;
          --bg2: #0e1420;
          --bg3: #131b2e;
          --border: rgba(255,255,255,0.08);
          --text: #f0f2f8;
          --muted: #8892a4;
        }
        html { scroll-behavior: smooth; }
        input { outline: none; }
        button { cursor: pointer; border: none; }
        a { text-decoration: none; color: inherit; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: var(--bg); }
        ::-webkit-scrollbar-thumb { background: #2a3450; border-radius: 3px; }
        .grid-bg {
          background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 60px 60px;
        }
        .glow-red { box-shadow: 0 0 60px rgba(255,58,92,0.25), 0 0 120px rgba(255,58,92,0.1); }
        .glow-green { box-shadow: 0 0 40px rgba(0,229,160,0.2); }
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes scanline {
          0% { top: -10%; }
          100% { top: 110%; }
        }
        .float { animation: float 4s ease-in-out infinite; }
        .card {
          background: var(--bg2);
          border: 1px solid var(--border);
          border-radius: 16px;
          transition: border-color 0.3s, transform 0.3s;
        }
        .card:hover { border-color: rgba(255,58,92,0.3); transform: translateY(-4px); }
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      {/* ── NAV ── */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          background: "rgba(8,12,20,0.85)", backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 5%",
          display: "flex", alignItems: "center", justifyContent: "space-between", height: 72,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, background: "var(--red)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800 }}>A</div>
          <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: "-0.03em" }}>Attend<span style={{ color: "var(--red)" }}>X</span></span>
        </div>

        <div style={{ display: "flex", gap: 32, fontSize: 14, fontWeight: 500, color: "var(--muted)" }} className="desktop-nav">
          {["Home", "About", "Features", "Pricing", "Blog", "Contact"].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} style={{ transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--muted)")}
            >{item}</a>
          ))}
        </div>

        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <motion.a href="#calculator" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            style={{ background: "var(--red)", color: "#fff", padding: "10px 22px", borderRadius: 10, fontSize: 14, fontWeight: 700, display: "block" }}
          >Get Started</motion.a>
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: "transparent", color: "#fff", fontSize: 22, display: "none" }}>☰</button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            style={{ position: "fixed", top: 72, left: 0, right: 0, background: "var(--bg2)", zIndex: 99, padding: "20px 5%", borderBottom: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: 16 }}
          >
            {["Home", "About", "Features", "Pricing", "Blog", "Contact"].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMenuOpen(false)} style={{ fontSize: 16, fontWeight: 600, color: "var(--muted)", padding: "8px 0" }}>{item}</a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HERO ── */}
      <section id="home" ref={heroRef} className="grid-bg" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "120px 5% 80px", position: "relative", overflow: "hidden" }}>
        {/* Glowing orbs */}
        <div style={{ position: "absolute", top: "15%", left: "10%", width: 400, height: 400, background: "radial-gradient(circle, rgba(255,58,92,0.15) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "10%", right: "10%", width: 300, height: 300, background: "radial-gradient(circle, rgba(0,229,160,0.1) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />

        <motion.div style={{ maxWidth: 860, position: "relative" }}>
          <motion.div variants={fadeUp} custom={0}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,58,92,0.12)", border: "1px solid rgba(255,58,92,0.3)", borderRadius: 100, padding: "6px 16px", fontSize: 13, fontWeight: 600, color: "var(--red)", marginBottom: 32 }}
          >
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--red)", display: "inline-block", animation: "pulse-ring 1.5s infinite" }} />
            Attendance Crisis Alert System
          </motion.div>

          <motion.h1 variants={fadeUp} custom={1}
            style={{ fontSize: "clamp(40px, 7vw, 80px)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.04em", marginBottom: 24 }}
          >
            Don't Let Low Attendance<br />
            <span style={{ color: "var(--red)", position: "relative" }}>Ruin Your Semester</span>
          </motion.h1>

          <motion.p variants={fadeUp} custom={2}
            style={{ fontSize: "clamp(16px, 2vw, 20px)", color: "var(--muted)", maxWidth: 600, margin: "0 auto 40px", lineHeight: 1.7 }}
          >
            Track, calculate, and manage your attendance before it's too late. Real-time alerts. Zero excuses. Built for students who want to stay ahead.
          </motion.p>

          <motion.div variants={fadeUp} custom={3} style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginBottom: 60 }}>
            <motion.a href="#calculator" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              style={{ background: "var(--red)", color: "#fff", padding: "16px 36px", borderRadius: 12, fontSize: 16, fontWeight: 700, display: "inline-block" }}
            >Calculate Now →</motion.a>
            <motion.a href="#how-it-works" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", color: "#fff", padding: "16px 36px", borderRadius: 12, fontSize: 16, fontWeight: 700, display: "inline-block" }}
            >See How It Works</motion.a>
          </motion.div>

          {/* Stats */}
          <motion.div variants={fadeUp} custom={4} style={{ display: "flex", justifyContent: "center", gap: 48, flexWrap: "wrap" }}>
            {[["50K+", "Students Tracked"], ["98%", "Accuracy Rate"], ["200+", "Institutions"], ["4.9★", "App Rating"]].map(([val, label]) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: "#fff" }}>{val}</div>
                <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>{label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Floating attendance gauge illustration */}
        <motion.div className="float"
          style={{ position: "absolute", right: "5%", top: "50%", transform: "translateY(-50%)", width: 180, height: 180, borderRadius: "50%", border: "2px solid rgba(255,58,92,0.3)", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,58,92,0.05)" }}
        >
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 36, fontWeight: 800, color: "var(--red)" }}>64%</div>
            <div style={{ fontSize: 11, color: "var(--muted)" }}>DANGER</div>
          </div>
        </motion.div>
      </section>

      {/* ── LOGOS TICKER ── */}
      <div style={{ background: "var(--bg2)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "20px 0", overflow: "hidden" }}>
        <div style={{ display: "flex", animation: "ticker 20s linear infinite", width: "max-content" }}>
          {[...logos, ...logos].map((l, i) => (
            <span key={i} style={{ padding: "0 48px", fontSize: 14, fontWeight: 600, color: "var(--muted)", whiteSpace: "nowrap", letterSpacing: "0.05em", textTransform: "uppercase" }}>{l}</span>
          ))}
        </div>
      </div>

      {/* ── ATTENDANCE CALCULATOR ── */}
      <Section id="calculator" style={{ padding: "100px 5%", background: "var(--bg)" }} className="">
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <motion.div variants={fadeUp}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--red)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Live Tool</span>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 800, letterSpacing: "-0.03em", marginTop: 12, marginBottom: 16 }}>Attendance Calculator</h2>
            <p style={{ color: "var(--muted)", fontSize: 16, marginBottom: 48 }}>Enter your class data and instantly know where you stand.</p>
          </motion.div>

          <motion.div variants={fadeUp} className="card glow-red" style={{ padding: "40px", borderRadius: 20 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
              {[["Classes Attended", present, setPresent], ["Total Classes Held", total, setTotal]].map(([label, val, setter]) => (
                <div key={label as string} style={{ textAlign: "left" }}>
                  <label style={{ fontSize: 13, color: "var(--muted)", fontWeight: 600, marginBottom: 8, display: "block" }}>{label as string}</label>
                  <input
                    type="number"
                    value={val as string}
                    onChange={e => (setter as (v: string) => void)(e.target.value)}
                    placeholder="0"
                    style={{ width: "100%", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 10, padding: "14px 16px", color: "#fff", fontSize: 18, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", transition: "border-color 0.2s" }}
                    onFocus={e => (e.target.style.borderColor = "var(--red)")}
                    onBlur={e => (e.target.style.borderColor = "var(--border)")}
                  />
                </div>
              ))}
            </div>

            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={handleCalc}
              style={{ width: "100%", background: "var(--red)", color: "#fff", padding: "16px", borderRadius: 12, fontSize: 16, fontWeight: 800, letterSpacing: "0.02em" }}
            >CALCULATE ATTENDANCE</motion.button>

            <AnimatePresence>
              {result && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{ marginTop: 32, padding: 28, borderRadius: 16, background: "var(--bg3)", border: `2px solid ${statusColors[result.status]}`, position: "relative", overflow: "hidden" }}
                >
                  {/* Percentage arc display */}
                  <div style={{ fontSize: 64, fontWeight: 800, color: statusColors[result.status], fontFamily: "'JetBrains Mono', monospace", lineHeight: 1 }}>
                    {result.percentage}%
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: statusColors[result.status], marginTop: 8, marginBottom: 12 }}>{result.label}</div>

                  {/* Progress bar */}
                  <div style={{ height: 8, background: "rgba(255,255,255,0.06)", borderRadius: 4, overflow: "hidden", marginBottom: 16 }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(result.percentage, 100)}%` }} transition={{ duration: 1, ease: "easeOut" }}
                      style={{ height: "100%", background: statusColors[result.status], borderRadius: 4 }}
                    />
                  </div>

                  <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.6 }}>{result.message}</p>

                  {classesNeeded !== null && classesNeeded > 0 && (
                    <div style={{ marginTop: 16, padding: "12px 16px", background: "rgba(245,200,66,0.1)", borderRadius: 10, border: "1px solid rgba(245,200,66,0.3)", fontSize: 14, color: "var(--amber)", fontWeight: 600 }}>
                      ⚠ You need to attend {classesNeeded} consecutive classes to reach 75%.
                    </div>
                  )}
                  {classesNeeded === 0 && result.status === "safe" && (
                    <div style={{ marginTop: 16, padding: "12px 16px", background: "rgba(0,229,160,0.1)", borderRadius: 10, border: "1px solid rgba(0,229,160,0.3)", fontSize: 14, color: "var(--green)", fontWeight: 600 }}>
                      ✓ You have attendance to spare. You can skip {Math.floor((parseFloat(present) - 0.75 * parseFloat(total)) / 0.25)} more classes.
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </Section>

      {/* ── FEATURES ── */}
      <Section id="features" className="" style={{ padding: "100px 5%", background: "var(--bg2)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <motion.div variants={fadeUp} style={{ textAlign: "center", marginBottom: 64 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--red)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Features</span>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 800, letterSpacing: "-0.03em", marginTop: 12, marginBottom: 16 }}>Everything You Need</h2>
            <p style={{ color: "var(--muted)", fontSize: 16, maxWidth: 500, margin: "0 auto" }}>Powerful tools to prevent attendance crisis before it begins.</p>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            {[
              { icon: "⚡", title: "Instant Calculation", desc: "Get your attendance percentage in milliseconds with color-coded risk levels." },
              { icon: "🔔", title: "Smart Alerts", desc: "Receive warnings before you cross critical thresholds — not after." },
              { icon: "📊", title: "Multi-Subject Tracking", desc: "Monitor attendance across all subjects in one clean dashboard." },
              { icon: "🎯", title: "Recovery Planner", desc: "Know exactly how many classes you need to attend to recover your percentage." },
              { icon: "📱", title: "Mobile-First Design", desc: "Built for on-the-go students. Works perfectly on any device." },
              { icon: "🔒", title: "Zero Data Storage", desc: "All calculations are client-side. Your data never leaves your browser." },
            ].map((f, i) => (
              <motion.div key={f.title} variants={fadeUp} custom={i} className="card" style={{ padding: 32 }}>
                <div style={{ fontSize: 36, marginBottom: 16 }}>{f.icon}</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>{f.title}</h3>
                <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.7 }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── HOW IT WORKS ── */}
      <Section id="how-it-works" className="" style={{ padding: "100px 5%", background: "var(--bg)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <motion.div variants={fadeUp} style={{ textAlign: "center", marginBottom: 64 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--red)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Process</span>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 800, letterSpacing: "-0.03em", marginTop: 12 }}>How It Works</h2>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 32, position: "relative" }}>
            {steps.map((step, i) => (
              <motion.div key={step.num} variants={fadeUp} custom={i} style={{ textAlign: "center", position: "relative" }}>
                <div style={{ width: 60, height: 60, borderRadius: 16, background: "rgba(255,58,92,0.1)", border: "1px solid rgba(255,58,92,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, fontSize: 18, color: "var(--red)" }}>{step.num}</div>
                <h3 style={{ fontWeight: 700, marginBottom: 10, fontSize: 16 }}>{step.title}</h3>
                <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.7 }}>{step.desc}</p>
                {i < steps.length - 1 && (
                  <div style={{ position: "absolute", right: -16, top: 30, color: "var(--border)", fontSize: 24 }}>→</div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── ABOUT ── */}
      <Section id="about" className="" style={{ padding: "100px 5%", background: "var(--bg2)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <motion.div variants={fadeUp}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--red)", textTransform: "uppercase", letterSpacing: "0.1em" }}>About Us</span>
            <h2 style={{ fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 800, letterSpacing: "-0.03em", marginTop: 12, marginBottom: 24, lineHeight: 1.1 }}>Born From a Real Crisis</h2>
            <p style={{ color: "var(--muted)", fontSize: 16, lineHeight: 1.8, marginBottom: 20 }}>
              AttendX was built when our founder nearly got debarred from semester exams — not because of negligence, but because there was no tool to see the warning signs early enough.
            </p>
            <p style={{ color: "var(--muted)", fontSize: 16, lineHeight: 1.8, marginBottom: 32 }}>
              Today, we're a team of students, engineers, and educators on a mission to eliminate preventable academic failures caused by poor attendance tracking.
            </p>
            <div style={{ display: "flex", gap: 32 }}>
              {[["2022", "Founded"], ["50K+", "Users"], ["200+", "Colleges"]].map(([v, l]) => (
                <div key={l}>
                  <div style={{ fontSize: 28, fontWeight: 800, color: "var(--red)" }}>{v}</div>
                  <div style={{ fontSize: 13, color: "var(--muted)" }}>{l}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={fadeUp} custom={1}>
            <div style={{ background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 20, padding: 40 }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🎓</div>
              <h3 style={{ fontWeight: 700, fontSize: 20, marginBottom: 12 }}>Our Mission</h3>
              <p style={{ color: "var(--muted)", lineHeight: 1.8, marginBottom: 24 }}>To empower every student with the awareness and tools to manage their academic attendance proactively — before crisis strikes.</p>
              <h3 style={{ fontWeight: 700, fontSize: 20, marginBottom: 12 }}>Our Vision</h3>
              <p style={{ color: "var(--muted)", lineHeight: 1.8 }}>A world where no student loses an academic year due to a problem that could have been solved with better information.</p>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* ── TESTIMONIALS ── */}
      <Section id="testimonials" className="" style={{ padding: "100px 5%", background: "var(--bg)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <motion.div variants={fadeUp} style={{ textAlign: "center", marginBottom: 64 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--red)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Reviews</span>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 800, letterSpacing: "-0.03em", marginTop: 12 }}>Students Love It</h2>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
            {testimonials.map((t, i) => (
              <motion.div key={t.name} variants={fadeUp} custom={i} className="card" style={{ padding: 28 }}>
                <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                  {"★".repeat(t.rating).split("").map((s, j) => <span key={j} style={{ color: "var(--amber)", fontSize: 16 }}>{s}</span>)}
                </div>
                <p style={{ color: "#ccd0e0", fontSize: 15, lineHeight: 1.7, marginBottom: 20, fontStyle: "italic" }}>"{t.quote}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--red)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14 }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: "var(--muted)" }}>{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── CASE STUDIES ── */}
      <Section id="case-studies" className="" style={{ padding: "100px 5%", background: "var(--bg2)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <motion.div variants={fadeUp} style={{ textAlign: "center", marginBottom: 64 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--red)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Results</span>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 800, letterSpacing: "-0.03em", marginTop: 12 }}>Real Impact Stories</h2>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
            {[
              { inst: "Delhi University", result: "34% reduction in debarments", metric: "34%", color: "var(--green)", desc: "After implementing AttendX across 5 departments, student debarments fell drastically in one semester." },
              { inst: "VIT Vellore", result: "8,000 students onboarded", metric: "8K", color: "var(--blue)", desc: "Students proactively managed their attendance, leading to an overall GPA improvement of 0.3 points." },
              { inst: "Amity University", result: "98% retention rate", metric: "98%", color: "var(--amber)", desc: "With real-time alerts, faculty spent 40% less time chasing attendance compliance." },
            ].map((cs, i) => (
              <motion.div key={cs.inst} variants={fadeUp} custom={i} className="card" style={{ padding: 32 }}>
                <div style={{ fontSize: 48, fontWeight: 800, color: cs.color, fontFamily: "'JetBrains Mono', monospace", marginBottom: 8 }}>{cs.metric}</div>
                <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>{cs.inst}</div>
                <div style={{ color: cs.color, fontSize: 13, fontWeight: 600, marginBottom: 16 }}>{cs.result}</div>
                <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.7 }}>{cs.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── BENEFITS ── */}
      <Section id="benefits" className="" style={{ padding: "100px 5%", background: "var(--bg)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
          <motion.div variants={fadeUp}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--red)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Advantages</span>
            <h2 style={{ fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 800, letterSpacing: "-0.03em", marginTop: 12, marginBottom: 40, lineHeight: 1.1 }}>Why AttendX Wins</h2>
            {[
              ["vs. Manual Tracking", "Spreadsheets are slow and error-prone. AttendX is instant and foolproof."],
              ["vs. Institution Apps", "Clunky portals that only show data — not what to do about it. We show you the path forward."],
              ["vs. Doing Nothing", "Students who track attendance are 3x less likely to get debarred."],
            ].map(([title, desc]) => (
              <div key={title} style={{ marginBottom: 28, paddingLeft: 20, borderLeft: "2px solid var(--red)" }}>
                <div style={{ fontWeight: 700, marginBottom: 6, fontSize: 15 }}>{title}</div>
                <div style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.7 }}>{desc}</div>
              </div>
            ))}
          </motion.div>

          <motion.div variants={fadeUp} custom={1}>
            <div style={{ background: "var(--bg3)", borderRadius: 20, border: "1px solid var(--border)", padding: 32 }}>
              <div style={{ fontWeight: 700, marginBottom: 24, fontSize: 16, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Feature Comparison</div>
              {[["Instant Calculation", true, true, false], ["Risk Alerts", true, false, false], ["Recovery Planner", true, false, false], ["Multi-Subject", true, false, false], ["No Data Storage", true, true, false]].map(([feat, us, them, manual]) => (
                <div key={feat as string} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 8, marginBottom: 16, alignItems: "center" }}>
                  <span style={{ fontSize: 14 }}>{feat as string}</span>
                  {[us, them, manual].map((v, i) => <div key={i} style={{ textAlign: "center", fontSize: 16 }}>{v ? "✅" : "❌"}</div>)}
                </div>
              ))}
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 8, marginTop: 20, paddingTop: 20, borderTop: "1px solid var(--border)" }}>
                <span />
                {["AttendX", "Others", "Manual"].map(l => <div key={l} style={{ textAlign: "center", fontSize: 11, color: "var(--muted)", fontWeight: 700, textTransform: "uppercase" }}>{l}</div>)}
              </div>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* ── PRICING ── */}
      <Section id="pricing" className="" style={{ padding: "100px 5%", background: "var(--bg2)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <motion.div variants={fadeUp} style={{ textAlign: "center", marginBottom: 64 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--red)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Pricing</span>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 800, letterSpacing: "-0.03em", marginTop: 12, marginBottom: 16 }}>Simple, Fair Pricing</h2>
            <p style={{ color: "var(--muted)" }}>Start free. Upgrade when you need more.</p>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
            {pricingTiers.map((tier, i) => (
              <motion.div key={tier.name} variants={fadeUp} custom={i} style={{
                background: tier.highlighted ? "var(--red)" : "var(--bg3)",
                border: `1px solid ${tier.highlighted ? "transparent" : "var(--border)"}`,
                borderRadius: 20, padding: 36, position: "relative", overflow: "hidden",
                transform: tier.highlighted ? "scale(1.04)" : "scale(1)",
              }}>
                {tier.highlighted && <div style={{ position: "absolute", top: 16, right: 16, background: "rgba(255,255,255,0.2)", borderRadius: 100, padding: "4px 12px", fontSize: 11, fontWeight: 700 }}>POPULAR</div>}
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{tier.name}</div>
                <div style={{ fontSize: 40, fontWeight: 800, marginBottom: 4 }}>{tier.price}</div>
                <div style={{ fontSize: 13, color: tier.highlighted ? "rgba(255,255,255,0.7)" : "var(--muted)", marginBottom: 32 }}>{tier.period}</div>
                {tier.features.map(f => (
                  <div key={f} style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 14 }}>
                    <span style={{ color: tier.highlighted ? "#fff" : "var(--green)", fontSize: 14 }}>✓</span>
                    <span style={{ fontSize: 14, color: tier.highlighted ? "rgba(255,255,255,0.9)" : "var(--muted)" }}>{f}</span>
                  </div>
                ))}
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  style={{
                    width: "100%", marginTop: 24, padding: "14px", borderRadius: 10, fontWeight: 700, fontSize: 15,
                    background: tier.highlighted ? "#fff" : "var(--red)",
                    color: tier.highlighted ? "var(--red)" : "#fff",
                  }}
                >{tier.cta}</motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── FAQ ── */}
      <Section id="faq" className="" style={{ padding: "100px 5%", background: "var(--bg)" }}>
        <div style={{ maxWidth: 740, margin: "0 auto" }}>
          <motion.div variants={fadeUp} style={{ textAlign: "center", marginBottom: 64 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--red)", textTransform: "uppercase", letterSpacing: "0.1em" }}>FAQ</span>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 800, letterSpacing: "-0.03em", marginTop: 12 }}>Common Questions</h2>
          </motion.div>

          {faqs.map((faq, i) => (
            <motion.div key={i} variants={fadeUp} custom={i}
              style={{ border: "1px solid var(--border)", borderRadius: 14, marginBottom: 12, overflow: "hidden" }}
            >
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{ width: "100%", background: "var(--bg2)", padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", color: "#fff", fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 600, textAlign: "left" }}
              >
                <span>{faq.q}</span>
                <motion.span animate={{ rotate: openFaq === i ? 45 : 0 }} transition={{ duration: 0.2 }} style={{ fontSize: 24, color: "var(--red)", flexShrink: 0, marginLeft: 16 }}>+</motion.span>
              </button>
              <AnimatePresence>
                {openFaq === i && (
                  <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} style={{ overflow: "hidden" }}>
                    <div style={{ padding: "16px 24px 24px", color: "var(--muted)", fontSize: 15, lineHeight: 1.8, background: "var(--bg3)" }}>{faq.a}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ── BLOG ── */}
      <Section id="blog" className="" style={{ padding: "100px 5%", background: "var(--bg2)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <motion.div variants={fadeUp} style={{ textAlign: "center", marginBottom: 64 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--red)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Resources</span>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 800, letterSpacing: "-0.03em", marginTop: 12 }}>Latest Articles</h2>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            {blogPosts.map((post, i) => (
              <motion.div key={post.title} variants={fadeUp} custom={i} className="card" style={{ padding: 32 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "var(--red)", background: "rgba(255,58,92,0.1)", padding: "4px 12px", borderRadius: 100 }}>{post.tag}</span>
                  <span style={{ fontSize: 12, color: "var(--muted)" }}>{post.date}</span>
                </div>
                <h3 style={{ fontWeight: 700, fontSize: 16, lineHeight: 1.5, marginBottom: 12 }}>{post.title}</h3>
                <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>{post.excerpt}</p>
                <span style={{ color: "var(--red)", fontSize: 14, fontWeight: 600 }}>Read more →</span>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── NEWSLETTER ── */}
      <Section id="newsletter" className="" style={{ padding: "80px 5%", background: "var(--bg3)" }}>
        <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
          <motion.div variants={fadeUp}>
            <h2 style={{ fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 12 }}>Get the Free Attendance Survival Kit</h2>
            <p style={{ color: "var(--muted)", marginBottom: 32, fontSize: 15 }}>Join 50,000+ students getting weekly tips to stay in the safe zone.</p>
            <div style={{ display: "flex", gap: 12, maxWidth: 480, margin: "0 auto" }}>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com"
                style={{ flex: 1, background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 10, padding: "14px 18px", color: "#fff", fontSize: 15, fontFamily: "'Syne', sans-serif" }}
              />
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}
                onClick={() => { if (email) setSubscribed(true); }}
                style={{ background: "var(--red)", color: "#fff", padding: "14px 24px", borderRadius: 10, fontWeight: 700, fontSize: 15, whiteSpace: "nowrap" }}
              >{subscribed ? "✓ Joined!" : "Subscribe"}</motion.button>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* ── CTA BANNER ── */}
      <Section id="cta" className="" style={{ padding: "100px 5%", background: "var(--bg)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, rgba(255,58,92,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center", position: "relative" }}>
          <motion.div variants={fadeUp}>
            <h2 style={{ fontSize: "clamp(32px, 5vw, 60px)", fontWeight: 800, letterSpacing: "-0.04em", marginBottom: 20, lineHeight: 1.05 }}>Stop Guessing. Start Knowing.</h2>
            <p style={{ color: "var(--muted)", fontSize: 18, marginBottom: 40 }}>Calculate your attendance right now — before it's too late.</p>
            <motion.a href="#calculator" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              style={{ background: "var(--red)", color: "#fff", padding: "18px 48px", borderRadius: 14, fontSize: 18, fontWeight: 800, display: "inline-block" }}
            >Calculate My Attendance →</motion.a>
          </motion.div>
        </div>
      </Section>

      {/* ── CONTACT ── */}
      <Section id="contact" className="" style={{ padding: "100px 5%", background: "var(--bg2)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "start" }}>
          <motion.div variants={fadeUp}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--red)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Contact</span>
            <h2 style={{ fontSize: "clamp(28px, 3vw, 42px)", fontWeight: 800, letterSpacing: "-0.03em", marginTop: 12, marginBottom: 24 }}>Get in Touch</h2>
            <p style={{ color: "var(--muted)", marginBottom: 36, lineHeight: 1.8 }}>Have questions or want to partner with us? Reach out and we'll respond within 24 hours.</p>
            {[["📧", "hello@attendx.in"], ["📞", "+91 98765 43210"], ["📍", "New Delhi, India"]].map(([icon, val]) => (
              <div key={val} style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 20 }}>
                <div style={{ fontSize: 24 }}>{icon}</div>
                <span style={{ color: "var(--muted)", fontSize: 15 }}>{val}</span>
              </div>
            ))}
          </motion.div>

          <motion.div variants={fadeUp} custom={1} className="card" style={{ padding: 36 }}>
            {[["Name", "text", "Your name"], ["Email", "email", "your@email.com"], ["Subject", "text", "How can we help?"]].map(([label, type, placeholder]) => (
              <div key={label} style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 13, color: "var(--muted)", fontWeight: 600, marginBottom: 8, display: "block" }}>{label}</label>
                <input type={type} placeholder={placeholder}
                  style={{ width: "100%", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 10, padding: "12px 16px", color: "#fff", fontSize: 15, fontFamily: "'Syne', sans-serif" }}
                  onFocus={e => (e.target.style.borderColor = "var(--red)")}
                  onBlur={e => (e.target.style.borderColor = "var(--border)")}
                />
              </div>
            ))}
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 13, color: "var(--muted)", fontWeight: 600, marginBottom: 8, display: "block" }}>Message</label>
              <textarea rows={4} placeholder="Tell us more..."
                style={{ width: "100%", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 10, padding: "12px 16px", color: "#fff", fontSize: 15, fontFamily: "'Syne', sans-serif", resize: "vertical" }}
                onFocus={e => (e.target.style.borderColor = "var(--red)")}
                onBlur={e => (e.target.style.borderColor = "var(--border)")}
              />
            </div>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              style={{ width: "100%", background: "var(--red)", color: "#fff", padding: "14px", borderRadius: 10, fontWeight: 700, fontSize: 16, fontFamily: "'Syne', sans-serif" }}
            >Send Message</motion.button>
          </motion.div>
        </div>
      </Section>

      {/* ── FOOTER ── */}
      <footer style={{ background: "#050810", borderTop: "1px solid var(--border)", padding: "60px 5% 40px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 48 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div style={{ width: 32, height: 32, background: "var(--red)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }}>A</div>
                <span style={{ fontWeight: 800, fontSize: 18 }}>Attend<span style={{ color: "var(--red)" }}>X</span></span>
              </div>
              <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.8, maxWidth: 280 }}>The smartest way to track and manage your attendance before crisis hits.</p>
            </div>
            {[["Product", ["Calculator", "Dashboard", "API", "Mobile App"]], ["Company", ["About", "Blog", "Careers", "Press"]], ["Legal", ["Privacy Policy", "Terms of Service", "Cookie Policy"]]].map(([title, links]) => (
              <div key={title as string}>
                <div style={{ fontWeight: 700, marginBottom: 16, fontSize: 14, textTransform: "uppercase", letterSpacing: "0.05em", color: "#fff" }}>{title as string}</div>
                {(links as string[]).map(link => (
                  <a key={link} href="#" style={{ display: "block", color: "var(--muted)", fontSize: 14, marginBottom: 12, transition: "color 0.2s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                    onMouseLeave={e => (e.currentTarget.style.color = "var(--muted)")}
                  >{link}</a>
                ))}
              </div>
            ))}
          </div>

          <div style={{ borderTop: "1px solid var(--border)", paddingTop: 32, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
            <span style={{ color: "var(--muted)", fontSize: 13 }}>© 2026 AttendX. All rights reserved.</span>
            <div style={{ display: "flex", gap: 20 }}>
              {["Twitter", "LinkedIn", "Instagram", "GitHub"].map(s => (
                <a key={s} href="#" style={{ color: "var(--muted)", fontSize: 13, transition: "color 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "var(--red)")}
                  onMouseLeave={e => (e.currentTarget.style.color = "var(--muted)")}
                >{s}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
