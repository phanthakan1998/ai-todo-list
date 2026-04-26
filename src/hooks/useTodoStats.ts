import { useMemo } from 'react'
import type { Category, Todo, TodoStats } from '../types/todo'
import { MS_PER_DAY } from '../constants/deadline'

function isOverdue(todo: Todo, today: Date): boolean {
  if (!todo.deadline || todo.done) return false
  const deadlineDate = new Date(todo.deadline + 'T00:00:00')
  return deadlineDate.getTime() < today.getTime() - (today.getTime() % MS_PER_DAY) + (today.getTimezoneOffset() * 60000 * -1)
}

export function useTodoStats(todos: Todo[], category: Category, today: Date = new Date()): TodoStats {
  return useMemo(() => {
    const categoryTodos = todos.filter(t => t.category === category)
    return categoryTodos.reduce<TodoStats>(
      (acc, todo) => {
        if (todo.done) return { ...acc, done: acc.done + 1 }
        if (isOverdue(todo, today)) return { ...acc, overdue: acc.overdue + 1 }
        return { ...acc, pending: acc.pending + 1 }
      },
      { pending: 0, done: 0, overdue: 0 },
    )
  }, [todos, category, today])
}
