"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useInView } from "motion/react";

// ── TYPES ────────────────────────────────────────────────────────────────────

interface Stat {
  value: string;
  label: string;
  color: string;
}

interface Tip {
  icon: string;
  category: string;
  title: string;
  impact: "Very High" | "High" | "Medium";
  desc: string;
}

// ── DATA ─────────────────────────────────────────────────────────────────────

const STATS: Stat[] = [
  { value: "1.2°C",  label: "average warming above pre-industrial levels", color: "#f97316" },
  { value: "424 ppm",label: "CO₂ in the atmosphere right now",             color: "#ef4444" },
  { value: "1M+",    label: "species threatened with extinction",           color: "#f59e0b" },
  { value: "3.6 mm", label: "sea level rise every single year",             color: "#38bdf8" },
];

const TIPS: Tip[] = [
  {
    icon: "✈",
    category: "Travel",
    title: "Skip one flight a year",
    impact: "High",
    desc: "A single round-trip from Delhi to London emits ~2.5 tonnes of CO₂ — equivalent to driving for 6 months. Take the train when you can.",
  },
  {
    icon: "🥗",
    category: "Diet",
    title: "Go plant-based 3 days a week",
    impact: "High",
    desc: "Shifting even partially to plant-based meals can cut your food-related emissions by 30–50%. Lentils and vegetables have a tiny carbon footprint.",
  },
  {
    icon: "💡",
    category: "Energy",
    title: "Switch to LED bulbs",
    impact: "Medium",
    desc: "LED bulbs use 75% less energy than incandescent ones and last 25× longer. Replacing 10 bulbs saves ~500 kg of CO₂ over their lifetime.",
  },
  {
    icon: "🚲",
    category: "Transport",
    title: "Cycle or walk for short trips",
    impact: "Medium",
    desc: "60% of car trips are under 8 km. Replacing just two car trips a week with cycling cuts ~150 kg CO₂ per year — and improves your health.",
  },
  {
    icon: "🛍",
    category: "Consumption",
    title: "Buy less, buy secondhand",
    impact: "Medium",
    desc: "Manufacturing new goods accounts for ~45% of global emissions. Secondhand markets and repair culture dramatically lower demand.",
  },
  {
    icon: "🗳",
    category: "Civic",
    title: "Vote for climate policy",
    impact: "Very High",
    desc: "Personal choices matter, but systemic change is 10–100× more impactful. Vote, advocate, and pressure institutions to act on climate.",
  },
];

const IMPACT_STYLES: Record<Tip["impact"], { bg: string; color: string }> = {
  "Very High": { bg: "rgba(239,68,68,0.15)",  color: "#fca5a5" },
  High:        { bg: "rgba(251,191,36,0.12)", color: "#fde68a" },
  Medium:      { bg: "rgba(52,211,153,0.12)", color: "#6ee7b7" },
};

// ── SUB-COMPONENTS ────────────────────────────────────────────────────────────

function Navbar() {
  const tipsRef = useRef<HTMLElement | null>(null);

  const scrollToTips = () => {
    const el = document.getElementById("tips");
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        zIndex: 100,
        padding: "0 2.5rem",
        height: "64px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        background: "rgba(5,12,7,0.75)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
    >
      <span style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: "20px",
        fontWeight: 700,
        color: "#b8f0c8",
        letterSpacing: "-0.3px",
      }}>
        Planet Brief
      </span>

      <div style={{ display: "flex", gap: "2.5rem", alignItems: "center" }}>
        {(["Facts", "Tips"] as const).map((label) => (
          <button
            key={label}
            onClick={() => document.getElementById(label.toLowerCase())?.scrollIntoView({ behavior: "smooth" })}
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: "rgba(255,255,255,0.5)",
              fontSize: "13px",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              transition: "color 0.2s",
              padding: 0,
            }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#b8f0c8")}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "rgba(255,255,255,0.5)")}
          >
            {label}
          </button>
        ))}
        <Link
          href="/quiz"
          style={{
            background: "#16a34a",
            color: "#fff",
            padding: "8px 20px",
            borderRadius: "6px",
            fontSize: "13px",
            fontWeight: 500,
            textDecoration: "none",
            letterSpacing: "0.03em",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#15803d")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#16a34a")}
        >
          Take Quiz
        </Link>
      </div>
    </motion.nav>
  );
}

// Animated section title
function SectionLabel({ children }: { children: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.p
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      style={{
        fontSize: "11px",
        letterSpacing: "0.15em",
        color: "#6ee7b7",
        textTransform: "uppercase",
        marginBottom: "0.5rem",
      }}
    >
      {children}
    </motion.p>
  );
}

