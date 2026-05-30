import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Shield, User, Clock, AlertOctagon, FilePen, Sparkles, Plus, Move } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { mockAudit, type AuditEntry } from "@/lib/mock-data";

export const Route = createFileRoute("/audit")({
  head: () => ({
    meta: [
      { title: "Audit log · WorkFlow" },
      { name: "description", content: "Tamper-proof timeline of every change in the system." },
    ],
  }),
  component: AuditPage,
});

function iconFor(action: string) {
  if (action.includes("flagged")) return AlertOctagon;
  if (action.includes("created")) return Plus;
  if (action.includes("moved")) return Move;
  if (action.includes("verified")) return Sparkles;
  if (action.includes("edited")) return FilePen;
  return User;
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function AuditPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <AppSidebar />
      <main className="ml-[240px] min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 z-20 backdrop-blur-xl bg-[color-mix(in_oklab,var(--background)_80%,transparent)] border-b border-[var(--border)] px-8 py-4 flex items-center justify-between"
        >
          <div>
            <h1 className="font-display text-[22px] font-semibold tracking-tight">Audit Log</h1>
            <div className="label-meta text-[11px] text-[var(--muted-foreground)] mt-0.5 flex items-center gap-2">
              <Shield size={11} className="text-[var(--conf-high)]" /> tamper-proof · append-only
            </div>
          </div>
          <span className="font-mono text-[12px] text-[var(--muted-foreground)]">{mockAudit.length} entries</span>
        </motion.div>

        <div className="max-w-3xl mx-auto p-8">
          <div className="relative pl-8">
            <div className="absolute left-[11px] top-2 bottom-2 w-px bg-[var(--border-strong)]" />
            {mockAudit.map((entry, i) => (
              <Entry key={entry.id} entry={entry} index={i} Icon={iconFor(entry.action)} />
            ))}
          </div>
          <div className="mt-10 text-center label-meta text-[10px] text-[var(--muted-foreground)]">
            — end of recent entries —
          </div>
        </div>
      </main>
    </div>
  );
}

function Entry({ entry, index, Icon }: { entry: AuditEntry; index: number; Icon: React.ComponentType<{ size?: number; className?: string }> }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="relative pb-6"
    >
      <div className="absolute -left-[26px] top-3 h-6 w-6 rounded-full bg-[var(--surface)] border border-[var(--border-strong)] grid place-items-center">
        <Icon size={11} className="text-[var(--accent)]" />
      </div>
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 hover:border-[var(--border-strong)] transition-colors">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[14px] font-medium">{entry.actor}</span>
              <span className="text-[13px] text-[var(--muted-foreground)]">{entry.action}</span>
            </div>
            <div className="mt-1 text-[13px] font-display">{entry.target}</div>
            {entry.diff && (
              <div className="mt-2 inline-block font-mono text-[11px] px-2 py-1 rounded bg-[var(--raised)] border border-[var(--border)] text-[var(--muted-foreground)]">
                {entry.diff}
              </div>
            )}
          </div>
          <div className="text-right shrink-0">
            <div className="flex items-center gap-1 font-mono text-[10px] text-[var(--muted-foreground)]">
              <Clock size={10} /> {timeAgo(entry.timestamp)}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
