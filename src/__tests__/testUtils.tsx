import { render } from '@testing-library/react'
import type { ReactElement } from 'react'
import type { StoragePort, Todo } from '../types/todo'

export function createMockStorage(initial: Todo[] = []): StoragePort {
  let store = [...initial]
  return {
    loadTodos: vi.fn(() => [...store]),
    saveTodos: vi.fn((todos: Todo[]) => { store = [...todos] }),
  }
}

export function renderWithMockStorage(ui: ReactElement, initial: Todo[] = []) {
  const storage = createMockStorage(initial)
  return { storage, ...render(ui) }
}
