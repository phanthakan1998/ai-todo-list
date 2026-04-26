import { SOON_THRESHOLD_DAYS, MS_PER_DAY } from '../constants/deadline'
import type { DeadlineStatus } from '../types/todo'
import { formatShortDate } from './dateFormatter'

export function computeDeadlineStatus(
  deadline: string,
  done: boolean,
  today: Date,
): DeadlineStatus | null {
  if (!deadline) return null

  const deadlineDate = new Date(deadline + 'T00:00:00')
  const diffDays = Math.round((deadlineDate.getTime() - today.getTime()) / MS_PER_DAY)

  if (done) return { state: 'ok', label: formatShortDate(deadline) }
  if (diffDays < 0) return { state: 'overdue', label: `${Math.abs(diffDays)}d overdue` }
  if (diffDays === 0) return { state: 'soon', label: 'Due today' }
  if (diffDays <= SOON_THRESHOLD_DAYS) return { state: 'soon', label: `${diffDays}d left` }
  return { state: 'ok', label: formatShortDate(deadline) }
}
