import { useEffect, useRef, useState } from 'react'
import { useSettings } from '../../context/SettingsContext'
import { SEARCH_ENGINES } from '../../utils/defaults'
import { fetchSearchSuggestions } from '../../utils/api'

export default function SearchBar() {
  const { settings, isDark } = useSettings()
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [activeIndex, setActiveIndex] = useState(-1)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    const trimmed = query.trim()
    if (!trimmed) {
      setSuggestions([])
      setActiveIndex(-1)
      return
    }

    const controller = new AbortController()
    const timeout = setTimeout(async () => {
      try {
        const results = await fetchSearchSuggestions(trimmed, controller.signal)
        setSuggestions(results)
        setActiveIndex(-1)
      } catch (error) {
        if (error.name !== 'AbortError') {
          setSuggestions([])
        }
      }
    }, 180)

    return () => {
      controller.abort()
      clearTimeout(timeout)
    }
  }, [query])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!query.trim()) return
    const engine = SEARCH_ENGINES[settings.searchEngine] || SEARCH_ENGINES.google
    window.location.href = engine.url(query.trim())
  }

  const selectSuggestion = (suggestion) => {
    setQuery(suggestion)
    setShowSuggestions(false)
    const engine = SEARCH_ENGINES[settings.searchEngine] || SEARCH_ENGINES.google
    window.location.href = engine.url(suggestion)
  }

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((prev) => (prev + 1) % suggestions.length)
      return
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((prev) => (prev <= 0 ? suggestions.length - 1 : prev - 1))
      return
    }

    if (e.key === 'Escape') {
      setShowSuggestions(false)
      setActiveIndex(-1)
      return
    }

    if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault()
      selectSuggestion(suggestions[activeIndex])
    }
  }

  const hasSuggestions = showSuggestions && suggestions.length > 0

  return (
    <form ref={containerRef} onSubmit={handleSubmit} className="w-full max-w-xl mx-auto relative">
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
          onChange={(e) => {
            setQuery(e.target.value)
            setShowSuggestions(true)
          }}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          placeholder={`Search with ${(SEARCH_ENGINES[settings.searchEngine] || SEARCH_ENGINES.google).label}`}
          className={`flex-1 bg-transparent outline-none placeholder:text-stone ${isDark ? 'text-bone' : 'text-void'}`}
          autoComplete="off"
        />
      </div>

      {hasSuggestions && (
        <ul
          className={`absolute left-0 right-0 mt-2 rounded-2xl border shadow-xl overflow-hidden z-20 ${
            isDark ? 'bg-swamp/95 border-scale/20' : 'bg-white/95 border-black/10'
          }`}
        >
          {suggestions.map((suggestion, index) => {
            const isActive = index === activeIndex
            return (
              <li key={`${suggestion}-${index}`}>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => selectSuggestion(suggestion)}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                    isActive
                      ? isDark
                        ? 'bg-scale/30 text-bone'
                        : 'bg-scale/20 text-void'
                      : isDark
                        ? 'text-bone hover:bg-scale/15'
                        : 'text-void hover:bg-scale/10'
                  }`}
                >
                  {suggestion}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </form>
  )
}
