import { describe, it, expect } from 'vitest'
import { computeDeadlineStatus } from '../../utils/deadlineUtils'

describe('computeDeadlineStatus', () => {
  const today = new Date('2026-04-26T00:00:00')

  describe('Given a todo with no deadline', () => {
    it('Then returns null', () => {
      expect(computeDeadlineStatus('', false, today)).toBeNull()
    })
  })

  describe('Given a todo that is done with an overdue deadline', () => {
    it('Then returns state "ok" because done overrides overdue', () => {
      const status = computeDeadlineStatus('2026-04-20', true, today)
      expect(status?.state).toBe('ok')
    })
  })

  describe('Given a todo with deadline 5 days in the future and not done', () => {
    it('Then returns state "ok" with a formatted date label', () => {
      const status = computeDeadlineStatus('2026-05-01', false, today)
      expect(status?.state).toBe('ok')
    })
  })

  describe('Given a todo with deadline exactly 3 days away and not done', () => {
    it('Then returns state "soon" with label "3d left"', () => {
      const status = computeDeadlineStatus('2026-04-29', false, today)
      expect(status?.state).toBe('soon')
      expect(status?.label).toBe('3d left')
    })
  })

  describe('Given a todo with deadline exactly 1 day away and not done', () => {
    it('Then returns state "soon" with label "1d left"', () => {
      const status = computeDeadlineStatus('2026-04-27', false, today)
      expect(status?.state).toBe('soon')
      expect(status?.label).toBe('1d left')
    })
  })

  describe('Given a todo with deadline today and not done', () => {
    it('Then returns state "soon" with label "Due today"', () => {
      const status = computeDeadlineStatus('2026-04-26', false, today)
      expect(status?.state).toBe('soon')
      expect(status?.label).toBe('Due today')
    })
  })

  describe('Given a todo with deadline 2 days overdue and not done', () => {
    it('Then returns state "overdue" with label "2d overdue"', () => {
      const status = computeDeadlineStatus('2026-04-24', false, today)
      expect(status?.state).toBe('overdue')
      expect(status?.label).toBe('2d overdue')
    })
  })

  describe('Given a todo with deadline 1 day overdue and not done', () => {
    it('Then returns state "overdue" with label "1d overdue"', () => {
      const status = computeDeadlineStatus('2026-04-25', false, today)
      expect(status?.state).toBe('overdue')
      expect(status?.label).toBe('1d overdue')
    })
  })
})
