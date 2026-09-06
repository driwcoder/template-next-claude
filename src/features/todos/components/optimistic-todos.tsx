"use client";

import { AnimatePresence, motion } from "motion/react";
import { startTransition, useOptimistic, useRef } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Todo } from "@/lib/db/schema";
import { addTodoAction, deleteTodoAction, toggleTodoAction } from "../actions";
import { TodoItem } from "./todo-item";

type Action =
  | { type: "add"; todo: Todo }
  | { type: "toggle"; id: string }
  | { type: "delete"; id: string };

function reducer(state: Todo[], action: Action): Todo[] {
  switch (action.type) {
    case "add":
      return [...state, action.todo];
    case "toggle":
      return state.map((t) => (t.id === action.id ? { ...t, completed: !t.completed } : t));
    case "delete":
      return state.filter((t) => t.id !== action.id);
  }
}

export function OptimisticTodos({ initialTodos }: { initialTodos: Todo[] }) {
  const [todos, mutate] = useOptimistic(initialTodos, reducer);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <div className="flex flex-col gap-4">
      <form
        ref={formRef}
        action={async (formData) => {
          const title = String(formData.get("title") ?? "").trim();
          if (!title) return;
          formRef.current?.reset();
          mutate({
            type: "add",
            todo: {
              id: crypto.randomUUID(),
              title,
              completed: false,
              createdAt: new Date(),
            },
          });
          const result = await addTodoAction(formData);
          if (!result.ok) toast.error(result.error);
        }}
        className="flex gap-2"
      >
        <Input
          name="title"
          placeholder="Add a task…"
          autoComplete="off"
          maxLength={120}
          aria-label="Task title"
        />
        <Button type="submit">Add</Button>
      </form>

      <ul className="flex flex-col gap-2">
        <AnimatePresence initial={false}>
          {todos.map((todo) => (
            <motion.li
              key={todo.id}
              layout
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.15 }}
            >
              <TodoItem
                todo={todo}
                onToggle={() =>
                  startTransition(async () => {
                    mutate({ type: "toggle", id: todo.id });
                    await toggleTodoAction(todo.id, !todo.completed);
                  })
                }
                onDelete={() =>
                  startTransition(async () => {
                    mutate({ type: "delete", id: todo.id });
                    await deleteTodoAction(todo.id);
                  })
                }
              />
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      {todos.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nothing yet. Add your first task.</p>
      ) : null}
    </div>
  );
}
