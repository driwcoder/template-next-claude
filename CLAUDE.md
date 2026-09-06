@AGENTS.md

# Template Next Claude — working notes

Opinionated Next.js 16 starter. Fluid, optimistic UI is the point; keep it that way.

## Idioma, data/hora e encoding

- **Responder sempre em português do Brasil (pt-BR)**: explicações, resumos, mensagens de commit e descrições de PR. Código e identificadores ficam em inglês.
- **Datas/horas**: exibir `dd/MM/aaaa` + `HH:mm` (24h), fuso `America/Sao_Paulo`. Em código, formatar com `Intl.DateTimeFormat("pt-BR", { timeZone: "America/Sao_Paulo" })` e persistir em UTC (`timestamptz`); nunca comparar datas como string.
- **Encoding**: arquivos e respostas em UTF-8 sem BOM; no PowerShell gravar com `-Encoding utf8` (nunca `echo "" >> arquivo` — o PS 5.1 grava UTF-16 e injeta bytes nulos). Não usar aspas/travessões tipográficos em código, JSON, `.env`, shell ou nomes de arquivo. Nomes de arquivo, branch, chaves de env e identificadores: só ASCII, sem espaços nem acentos.

## Stack

- **Next.js 16** App Router, RSC, Server Actions, Turbopack (default), React Compiler (`reactCompiler: true`).
- **React 19.2** — reach for `useOptimistic` / `useActionState` / `<ViewTransition>` before client state libraries.
- **Tailwind v4 + shadcn/ui** (`radix-nova` style). Components live in `src/components/ui` — owned code, edit freely. `cn()` from `@/lib/utils`.
- **TanStack Query** for client-fetched server state only. Server-rendered data stays in RSC.
- **Drizzle + Postgres** (`src/lib/db`). No `DATABASE_URL` → `db` is `null` and features fall back to in-memory stores so the repo runs on a clean clone.
- **better-auth** (`src/lib/auth.ts`), route at `src/app/api/auth/[...all]`, client in `src/lib/auth-client.ts`.
- **Biome** lint+format. **Vitest** unit, **Playwright** e2e. **lefthook** runs Biome + `tsc` pre-commit, Vitest pre-push.

## Conventions

- Features are vertical slices under `src/features/<name>/`: `repo.ts` (data, `import "server-only"`), `actions.ts` (`"use server"`, validate every input with Zod), `components/`.
- Read env only through `@/env` (`src/env.ts`), never `process.env` directly.
- Optimistic mutation pattern: server component reads → client island holds `useOptimistic` list/reducer → Server Action inside `startTransition` → `revalidatePath` reconciles. See `src/features/todos`.
- Server Actions are public POST endpoints. Validate args; add an auth check when data isn't public (snippet in `src/features/todos/actions.ts`).
- Auth: `getSession()` from `src/features/auth/session.ts` in RSC / route handlers; `useSession()` / `authClient` (no `baseURL` — same-origin) on the client. Protect a route by `redirect("/login")` when `getSession()` is null (see `src/app/dashboard/page.tsx`).
- Match the style of the file you're in. `src/components/ui/**` is excluded from lint — don't reformat it.

## Next.js

- Server Components by default. Add `"use client"` only for real interactivity (state, effects, event handlers, browser APIs) and keep client islands at the leaves.
- Mutations go through Server Actions (`"use server"`). Route handlers only for webhooks, OAuth callbacks, or non-browser callers.
- `params`, `searchParams`, `cookies()`, `headers()` are async in Next 16 — always `await`.
- Slow reads: fetch in the Server Component / `repo.ts` and wrap in `<Suspense>` with a skeleton so the shell paints immediately.
- After a mutation: `revalidatePath` / `revalidateTag` for cached reads, `refresh()` for dynamic ones. Don't add client-side refetching for this.
- `<Link>` for navigation (typed routes are on). `next/image` and `next/font` only — no raw `<img>`, no CSS `@import` for fonts.

## shadcn/ui first

- **Before building any UI element or component, check whether shadcn/ui already ships it** — https://ui.shadcn.com/docs/components — and add it with `pnpm dlx shadcn@latest add <name>`.
- Hand-roll a component only when shadcn has no close match; even then, compose it from shadcn primitives (Button, Input, Dialog, Popover, …) and the existing token system.
- Installed components land in `src/components/ui/` as owned source — edit freely; they're lint-excluded.
- **Theming**: everything is driven by the CSS variables in `src/app/globals.css` (`--primary`, `--radius`, `--card`, …). To reskin, build a preset in the theme generator at https://ui.shadcn.com/create and paste its tokens into `globals.css` — never hardcode colors/radii in components.
- Icons: `lucide-react`. Toasts: `sonner` (wired in `src/components/providers.tsx`).

## Verify before done

```
pnpm lint && pnpm typecheck && pnpm test && pnpm build
```

Next 16 differs from older training data — check `node_modules/next/dist/docs/` before using an unfamiliar API.

---

# CLAUDE.md

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.