function Hero({ onScrollToTips }: { onScrollToTips: () => void }) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const words = ["Our", "planet", "is", "changing."];

  return (
    <section
      ref={containerRef}
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "8rem 2rem 5rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Parallax background rings */}
      <motion.div style={{ y, opacity, position: "absolute", inset: 0, pointerEvents: "none" }}>
        {[360, 560, 760, 960].map((size, i) => (
          <motion.div
            key={size}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: i * 0.15, ease: "easeOut" }}
            style={{
              position: "absolute",
              width: size,
              height: size,
              borderRadius: "50%",
              border: `1px solid rgba(184,240,200,${0.07 - i * 0.012})`,
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        ))}
        {/* Glow blob */}
        <div style={{
          position: "absolute",
          width: 600, height: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(22,163,74,0.12) 0%, transparent 70%)",
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          filter: "blur(40px)",
        }} />
      </motion.div>

      {/* Badge */}
      <motion.span
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        style={{
          display: "inline-block",
          background: "rgba(184,240,200,0.08)",
          border: "1px solid rgba(184,240,200,0.2)",
          borderRadius: "20px",
          padding: "5px 16px",
          fontSize: "11px",
          letterSpacing: "0.14em",
          color: "#b8f0c8",
          marginBottom: "2rem",
          textTransform: "uppercase",
          position: "relative",
          zIndex: 1,
        }}
      >
        Climate Awareness · Student Project
      </motion.span>

      {/* Headline — word by word */}
      <h1 style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: "clamp(3rem, 8.5vw, 6.5rem)",
        fontWeight: 700,
        lineHeight: 1.05,
        letterSpacing: "-1.5px",
        marginBottom: "1.25rem",
        position: "relative",
        zIndex: 1,
        maxWidth: "820px",
      }}>
        {words.map((word, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            style={{
              display: "inline-block",
              marginRight: "0.28em",
              color: word === "changing." ? "#f97316" : "#f0faf2",
              fontStyle: word === "changing." ? "italic" : "normal",
            }}
          >
            {word}
          </motion.span>
        ))}
        <br />
        <motion.span
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: "inline-block", color: "#f0faf2" }}
        >
          Are you ready?
        </motion.span>
      </h1>

      {/* Subheading */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.9 }}
        style={{
          fontSize: "clamp(1rem, 2vw, 1.2rem)",
          color: "rgba(255,255,255,0.5)",
          maxWidth: "500px",
          lineHeight: 1.75,
          marginBottom: "3rem",
          position: "relative",
          zIndex: 1,
        }}
      >
        Climate change is the defining challenge of our generation. Explore the facts, test your knowledge, and discover actions that actually make a difference.
      </motion.p>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.05 }}
        style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center", position: "relative", zIndex: 1 }}
      >
        <Link
          href="/quiz"
          style={{
            background: "#16a34a",
            color: "#fff",
            padding: "15px 36px",
            borderRadius: "8px",
            textDecoration: "none",
            fontSize: "15px",
            fontWeight: 500,
            letterSpacing: "0.02em",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            transition: "background 0.2s, transform 0.15s",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#15803d"; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#16a34a"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
        >
          Take the Quiz
          <span style={{ fontSize: "16px" }}>→</span>
        </Link>

        <motion.button
          onClick={onScrollToTips}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          style={{
            background: "transparent",
            color: "#b8f0c8",
            padding: "15px 36px",
            borderRadius: "8px",
            border: "1px solid rgba(184,240,200,0.25)",
            fontSize: "15px",
            fontWeight: 500,
            cursor: "pointer",
            letterSpacing: "0.02em",
            transition: "border-color 0.2s",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "rgba(184,240,200,0.65)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "rgba(184,240,200,0.25)")}
        >
          See Tips ↓
        </motion.button>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.8 }}
        style={{
          position: "absolute",
          bottom: "2.5rem",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "6px",
        }}
      >
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          style={{
            width: "1px",
            height: "40px",
            background: "linear-gradient(to bottom, rgba(184,240,200,0.5), transparent)",
          }}
        />
      </motion.div>
    </section>
  );
}

