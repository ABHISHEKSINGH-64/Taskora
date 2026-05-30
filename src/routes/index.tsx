import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { ArrowRight, ArrowUpRight, Check, AlertOctagon, EyeOff, Link2Off, Clock, Search, Sparkles, Shield, Workflow } from "lucide-react";
import { HeroScene } from "@/components/HeroScene";
import { Navbar } from "@/components/Navbar";
import { ConfidenceRing } from "@/components/ConfidenceRing";
import { StreamingText } from "@/components/StreamingText";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "WorkFlow — Verified accountability for every team" },
      { name: "description", content: "AI-verified work logs, real-time kanban, and a tamper-proof audit trail. Built for managers who refuse to fly blind." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="bg-[var(--background)] text-[var(--foreground)] overflow-x-hidden">
      <Navbar />
      <Hero />
      <Marquee />
      <Problem />
      <FeatureLog />
      <FeatureBriefing />
      <FeatureAudit />
      <CTA />
      <Footer />
    </div>
  );
}

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      <HeroScene />
      <div
        className="absolute inset-0 -z-10"
        style={{ background: "radial-gradient(circle at 50% 60%, transparent 0%, var(--background) 75%)" }}
      />
      <motion.div style={{ y, opacity }} className="mx-auto max-w-[1400px] w-full px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl"
        >
          <div className="label-micro mb-6 flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--conf-high)] opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[var(--conf-high)]" />
            </span>
            Workforce accountability · v1.0 live
          </div>

          <h1 className="font-display font-semibold tracking-[-0.04em] leading-[0.92] text-[clamp(52px,9vw,120px)]">
            Every task.<br />
            Every log.<br />
            <span className="italic font-light text-[var(--accent)]">Verified.</span>
          </h1>

          <p className="mt-8 max-w-xl text-[17px] leading-[1.65] text-[var(--muted-foreground)]">
            WorkFlow gives managers complete visibility and uses AI to verify every work log —
            so no one can bluff their way through another sprint.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link to="/dashboard" className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-6 py-3.5 text-[14px] font-medium text-[var(--accent-foreground)] hover:opacity-90 transition-opacity">
              Open dashboard <ArrowRight size={16} />
            </Link>
            <a href="#features" className="inline-flex items-center gap-2 rounded-xl border border-[var(--border-strong)] px-6 py-3.5 text-[14px] font-medium hover:bg-[var(--surface)] transition-colors">
              See how it works
            </a>
          </div>

          <div className="mt-16 flex items-center gap-8 text-[var(--muted-foreground)] label-meta text-[11px]">
            <div><span className="font-mono text-[var(--foreground)] text-[13px]">500ms</span> realtime sync</div>
            <div><span className="font-mono text-[var(--foreground)] text-[13px]">0—100</span> ai score</div>
            <div><span className="font-mono text-[var(--foreground)] text-[13px]">∞</span> audit trail</div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="label-meta text-[10px] text-[var(--muted-foreground)]">scroll</span>
        <div className="h-14 w-px bg-[var(--border-strong)] overflow-hidden relative">
          <motion.div
            animate={{ y: [-60, 60] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute h-3 w-px bg-[var(--accent)]"
          />
        </div>
      </motion.div>
    </section>
  );
}

