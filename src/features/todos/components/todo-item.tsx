"use client";

import { CheckIcon, Trash2Icon } from "lucide-react";
import { startTransition, useOptimistic } from "react";
import { Button } from "@/components/ui/button";
import type { Todo } from "@/lib/db/schema";
import { cn } from "@/lib/utils";

type Props = {
  todo: Todo;
  onToggle: () => void;
  onDelete: () => void;
};

export function TodoItem({ todo, onToggle, onDelete }: Props) {
  const [isDeleting, setDeleting] = useOptimistic(false);

  return (
    <div
      data-pending={isDeleting ? "" : undefined}
      className="flex items-center gap-3 rounded-lg border bg-card px-3 py-2 transition-all has-data-pending:opacity-40"
    >
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={todo.completed}
        aria-label={todo.completed ? "Mark incomplete" : "Mark complete"}
        className={cn(
          "flex size-5 items-center justify-center rounded-md border transition-colors",
          todo.completed ? "border-primary bg-primary text-primary-foreground" : "bg-background"
        )}
      >
        {todo.completed ? <CheckIcon className="size-3.5" /> : null}
      </button>

      <span
        className={cn("flex-1 text-sm", todo.completed && "text-muted-foreground line-through")}
      >
        {todo.title}
      </span>

      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Delete task"
        className="text-muted-foreground opacity-60 transition-opacity hover:opacity-100 focus-visible:opacity-100"
        onClick={() =>
          startTransition(() => {
            setDeleting(true);
            onDelete();
          })
        }
      >
        <Trash2Icon />
      </Button>
    </div>
  );
}
