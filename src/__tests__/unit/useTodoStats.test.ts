import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useTodoStats } from '../../hooks/useTodoStats'
import type { Todo } from '../../types/todo'

const workTodo = (overrides: Partial<Todo> = {}): Todo => ({
  id: Date.now() + Math.random(),
  category: 'work',
  text: 'task',
  deadline: '',
  done: false,
  ...overrides,
})

describe('useTodoStats hook', () => {
  describe('Given an empty todos list', () => {
    it('Then returns all zeros', () => {
      const { result } = renderHook(() => useTodoStats([], 'work', new Date('2026-04-26')))
      expect(result.current).toEqual({ pending: 0, done: 0, overdue: 0 })
    })
  })

  describe('Given todos for different categories', () => {
    it('Then only counts todos for the given category', () => {
      const todos = [
        workTodo({ category: 'work' }),
        workTodo({ category: 'private' }),
      ]
      const { result } = renderHook(() => useTodoStats(todos, 'work', new Date('2026-04-26')))
      expect(result.current.pending).toBe(1)
    })
  })

  describe('Given a mix of pending and done todos', () => {
    it('Then counts pending and done separately', () => {
      const todos = [
        workTodo({ done: false }),
        workTodo({ done: true }),
        workTodo({ done: true }),
      ]
      const { result } = renderHook(() => useTodoStats(todos, 'work', new Date('2026-04-26')))
      expect(result.current.pending).toBe(1)
      expect(result.current.done).toBe(2)
    })
  })

  describe('Given a todo with a past deadline that is not done', () => {
    it('Then counts it as overdue and not as pending', () => {
      const todos = [workTodo({ deadline: '2026-04-20', done: false })]
      const { result } = renderHook(() => useTodoStats(todos, 'work', new Date('2026-04-26')))
      expect(result.current.overdue).toBe(1)
      expect(result.current.pending).toBe(0)
    })
  })

  describe('Given a todo with a past deadline that is done', () => {
    it('Then counts it as done and not overdue', () => {
      const todos = [workTodo({ deadline: '2026-04-20', done: true })]
      const { result } = renderHook(() => useTodoStats(todos, 'work', new Date('2026-04-26')))
      expect(result.current.done).toBe(1)
      expect(result.current.overdue).toBe(0)
    })
  })
})
