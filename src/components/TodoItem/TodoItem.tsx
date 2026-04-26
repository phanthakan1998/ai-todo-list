import type { Todo } from '../../types/todo'
import { computeDeadlineStatus } from '../../utils/deadlineUtils'
import { DeadlineTag } from '../DeadlineTag/DeadlineTag'

interface Props {
  todo: Todo
  onToggle: (id: number) => void
  onDelete: (id: number) => void
}

export function TodoItem({ todo, onToggle, onDelete }: Props) {
  const deadlineStatus = computeDeadlineStatus(todo.deadline, todo.done, new Date())

  return (
    <li className={`todo-item${todo.done ? ' completed' : ''}`}>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={() => onToggle(todo.id)}
        aria-label={`Toggle: ${todo.text}`}
      />
      <span className={`todo-text${todo.done ? ' done' : ''}`}>{todo.text}</span>
      {deadlineStatus && <DeadlineTag status={deadlineStatus} />}
      <button onClick={() => onDelete(todo.id)} aria-label="Delete todo">
        Delete
      </button>
    </li>
  )
}
