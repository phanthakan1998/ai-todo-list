import type { TodoStats } from '../../types/todo'

interface Props {
  stats: TodoStats
}

export function StatsBar({ stats }: Props) {
  return (
    <div className="stats-bar">
      <span className="stat pending"><strong>{stats.pending}</strong> pending</span>
      <span className="stat done"><strong>{stats.done}</strong> done</span>
      <span className="stat overdue"><strong>{stats.overdue}</strong> overdue</span>
    </div>
  )
}
