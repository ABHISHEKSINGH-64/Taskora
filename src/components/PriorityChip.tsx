import type { Priority } from "@/lib/mock-data";

export function PriorityChip({ priority }: { priority: Priority }) {
  const color =
    priority === "high" ? "var(--priority-high)" : priority === "medium" ? "var(--priority-medium)" : "var(--priority-low)";
  return (
    <span className="inline-flex items-center gap-1.5 label-meta text-[10px] text-[var(--muted-foreground)]">
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
      {priority}
    </span>
  );
}
