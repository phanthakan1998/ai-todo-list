import type { StoragePort, Todo } from '../types/todo'

const STORAGE_KEY = 'todos'

export const todoStorageService: StoragePort = {
  loadTodos(): Todo[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? (JSON.parse(raw) as Todo[]) : []
    } catch {
      return []
    }
  },

  saveTodos(todos: Todo[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  },
}
