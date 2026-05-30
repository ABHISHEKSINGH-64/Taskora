import { AnimatePresence, motion } from "framer-motion";
import { X, Sparkles, RefreshCw } from "lucide-react";
import { StreamingText } from "./StreamingText";

const SAMPLE = `Kabir Nair's Inventory reconciliation has been overdue for 2 days — his single log entry was flagged for vagueness (score 18/100), which is a pattern worth investigating before week's end. Ananya Iyer's Onboarding deck v2 received a 32/100 log this morning; the AI flagged "vague" — recommend a 10-minute check-in today. Priya Sharma is significantly outperforming: her Q3 Sales Report log scored 84/100 and NPS analysis closed at 91/100 yesterday. Devansh Rao's billing webhook refactor is on track (76/100) and not at risk. My recommendation: pull Kabir into a working session this afternoon and reassign one of Ananya's lower-priority items to free her capacity.`;

export function BriefingDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[480px] z-50 bg-[var(--surface)] border-l border-[var(--border)] flex flex-col"
          >
            <div className="flex items-center justify-between p-5 border-b border-[var(--border)]">
              <div className="flex items-center gap-2.5">
                <div className="h-7 w-7 rounded-lg bg-[var(--accent)]/15 grid place-items-center">
                  <Sparkles size={14} className="text-[var(--accent)]" />
                </div>
                <div>
                  <h3 className="font-display text-[15px] font-semibold">Team Briefing</h3>
                  <div className="label-meta text-[10px] text-[var(--muted-foreground)]">claude haiku · just now</div>
                </div>
              </div>
              <button onClick={onClose} className="h-8 w-8 rounded-lg hover:bg-[var(--raised)] grid place-items-center text-[var(--muted-foreground)]">
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <StreamingText text={SAMPLE} />
            </div>

            <div className="p-5 border-t border-[var(--border)] flex items-center justify-between">
              <span className="label-meta text-[10px] text-[var(--muted-foreground)]">8 tasks · 5 employees · 1 overdue</span>
              <button className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--border-strong)] text-[12px] hover:bg-[var(--raised)]">
                <RefreshCw size={12} /> Regenerate
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
