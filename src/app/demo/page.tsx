import type { Metadata } from "next";
import { Suspense } from "react";
import { SiteHeader } from "@/components/site-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TodoList, TodoListSkeleton } from "@/features/todos/components/todo-list";

export const metadata: Metadata = { title: "Optimistic demo" };

// Always reflect the live store (in-memory or Postgres) rather than build-time data.
export const dynamic = "force-dynamic";

export default function DemoPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle>Todos</CardTitle>
            <CardDescription>
              Add, toggle and delete update instantly via <code>useOptimistic</code> + Server
              Actions. The server reconciles on revalidation; failures roll back and toast.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<TodoListSkeleton />}>
              <TodoList />
            </Suspense>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
