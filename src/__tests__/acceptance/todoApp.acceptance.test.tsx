import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { App } from '../../App'
import type { StoragePort, Todo } from '../../types/todo'

function makeStorage(initial: Todo[] = []): StoragePort {
  let store = [...initial]
  return {
    loadTodos: vi.fn(() => [...store]),
    saveTodos: vi.fn((todos: Todo[]) => { store = [...todos] }),
  }
}

describe('Todo App — acceptance tests', () => {
  let storage: StoragePort

  beforeEach(() => {
    storage = makeStorage()
    vi.setSystemTime(new Date('2026-04-26T00:00:00'))
  })

  afterEach(() => vi.useRealTimers())

  describe('Given the app loads with no persisted data', () => {
    describe('When the user views the Work tab', () => {
      it('Then the empty state message is displayed', () => {
        render(<App storage={storage} />)
        expect(screen.getByText(/no todos yet/i)).toBeInTheDocument()
      })

      it('Then stats show 0 pending, 0 done, 0 overdue', () => {
        render(<App storage={storage} />)
        expect(screen.getAllByText(/0/).length).toBeGreaterThanOrEqual(1)
        expect(screen.getByText(/pending/i)).toBeInTheDocument()
      })
    })
  })

  describe('Given the user is on the Work tab', () => {
    describe('When the user adds a todo "Finish report"', () => {
      it('Then "Finish report" appears in the list', async () => {
        render(<App storage={storage} />)
        await userEvent.type(screen.getByPlaceholderText(/what needs to be done/i), 'Finish report')
        await userEvent.click(screen.getByRole('button', { name: /add/i }))
        expect(screen.getByText('Finish report')).toBeInTheDocument()
      })

      it('Then pending count increments to 1', async () => {
        render(<App storage={storage} />)
        await userEvent.type(screen.getByPlaceholderText(/what needs to be done/i), 'Finish report')
        await userEvent.click(screen.getByRole('button', { name: /add/i }))
        const statsBar = screen.getByRole('region', { name: /stats/i })
        expect(within(statsBar).getByText(/1/)).toBeInTheDocument()
        expect(within(statsBar).getByText(/pending/i)).toBeInTheDocument()
      })
    })

    describe('When the user adds a Work todo and switches to Private tab', () => {
      it('Then the Work todo does not appear in the Private list', async () => {
        render(<App storage={storage} />)
        await userEvent.type(screen.getByPlaceholderText(/what needs to be done/i), 'Work task')
        await userEvent.click(screen.getByRole('button', { name: /add/i }))
        await userEvent.click(screen.getByRole('button', { name: /private/i }))
        expect(screen.queryByText('Work task')).not.toBeInTheDocument()
      })
    })
  })

  describe('Given a Work todo exists', () => {
    describe('When the user clicks the checkbox', () => {
      it('Then the todo text has done class', async () => {
        render(<App storage={storage} />)
        await userEvent.type(screen.getByPlaceholderText(/what needs to be done/i), 'Finish report')
        await userEvent.click(screen.getByRole('button', { name: /add/i }))
        await userEvent.click(screen.getByRole('checkbox'))
        expect(screen.getByText('Finish report')).toHaveClass('done')
      })
    })

    describe('When the user clicks the delete button', () => {
      it('Then the todo is removed from the list', async () => {
        render(<App storage={storage} />)
        await userEvent.type(screen.getByPlaceholderText(/what needs to be done/i), 'Finish report')
        await userEvent.click(screen.getByRole('button', { name: /add/i }))
        await userEvent.click(screen.getByRole('button', { name: /delete/i }))
        expect(screen.queryByText('Finish report')).not.toBeInTheDocument()
      })
    })
  })

  describe('Given a todo with an overdue deadline exists', () => {
    describe('When the todo is rendered', () => {
      it('Then the deadline tag shows overdue state', async () => {
        render(<App storage={storage} />)
        await userEvent.type(screen.getByPlaceholderText(/what needs to be done/i), 'Late task')
        await userEvent.type(screen.getByLabelText(/deadline/i), '2026-04-20')
        await userEvent.click(screen.getByRole('button', { name: /add/i }))
        expect(screen.getAllByText(/overdue/i).length).toBeGreaterThanOrEqual(1)
      })
    })
  })

  describe('Given a todo with a deadline 2 days from now', () => {
    describe('When the todo is rendered', () => {
      it('Then the deadline tag shows "soon" with "2d left"', async () => {
        render(<App storage={storage} />)
        await userEvent.type(screen.getByPlaceholderText(/what needs to be done/i), 'Soon task')
        await userEvent.type(screen.getByLabelText(/deadline/i), '2026-04-28')
        await userEvent.click(screen.getByRole('button', { name: /add/i }))
        expect(screen.getByText('2d left')).toBeInTheDocument()
      })
    })
  })

  describe('Given todos in localStorage on app load', () => {
    it('Then the app displays the persisted todos', () => {
      const persisted: Todo[] = [
        { id: 1, category: 'work', text: 'Persisted task', deadline: '', done: false },
      ]
      storage = makeStorage(persisted)
      render(<App storage={storage} />)
      expect(screen.getByText('Persisted task')).toBeInTheDocument()
    })
  })
})
