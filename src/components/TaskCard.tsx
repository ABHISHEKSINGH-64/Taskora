import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import { Calendar, MessageSquare } from "lucide-react";
import type { Task } from "@/lib/mock-data";
import { ConfidenceRing } from "./ConfidenceRing";
import { PriorityChip } from "./PriorityChip";

function fmtDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
function isSoon(iso: string) {
  return new Date(iso).getTime() - Date.now() < 24 * 3600 * 1000;
}

export function TaskCard({ task, onClick }: { task: Task; onClick?: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const priorityColor =
    task.priority === "high" ? "var(--priority-high)" : task.priority === "medium" ? "var(--priority-medium)" : "var(--priority-low)";

  const overdue = task.status === "overdue";
  const soon = isSoon(task.dueDate);

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      layout
      whileHover={{ y: -2 }}
      onClick={onClick}
      className={`group relative rounded-xl border bg-[var(--raised)] p-4 cursor-grab active:cursor-grabbing transition-colors hover:border-[var(--border-strong)] ${
        overdue ? "pulse-overdue border-[var(--conf-low)]/40" : "border-[var(--border)]"
      }`}
    >
      <div className="absolute left-0 top-3 bottom-3 w-[3px] rounded-r" style={{ backgroundColor: priorityColor }} />
      <div className="flex items-start justify-between gap-3 mb-3 pl-2">
        <h4 className="font-display text-[15px] font-medium leading-snug">{task.title}</h4>
        {task.aiScore !== undefined && <ConfidenceRing score={task.aiScore} />}
      </div>
      <p className="pl-2 text-[12.5px] text-[var(--muted-foreground)] line-clamp-2 mb-4">{task.description}</p>
      <div className="pl-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="h-6 w-6 rounded-full grid place-items-center text-[10px] font-mono font-medium"
            style={{ background: "var(--overlay)", color: "var(--foreground)" }}
          >
            {task.assigneeInitials}
          </div>
          <PriorityChip priority={task.priority} />
        </div>
        <div className="flex items-center gap-3 text-[var(--muted-foreground)]">
          <span className="inline-flex items-center gap-1 font-mono text-[10px]">
            <MessageSquare size={11} /> {task.logsCount}
          </span>
          <span
            className="inline-flex items-center gap-1 font-mono text-[10px]"
            style={{ color: overdue || soon ? "var(--conf-low)" : undefined }}
          >
            <Calendar size={11} /> {fmtDate(task.dueDate)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
