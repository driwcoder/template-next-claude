import { listTodos } from "../repo";
import { OptimisticTodos } from "./optimistic-todos";

/** Server Component: reads persisted todos, hands them to the client island. */
export async function TodoList() {
  const todos = await listTodos();
  return <OptimisticTodos initialTodos={todos} />;
}

export function TodoListSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-11 animate-pulse rounded-lg border bg-muted/40" />
      ))}
    </div>
  );
}
