# Taskora

> AI-powered, role-based employee task & accountability platform.
> Built for the hackathon — engineered to feel like a funded startup product.

Taskora is a command-center for modern teams. Managers see a live, AI-scored view of what their team is actually doing. Employees log work in seconds and get instant, AI-validated confidence scores instead of nagging status meetings. Every action is captured in a tamper-proof audit trail.

---

## Live preview

- **Preview:** https://workflow-verified-vision.lovable.app
- **Routes:** `/` (landing) · `/login` (role switch) · `/dashboard` (Kanban + AI) · `/audit` (timeline)

---

## Key features

| | |
|---|---|
| 🧠 **AI-scored work logs** | Submit a log, get a 0–100 confidence score, verdict, rationale, and risk flags in <2s. |
| 📋 **Drag-and-drop Kanban** | Four columns — Todo, In Progress, Done, Overdue — powered by `@dnd-kit`. |
| 💍 **Confidence Ring** | SVG ring on every task card visualizes the latest AI score with semantic colors. |
| 📡 **Streaming briefing** | Manager opens the drawer; AI streams a real-time team status summary. |
| 🛡️ **Tamper-proof audit trail** | Vertical timeline of every state change with actor + before/after diff. |
| 🌐 **Interactive 3D scenes** | Hero node-link network + dashboard icosahedron, both reactive to mouse. |
| 🎨 **Two themes** | "Bloomberg Dark" and "Editorial Light", switchable instantly. |
| 👤 **Role-based UI** | Manager and Employee views from the same components. |

---

## Architecture

```text
┌──────────────────────────────────────────────┐
│  Browser  (React 19 + TanStack Router)       │
│  ─────────────────────────────────────────   │
│  Routes  →  Components  →  Three.js scenes   │
│                │                              │
│                │ useServerFn()                │
│                ▼                              │
└──────────────────────────────────────────────┘
                 │  typed RPC (POST)
                 ▼
┌──────────────────────────────────────────────┐
│  TanStack Start server functions             │
│  (Cloudflare Workers / edge runtime)         │
│  ─────────────────────────────────────────   │
│  scoreWorkLog  →  ai-gateway.server.ts       │
└──────────────────────────────────────────────┘
                 │  OpenAI-compatible HTTPS
                 ▼
┌──────────────────────────────────────────────┐
│  Lovable AI Gateway                          │
│  model: google/gemini-3-flash-preview        │
└──────────────────────────────────────────────┘
```
screenshots 
<img width="1600" height="776" alt="WhatsApp Image 2026-05-30 at 2 25 06 PM" src="https://github.com/user-attachments/assets/b598e084-38a7-4d26-adab-04260c2947d2" />
<img width="1600" height="762" alt="WhatsApp Image 2026-05-30 at 2 24 55 PM" src="https://github.com/user-attachments/assets/49eedfd2-53c9-4baa-bb12-72b110c7b861" />
<img width="1600" height="780" alt="WhatsApp Image 2026-05-30 at 2 24 47 PM" src="https://github.com/user-attachments/assets/12706a40-2e53-43c1-8fd3-a8e5c1fc3c67" />




**Routing.** File-based via `src/routes/`. `routeTree.gen.ts` is auto-generated.

**Server.** No separate backend. Business logic lives in `createServerFn` files (`*.functions.ts`) and runs on the edge. Secrets stay server-side because `*.server.ts` modules are guarded from the client bundle.

**Data flow — `scoreWorkLog`:**
1. Employee submits a log in `WorkLogSheet`.
2. `useServerFn(scoreWorkLog)` POSTs `{ taskTitle, logText, evidenceUrl? }`.
3. Server fn validates with Zod, builds a prompt, calls Gemini via the AI Gateway, parses the JSON response.
4. On AI failure, a deterministic heuristic fallback returns a score so the UX never breaks.
5. The component receives `{ score, verdict, rationale, flags }`, updates `task.aiScore`, and the `ConfidenceRing` re-renders.

---

## Tech stack — what & why

