"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createTodo, deleteTodo, setTodoCompleted } from "./repo";

// Server Actions are reachable by direct POST — validate every input here, and
// add an auth check when the data isn't public. Example:
//   import { headers } from "next/headers";
//   import { auth } from "@/lib/auth";
//   const session = await auth.api.getSession({ headers: await headers() });
//   if (!session) throw new Error("Unauthorized");

const titleSchema = z.string().trim().min(1, "Enter a task").max(120, "Keep it under 120 chars");

export type AddTodoResult = { ok: true } | { ok: false; error: string };

export async function addTodoAction(formData: FormData): Promise<AddTodoResult> {
  const parsed = titleSchema.safeParse(formData.get("title"));
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  await createTodo(parsed.data);
  revalidatePath("/demo");
  return { ok: true };
}

export async function toggleTodoAction(id: string, completed: boolean): Promise<void> {
  await setTodoCompleted(id, completed);
  revalidatePath("/demo");
}

export async function deleteTodoAction(id: string): Promise<void> {
  await deleteTodo(id);
  revalidatePath("/demo");
}
