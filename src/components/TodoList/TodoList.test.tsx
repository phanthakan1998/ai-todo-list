import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TodoList } from './TodoList'
import type { Todo } from '../../types/todo'

const makeTodo = (id: number, text: string): Todo => ({
  id, category: 'work', text, deadline: '', done: false,
})

describe('TodoList component', () => {
  describe('Given an empty todos array', () => {
    it('Then renders the empty state message', () => {
      render(<TodoList todos={[]} onToggle={vi.fn()} onDelete={vi.fn()} />)
      expect(screen.getByText(/no todos yet/i)).toBeInTheDocument()
    })
  })

  describe('Given a list of todos', () => {
    it('Then renders all todo items', () => {
      const todos = [makeTodo(1, 'Task A'), makeTodo(2, 'Task B')]
      render(<TodoList todos={todos} onToggle={vi.fn()} onDelete={vi.fn()} />)
      expect(screen.getByText('Task A')).toBeInTheDocument()
      expect(screen.getByText('Task B')).toBeInTheDocument()
    })

    it('Then does not render the empty state', () => {
      const todos = [makeTodo(1, 'Task A')]
      render(<TodoList todos={todos} onToggle={vi.fn()} onDelete={vi.fn()} />)
      expect(screen.queryByText(/no todos yet/i)).not.toBeInTheDocument()
    })
  })
})
