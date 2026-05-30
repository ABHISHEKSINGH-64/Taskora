import { Link, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { LayoutGrid, FileText, Home, AlertCircle } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

const items = [
  { label: "Board", to: "/dashboard", icon: LayoutGrid },
  { label: "Audit Log", to: "/audit", icon: FileText },
  { label: "Landing", to: "/", icon: Home },
] as const;

export function AppSidebar({ overdueCount = 0, activeMembers = 7 }: { overdueCount?: number; activeMembers?: number }) {
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  return (
    <motion.aside
      initial={{ x: -40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="fixed left-0 top-0 bottom-0 w-[240px] z-40 bg-[var(--surface)] border-r border-[var(--border)] flex flex-col"
    >
      <div className="px-6 py-5 flex items-center gap-2.5">
        <svg width="22" height="22" viewBox="0 0 24 24" className="text-[var(--accent)]">
          <motion.path
            d="M3 4 L7 20 L12 8 L17 20 L21 4"
            stroke="currentColor"
            strokeWidth="2.2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          />
        </svg>
        <span className="font-display text-[17px] font-semibold tracking-tight">workflow</span>
      </div>

      <div className="mx-4 my-2 px-4 py-4 rounded-xl bg-[var(--raised)] border border-[var(--border)]">
        <div className="label-micro mb-1">Team pulse</div>
        <div className="flex items-baseline gap-2">
          <span className="font-display text-[28px] font-semibold tabular-nums">{activeMembers}</span>
          <span className="label-meta text-[10px] text-[var(--muted-foreground)]">active</span>
        </div>
        <div className="mt-2 flex items-center gap-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--conf-high)] opacity-75 animate-ping" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[var(--conf-high)]" />
          </span>
          <span className="label-meta text-[10px] text-[var(--muted-foreground)]">live</span>
        </div>
      </div>

      <nav className="px-3 py-4 flex flex-col gap-0.5">
        {items.map((item) => {
          const active = pathname === item.to;
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] transition-colors ${
                active
                  ? "bg-[var(--raised)] text-[var(--foreground)]"
                  : "text-[var(--muted-foreground)] hover:bg-[var(--raised)] hover:text-[var(--foreground)]"
              }`}
            >
              <Icon size={16} strokeWidth={1.5} />
              {item.label}
              {active && (
                <motion.span layoutId="nav-active" className="ml-auto h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
              )}
            </Link>
          );
        })}
      </nav>

      {overdueCount > 0 && (
        <div className="mx-4 my-2 px-4 py-3 rounded-xl border border-[var(--conf-low)]/40 bg-[color-mix(in_oklab,var(--conf-low)_8%,transparent)]">
          <div className="flex items-center gap-2 text-[var(--conf-low)]">
            <AlertCircle size={14} />
            <span className="label-meta text-[11px]">{overdueCount} overdue</span>
          </div>
        </div>
      )}

      <div className="mt-auto p-4 border-t border-[var(--border)] flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-[var(--accent)] grid place-items-center text-[12px] font-mono font-medium text-[var(--accent-foreground)]">
          MN
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-medium truncate">Maya Nair</div>
          <div className="label-meta text-[10px] text-[var(--muted-foreground)]">manager</div>
        </div>
        <ThemeToggle />
      </div>
    </motion.aside>
  );
}
