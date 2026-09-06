@AGENTS.md

# Template Next Claude — working notes

Opinionated Next.js 16 starter. Fluid, optimistic UI is the point; keep it that way.

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
- Match the style of the file you're in. `src/components/ui/**` is excluded from lint — don't reformat it.

## Verify before done

```
pnpm lint && pnpm typecheck && pnpm test && pnpm build
```

Next 16 differs from older training data — check `node_modules/next/dist/docs/` before using an unfamiliar API.
