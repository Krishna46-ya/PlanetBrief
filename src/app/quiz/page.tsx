"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  animate,
} from "motion/react";

// ── TYPES ─────────────────────────────────────────────────────────────────────

interface Question {
  q: string;
  opts: string[];
  ans: number;
  fact: string;
}

// ── DATA ──────────────────────────────────────────────────────────────────────

const QUIZ: Question[] = [
  {
    q: "What percentage of the last decade's years rank among the hottest ever recorded?",
    opts: ["50%", "70%", "90%", "100%"],
    ans: 3,
    fact: "All ten years between 2014–2023 rank among the warmest ever recorded — the planet is warming faster than at any point in human civilisation.",
  },
  {
    q: "How much CO₂ does producing one kilogram of beef generate?",
    opts: ["2 kg CO₂", "9 kg CO₂", "27 kg CO₂", "60 kg CO₂"],
    ans: 2,
    fact: "Beef generates roughly 27 kg of CO₂ per kg of meat — nearly 20× more than lentils. Cutting red meat is one of the highest-impact personal choices you can make.",
  },
  {
    q: "What share of global CO₂ emissions comes from the richest 10% of people?",
    opts: ["20%", "35%", "48%", "60%"],
    ans: 2,
    fact: "The wealthiest 10% produce nearly half of global carbon emissions. Lifestyle changes at the top have a disproportionate impact on the climate.",
  },
  {
    q: "By how much has Arctic sea ice extent declined since 1979?",
    opts: ["~10%", "~30%", "~50%", "~70%"],
    ans: 1,
    fact: "Arctic summer sea ice has shrunk by roughly 30% since satellite records began. An ice-free Arctic summer could arrive before 2050.",
  },
  {
    q: "Which renewable energy source grew the fastest globally in 2023?",
    opts: ["Wind", "Hydropower", "Solar", "Geothermal"],
    ans: 2,
    fact: "Solar capacity additions broke records in 2023, making it the fastest-growing energy source on Earth — and costs have fallen 90% in a decade.",
  },
  {
    q: "What is the CO₂ concentration scientists consider the upper 'safe' limit?",
    opts: ["280 ppm", "350 ppm", "420 ppm", "500 ppm"],
    ans: 1,
    fact: "350 ppm is widely cited as the upper safe limit. We're already at ~424 ppm and rising — which is why urgent action is needed now.",
  },
];

const RESULT_TIERS = [
  {
    min: 0, max: 2,
    label: "Climate Newcomer",
    message: "Every expert was once a beginner. The fact you're here means you care — now let the facts guide you.",
    color: "#f97316",
  },
  {
    min: 3, max: 4,
    label: "Climate Aware",
    message: "You know the basics and that matters. A little more reading and you'll be leading the conversation.",
    color: "#f59e0b",
  },
  {
    min: 5, max: 5,
    label: "Climate Literate",
    message: "Sharp knowledge, real awareness. You're ahead of most — now channel that into action.",
    color: "#6ee7b7",
  },
  {
    min: 6, max: 6,
    label: "Climate Champion",
    message: "Perfect score. You understand the science, the stakes, and the solutions. Share this quiz and bring others up.",
    color: "#16a34a",
  },
];

// ── HELPERS ───────────────────────────────────────────────────────────────────

function getTier(score: number) {
  return RESULT_TIERS.find((t) => score >= t.min && score <= t.max)!;
}

// Animated counter
function Counter({ to, duration = 1.2 }: { to: number; duration?: number }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const unsub = rounded.on("change", setDisplay);
    const ctrl = animate(count, to, { duration, ease: "easeOut" });
    return () => { ctrl.stop(); unsub(); };
  }, [to]);

  return <span>{display}</span>;
}

// ── COMPONENTS ────────────────────────────────────────────────────────────────

function Navbar() {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        zIndex: 100,
        padding: "0 2.5rem",
        height: "64px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "rgba(5,12,7,0.8)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <Link
        href="/"
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "20px",
          fontWeight: 700,
          color: "#b8f0c8",
          textDecoration: "none",
          letterSpacing: "-0.3px",
        }}
      >
        Planet Brief
      </Link>

      <Link
        href="/"
        style={{
          color: "rgba(255,255,255,0.45)",
          fontSize: "13px",
          textDecoration: "none",
          letterSpacing: "0.05em",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          transition: "color 0.2s",
        }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#b8f0c8")}
        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.45)")}
      >
        ← Back to home
      </Link>
    </motion.nav>
  );
}

