import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { hasDatabase } from "@/lib/db";

const STACK = [
  ["Next.js 16", "App Router, RSC, Server Actions, Turbopack, React Compiler"],
  ["React 19.2", "useOptimistic, useActionState, <ViewTransition>"],
  ["Tailwind v4 + shadcn/ui", "Design tokens, dark mode, accessible primitives"],
  ["TanStack Query", "Client-side server-state cache + devtools"],
  ["Drizzle + Postgres", "Typed schema, migrations; in-memory fallback"],
  ["better-auth", "Email/password, sessions, Drizzle adapter"],
  ["Biome + lefthook", "Lint, format, typecheck on commit"],
  ["Vitest + Playwright", "Unit + end-to-end, wired into CI"],
] as const;

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-16">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Repo template
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-balance">
          A Next.js starter tuned for fluid, optimistic UI.
        </h1>
        <p className="mt-4 max-w-xl text-muted-foreground text-pretty">
          Everything below is pre-wired and passing checks. Clone it, run{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">pnpm dev</code>, and
          build.
        </p>

        <div className="mt-8 flex items-center gap-3">
          <Button asChild size="lg">
            <Link href="/demo">
              See the optimistic demo
              <ArrowRightIcon />
            </Link>
          </Button>
          <span className="text-sm text-muted-foreground">
            Data source: {hasDatabase ? "Postgres" : "in-memory (no DATABASE_URL)"}
          </span>
        </div>

        <dl className="mt-14 grid gap-x-8 gap-y-5 sm:grid-cols-2">
          {STACK.map(([name, detail]) => (
            <div key={name}>
              <dt className="text-sm font-medium">{name}</dt>
              <dd className="text-sm text-muted-foreground">{detail}</dd>
            </div>
          ))}
        </dl>
      </main>
    </>
  );
}
