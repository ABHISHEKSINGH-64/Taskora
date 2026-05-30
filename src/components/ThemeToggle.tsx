import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/theme";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";
  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className={`relative inline-flex h-9 w-16 items-center rounded-full border border-[var(--border-strong)] bg-[var(--surface)] transition-colors hover:bg-[var(--raised)] ${className}`}
    >
      <span
        className="absolute top-1 left-1 flex h-7 w-7 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--accent-foreground)] shadow-sm transition-transform duration-300"
        style={{ transform: isDark ? "translateX(0)" : "translateX(28px)" }}
      >
        {isDark ? <Moon size={14} /> : <Sun size={14} />}
      </span>
    </button>
  );
}
