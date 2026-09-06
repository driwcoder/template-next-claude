// @vitest-environment node
// Server-side data logic — no DOM. Node env also lets `@/env` resolve as server.
import { beforeEach, describe, expect, it } from "vitest";
import { createTodo, deleteTodo, listTodos, setTodoCompleted } from "./repo";

// No DATABASE_URL in the test env -> repo uses its in-memory store.

describe("todos repo (in-memory)", () => {
  let baseCount = 0;

  beforeEach(async () => {
    baseCount = (await listTodos()).length;
  });

  it("creates and lists a todo", async () => {
    const created = await createTodo("write a test");
    expect(created.id).toBeTruthy();
    expect(created.completed).toBe(false);

    const all = await listTodos();
    expect(all).toHaveLength(baseCount + 1);
    expect(all.at(-1)?.title).toBe("write a test");
  });

  it("toggles completion", async () => {
    const created = await createTodo("toggle me");
    await setTodoCompleted(created.id, true);
    const found = (await listTodos()).find((t) => t.id === created.id);
    expect(found?.completed).toBe(true);
  });

  it("deletes a todo", async () => {
    const created = await createTodo("delete me");
    await deleteTodo(created.id);
    const found = (await listTodos()).find((t) => t.id === created.id);
    expect(found).toBeUndefined();
  });
});