function Facts() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="facts" style={{ padding: "6rem 2rem", maxWidth: "1140px", margin: "0 auto" }}>
      <SectionLabel>By the numbers</SectionLabel>

      <motion.h2
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
          color: "#f0faf2",
          fontWeight: 700,
          marginBottom: "3.5rem",
          maxWidth: "480px",
          lineHeight: 1.2,
          letterSpacing: "-0.5px",
        }}
      >
        The numbers don't lie
      </motion.h2>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "1px",
        background: "rgba(255,255,255,0.06)",
        borderRadius: "18px",
        overflow: "hidden",
      }}>
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.value}
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.1 + i * 0.1, ease: "easeOut" }}
            style={{ background: "#0a1a0e", padding: "2.5rem 2rem", transition: "background 0.2s" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#0f2215")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#0a1a0e")}
          >
            <div style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(2rem, 5vw, 2.8rem)",
              color: stat.color,
              fontWeight: 700,
              letterSpacing: "-1px",
              marginBottom: "0.75rem",
            }}>
              {stat.value}
            </div>
            <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.45)", lineHeight: 1.55 }}>
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function TipCard({ tip, index }: { tip: Tip; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const styles = IMPACT_STYLES[tip.impact];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: (index % 3) * 0.1, ease: "easeOut" }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      style={{
        background: "#0a1a0e",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "16px",
        padding: "1.75rem",
        cursor: "default",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
        <span style={{ fontSize: "26px", lineHeight: 1 }}>{tip.icon}</span>
        <span style={{
          fontSize: "11px",
          fontWeight: 600,
          padding: "3px 10px",
          borderRadius: "20px",
          background: styles.bg,
          color: styles.color,
          letterSpacing: "0.05em",
          whiteSpace: "nowrap",
        }}>
          {tip.impact} impact
        </span>
      </div>
      <p style={{ fontSize: "11px", letterSpacing: "0.1em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", marginBottom: "6px" }}>
        {tip.category}
      </p>
      <h3 style={{ fontSize: "17px", fontWeight: 600, color: "#f0faf2", marginBottom: "0.75rem", lineHeight: 1.3 }}>
        {tip.title}
      </h3>
      <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.48)", lineHeight: 1.7 }}>
        {tip.desc}
      </p>
    </motion.div>
  );
}

function Tips() {
  const titleRef = useRef(null);
  const inView = useInView(titleRef, { once: true, margin: "-80px" });

  return (
    <section id="tips" style={{ padding: "6rem 2rem", maxWidth: "1140px", margin: "0 auto" }}>
      <SectionLabel>Take action</SectionLabel>

      <motion.h2
        ref={titleRef}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
          color: "#f0faf2",
          fontWeight: 700,
          marginBottom: "0.75rem",
          letterSpacing: "-0.5px",
        }}
      >
        What you can do today
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.15 }}
        style={{
          fontSize: "16px",
          color: "rgba(255,255,255,0.45)",
          marginBottom: "3rem",
          maxWidth: "480px",
          lineHeight: 1.7,
        }}
      >
        Small shifts in behaviour, multiplied by millions of people, create the systemic change our planet needs.
      </motion.p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" }}>
        {TIPS.map((tip, i) => (
          <TipCard key={tip.title} tip={tip} index={i} />
        ))}
      </div>
    </section>
  );
}

function QuizCTA() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section style={{ padding: "6rem 2rem" }}>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{
          maxWidth: "760px",
          margin: "0 auto",
          background: "linear-gradient(135deg, #0f2e17 0%, #0a1a0e 100%)",
          border: "1px solid rgba(22,163,74,0.25)",
          borderRadius: "24px",
          padding: "4rem 3rem",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* glow */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse at 50% 0%, rgba(22,163,74,0.18) 0%, transparent 65%)",
        }} />

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          style={{ fontSize: "11px", letterSpacing: "0.15em", color: "#6ee7b7", textTransform: "uppercase", marginBottom: "1rem" }}
        >
          Test your knowledge
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
            color: "#f0faf2",
            fontWeight: 700,
            letterSpacing: "-0.5px",
            lineHeight: 1.15,
            marginBottom: "1rem",
          }}
        >
          How much do you actually know about climate change?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4 }}
          style={{ fontSize: "16px", color: "rgba(255,255,255,0.45)", marginBottom: "2.5rem", lineHeight: 1.7 }}
        >
          6 questions. Real facts. Find out your Climate IQ.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
        >
          <Link
            href="/quiz"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              background: "#16a34a",
              color: "#fff",
              padding: "16px 40px",
              borderRadius: "10px",
              textDecoration: "none",
              fontSize: "16px",
              fontWeight: 500,
              letterSpacing: "0.02em",
              transition: "background 0.2s, transform 0.15s",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#15803d"; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#16a34a"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
          >
            Start the Quiz →
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{
      borderTop: "1px solid rgba(255,255,255,0.06)",
      padding: "3rem 2rem",
      textAlign: "center",
    }}>
      <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "18px", color: "#b8f0c8", marginBottom: "0.5rem" }}>
        Planet Brief
      </p>
      <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.25)" }}>
        A student project for climate awareness · {new Date().getFullYear()}
      </p>
    </footer>
  );
}

// ── PAGE ──────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const tipsRef = useRef<HTMLElement | null>(null);

  const scrollToTips = () => {
    document.getElementById("tips")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body {
          background: #050c07;
          font-family: 'Helvetica Neue', Arial, sans-serif;
          -webkit-font-smoothing: antialiased;
          color: #f0faf2;
        }
        ::selection { background: rgba(22,163,74,0.35); }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #050c07; }
        ::-webkit-scrollbar-thumb { background: #1a3a22; border-radius: 3px; }
      `}</style>

      <Navbar />

      <main>
        <Hero onScrollToTips={scrollToTips} />
        <Facts />
        <Tips />
        <QuizCTA />
      </main>

      <Footer />
    </>
  );
}
