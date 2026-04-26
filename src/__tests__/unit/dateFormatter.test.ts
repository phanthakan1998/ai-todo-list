import { describe, it, expect } from 'vitest'
import { formatShortDate } from '../../utils/dateFormatter'

describe('formatShortDate', () => {
  describe('Given a standard ISO date string', () => {
    it('Then returns a human-readable short date', () => {
      expect(formatShortDate('2026-01-05')).toBe('Jan 5, 2026')
    })
  })

  describe('Given a year-end date', () => {
    it('Then formats December 31 correctly', () => {
      expect(formatShortDate('2025-12-31')).toBe('Dec 31, 2025')
    })
  })

  describe('Given a leap-year date', () => {
    it('Then formats Feb 29 correctly', () => {
      expect(formatShortDate('2024-02-29')).toBe('Feb 29, 2024')
    })
  })
})
