"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "@/lib/auth-client";

export function AuthNav() {
  const { data, isPending } = useSession();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  if (isPending) {
    return <div className="h-8 w-20 animate-pulse rounded-md bg-muted" />;
  }

  if (!data) {
    return (
      <Button asChild variant="ghost" size="sm">
        <Link href="/login">Sign in</Link>
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/dashboard"
        className="hidden max-w-[16ch] truncate text-sm text-muted-foreground hover:text-foreground sm:inline"
      >
        {data.user.email}
      </Link>
      <Button
        variant="ghost"
        size="sm"
        disabled={signingOut}
        onClick={async () => {
          setSigningOut(true);
          await signOut();
          router.push("/");
          router.refresh();
        }}
      >
        Sign out
      </Button>
    </div>
  );
}
