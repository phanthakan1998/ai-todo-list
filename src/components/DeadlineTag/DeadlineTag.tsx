import type { DeadlineStatus } from '../../types/todo'

interface Props {
  status: DeadlineStatus
}

export function DeadlineTag({ status }: Props) {
  return <span className={`deadline-tag ${status.state}`}>{status.label}</span>
}
