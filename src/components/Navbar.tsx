import { Link } from "@tanstack/react-router";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl bg-[color-mix(in_oklab,var(--background)_70%,transparent)] border-b border-[var(--border)]">
      <div className="mx-auto max-w-[1400px] flex h-16 items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2.5 group">
          <svg width="22" height="22" viewBox="0 0 24 24" className="text-[var(--accent)]">
            <path d="M3 4 L7 20 L12 8 L17 20 L21 4" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="font-display text-[18px] font-semibold tracking-tight">workflow</span>
          <span className="label-micro ml-1 text-[10px]">v1.0</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 label-meta text-[12px] text-[var(--muted-foreground)]">
          <a href="#problem" className="hover:text-[var(--foreground)] transition-colors">Problem</a>
          <a href="#features" className="hover:text-[var(--foreground)] transition-colors">Features</a>
          <Link to="/dashboard" className="hover:text-[var(--foreground)] transition-colors">Dashboard</Link>
          <Link to="/audit" className="hover:text-[var(--foreground)] transition-colors">Audit</Link>
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            to="/dashboard"
            className="hidden sm:inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2 text-[13px] font-medium text-[var(--accent-foreground)] hover:opacity-90 transition-opacity"
          >
            Launch app
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
