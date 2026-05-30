import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in · Taskora" }] }),
  component: LoginPage,
});

function LoginPage() {
  const [role, setRole] = useState<"manager" | "employee">("manager");
  return (
    <div className="min-h-screen bg-[var(--background)] grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between p-10 bg-[var(--surface)] border-r border-[var(--border)]">
        <Link to="/" className="flex items-center gap-2.5">
          <svg width="22" height="22" viewBox="0 0 24 24" className="text-[var(--accent)]">
            <path d="M3 4 L7 20 L12 8 L17 20 L21 4" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="font-display text-[18px] font-semibold">taskora</span>
        </Link>
        <div>
          <div className="label-micro mb-4">demo credentials</div>
          <div className="space-y-3 font-mono text-[13px] text-[var(--muted-foreground)]">
            <div><span className="text-[var(--foreground)]">manager@demo.com</span> / demo1234</div>
            <div><span className="text-[var(--foreground)]">employee@demo.com</span> / demo1234</div>
          </div>
          <p className="mt-8 font-display text-[28px] leading-tight max-w-sm text-[var(--foreground)]">
            "We stopped having status meetings the week we deployed this."
          </p>
          <p className="mt-3 label-meta text-[11px] text-[var(--muted-foreground)]">— pilot customer, Mumbai</p>
        </div>
      </div>

      <div className="relative flex items-center justify-center p-8">
        <div className="absolute top-6 right-6"><ThemeToggle /></div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
          <div className="label-micro mb-3">welcome back</div>
          <h1 className="font-display text-[36px] font-semibold tracking-tight leading-tight mb-2">Sign in</h1>
          <p className="text-[13px] text-[var(--muted-foreground)] mb-8">Pick your role to enter the demo.</p>

          <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-[var(--surface)] border border-[var(--border)] mb-6">
            {(["manager", "employee"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`relative py-2 text-[13px] rounded-lg capitalize transition-colors ${role === r ? "text-[var(--accent-foreground)]" : "text-[var(--muted-foreground)]"}`}
              >
                {role === r && <motion.span layoutId="role-pill" className="absolute inset-0 bg-[var(--accent)] rounded-lg -z-10" />}
                {r}
              </button>
            ))}
          </div>

          <form className="space-y-3">
            <input defaultValue={`${role}@demo.com`} className="w-full px-4 py-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] focus:border-[var(--accent)] outline-none text-[14px]" />
            <input type="password" defaultValue="demo1234" className="w-full px-4 py-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] focus:border-[var(--accent)] outline-none text-[14px]" />
            <Link to="/dashboard" className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--accent)] text-[var(--accent-foreground)] py-3 text-[14px] font-medium hover:opacity-90 transition-opacity">
              Enter dashboard <ArrowRight size={15} />
            </Link>
          </form>

          <div className="mt-8 label-meta text-[10px] text-[var(--muted-foreground)] text-center">
            no account needed · demo mode
          </div>
        </motion.div>
      </div>
    </div>
  );
}
