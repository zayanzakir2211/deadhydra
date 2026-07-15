import { useEffect, useState } from 'react'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { useSettings } from '../../context/SettingsContext'
import { fetchQuote } from '../../utils/api'
import { FALLBACK_QUOTES } from '../../utils/defaults'

function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

function randomFallback() {
  return FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)]
}

export default function Quote() {
  const [cache, setCache] = useLocalStorage('deadhydra:quote', null)
  const [loading, setLoading] = useState(false)
  const { isDark } = useSettings()

  const loadQuote = async (force = false) => {
    const key = todayKey()
    if (!force && cache && cache.dateKey === key) return
    setLoading(true)
    const remote = await fetchQuote()
    const quote = remote || randomFallback()
    setCache({ ...quote, dateKey: key })
    setLoading(false)
  }

  useEffect(() => {
    loadQuote()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      {cache ? (
        <blockquote>
          <p className={`text-sm leading-relaxed italic ${isDark ? 'text-bone' : 'text-void'}`}>“{cache.content}”</p>
          <footer className="mt-2 text-xs text-scale">— {cache.author}</footer>
        </blockquote>
      ) : (
        <p className="text-sm text-stone animate-pulse">Loading quote…</p>
      )}
      <button
        onClick={() => loadQuote(true)}
        disabled={loading}
        className="mt-3 text-xs text-stone hover:text-scale transition-colors"
      >
        {loading ? 'Refreshing…' : '↻ New quote'}
      </button>
    </div>
  )
}