| Layer | Tech | Why it's here |
|---|---|---|
| **Framework** | TanStack Start v1 + **React 19** | SSR-capable full-stack React with file-based routing and typed server functions. |
| **Build tool** | **Vite 7** | Instant HMR in dev, fast prod bundles. |
| **Server runtime** | Cloudflare Workers (edge) | Global low-latency execution of server fns. |
| **Routing** | `@tanstack/react-router` | Type-safe routes, loaders, layouts. |
| **Server RPC** | `@tanstack/react-start` (`createServerFn`) | Typed client → server calls without writing endpoints. |
| **AI gateway** | Lovable AI Gateway | Single endpoint, billing handled, no provider lock-in. |
| **AI SDK** | `ai` + `@ai-sdk/openai-compatible` | Provider-agnostic chat/structured-output calls (we use Google Gemini Flash). |
| **Validation** | **Zod** | Runtime validation for server-fn inputs and AI JSON output. |
| **Async state** | `@tanstack/react-query` | Caching/refetching where needed. |
| **Styling** | **Tailwind CSS v4** | Utility-first styling via native CSS `@import` and `@theme` tokens in `src/styles.css`. |
| **UI primitives** | shadcn/ui (Radix UI) | Accessible, unstyled primitives we theme with our tokens. |
| **Animation** | **Framer Motion** | Page transitions, card entrances, scroll reveals, overdue pulse. |
| **3D** | **Three.js** | Hero node-link network + dashboard icosahedron with mouse parallax. |
| **Drag & Drop** | `@dnd-kit/core` + `@dnd-kit/sortable` | Accessible Kanban DnD with keyboard support. |
| **Icons** | `lucide-react` | Consistent stroke iconography. |
| **Charts** | `recharts` | (Future) team analytics. |
| **Notifications** | `sonner` | Toasts for log submissions / score results. |
| **Forms** | `react-hook-form` + `@hookform/resolvers` | Performant forms with Zod validation. |
| **Date utils** | `date-fns` | Audit timestamps, due-date math. |
| **Local state** | `zustand` | Lightweight global state where Query is overkill. |
| **Typography** | Clash Display (display), DM Sans (UI), JetBrains Mono (data) | Distinct editorial voice — no Inter/Poppins. |

---

## File structure

```text
src/
├── routes/                      # File-based routes
│   ├── __root.tsx               # HTML shell + providers
│   ├── index.tsx                # Landing page with HeroScene
│   ├── login.tsx                # Role selector (manager / employee)
│   ├── dashboard.tsx            # Kanban board + DashboardScene
│   ├── audit.tsx                # Tamper-proof timeline
│   └── sitemap[.]xml.ts         # SEO sitemap
│
├── components/
│   ├── AppSidebar.tsx           # Command center sidebar w/ Team Pulse
│   ├── Navbar.tsx               # Top nav
│   ├── HeroScene.tsx            # Three.js node-link landing scene
│   ├── DashboardScene.tsx       # Three.js icosahedron + particles
│   ├── TaskColumn.tsx           # Kanban column (droppable)
│   ├── TaskCard.tsx             # Draggable card w/ ConfidenceRing
│   ├── ConfidenceRing.tsx       # SVG progress ring (0–100)
│   ├── PriorityChip.tsx         # Priority badge
│   ├── BriefingDrawer.tsx       # Streaming AI team briefing
│   ├── WorkLogSheet.tsx         # Submit + AI-score work logs
│   ├── StreamingText.tsx        # Token-by-token text reveal
│   ├── ThemeToggle.tsx          # Dark / light switch
│   └── ui/                      # shadcn primitives
│
└── lib/
    ├── score-log.functions.ts   # createServerFn: AI scoring
    ├── ai-gateway.server.ts     # Lovable AI Gateway provider
    ├── theme.tsx                # ThemeProvider (dark/light)
    ├── mock-data.ts             # Seed tasks + audit entries
    └── utils.ts                 # cn() etc.
```

---

## Core modules — deep dive

### `src/lib/score-log.functions.ts`
A `createServerFn({ method: 'POST' })` that:
- Validates input with Zod (`taskTitle`, `logText`, optional `evidenceUrl`).
- Builds a prompt asking the model to grade **specificity**, **evidence**, and **plausibility**.
- Calls Gemini Flash through the AI Gateway with `generateObject` and a Zod schema, guaranteeing the response shape.
- Falls back to a deterministic heuristic (length + keyword + evidence check) when the gateway is unreachable, so the UI never sees an error.
- Returns: `{ score: 0-100, verdict: 'verified' | 'review' | 'reject', rationale: string, flags: string[] }`.

### `src/lib/ai-gateway.server.ts`
Thin wrapper around `createOpenAICompatible` that injects the `Lovable-API-Key` header and points at `https://ai.gateway.lovable.dev/v1`.

### `src/components/ConfidenceRing.tsx`
Pure-SVG ring. Stroke length is `circumference * (1 - score/100)`; color is mapped to `--conf-high` / `--conf-mid` / `--conf-low` tokens so it respects the active theme.

