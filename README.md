# Template Next Claude

Opinionated Next.js starter tuned for **fluid, optimistic UI** — pre-wired, pre-configured, and passing every check on first clone.

## Stack

| Layer | Choice | Why |
| --- | --- | --- |
| Framework | **Next.js 16** — App Router, RSC, Server Actions, Turbopack, React Compiler | Optimistic UI primitives built in, minimal client JS |
| UI | **React 19.2**, **Tailwind v4**, **shadcn/ui** (`radix-nova`) | `useOptimistic` / `useActionState`, accessible primitives, consistent tokens + dark mode |
| Motion | **Motion** (`motion/react`) + React `<ViewTransition>` | Layout animations, no bespoke lifecycle code |
| Server state | **TanStack Query** (+ devtools) | Client-fetch cache; RSC handles the rest |
| Data | **Drizzle ORM** + **Postgres** (`postgres` driver) | Typed schema + migrations; **in-memory fallback** with no `DATABASE_URL` |
| Auth | **better-auth** | Email/password + sessions, Drizzle adapter, memory adapter fallback |
| Quality | **Biome**, **lefthook**, strict **TypeScript** | One fast lint/format tool; checks on commit |
| Tests | **Vitest** + Testing Library, **Playwright** | Unit + e2e, both in CI |
| Env | **@t3-oss/env-nextjs** + Zod | Validated, typed `process.env` |

## Quick start

```bash
pnpm install
cp .env.example .env   # optional — runs fine with everything blank
pnpm dev
```

Open <http://localhost:3000>. The `/demo` route shows optimistic add / toggle / delete backed by a Server Action.

## Scripts

| Script | Does |
| --- | --- |
| `pnpm dev` | Dev server (Turbopack) |
| `pnpm build` / `pnpm start` | Production build / serve |
| `pnpm lint` · `pnpm lint:fix` · `pnpm format` | Biome |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm test` · `pnpm test:watch` | Vitest |
| `pnpm test:e2e` | Playwright (run `pnpm exec playwright install` once) |
| `pnpm db:generate` · `db:migrate` · `db:push` · `db:studio` | Drizzle Kit |
| `pnpm auth:generate` | Regenerate better-auth tables after config changes |

## Enabling Postgres

1. Set `DATABASE_URL` in `.env`.
2. `pnpm db:push` (or `db:generate` + `db:migrate`).

`db` becomes a live Drizzle client and every `src/features/*/repo.ts` switches from its in-memory store to SQL automatically.

## Layout

```
src/
  app/               routes (App Router)
    (auth)/login, (auth)/signup   email + password screens
    dashboard/       protected route (redirects to /login without a session)
    demo/            optimistic-UI demo
    api/auth/[...all] better-auth handler
  components/         app-wide components
    ui/               shadcn primitives (owned code)
  features/<name>/    vertical slices: repo.ts · actions.ts · components/
    auth/             session helper + login/signup/nav components
  lib/
    auth.ts  auth-client.ts
    db/      index.ts · schema.ts
    utils.ts
  env.ts             validated environment
.claude/             project settings + format-on-write hook
```

Auth works on a clean clone (better-auth memory adapter). Signup at `/signup`,
then `/dashboard` is gated by `getSession()` in `src/features/auth/session.ts`.
Set `DATABASE_URL` to persist users in Postgres instead.

## Conventions

- Env only through `@/env`.
- Feature data access in `repo.ts` (`import "server-only"`); mutations in `actions.ts` (`"use server"`, Zod-validated).
- Optimistic pattern: RSC read → client `useOptimistic` island → Server Action in `startTransition` → `revalidatePath`. Reference: `src/features/todos`.
- `src/components/ui/**` is lint-excluded; don't reformat it.

See [`CLAUDE.md`](./CLAUDE.md) for the agent-facing version.

## Requirements

Node >= 22 (`.nvmrc` pins 22) · pnpm >= 11.

## License

[MIT](./LICENSE) © driwcoder
