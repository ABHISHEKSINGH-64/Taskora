import { AnimatePresence, motion } from "framer-motion";
import { X, Send, Loader2, Check, Sparkles, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import type { Task } from "@/lib/mock-data";
import { scoreWorkLog } from "@/lib/score-log.functions";
import { ConfidenceRing } from "./ConfidenceRing";

type Result = {
  score: number;
  verdict: string;
  rationale: string;
  flags: string[];
};

export function WorkLogSheet({
  task,
  onClose,
  onScored,
}: {
  task: Task | null;
  onClose: () => void;
  onScored?: (taskId: string, score: number) => void;
}) {
  const [val, setVal] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [result, setResult] = useState<Result | null>(null);
  const score = useServerFn(scoreWorkLog);

  const close = () => {
    onClose();
    setTimeout(() => {
      setVal("");
      setState("idle");
      setResult(null);
    }, 350);
  };

  const submit = async () => {
    if (!task) return;
    setState("loading");
    setResult(null);
    try {
      const r = (await score({
        data: {
          taskTitle: task.title,
          taskDescription: task.description,
          logText: val,
        },
      })) as Result;
      setResult(r);
      setState("done");
      onScored?.(task.id, r.score);
    } catch (e) {
      console.error(e);
      setState("error");
    }
  };

  return (
    <AnimatePresence>
      {task && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
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
                <button onClick={close} className="h-9 w-9 rounded-xl hover:bg-[var(--raised)] grid place-items-center text-[var(--muted-foreground)]">
                  <X size={18} />
                </button>
              </div>

              <textarea
                value={val}
                onChange={(e) => setVal(e.target.value)}
                disabled={state === "loading"}
                placeholder="What specifically did you do today? Cite tools, files, outcomes — the AI verifier prefers detail."
                rows={6}
                className="w-full resize-none rounded-xl bg-[var(--raised)] border border-[var(--border)] focus:border-[var(--accent)] outline-none p-4 text-[14px] leading-relaxed placeholder:text-[var(--muted-foreground)] disabled:opacity-60"
              />
              <div className="flex items-center justify-between mt-2">
                <span className="font-mono text-[11px] text-[var(--muted-foreground)] tabular-nums">{val.length} chars</span>
                <span className="label-meta text-[10px] text-[var(--muted-foreground)] inline-flex items-center gap-1">
                  <Sparkles size={10} /> verified by Lovable AI
                </span>
              </div>

              <AnimatePresence mode="wait">
                {state === "done" && result && (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 12, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="mt-5 overflow-hidden"
                  >
                    <div className="rounded-2xl border border-[var(--border)] bg-[var(--raised)] p-4 flex items-start gap-4">
                      <ConfidenceRing score={result.score} size={52} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-display text-[14px] font-semibold capitalize">{result.verdict}</span>
                          {result.flags.map((f) => (
                            <span key={f} className="font-mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded border border-[var(--border)] text-[var(--muted-foreground)]">{f}</span>
                          ))}
                        </div>
                        <p className="text-[12.5px] text-[var(--muted-foreground)] leading-relaxed">{result.rationale}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
                {state === "error" && (
                  <motion.div
                    key="err"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-4 flex items-center gap-2 text-[12.5px] text-[var(--conf-low)]"
                  >
                    <AlertTriangle size={14} /> Scoring failed. Try again.
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                disabled={!val || state === "loading"}
                onClick={state === "done" ? close : submit}
                className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--accent)] text-[var(--accent-foreground)] py-3.5 text-[14px] font-medium disabled:opacity-40 transition-opacity"
              >
                {state === "idle" && (<><Send size={15} /> Submit log</>)}
                {state === "loading" && (<><Loader2 size={15} className="animate-spin" /> AI is reviewing…</>)}
                {state === "done" && (<><Check size={16} /> Done — close</>)}
                {state === "error" && (<><Send size={15} /> Retry</>)}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
