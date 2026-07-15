import { createContext, useContext, useEffect, useMemo } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { DEFAULT_SETTINGS } from '../utils/defaults'

const SettingsContext = createContext(null)

export function SettingsProvider({ children }) {
  const [settings, setSettings, resetSettings] = useLocalStorage('deadhydra:settings', DEFAULT_SETTINGS)

  // Merge in any new default keys added in later versions.
  useEffect(() => {
    setSettings((prev) => ({
      ...DEFAULT_SETTINGS,
      ...prev,
      widgetVisibility: { ...DEFAULT_SETTINGS.widgetVisibility, ...(prev.widgetVisibility || {}) },
    }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const updateWidgetVisibility = (widgetId, visible) => {
    setSettings((prev) => ({
      ...prev,
      widgetVisibility: { ...prev.widgetVisibility, [widgetId]: visible },
    }))
  }

  const isDark = useMemo(() => {
    if (settings.theme === 'dark') return true
    if (settings.theme === 'light') return false
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return true
  }, [settings.theme])

  useEffect(() => {
    document.documentElement.classList.toggle('light', !isDark)
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  const value = {
    settings,
    setSettings,
    updateSetting,
    updateWidgetVisibility,
    resetSettings,
    isDark,
  }

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export function useSettings() {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider')
  return ctx
}
