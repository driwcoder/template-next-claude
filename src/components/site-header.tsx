import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-3xl items-center justify-between px-4">
        <Link href="/" className="font-mono text-sm font-semibold tracking-tight">
          template-next-claude
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link
            href="/demo"
            className="rounded-md px-2.5 py-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            Demo
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
