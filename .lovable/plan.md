## Goal
Create a single `README.md` at the project root that fully documents WorkFlow — overview, features, architecture, tech stack (with rationale per dependency), file structure, setup, env vars, and AI scoring flow.

## Sections to include

1. **Hero / Tagline** — WorkFlow: AI-powered, role-based employee task & accountability platform.
2. **Demo** — preview URL, screenshots placeholder, hackathon context.
3. **Key Features**
   - Role-based dashboard (manager / employee)
   - Drag-and-drop Kanban board (todo / in-progress / done / overdue)
   - AI-scored work logs with confidence ring (0–100)
   - Streaming AI team briefing
   - Tamper-proof audit trail
   - Interactive 3D background (Three.js)
   - Dark / light theme toggle ("Bloomberg Dark" / "Editorial Light")
4. **Architecture**
   - ASCII diagram: Browser (React + R3F) ⇄ TanStack Start server fns ⇄ Lovable AI Gateway (Gemini)
   - Routing model (file-based, `src/routes/`)
   - Server functions vs server routes
   - Data flow for `scoreWorkLog`
5. **Tech Stack — what & why**
   | Layer | Tech | Used for |
   |---|---|---|
   | Framework | TanStack Start v1 + React 19 | SSR, file-based routing, server fns |
   | Build | Vite 7 | Dev server, bundling |
   | Runtime | Cloudflare Workers (edge) | Server fn execution |
   | Styling | Tailwind v4 + CSS tokens in `src/styles.css` | Design system, theming |
   | UI primitives | shadcn/ui (Radix) | Accessible components |
   | Animation | Framer Motion | Page/card/scroll animations |
   | 3D | Three.js | Hero scene + dashboard background icosahedron |
   | DnD | @dnd-kit | Kanban drag-and-drop |
   | Icons | lucide-react | Iconography |
   | Typography | Clash Display, DM Sans, JetBrains Mono | Display / body / mono |
   | AI | Lovable AI Gateway + `ai` SDK + `@ai-sdk/openai-compatible` + Zod | Work log scoring (Gemini Flash) |
   | Validation | Zod | Server fn input + AI output schema |
   | State/data | TanStack Query | (where used) async state |
6. **File Structure** — annotated tree of `src/` (routes, components, lib).
7. **Core Modules — deep dive**
   - `src/lib/score-log.functions.ts` — server fn, prompt, schema, fallback heuristic
   - `src/lib/ai-gateway.server.ts` — provider factory
   - `src/components/ConfidenceRing.tsx` — SVG ring math
   - `src/components/DashboardScene.tsx` — Three.js scene lifecycle
   - `src/components/WorkLogSheet.tsx` — submit → score → update task
   - `src/components/HeroScene.tsx` — landing node-link network
   - `src/lib/theme.tsx` — theme provider
   - `src/lib/mock-data.ts` — seed tasks + audit
8. **AI Scoring Pipeline** — step-by-step with input/output JSON example.
9. **Design System** — color tokens (`--conf-high/mid/low`, `--status-*`), radii, motion principles.
10. **Routes** — `/`, `/login`, `/dashboard`, `/audit`, `/sitemap.xml`.
11. **Getting Started** — `bun install`, `bun dev`, env setup (`LOVABLE_API_KEY`).
12. **Environment Variables** — table of server vs client (`VITE_*`).
13. **Scripts** — from `package.json`.
14. **Deployment** — Lovable publish + Cloudflare Workers note.
15. **Roadmap** — Supabase persistence, real auth, notifications, mobile.
16. **Credits / License**.

## Deliverable
One file: `README.md` (root). No code changes elsewhere.