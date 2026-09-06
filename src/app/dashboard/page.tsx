import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getSession } from "@/features/auth/session";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle>Dashboard</CardTitle>
            <CardDescription>
              Protected route — the server redirects here to <code>/login</code> without a session.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm">
            Signed in as <span className="font-medium text-foreground">{session.user.email}</span>.
          </CardContent>
        </Card>
      </main>
    </>
  );
}
