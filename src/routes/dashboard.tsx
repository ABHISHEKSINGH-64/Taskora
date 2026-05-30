import { createFileRoute } from "@tanstack/react-router";
import { DndContext, type DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Search, Plus } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { TaskColumn } from "@/components/TaskColumn";
import { BriefingDrawer } from "@/components/BriefingDrawer";
import { WorkLogSheet } from "@/components/WorkLogSheet";
import { DashboardScene } from "@/components/DashboardScene";
import { mockTasks, type Status, type Task } from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard · WorkFlow" },
      { name: "description", content: "Real-time kanban board with AI-verified work logs." },
    ],
  }),
  component: Dashboard,
});

const STATUSES: Status[] = ["todo", "in_progress", "done", "overdue"];

function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [briefingOpen, setBriefingOpen] = useState(false);
  const [logTask, setLogTask] = useState<Task | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const grouped = useMemo(() => {
    const g: Record<Status, Task[]> = { todo: [], in_progress: [], done: [], overdue: [] };
    tasks.forEach((t) => g[t.status].push(t));
    return g;
  }, [tasks]);

  const overdueCount = grouped.overdue.length;

  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over) return;
    const newStatus = over.id as Status;
    if (!STATUSES.includes(newStatus)) return;
    setTasks((prev) => prev.map((t) => (t.id === active.id ? { ...t, status: newStatus } : t)));
  };

  return (
    <div className="min-h-screen bg-[var(--background)] relative">
      <DashboardScene />
      <AppSidebar overdueCount={overdueCount} />

      <main className="ml-[240px] min-h-screen flex flex-col">
        {/* Top bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="sticky top-0 z-20 backdrop-blur-xl bg-[color-mix(in_oklab,var(--background)_80%,transparent)] border-b border-[var(--border)] px-8 py-4 flex items-center justify-between"
        >
          <div>
            <h1 className="font-display text-[22px] font-semibold tracking-tight">Board</h1>
            <div className="label-meta text-[11px] text-[var(--muted-foreground)] mt-0.5">
              {tasks.length} tasks · {overdueCount} overdue · synced just now
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-[13px] text-[var(--muted-foreground)] w-[260px]">
              <Search size={14} />
              <input placeholder="Search tasks…" className="bg-transparent outline-none flex-1 text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]" />
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded border border-[var(--border)]">⌘K</span>
            </div>
            <button className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--border-strong)] text-[13px] hover:bg-[var(--surface)] transition-colors">
              <Plus size={14} /> New
            </button>
            <button
              onClick={() => setBriefingOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--accent)] text-[var(--accent-foreground)] text-[13px] font-medium hover:opacity-90 transition-opacity"
            >
              <Sparkles size={14} /> Brief me
            </button>
          </div>
        </motion.div>

        {/* Board */}
        <div className="flex-1 p-8 overflow-x-auto">
          <DndContext sensors={sensors} onDragEnd={onDragEnd}>
            <motion.div
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } } }}
              className="flex gap-5 min-w-max"
            >
              {STATUSES.map((s) => (
                <motion.div
                  key={s}
                  variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                  className="w-[320px]"
                >
                  <TaskColumn status={s} tasks={grouped[s]} onCardClick={(t) => setLogTask(t)} />
                </motion.div>
              ))}
            </motion.div>
          </DndContext>
        </div>
      </main>

      <BriefingDrawer open={briefingOpen} onClose={() => setBriefingOpen(false)} />
      <WorkLogSheet
        task={logTask}
        onClose={() => setLogTask(null)}
        onScored={(id, score) =>
          setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, aiScore: score, logsCount: t.logsCount + 1 } : t)))
        }
      />
    </div>
  );
}
