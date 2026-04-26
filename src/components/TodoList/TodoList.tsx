import type { Todo } from '../../types/todo'
import { TodoItem } from '../TodoItem/TodoItem'
import { EmptyState } from '../EmptyState/EmptyState'

interface Props {
  todos: Todo[]
  onToggle: (id: number) => void
  onDelete: (id: number) => void
}

export function TodoList({ todos, onToggle, onDelete }: Props) {
  if (todos.length === 0) return <EmptyState />

  return (
    <ul className="todo-list">
      {todos.map(todo => (
        <TodoItem key={todo.id} todo={todo} onToggle={onToggle} onDelete={onDelete} />
      ))}
    </ul>
  )
}
