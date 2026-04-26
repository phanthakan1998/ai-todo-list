import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AddTodoForm } from './AddTodoForm'

describe('AddTodoForm component', () => {
  describe('Given the form is rendered', () => {
    describe('When the user types text and clicks Add', () => {
      it('Then onAdd is called with the trimmed text and empty deadline', async () => {
        const onAdd = vi.fn()
        render(<AddTodoForm onAdd={onAdd} />)
        await userEvent.type(screen.getByPlaceholderText(/what needs to be done/i), 'Buy milk')
        await userEvent.click(screen.getByRole('button', { name: /add/i }))
        expect(onAdd).toHaveBeenCalledWith('Buy milk', '')
      })

      it('Then the input is cleared after submission', async () => {
        render(<AddTodoForm onAdd={vi.fn()} />)
        const input = screen.getByPlaceholderText(/what needs to be done/i)
        await userEvent.type(input, 'Buy milk')
        await userEvent.click(screen.getByRole('button', { name: /add/i }))
        expect(input).toHaveValue('')
      })
    })

    describe('When the user types text and presses Enter', () => {
      it('Then onAdd is called', async () => {
        const onAdd = vi.fn()
        render(<AddTodoForm onAdd={onAdd} />)
        await userEvent.type(screen.getByPlaceholderText(/what needs to be done/i), 'Buy milk{Enter}')
        expect(onAdd).toHaveBeenCalledWith('Buy milk', '')
      })
    })

    describe('When the user submits with empty text', () => {
      it('Then onAdd is not called', async () => {
        const onAdd = vi.fn()
        render(<AddTodoForm onAdd={onAdd} />)
        await userEvent.click(screen.getByRole('button', { name: /add/i }))
        expect(onAdd).not.toHaveBeenCalled()
      })
    })

    describe('When the user fills in text and a deadline date', () => {
      it('Then onAdd is called with both text and the ISO date string', async () => {
        const onAdd = vi.fn()
        render(<AddTodoForm onAdd={onAdd} />)
        await userEvent.type(screen.getByPlaceholderText(/what needs to be done/i), 'Submit tax')
        await userEvent.type(screen.getByLabelText(/deadline/i), '2026-05-01')
        await userEvent.click(screen.getByRole('button', { name: /add/i }))
        expect(onAdd).toHaveBeenCalledWith('Submit tax', '2026-05-01')
      })
    })
  })
})
