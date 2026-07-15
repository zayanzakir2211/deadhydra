import { useState } from 'react'
import { useSettings } from '../../context/SettingsContext'
import { SEARCH_ENGINES } from '../../utils/defaults'

export default function SearchBar() {
  const { settings, isDark } = useSettings()
  const [query, setQuery] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!query.trim()) return
    const engine = SEARCH_ENGINES[settings.searchEngine] || SEARCH_ENGINES.google
    window.location.href = engine.url(query.trim())
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto">
      <div
        className={`flex items-center gap-3 rounded-full px-5 py-3 border transition-colors ${
          isDark
            ? 'bg-swamp/70 border-scale/20 focus-within:border-scale'
            : 'bg-white/70 border-black/10 focus-within:border-scale'
        }`}
      >
        <svg className="w-5 h-5 shrink-0 text-scale" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search with ${(SEARCH_ENGINES[settings.searchEngine] || SEARCH_ENGINES.google).label}`}
          className={`flex-1 bg-transparent outline-none placeholder:text-stone ${isDark ? 'text-bone' : 'text-void'}`}
        />
      </div>
    </form>
  )
}
