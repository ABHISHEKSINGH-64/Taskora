import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { AnimatePresence, motion } from "framer-motion";
import type { Status, Task } from "@/lib/mock-data";
import { TaskCard } from "./TaskCard";

const COLORS: Record<Status, string> = {
  todo: "var(--status-todo)",
  in_progress: "var(--status-in-progress)",
  done: "var(--status-done)",
  overdue: "var(--status-overdue)",
};
const LABELS: Record<Status, string> = {
  todo: "To Do",
  in_progress: "In Progress",
  done: "Done",
  overdue: "Overdue",
};

export function TaskColumn({ status, tasks, onCardClick }: { status: Status; tasks: Task[]; onCardClick?: (t: Task) => void }) {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  return (
    <div
      ref={setNodeRef}
      className={`flex-1 min-w-[280px] rounded-2xl border bg-[var(--surface)] p-4 transition-colors ${
        isOver ? "border-[var(--accent)]" : "border-[var(--border)]"
      }`}
    >
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--border)]" style={{ borderLeftWidth: 0 }}>
        <div className="flex items-center gap-2.5">
          <span className="h-2 w-2 rounded-full" style={{ background: COLORS[status] }} />
          <h3 className="font-display text-[14px] font-semibold tracking-tight">{LABELS[status]}</h3>
        </div>
        <span className="font-mono text-[11px] text-[var(--muted-foreground)] tabular-nums">{tasks.length}</span>
      </div>
      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-3 min-h-[120px]">
          <AnimatePresence>
            {tasks.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-xl border border-dashed border-[var(--border)] py-10 text-center label-meta text-[11px] text-[var(--muted-foreground)]"
              >
                No tasks
              </motion.div>
            ) : (
              tasks.map((t) => <TaskCard key={t.id} task={t} onClick={() => onCardClick?.(t)} />)
            )}
          </AnimatePresence>
        </div>
      </SortableContext>
    </div>
  );
}