function Marquee() {
  const items = ["Accountability", "Real-time sync", "AI verification", "Audit trail", "Role-based access", "Auto overdue detection", "Streaming briefings", "Tamper-proof"];
  return (
    <div className="border-y border-[var(--border)] py-6 overflow-hidden bg-[var(--surface)]">
      <div className="flex marquee-track gap-12 w-max">
        {[...items, ...items, ...items].map((s, i) => (
          <div key={i} className="flex items-center gap-12 label-meta text-[12px] text-[var(--muted-foreground)] whitespace-nowrap">
            <span>{s}</span>
            <span className="text-[var(--accent)]">◇</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Problem() {
  const items = [
    { icon: Workflow, title: "No single source of truth", text: "Tasks live in chat, sheets, sticky notes, heads." },
    { icon: AlertOctagon, title: "Zero accountability", text: "\"It's done\" with no proof, no log, no record." },
    { icon: EyeOff, title: "Managers flying blind", text: "Status meetings are guesswork dressed as data." },
    { icon: Link2Off, title: "No historical record", text: "What changed yesterday? No one remembers." },
    { icon: Clock, title: "40% lost to follow-ups", text: "Most management time is just chasing updates." },
  ];

  return (
    <section id="problem" className="relative py-32 px-6">
      <div className="mx-auto max-w-[1400px]">
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformOrigin: "left" }}
          className="h-px bg-[var(--border-strong)] mb-12"
        />
        <div className="grid lg:grid-cols-[1fr_2fr] gap-12 mb-16">
          <div>
            <div className="label-micro mb-4">01 · the problem</div>
            <h2 className="font-display text-[clamp(34px,5vw,64px)] font-semibold tracking-[-0.025em] leading-[1.02]">
              Small business management is broken — held together by spreadsheets and trust.
            </h2>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-0">
          {items.map((it, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              style={{ marginTop: `${i * 40}px` }}
              className="rounded-2xl border border-[var(--border)] border-l-2 border-l-[var(--accent)] bg-[var(--surface)] p-6"
            >
              <it.icon size={20} className="text-[var(--accent)] mb-6" strokeWidth={1.5} />
              <h3 className="font-display text-[18px] font-medium leading-tight mb-2">{it.title}</h3>
              <p className="text-[13px] text-[var(--muted-foreground)] leading-relaxed">{it.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureLog() {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setPhase((p) => (p + 1) % 2), 4200);
    return () => clearInterval(id);
  }, []);

  const samples = [
    { text: "did some work today", score: 12, flag: "vague · no_detail" },
    { text: "Refactored billing webhook idempotency: added retry queue with exponential backoff, migrated 3 endpoints, all green in staging.", score: 88, flag: "genuine_effort" },
  ];
  const s = samples[phase];

  return (
    <section id="features" className="py-32 px-6 bg-[var(--surface)] border-y border-[var(--border)]">
      <div className="mx-auto max-w-[1400px] grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          key={phase}
          initial={{ opacity: 0.4 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="order-2 lg:order-1 rounded-2xl border border-[var(--border)] bg-[var(--raised)] p-8"
        >
          <div className="flex items-center justify-between mb-5">
            <div className="label-micro">work log · employee submitted</div>
            <ConfidenceRing score={s.score} size={48} />
          </div>
          <div className="rounded-xl bg-[var(--background)] border border-[var(--border)] p-4 min-h-[120px]">
            <motion.p key={s.text} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[14px] leading-relaxed">
              {s.text}
            </motion.p>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span
              className="label-meta text-[10px] px-2.5 py-1 rounded-full border"
              style={{
                color: s.score >= 70 ? "var(--conf-high)" : "var(--conf-low)",
                borderColor: s.score >= 70 ? "var(--conf-high)" : "var(--conf-low)",
                background: `color-mix(in oklab, ${s.score >= 70 ? "var(--conf-high)" : "var(--conf-low)"} 10%, transparent)`,
              }}
            >
              {s.flag}
            </span>
            <span className="font-mono text-[11px] text-[var(--muted-foreground)]">claude haiku · 412ms</span>
          </div>
        </motion.div>

        <div className="order-1 lg:order-2">
          <div className="label-micro mb-4">02 · ai log verifier</div>
          <h2 className="font-display text-[clamp(30px,4vw,52px)] font-semibold tracking-[-0.025em] leading-[1.05] mb-5">
            Every log gets a score. <span className="text-[var(--muted-foreground)]">Vague answers don't survive.</span>
          </h2>
          <p className="text-[15px] text-[var(--muted-foreground)] leading-[1.7] max-w-md">
            Claude Haiku reads every submission against the task brief, scores it 0–100, and flags
            patterns: vague, off-topic, no detail, completed without proof. Green is real work.
          </p>
          <ul className="mt-8 space-y-2 text-[13px] text-[var(--muted-foreground)]">
            {["sub-second response", "5 distinct flag categories", "manager-visible in realtime"].map((t) => (
              <li key={t} className="flex items-center gap-2"><Check size={14} className="text-[var(--conf-high)]" /> {t}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function FeatureBriefing() {
  const [visible, setVisible] = useState(false);
  return (
    <section className="py-32 px-6">
      <motion.div
        onViewportEnter={() => setVisible(true)}
        viewport={{ once: true }}
        className="mx-auto max-w-[1400px] grid lg:grid-cols-2 gap-16 items-center"
      >
        <div>
          <div className="label-micro mb-4">03 · one-click team briefing</div>
          <h2 className="font-display text-[clamp(30px,4vw,52px)] font-semibold tracking-[-0.025em] leading-[1.05] mb-5">
            Skip the standup. <span className="text-[var(--muted-foreground)]">Read the briefing.</span>
          </h2>
          <p className="text-[15px] text-[var(--muted-foreground)] leading-[1.7] max-w-md">
            One button. The AI reads the entire board, every log, every overdue task, and writes
            you a five-sentence plain-English brief: who's behind, what's at risk, who to recognize.
          </p>
          <div className="mt-8 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--accent)]/12 border border-[var(--accent)]/30 text-[var(--accent)] text-[13px] font-medium">
            <Sparkles size={14} /> Brief me
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
          <div className="px-5 py-3 border-b border-[var(--border)] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-[var(--accent)]" />
              <span className="label-meta text-[11px]">team briefing</span>
            </div>
            <span className="font-mono text-[10px] text-[var(--muted-foreground)]">live · streaming</span>
          </div>
          <div className="p-6 min-h-[260px]">
            {visible && (
              <StreamingText
                text="Kabir Nair's Inventory reconciliation has been overdue for 2 days — the single log was flagged vague (18/100). Ananya's Onboarding deck v2 scored 32 this morning; recommend a check-in today. Priya Sharma is significantly outperforming with two 80+ scores this week. Devansh Rao's billing refactor is on track at 76/100."
                speed={10}
              />
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function FeatureAudit() {
  const entries = [
    { actor: "Priya Sharma", action: "submitted log · scored 84/100", time: "12m ago" },
    { actor: "System", action: "auto-flagged Inventory recon as overdue", time: "47m ago" },
    { actor: "Ananya Iyer", action: "moved Onboarding deck v2 → in_progress", time: "2h ago" },
    { actor: "Rohan Mehta", action: "created task — Hire Senior Data Analyst", time: "5h ago" },
    { actor: "Maya Nair", action: "edited priority: low → medium on Refactor billing", time: "yesterday" },
  ];
  return (
    <section className="py-32 px-6 bg-[var(--surface)] border-y border-[var(--border)]">
      <div className="mx-auto max-w-[1400px] grid lg:grid-cols-2 gap-16 items-start">
        <div>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--raised)] p-6">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--border)]">
              <span className="label-meta text-[11px] flex items-center gap-2">
                <Shield size={13} className="text-[var(--conf-high)]" />
                tamper-proof · append only
              </span>
              <span className="font-mono text-[10px] text-[var(--muted-foreground)]">5 of 1,247</span>
            </div>
            <div className="relative pl-6">
              <div className="absolute left-[7px] top-2 bottom-2 w-px bg-[var(--border-strong)]" />
              {entries.map((e, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="relative pb-5 last:pb-0"
                >
                  <div className="absolute -left-[22px] top-1.5 h-3 w-3 rounded-full bg-[var(--accent)] ring-4 ring-[var(--raised)]" />
                  <div className="text-[13px] font-medium">{e.actor}</div>
                  <div className="text-[12px] text-[var(--muted-foreground)] mt-0.5">{e.action}</div>
                  <div className="font-mono text-[10px] text-[var(--muted-foreground)] mt-1">{e.time}</div>
                </motion.div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-[var(--border)] text-center label-meta text-[10px] text-[var(--conf-low)]">
              you cannot delete this record
            </div>
          </div>
        </div>

        <div>
          <div className="label-micro mb-4">04 · audit trail</div>
          <h2 className="font-display text-[clamp(30px,4vw,52px)] font-semibold tracking-[-0.025em] leading-[1.05] mb-5">
            Every action recorded. <span className="text-[var(--muted-foreground)]">Nothing deletable.</span>
          </h2>
          <p className="text-[15px] text-[var(--muted-foreground)] leading-[1.7] max-w-md">
            Status changes, log edits, priority shifts, assignment swaps — all stamped with actor,
            diff, and timestamp. When a question comes up six months later, you have the answer.
          </p>
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="relative py-40 px-6 overflow-hidden">
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 h-[400px] w-[400px] rounded-full opacity-25 blur-[100px]" style={{ background: "var(--accent)", animation: "drift-a 22s ease-in-out infinite" }} />
        <div className="absolute top-1/2 right-1/4 h-[350px] w-[350px] rounded-full opacity-20 blur-[100px]" style={{ background: "var(--conf-high)", animation: "drift-b 26s ease-in-out infinite" }} />
        <div className="absolute bottom-1/4 left-1/2 h-[400px] w-[400px] rounded-full opacity-20 blur-[100px]" style={{ background: "var(--conf-mid)", animation: "drift-c 19s ease-in-out infinite" }} />
      </div>
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-display text-[clamp(40px,7vw,84px)] font-semibold tracking-[-0.03em] leading-[0.98]">
          Stop chasing updates.<br />
          <span className="italic font-light text-[var(--accent)]">Start tracking outcomes.</span>
        </h2>
        <div className="mt-10 flex justify-center gap-3 flex-wrap">
          <Link to="/dashboard" className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-7 py-4 text-[14px] font-medium text-[var(--accent-foreground)] hover:opacity-90 transition-opacity">
            Open the dashboard <ArrowUpRight size={16} />
          </Link>
          <Link to="/login" className="inline-flex items-center gap-2 rounded-xl border border-[var(--border-strong)] px-7 py-4 text-[14px] font-medium hover:bg-[var(--surface)] transition-colors">
            Request demo
          </Link>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[var(--border)] py-10 px-6">
      <div className="mx-auto max-w-[1400px] flex flex-wrap items-center justify-between gap-4 label-meta text-[11px] text-[var(--muted-foreground)]">
        <div>workflow · built for accountability · {new Date().getFullYear()}</div>
        <div className="flex items-center gap-6">
          <span>react · supabase · claude</span>
          <span className="flex items-center gap-1.5"><Search size={11} /> docs</span>
        </div>
      </div>
    </footer>
  );
}
