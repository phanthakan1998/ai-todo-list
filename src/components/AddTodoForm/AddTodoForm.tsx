import { useState } from 'react'

interface Props {
  onAdd: (text: string, deadline: string) => void
}

export function AddTodoForm({ onAdd }: Props) {
  const [text, setText] = useState('')
  const [deadline, setDeadline] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim()) return
    onAdd(text.trim(), deadline)
    setText('')
    setDeadline('')
  }

  return (
    <form className="add-todo-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="What needs to be done?"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <label htmlFor="deadline">Deadline</label>
      <input
        id="deadline"
        type="date"
        value={deadline}
        onChange={e => setDeadline(e.target.value)}
      />
      <button type="submit">Add</button>
    </form>
  )
}
