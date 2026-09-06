import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { Todo } from "@/lib/db/schema";
import { TodoItem } from "./todo-item";

const todo: Todo = {
  id: "t1",
  title: "buy milk",
  completed: false,
  createdAt: new Date(),
};

describe("<TodoItem />", () => {
  it("renders the title and fires callbacks", async () => {
    const onToggle = vi.fn();
    const onDelete = vi.fn();
    const user = userEvent.setup();

    render(<TodoItem todo={todo} onToggle={onToggle} onDelete={onDelete} />);

    expect(screen.getByText("buy milk")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /mark complete/i }));
    expect(onToggle).toHaveBeenCalledOnce();

    await user.click(screen.getByRole("button", { name: /delete task/i }));
    expect(onDelete).toHaveBeenCalledOnce();
  });

  it("shows completed state", () => {
    render(<TodoItem todo={{ ...todo, completed: true }} onToggle={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByRole("button", { name: /mark incomplete/i })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
  });
});
