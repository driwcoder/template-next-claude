import "server-only";

import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { type Todo, todos } from "@/lib/db/schema";

/**
 * Data access for the demo feature.
 * With `DATABASE_URL` set it hits Postgres via Drizzle; otherwise it uses a
 * module-level in-memory array so the template runs on a fresh clone.
 */

function seedRows(): Todo[] {
  return [
    { id: "seed-1", title: "Read the README", completed: true, createdAt: new Date(0) },
    { id: "seed-2", title: "Run pnpm dev", completed: false, createdAt: new Date(1) },
    { id: "seed-3", title: "Wire up your first feature", completed: false, createdAt: new Date(2) },
  ];
}

// Pin the array to globalThis so every module instance (RSC layer, action layer,
// dev HMR) shares one store. Swap this whole block for a real DB in production.
const globalStore = globalThis as unknown as { __todosMemory?: Todo[] };
globalStore.__todosMemory ??= seedRows();
const memory: Todo[] = globalStore.__todosMemory;

export async function listTodos(): Promise<Todo[]> {
  if (!db) {
    return [...memory].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }
  return db.select().from(todos).orderBy(todos.createdAt);
}

export async function createTodo(title: string): Promise<Todo> {
  if (!db) {
    const row: Todo = {
      id: crypto.randomUUID(),
      title,
      completed: false,
      createdAt: new Date(),
    };
    memory.push(row);
    return row;
  }
  const [row] = await db.insert(todos).values({ title }).returning();
  if (!row) throw new Error("Insert returned no row");
  return row;
}

export async function setTodoCompleted(id: string, completed: boolean): Promise<void> {
  if (!db) {
    const row = memory.find((t) => t.id === id);
    if (row) row.completed = completed;
    return;
  }
  await db.update(todos).set({ completed }).where(eq(todos.id, id));
}

export async function deleteTodo(id: string): Promise<void> {
  if (!db) {
    const index = memory.findIndex((t) => t.id === id);
    if (index >= 0) memory.splice(index, 1);
    return;
  }
  await db.delete(todos).where(eq(todos.id, id));
}
