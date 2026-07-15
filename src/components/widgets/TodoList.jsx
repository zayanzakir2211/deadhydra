import { useState, useMemo } from 'react'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { useSettings } from '../../context/SettingsContext'

export default function TodoList() {
  const [todos, setTodos] = useLocalStorage('deadhydra:todos', [])
  const [text, setText] = useState('')
  const [filter, setFilter] = useState('all')
  const { isDark } = useSettings()

  const addTodo = (e) => {
    e.preventDefault()
    if (!text.trim()) return
    setTodos((prev) => [...prev, { id: Date.now().toString(), text: text.trim(), done: false }])
    setText('')
  }

  const toggleTodo = (id) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
  }

  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((t) => t.id !== id))
  }

  const filtered = useMemo(() => {
    if (filter === 'active') return todos.filter((t) => !t.done)
    if (filter === 'completed') return todos.filter((t) => t.done)
    return todos
  }, [todos, filter])

  const inputClasses = isDark
    ? 'bg-swamp/60 border-scale/20 text-bone placeholder:text-stone'
    : 'bg-white/70 border-black/10 text-void placeholder:text-stone'

  return (
    <div>
      <form onSubmit={addTodo} className="flex gap-2 mb-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a task..."
          className={`flex-1 rounded-lg border px-3 py-2 text-sm outline-none focus:border-scale ${inputClasses}`}
        />
        <button
          type="submit"
          className="rounded-lg px-3 py-2 text-sm font-medium bg-scale text-void hover:bg-scale-bright transition-colors"
        >
          Add
        </button>
      </form>

      <div className="flex gap-2 mb-3 text-xs">
        {['all', 'active', 'completed'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-2 py-1 rounded-full capitalize transition-colors ${
              filter === f ? 'bg-scale text-void' : 'text-stone hover:text-scale'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <ul className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
        {filtered.length === 0 && <li className="text-sm text-stone italic">Nothing here.</li>}
        {filtered.map((t) => (
          <li key={t.id} className="flex items-center gap-2 group">
            <input
              type="checkbox"
              checked={t.done}
              onChange={() => toggleTodo(t.id)}
              className="accent-scale w-4 h-4 shrink-0"
            />
            <span className={`flex-1 text-sm ${t.done ? 'line-through text-stone' : isDark ? 'text-bone' : 'text-void'}`}>
              {t.text}
            </span>
            <button
              onClick={() => deleteTodo(t.id)}
              className="text-stone hover:text-rust opacity-0 group-hover:opacity-100 transition-opacity text-xs"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
