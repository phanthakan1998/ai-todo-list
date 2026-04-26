export type Category = 'work' | 'private'

export type DeadlineState = 'ok' | 'soon' | 'overdue'

export interface DeadlineStatus {
  state: DeadlineState
  label: string
}

export interface Todo {
  id: number
  category: Category
  text: string
  deadline: string
  done: boolean
}

export interface TodoStats {
  pending: number
  done: number
  overdue: number
}

export interface StoragePort {
  loadTodos(): Todo[]
  saveTodos(todos: Todo[]): void
}
