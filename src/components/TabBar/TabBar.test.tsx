import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TabBar } from './TabBar'

describe('TabBar component', () => {
  describe('Given activeCategory is "work"', () => {
    it('Then Work tab has aria-selected true', () => {
      render(<TabBar activeCategory="work" onCategoryChange={vi.fn()} />)
      expect(screen.getByRole('button', { name: /work/i })).toHaveAttribute('aria-selected', 'true')
    })

    it('Then Private tab has aria-selected false', () => {
      render(<TabBar activeCategory="work" onCategoryChange={vi.fn()} />)
      expect(screen.getByRole('button', { name: /private/i })).toHaveAttribute('aria-selected', 'false')
    })

    describe('When the user clicks the Private tab', () => {
      it('Then onCategoryChange is called with "private"', async () => {
        const onCategoryChange = vi.fn()
        render(<TabBar activeCategory="work" onCategoryChange={onCategoryChange} />)
        await userEvent.click(screen.getByRole('button', { name: /private/i }))
        expect(onCategoryChange).toHaveBeenCalledWith('private')
      })
    })
  })

  describe('Given activeCategory is "private"', () => {
    it('Then Private tab has aria-selected true', () => {
      render(<TabBar activeCategory="private" onCategoryChange={vi.fn()} />)
      expect(screen.getByRole('button', { name: /private/i })).toHaveAttribute('aria-selected', 'true')
    })

    describe('When the user clicks the Work tab', () => {
      it('Then onCategoryChange is called with "work"', async () => {
        const onCategoryChange = vi.fn()
        render(<TabBar activeCategory="private" onCategoryChange={onCategoryChange} />)
        await userEvent.click(screen.getByRole('button', { name: /work/i }))
        expect(onCategoryChange).toHaveBeenCalledWith('work')
      })
    })
  })
})