### `src/components/DashboardScene.tsx`
Mounts a `WebGLRenderer`, builds a wireframe `IcosahedronGeometry` plus orbiting particle field, listens to `mousemove` to parallax the camera, and animates inside `requestAnimationFrame`. Cleans up on unmount.

### `src/components/WorkLogSheet.tsx`
Bottom-sheet form. Calls `useServerFn(scoreWorkLog)`, shows skeleton states while scoring, then a result panel with the ring, verdict, rationale, and flag chips. Calls `onScored(taskId, score)` to lift state into the Kanban.

### `src/components/HeroScene.tsx`
Animated node-link network that pulses to suggest live activity and reacts to cursor movement.

### `src/lib/theme.tsx`
React context provider that toggles `data-theme="dark|light"` on `<html>`; CSS tokens in `src/styles.css` flip automatically.

### `src/lib/mock-data.ts`
Seed dataset of realistic tasks (with priorities, owners, due dates, AI scores) and audit log entries (actor, before/after diff, timestamp).

---

## AI scoring pipeline

**Request**
```json
{
  "taskTitle": "Refactor billing service",
  "logText": "Extracted invoice generator into its own module, added 14 tests, all green.",
  "evidenceUrl": "https://github.com/acme/billing/pull/482"
}
```

**Response**
```json
{
  "score": 87,
  "verdict": "verified",
  "rationale": "Specific deliverable, measurable scope (14 tests), and concrete PR evidence.",
  "flags": []
}
```

**Verdict mapping**
- `verified` — score ≥ 75
- `review` — 40 ≤ score < 75
- `reject` — score < 40

---

## Design system

Defined in `src/styles.css` using OKLCH and CSS variables:

```css
--conf-high: oklch(0.78 0.18 145);   /* green  ≥ 75 */
--conf-mid:  oklch(0.82 0.16  85);   /* amber  40–74 */
--conf-low:  oklch(0.65 0.22  25);   /* red    < 40 */

--status-todo:        var(--muted);
--status-in-progress: var(--primary);
--status-done:        var(--conf-high);
--status-overdue:     var(--conf-low);
```

**Principles**
- Generous border radius (`--radius: 1rem`) on every surface.
- Motion is deliberate: Framer Motion `spring` for cards, `ease-out` for reveals.
- Typography pairs Clash Display (headings) with DM Sans (body) and JetBrains Mono (numbers/IDs).

---

## Routes

| Path | File | Purpose |
|---|---|---|
| `/` | `routes/index.tsx` | Landing — hero, value props, CTA. |
| `/login` | `routes/login.tsx` | Pick role (manager / employee). |
| `/dashboard` | `routes/dashboard.tsx` | Kanban, briefing, work log sheet. |
| `/audit` | `routes/audit.tsx` | Tamper-proof timeline. |
| `/sitemap.xml` | `routes/sitemap[.]xml.ts` | SEO sitemap. |

---

## Getting started

```bash
# 1. Install
bun install

# 2. Set env (server-side)
echo "LOVABLE_API_KEY=sk-..." >> .env

# 3. Dev
bun dev          # http://localhost:5173

# 4. Production build
bun run build
bun run preview
```

### Environment variables

| Variable | Scope | Purpose |
|---|---|---|
| `LOVABLE_API_KEY` | server (`process.env`) | Auth for Lovable AI Gateway. Never bundled. |
| `VITE_*` | client | Public values exposed to the browser. None required for the demo. |

---

## Scripts

| Command | What it does |
|---|---|
| `bun dev` | Start Vite dev server with HMR. |
| `bun run build` | Production build. |
| `bun run build:dev` | Dev-mode build (prerender-safe checks). |
| `bun run preview` | Preview the built app. |
| `bun run lint` | ESLint. |
| `bun run format` | Prettier. |

---

## Deployment

Click **Publish** in Lovable. The app deploys to Cloudflare Workers — server functions run at the edge globally.

Stable URLs:
- Production: `project--<id>.lovable.app`
- Preview: `project--<id>-dev.lovable.app`

---

## Roadmap

- Persist tasks, logs, and audit entries in Lovable Cloud (Supabase).
- Real auth (email + Google OAuth).
- Slack / email notifications on overdue + low-confidence logs.
- Manager analytics: throughput, score drift, risk heatmap.
- Mobile-first employee logger as a PWA.

---

## Credits

Built with ❤️ on [Lovable](https://lovable.dev). UI primitives by [shadcn/ui](https://ui.shadcn.com) + [Radix](https://radix-ui.com). 3D by [Three.js](https://threejs.org). Motion by [Framer Motion](https://www.framer.com/motion/).
