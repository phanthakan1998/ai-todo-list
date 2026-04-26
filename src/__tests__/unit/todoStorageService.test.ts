import { describe, it, expect, beforeEach } from 'vitest'
import { todoStorageService } from '../../services/todoStorageService'
import type { Todo } from '../../types/todo'

const STORAGE_KEY = 'todos'
const sampleTodo: Todo = { id: 1, category: 'work', text: 'Test', deadline: '', done: false }

describe('todoStorageService', () => {
  beforeEach(() => localStorage.clear())

  describe('loadTodos', () => {
    describe('Given localStorage is empty', () => {
      it('Then returns an empty array', () => {
        expect(todoStorageService.loadTodos()).toEqual([])
      })
    })

    describe('Given valid JSON todos exist in localStorage', () => {
      it('Then returns the parsed array', () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([sampleTodo]))
        expect(todoStorageService.loadTodos()).toEqual([sampleTodo])
      })
    })

    describe('Given corrupted JSON in localStorage', () => {
      it('Then returns an empty array without throwing', () => {
        localStorage.setItem(STORAGE_KEY, 'not-json{{{')
        expect(todoStorageService.loadTodos()).toEqual([])
      })
    })
  })

  describe('saveTodos', () => {
    describe('Given a todos array', () => {
      it('Then writes JSON to localStorage under the todos key', () => {
        todoStorageService.saveTodos([sampleTodo])
        expect(localStorage.getItem(STORAGE_KEY)).toBe(JSON.stringify([sampleTodo]))
      })
    })
  })
})
