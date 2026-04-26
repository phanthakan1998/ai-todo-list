import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StatsBar } from './StatsBar'

describe('StatsBar component', () => {
  describe('Given stats with 2 pending, 1 done, 0 overdue', () => {
    it('Then renders all three counts', () => {
      render(<StatsBar stats={{ pending: 2, done: 1, overdue: 0 }} />)
      expect(screen.getByText(/2/)).toBeInTheDocument()
      expect(screen.getByText(/pending/i)).toBeInTheDocument()
      expect(screen.getByText(/1/)).toBeInTheDocument()
      expect(screen.getByText(/done/i)).toBeInTheDocument()
    })
  })

  describe('Given stats with overdue todos', () => {
    it('Then renders the overdue count', () => {
      render(<StatsBar stats={{ pending: 0, done: 0, overdue: 3 }} />)
      expect(screen.getByText(/3/)).toBeInTheDocument()
      expect(screen.getByText(/overdue/i)).toBeInTheDocument()
    })
  })
})
