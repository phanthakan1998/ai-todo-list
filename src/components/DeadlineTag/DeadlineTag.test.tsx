import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DeadlineTag } from './DeadlineTag'
import type { DeadlineStatus } from '../../types/todo'

describe('DeadlineTag component', () => {
  describe('Given a "soon" status', () => {
    it('Then renders the label', () => {
      const status: DeadlineStatus = { state: 'soon', label: '2d left' }
      render(<DeadlineTag status={status} />)
      expect(screen.getByText('2d left')).toBeInTheDocument()
    })

    it('Then applies the soon CSS class', () => {
      const status: DeadlineStatus = { state: 'soon', label: '2d left' }
      render(<DeadlineTag status={status} />)
      expect(screen.getByText('2d left')).toHaveClass('soon')
    })
  })

  describe('Given an "overdue" status', () => {
    it('Then renders the label', () => {
      const status: DeadlineStatus = { state: 'overdue', label: '3d overdue' }
      render(<DeadlineTag status={status} />)
      expect(screen.getByText('3d overdue')).toBeInTheDocument()
    })

    it('Then applies the overdue CSS class', () => {
      const status: DeadlineStatus = { state: 'overdue', label: '3d overdue' }
      render(<DeadlineTag status={status} />)
      expect(screen.getByText('3d overdue')).toHaveClass('overdue')
    })
  })

  describe('Given an "ok" status', () => {
    it('Then renders the label', () => {
      const status: DeadlineStatus = { state: 'ok', label: 'May 1, 2026' }
      render(<DeadlineTag status={status} />)
      expect(screen.getByText('May 1, 2026')).toBeInTheDocument()
    })

    it('Then applies the ok CSS class', () => {
      const status: DeadlineStatus = { state: 'ok', label: 'May 1, 2026' }
      render(<DeadlineTag status={status} />)
      expect(screen.getByText('May 1, 2026')).toHaveClass('ok')
    })
  })
})
