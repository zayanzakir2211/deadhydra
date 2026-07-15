import { useEffect, useRef, useState } from 'react'
import { useSettings } from '../../context/SettingsContext'
import { useLocalStorage } from '../../hooks/useLocalStorage'

const MODES = {
  work: { label: 'Focus', key: 'pomodoroWork' },
  short: { label: 'Short break', key: 'pomodoroShortBreak' },
  long: { label: 'Long break', key: 'pomodoroLongBreak' },
}

function playChime() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.value = 660
    gain.gain.setValueAtTime(0.2, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + 1.2)
  } catch {
    // ignore audio failures
  }
}

export default function PomodoroTimer() {
  const { settings, isDark } = useSettings()
  const [mode, setMode] = useState('work')
  const durationMin = settings[MODES[mode].key]
  const [secondsLeft, setSecondsLeft] = useState(durationMin * 60)
  const [running, setRunning] = useState(false)
  const [sessions, setSessions] = useLocalStorage('deadhydra:pomodoroSessions', { date: '', count: 0 })
  const intervalRef = useRef(null)

  // Reset countdown when duration/mode changes and timer isn't running
  useEffect(() => {
    if (!running) setSecondsLeft(durationMin * 60)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [durationMin, mode])

  useEffect(() => {
    if (!running) return
    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(intervalRef.current)
          setRunning(false)
          handleComplete()
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running])

  const handleComplete = () => {
    playChime()
    if (Notification && Notification.permission === 'granted') {
      new Notification('Deadhydra', { body: `${MODES[mode].label} session complete.` })
    }
    if (mode === 'work') {
      const today = new Date().toISOString().slice(0, 10)
      setSessions((prev) => (prev.date === today ? { date: today, count: prev.count + 1 } : { date: today, count: 1 }))
    }
  }

  const toggle = () => {
    if (!running && Notification && Notification.permission === 'default') {
      Notification.requestPermission()
    }
    setRunning((r) => !r)
  }

  const reset = () => {
    setRunning(false)
    setSecondsLeft(durationMin * 60)
  }

  const switchMode = (m) => {
    setRunning(false)
    setMode(m)
  }

  const total = durationMin * 60
  const progress = total > 0 ? (total - secondsLeft) / total : 0
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - progress)

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0')
  const ss = String(secondsLeft % 60).padStart(2, '0')

  const today = new Date().toISOString().slice(0, 10)
  const todaySessions = sessions.date === today ? sessions.count : 0

  return (
    <div className="flex flex-col items-center">
      <div className="flex gap-1 mb-4 text-xs">
        {Object.entries(MODES).map(([key, m]) => (
          <button
            key={key}
            onClick={() => switchMode(key)}
            className={`px-2 py-1 rounded-full transition-colors ${
              mode === key ? 'bg-scale text-void' : 'text-stone hover:text-scale'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="relative w-32 h-32">
        <svg viewBox="0 0 120 120" className="w-32 h-32 -rotate-90">
          <circle cx="60" cy="60" r={radius} fill="none" stroke={isDark ? '#1e332c' : '#e5ded0'} strokeWidth="8" />
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke={mode === 'work' ? '#c4443a' : '#4c9a82'}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={running ? 'animate-ember' : ''}
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`font-mono text-2xl tabular-nums ${isDark ? 'text-bone' : 'text-void'}`}>
            {mm}:{ss}
          </span>
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <button
          onClick={toggle}
          className="rounded-lg px-4 py-1.5 text-sm font-medium bg-scale text-void hover:bg-scale-bright transition-colors"
        >
          {running ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={reset}
          className="rounded-lg px-4 py-1.5 text-sm border border-stone/30 text-stone hover:text-bone transition-colors"
        >
          Reset
        </button>
      </div>

      <p className="mt-3 text-xs text-stone">{todaySessions} focus session{todaySessions === 1 ? '' : 's'} today</p>
    </div>
  )
}
