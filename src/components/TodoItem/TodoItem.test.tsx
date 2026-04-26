import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TodoItem } from './TodoItem'
import type { Todo } from '../../types/todo'

const baseTodo: Todo = { id: 1, category: 'work', text: 'Buy milk', deadline: '', done: false }

describe('TodoItem component', () => {
  describe('Given a todo that is not done', () => {
    it('Then renders the todo text', () => {
      render(<TodoItem todo={baseTodo} onToggle={vi.fn()} onDelete={vi.fn()} />)
      expect(screen.getByText('Buy milk')).toBeInTheDocument()
    })

    it('Then checkbox is unchecked', () => {
      render(<TodoItem todo={baseTodo} onToggle={vi.fn()} onDelete={vi.fn()} />)
      expect(screen.getByRole('checkbox')).not.toBeChecked()
    })

    it('Then text does not have line-through style', () => {
      render(<TodoItem todo={baseTodo} onToggle={vi.fn()} onDelete={vi.fn()} />)
      expect(screen.getByText('Buy milk')).not.toHaveClass('done')
    })
  })

  describe('Given a todo that is done', () => {
    it('Then checkbox is checked', () => {
      render(<TodoItem todo={{ ...baseTodo, done: true }} onToggle={vi.fn()} onDelete={vi.fn()} />)
      expect(screen.getByRole('checkbox')).toBeChecked()
    })

    it('Then text has done class', () => {
      render(<TodoItem todo={{ ...baseTodo, done: true }} onToggle={vi.fn()} onDelete={vi.fn()} />)
      expect(screen.getByText('Buy milk')).toHaveClass('done')
    })
  })

  describe('When the user clicks the checkbox', () => {
    it('Then onToggle is called with the todo id', async () => {
      const onToggle = vi.fn()
      render(<TodoItem todo={baseTodo} onToggle={onToggle} onDelete={vi.fn()} />)
      await userEvent.click(screen.getByRole('checkbox'))
      expect(onToggle).toHaveBeenCalledWith(1)
    })
  })

  describe('When the user clicks the delete button', () => {
    it('Then onDelete is called with the todo id', async () => {
      const onDelete = vi.fn()
      render(<TodoItem todo={baseTodo} onToggle={vi.fn()} onDelete={onDelete} />)
      await userEvent.click(screen.getByRole('button', { name: /delete/i }))
      expect(onDelete).toHaveBeenCalledWith(1)
    })
  })

  describe('Given a todo with a deadline 2 days away', () => {
    it('Then renders the deadline tag', () => {
      const todo: Todo = { ...baseTodo, deadline: '2026-04-28' }
      vi.setSystemTime(new Date('2026-04-26T00:00:00'))
      render(<TodoItem todo={todo} onToggle={vi.fn()} onDelete={vi.fn()} />)
      expect(screen.getByText('2d left')).toBeInTheDocument()
      vi.useRealTimers()
    })
  })
})
