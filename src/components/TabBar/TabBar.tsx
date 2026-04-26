import type { Category } from '../../types/todo'

interface Props {
  activeCategory: Category
  onCategoryChange: (category: Category) => void
}

const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'work', label: 'Work' },
  { value: 'private', label: 'Private' },
]

export function TabBar({ activeCategory, onCategoryChange }: Props) {
  return (
    <div className="tab-bar" role="tablist">
      {CATEGORIES.map(({ value, label }) => (
        <button
          key={value}
          role="button"
          aria-selected={activeCategory === value ? 'true' : 'false'}
          className={`tab${activeCategory === value ? ' active' : ''}`}
          onClick={() => onCategoryChange(value)}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