function ProgressRing({
  progress,
  current,
  total,
}: {
  progress: number;
  current: number;
  total: number;
}) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const offset = circ - (progress / 100) * circ;

  return (
    <div style={{ position: "relative", width: 88, height: 88 }}>
      <svg width="88" height="88" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="44" cy="44" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="3" />
        <motion.circle
          cx="44" cy="44" r={r}
          fill="none"
          stroke="#16a34a"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circ}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </svg>
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
      }}>
        <span style={{ fontSize: "18px", fontWeight: 700, color: "#f0faf2", lineHeight: 1 }}>{current}</span>
        <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)" }}>/ {total}</span>
      </div>
    </div>
  );
}

const OPTION_LETTERS = ["A", "B", "C", "D"];

function QuestionCard({
  question,
  index,
  selected,
  onSelect,
}: {
  question: Question;
  index: number;
  selected: number | null;
  onSelect: (i: number) => void;
}) {
  const answered = selected !== null;

  function getOptionStyle(i: number): React.CSSProperties {
    const base: React.CSSProperties = {
      width: "100%",
      textAlign: "left",
      padding: "16px 20px",
      borderRadius: "12px",
      border: "1px solid rgba(255,255,255,0.09)",
      background: "rgba(255,255,255,0.03)",
      color: "rgba(255,255,255,0.75)",
      fontSize: "15px",
      lineHeight: 1.55,
      cursor: answered ? "default" : "pointer",
      display: "flex",
      alignItems: "flex-start",
      gap: "14px",
      transition: "background 0.18s, border-color 0.18s",
    };

    if (answered) {
      if (i === question.ans) {
        return { ...base, background: "rgba(22,163,74,0.16)", border: "1px solid rgba(22,163,74,0.5)", color: "#86efac" };
      }
      if (i === selected) {
        return { ...base, background: "rgba(239,68,68,0.13)", border: "1px solid rgba(239,68,68,0.45)", color: "#fca5a5" };
      }
      return { ...base, opacity: 0.4 };
    }
    return base;
  }

  return (
    <motion.div
      key={index}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      style={{ width: "100%" }}
    >
      {/* Question number label */}
      <p style={{
        fontSize: "11px",
        letterSpacing: "0.14em",
        color: "#6ee7b7",
        textTransform: "uppercase",
        marginBottom: "0.9rem",
      }}>
        Question {index + 1}
      </p>

      {/* Question text */}
      <h2 style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: "clamp(1.3rem, 3vw, 1.65rem)",
        fontWeight: 700,
        color: "#f0faf2",
        lineHeight: 1.35,
        marginBottom: "2rem",
        letterSpacing: "-0.3px",
      }}>
        {question.q}
      </h2>

      {/* Options */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {question.opts.map((opt, i) => (
          <motion.button
            key={i}
            style={getOptionStyle(i)}
            onClick={() => !answered && onSelect(i)}
            whileHover={!answered ? { scale: 1.01, transition: { duration: 0.15 } } : {}}
            whileTap={!answered ? { scale: 0.99 } : {}}
            onMouseEnter={(e) => {
              if (!answered) {
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.07)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.18)";
              }
            }}
            onMouseLeave={(e) => {
              if (!answered) {
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.09)";
              }
            }}
          >
            <span style={{
              minWidth: "26px", height: "26px",
              borderRadius: "6px",
              background: answered && i === question.ans
                ? "rgba(22,163,74,0.3)"
                : answered && i === selected && i !== question.ans
                ? "rgba(239,68,68,0.25)"
                : "rgba(255,255,255,0.07)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "12px", fontWeight: 600,
              color: answered && i === question.ans ? "#86efac"
                : answered && i === selected ? "#fca5a5"
                : "rgba(255,255,255,0.4)",
              flexShrink: 0,
              marginTop: "1px",
              transition: "all 0.2s",
            }}>
              {OPTION_LETTERS[i]}
            </span>
            <span>{opt}</span>
            {answered && i === question.ans && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                style={{ marginLeft: "auto", fontSize: "16px", flexShrink: 0 }}
              >
                ✓
              </motion.span>
            )}
            {answered && i === selected && i !== question.ans && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                style={{ marginLeft: "auto", fontSize: "14px", flexShrink: 0, color: "#fca5a5" }}
              >
                ✗
              </motion.span>
            )}
          </motion.button>
        ))}
      </div>

      {/* Fact reveal */}
      <AnimatePresence>
        {answered && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: "1.25rem" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            style={{ overflow: "hidden" }}
          >
            <div style={{
              background: "rgba(22,163,74,0.08)",
              border: "1px solid rgba(22,163,74,0.2)",
              borderRadius: "12px",
              padding: "1rem 1.25rem",
            }}>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", marginBottom: "4px", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Did you know
              </p>
              <p style={{ fontSize: "14px", color: "#86efac", lineHeight: 1.7, margin: 0 }}>
                {question.fact}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ResultsScreen({ score, onRetry }: { score: number; onRetry: () => void }) {
  const tier = getTier(score);
  const pct = Math.round((score / QUIZ.length) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{ width: "100%", textAlign: "center" }}
    >
      {/* Score circle */}
      <div style={{ marginBottom: "2.5rem" }}>
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.1 }}
          style={{
            width: 140, height: 140,
            borderRadius: "50%",
            background: `conic-gradient(${tier.color} ${pct}%, rgba(255,255,255,0.06) 0%)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 1.5rem",
            position: "relative",
          }}
        >
          <div style={{
            width: 114, height: 114,
            borderRadius: "50%",
            background: "#050c07",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
          }}>
            <span style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "38px", fontWeight: 700,
              color: tier.color, lineHeight: 1,
            }}>
              <Counter to={score} />
            </span>
            <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.3)" }}>
              / {QUIZ.length}
            </span>
          </div>
        </motion.div>

        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{
            display: "inline-block",
            fontSize: "12px",
            fontWeight: 600,
            padding: "4px 14px",
            borderRadius: "20px",
            background: `${tier.color}22`,
            color: tier.color,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: "1rem",
          }}
        >
          {tier.label}
        </motion.span>
      </div>

      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "clamp(1.5rem, 4vw, 2rem)",
          color: "#f0faf2",
          fontWeight: 700,
          letterSpacing: "-0.3px",
          lineHeight: 1.25,
          marginBottom: "1rem",
          maxWidth: "480px",
          margin: "0 auto 1rem",
        }}
      >
        You got {score} out of {QUIZ.length} right
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.65 }}
        style={{
          fontSize: "16px",
          color: "rgba(255,255,255,0.5)",
          lineHeight: 1.7,
          maxWidth: "440px",
          margin: "0 auto 2.5rem",
        }}
      >
        {tier.message}
      </motion.p>

      {/* Score breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.75 }}
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "12px",
          marginBottom: "2.5rem",
          flexWrap: "wrap",
        }}
      >
        {QUIZ.map((_, i) => (
          <div
            key={i}
            style={{
              width: 36, height: 36,
              borderRadius: "50%",
              background: i < score ? "rgba(22,163,74,0.2)" : "rgba(255,255,255,0.05)",
              border: `1px solid ${i < score ? "rgba(22,163,74,0.5)" : "rgba(255,255,255,0.1)"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "13px",
              color: i < score ? "#86efac" : "rgba(255,255,255,0.2)",
            }}
          >
            {i < score ? "✓" : i + 1}
          </div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.85 }}
        style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}
      >
        <motion.button
          onClick={onRetry}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          style={{
            background: "#16a34a",
            color: "#fff",
            border: "none",
            padding: "14px 32px",
            borderRadius: "8px",
            fontSize: "15px",
            fontWeight: 500,
            cursor: "pointer",
            letterSpacing: "0.02em",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#15803d")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#16a34a")}
        >
          Try again
        </motion.button>

        <Link
          href="/#tips"
          style={{
            background: "transparent",
            color: "#b8f0c8",
            border: "1px solid rgba(184,240,200,0.25)",
            padding: "14px 32px",
            borderRadius: "8px",
            fontSize: "15px",
            fontWeight: 500,
            textDecoration: "none",
            letterSpacing: "0.02em",
            transition: "border-color 0.2s",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "rgba(184,240,200,0.6)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "rgba(184,240,200,0.25)")}
        >
          See action tips →
        </Link>
      </motion.div>
    </motion.div>
  );
}

// ── PAGE ──────────────────────────────────────────────────────────────────────

export default function QuizPage() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(QUIZ.length).fill(null));

  const progress = ((current + (selected !== null ? 1 : 0)) / QUIZ.length) * 100;

  function handleSelect(i: number) {
    if (selected !== null) return;
    setSelected(i);
    const updated = [...answers];
    updated[current] = i;
    setAnswers(updated);
    if (i === QUIZ[current].ans) setScore((s) => s + 1);
  }

  function handleNext() {
    if (current < QUIZ.length - 1) {
      setCurrent((c) => c + 1);
      setSelected(null);
    } else {
      setDone(true);
    }
  }

  function handleRetry() {
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setDone(false);
    setAnswers(Array(QUIZ.length).fill(null));
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          background: #050c07;
          font-family: 'Helvetica Neue', Arial, sans-serif;
          -webkit-font-smoothing: antialiased;
          color: #f0faf2;
          min-height: 100vh;
        }
        ::selection { background: rgba(22,163,74,0.35); }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #050c07; }
        ::-webkit-scrollbar-thumb { background: #1a3a22; border-radius: 3px; }
      `}</style>

      <Navbar />

      {/* Background glow */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(22,163,74,0.09) 0%, transparent 70%)",
      }} />

      <main style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: "100px 1.5rem 4rem",
        position: "relative",
        zIndex: 1,
      }}>
        <div style={{ width: "100%", maxWidth: "640px" }}>

          <AnimatePresence mode="wait">
            {!done ? (
              <motion.div
                key="quiz"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ width: "100%" }}
              >
                {/* Header row */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "2.5rem",
                }}>
                  <div>
                    <motion.p
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: "22px",
                        fontWeight: 700,
                        color: "#f0faf2",
                        letterSpacing: "-0.3px",
                        marginBottom: "4px",
                      }}
                    >
                      Climate IQ Quiz
                    </motion.p>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.15 }}
                      style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)" }}
                    >
                      {QUIZ.length} questions · Test your knowledge
                    </motion.p>
                  </div>

                  <ProgressRing
                    progress={progress}
                    current={current + 1}
                    total={QUIZ.length}
                  />
                </div>

                {/* Progress bar */}
                <div style={{
                  height: "2px",
                  background: "rgba(255,255,255,0.06)",
                  borderRadius: "2px",
                  marginBottom: "2.5rem",
                  overflow: "hidden",
                }}>
                  <motion.div
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    style={{ height: "100%", background: "#16a34a", borderRadius: "2px" }}
                  />
                </div>

                {/* Card container */}
                <div style={{
                  background: "#0a1a0e",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "20px",
                  padding: "clamp(1.5rem, 4vw, 2.5rem)",
                  marginBottom: "1.25rem",
                  minHeight: "420px",
                  display: "flex",
                  flexDirection: "column",
                }}>
                  <AnimatePresence mode="wait">
                    <QuestionCard
                      key={current}
                      question={QUIZ[current]}
                      index={current}
                      selected={selected}
                      onSelect={handleSelect}
                    />
                  </AnimatePresence>
                </div>

                {/* Next button */}
                <AnimatePresence>
                  {selected !== null && (
                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.3 }}
                      onClick={handleNext}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        width: "100%",
                        padding: "16px",
                        background: "#16a34a",
                        color: "#fff",
                        border: "none",
                        borderRadius: "12px",
                        fontSize: "15px",
                        fontWeight: 500,
                        cursor: "pointer",
                        letterSpacing: "0.03em",
                        transition: "background 0.2s",
                      }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#15803d")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#16a34a")}
                    >
                      {current < QUIZ.length - 1 ? "Next question →" : "See my results →"}
                    </motion.button>
                  )}
                </AnimatePresence>

                {/* Question dots */}
                <div style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "8px",
                  marginTop: "2rem",
                }}>
                  {QUIZ.map((_, i) => (
                    <div
                      key={i}
                      style={{
                        width: i === current ? 20 : 7,
                        height: 7,
                        borderRadius: "4px",
                        background: i < current
                          ? "#16a34a"
                          : i === current
                          ? "#6ee7b7"
                          : "rgba(255,255,255,0.12)",
                        transition: "all 0.3s ease",
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ width: "100%" }}
              >
                <ResultsScreen score={score} onRetry={handleRetry} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </>
  );
}
