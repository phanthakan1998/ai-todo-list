import { useState } from 'react'
import type { Category, StoragePort, Todo } from '../types/todo'

export function useTodos(category: Category, storage: StoragePort) {
  const [todos, setTodos] = useState<Todo[]>(() => storage.loadTodos())

  function persist(next: Todo[]) {
    setTodos(next)
    storage.saveTodos(next)
  }

  function addTodo(text: string, deadline: string) {
    const trimmed = text.trim()
    if (!trimmed) return
    const next = [
      { id: Date.now(), category, text: trimmed, deadline, done: false },
      ...todos,
    ]
    persist(next)
  }

  function toggleTodo(id: number) {
    persist(todos.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  function deleteTodo(id: number) {
    persist(todos.filter(t => t.id !== id))
  }

  return { todos, addTodo, toggleTodo, deleteTodo }
}
