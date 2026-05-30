import { AnimatePresence, motion } from "framer-motion";
import { X, Send, Loader2, Check } from "lucide-react";
import { useState } from "react";
import type { Task } from "@/lib/mock-data";

export function WorkLogSheet({ task, onClose }: { task: Task | null; onClose: () => void }) {
  const [val, setVal] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");

  const submit = () => {
    setState("loading");
    setTimeout(() => {
      setState("done");
      setTimeout(() => {
        onClose();
        setVal("");
        setState("idle");
      }, 1100);
    }, 1400);
  };

  return (
    <AnimatePresence>
      {task && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed left-0 right-0 bottom-0 z-50 bg-[var(--surface)] border-t border-[var(--border-strong)] rounded-t-3xl shadow-2xl"
          >
            <div className="mx-auto max-w-2xl p-6 sm:p-8">
              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[var(--border-strong)]" />
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="label-micro mb-1.5">Log work for</div>
                  <h3 className="font-display text-[20px] font-semibold leading-snug">{task.title}</h3>
                </div>
                <button onClick={onClose} className="h-9 w-9 rounded-xl hover:bg-[var(--raised)] grid place-items-center text-[var(--muted-foreground)]">
                  <X size={18} />
                </button>
              </div>

              <textarea
                value={val}
                onChange={(e) => setVal(e.target.value)}
                placeholder="What specifically did you do today? Cite tools, files, outcomes — the AI verifier prefers detail."
                rows={6}
                className="w-full resize-none rounded-xl bg-[var(--raised)] border border-[var(--border)] focus:border-[var(--accent)] outline-none p-4 text-[14px] leading-relaxed placeholder:text-[var(--muted-foreground)]"
              />
              <div className="flex items-center justify-between mt-2">
                <span className="font-mono text-[11px] text-[var(--muted-foreground)] tabular-nums">{val.length} chars</span>
                <span className="label-meta text-[10px] text-[var(--muted-foreground)]">verified by claude haiku</span>
              </div>

              <button
                disabled={!val || state !== "idle"}
                onClick={submit}
                className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--accent)] text-[var(--accent-foreground)] py-3.5 text-[14px] font-medium disabled:opacity-40 transition-opacity"
              >
                {state === "idle" && (<><Send size={15} /> Submit log</>)}
                {state === "loading" && (<><Loader2 size={15} className="animate-spin" /> AI is reviewing…</>)}
                {state === "done" && (<><Check size={16} /> Submitted</>)}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
