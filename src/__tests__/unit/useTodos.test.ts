import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTodos } from '../../hooks/useTodos'
import type { StoragePort, Todo } from '../../types/todo'

function makeMockStorage(initial: Todo[] = []): StoragePort {
  let store = [...initial]
  return {
    loadTodos: vi.fn(() => [...store]),
    saveTodos: vi.fn((todos: Todo[]) => { store = [...todos] }),
  }
}

describe('useTodos hook', () => {
  describe('Given no todos in storage', () => {
    describe('When the hook initialises', () => {
      it('Then the todos list is empty', () => {
        const storage = makeMockStorage()
        const { result } = renderHook(() => useTodos('work', storage))
        expect(result.current.todos).toHaveLength(0)
      })
    })
  })

  describe('Given todos exist in storage', () => {
    describe('When the hook initialises', () => {
      it('Then todos are loaded from storage', () => {
        const existing: Todo = { id: 1, category: 'work', text: 'Existing', deadline: '', done: false }
        const storage = makeMockStorage([existing])
        const { result } = renderHook(() => useTodos('work', storage))
        expect(result.current.todos).toHaveLength(1)
        expect(result.current.todos[0].text).toBe('Existing')
      })
    })
  })

  describe('Given the user is on the Work tab', () => {
    let storage: StoragePort

    beforeEach(() => { storage = makeMockStorage() })

    describe('When addTodo is called with valid text', () => {
      it('Then a new Work todo appears in the list', () => {
        const { result } = renderHook(() => useTodos('work', storage))
        act(() => result.current.addTodo('Write report', ''))
        expect(result.current.todos).toHaveLength(1)
        expect(result.current.todos[0].text).toBe('Write report')
        expect(result.current.todos[0].category).toBe('work')
      })

      it('Then saveTodos is called on the storage port', () => {
        const { result } = renderHook(() => useTodos('work', storage))
        act(() => result.current.addTodo('Write report', ''))
        expect(storage.saveTodos).toHaveBeenCalledTimes(1)
      })

      it('Then the new todo has done set to false', () => {
        const { result } = renderHook(() => useTodos('work', storage))
        act(() => result.current.addTodo('Write report', ''))
        expect(result.current.todos[0].done).toBe(false)
      })
    })

    describe('When addTodo is called with blank text', () => {
      it('Then no todo is added', () => {
        const { result } = renderHook(() => useTodos('work', storage))
        act(() => result.current.addTodo('   ', ''))
        expect(result.current.todos).toHaveLength(0)
      })
    })
  })

  describe('Given a todo exists', () => {
    it('When toggleTodo is called Then the done flag flips to true', () => {
      const todo: Todo = { id: 100, category: 'work', text: 'Task', deadline: '', done: false }
      const storage = makeMockStorage([todo])
      const { result } = renderHook(() => useTodos('work', storage))
      act(() => result.current.toggleTodo(100))
      expect(result.current.todos[0].done).toBe(true)
    })

    it('When toggleTodo is called twice Then the done flag returns to false', () => {
      const todo: Todo = { id: 100, category: 'work', text: 'Task', deadline: '', done: false }
      const storage = makeMockStorage([todo])
      const { result } = renderHook(() => useTodos('work', storage))
      act(() => result.current.toggleTodo(100))
      act(() => result.current.toggleTodo(100))
      expect(result.current.todos[0].done).toBe(false)
    })

    it('When deleteTodo is called Then the todo is removed', () => {
      const todo: Todo = { id: 100, category: 'work', text: 'Task', deadline: '', done: false }
      const storage = makeMockStorage([todo])
      const { result } = renderHook(() => useTodos('work', storage))
      act(() => result.current.deleteTodo(100))
      expect(result.current.todos).toHaveLength(0)
    })

    it('When deleteTodo is called Then saveTodos is called', () => {
      const todo: Todo = { id: 100, category: 'work', text: 'Task', deadline: '', done: false }
      const storage = makeMockStorage([todo])
      const { result } = renderHook(() => useTodos('work', storage))
      act(() => result.current.deleteTodo(100))
      expect(storage.saveTodos).toHaveBeenCalled()
    })
  })
})
