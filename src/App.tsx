import { useState } from 'react'
import type { Category, StoragePort } from './types/todo'
import { todoStorageService } from './services/todoStorageService'
import { useTodos } from './hooks/useTodos'
import { useTodoStats } from './hooks/useTodoStats'
import { TabBar } from './components/TabBar/TabBar'
import { AddTodoForm } from './components/AddTodoForm/AddTodoForm'
import { TodoList } from './components/TodoList/TodoList'
import { StatsBar } from './components/StatsBar/StatsBar'
import './App.css'

interface Props {
  storage?: StoragePort
}

export function App({ storage = todoStorageService }: Props) {
  const [activeCategory, setActiveCategory] = useState<Category>('work')
  const { todos, addTodo, toggleTodo, deleteTodo } = useTodos(activeCategory, storage)
  const stats = useTodoStats(todos, activeCategory)

  const visibleTodos = todos.filter(t => t.category === activeCategory)

  return (
    <div className="app">
      <header className="app-header">
        <h1>✦ My Todos</h1>
      </header>
      <main className="app-main">
        <TabBar activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
        <AddTodoForm onAdd={addTodo} />
        <section aria-label="Stats" className="stats-section">
          <StatsBar stats={stats} />
        </section>
        <TodoList todos={visibleTodos} onToggle={toggleTodo} onDelete={deleteTodo} />
      </main>
    </div>
  )
}

export default App
