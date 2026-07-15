import { useEffect, useState } from 'react'
import { SettingsProvider, useSettings } from './context/SettingsContext'
import { useLocalStorage } from './hooks/useLocalStorage'
import { dailyPicsumUrl } from './utils/api'
import DashboardGrid from './components/DashboardGrid'
import SettingsPanel from './components/Settings'

function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

function Background() {
  const { settings, isDark } = useSettings()
  const [dailyCache, setDailyCache] = useLocalStorage('deadhydra:dailyBg', null)

  useEffect(() => {
    const key = todayKey()
    if (settings.backgroundType !== 'daily') return
    if (dailyCache && dailyCache.dateKey === key) return
    setDailyCache({ dateKey: key, url: dailyPicsumUrl(key) })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.backgroundType])

  if (!settings.backgroundEnabled || settings.backgroundType === 'none') {
    return <div className={`fixed inset-0 -z-10 ${isDark ? 'bg-void' : 'bg-card-light'}`} />
  }

  if (settings.backgroundType === 'color') {
    return <div className={`fixed inset-0 -z-10 ${isDark ? 'bg-void' : 'bg-card-light'}`} />
  }

  const imgUrl = settings.backgroundType === 'custom' ? settings.customBackground : dailyCache?.url

  if (!imgUrl) {
    return <div className={`fixed inset-0 -z-10 ${isDark ? 'bg-void' : 'bg-card-light'}`} />
  }

  return (
    <div className="fixed inset-0 -z-10">
      <img src={imgUrl} alt="" className="w-full h-full object-cover" />
      <div className={`absolute inset-0 ${isDark ? 'bg-void/70' : 'bg-white/50'}`} />
    </div>
  )
}

function DashboardShell() {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const { isDark, updateSetting } = useSettings()

  return (
    <div className="min-h-screen relative">
      <Background />

      <header className="flex justify-end px-5 pt-5">
        <button
          onClick={() => updateSetting('theme', isDark ? 'light' : 'dark')}
          className="mr-2 w-9 h-9 rounded-full glass flex items-center justify-center border border-scale/20 text-scale hover:text-scale-bright transition-colors"
          title="Toggle dark / light"
        >
          {isDark ? '☾' : '☀'}
        </button>
        <button
          onClick={() => setSettingsOpen(true)}
          className="w-9 h-9 rounded-full glass flex items-center justify-center border border-scale/20 text-scale hover:text-scale-bright transition-colors"
          title="Settings"
        >
          ⚙
        </button>
      </header>

      <main className="px-4 pb-16 pt-4">
        <DashboardGrid />
      </main>

      <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  )
}

export default function App() {
  return (
    <SettingsProvider>
      <DashboardShell />
    </SettingsProvider>
  )
}
