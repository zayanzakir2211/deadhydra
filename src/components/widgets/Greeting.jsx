import { useEffect, useState } from 'react'
import { useSettings } from '../../context/SettingsContext'

function getGreetingWord(hour) {
  if (hour < 5) return 'Good night'
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

export default function Greeting() {
  const { settings, isDark } = useSettings()
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const hours24 = now.getHours()
  const greeting = getGreetingWord(hours24)

  let hourDisplay = hours24
  let suffix = ''
  if (!settings.clock24h) {
    suffix = hours24 >= 12 ? ' PM' : ' AM'
    hourDisplay = hours24 % 12 || 12
  }
  const mm = String(now.getMinutes()).padStart(2, '0')
  const ss = String(now.getSeconds()).padStart(2, '0')
  const timeStr = `${String(hourDisplay).padStart(settings.clock24h ? 2 : 1, '0')}:${mm}:${ss}${suffix}`

  const dateStr = now.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="text-center py-6">
      <p className={`font-display text-2xl sm:text-3xl tracking-tight ${isDark ? 'text-bone' : 'text-void'}`}>
        {greeting}, <span className="text-scale-bright">{settings.displayName || 'there'}</span>
      </p>
      <p className={`font-mono text-5xl sm:text-6xl mt-3 tabular-nums ${isDark ? 'text-scale-bright' : 'text-scale'}`}>
        {timeStr}
      </p>
      <p className={`mt-2 text-sm ${isDark ? 'text-stone' : 'text-stone'}`}>{dateStr}</p>
    </div>
  )
}
