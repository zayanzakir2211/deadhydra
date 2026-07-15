import { useRef } from 'react'
import { useSettings } from '../context/SettingsContext'
import { SEARCH_ENGINES } from '../utils/defaults'

const WIDGET_LABELS = {
  greeting: 'Greeting & clock',
  search: 'Search bar',
  todos: 'Todo list',
  links: 'Quick links',
  weather: 'Weather',
  quote: 'Quote of the day',
  pomodoro: 'Focus timer',
}

const MAX_IMAGE_DIMENSION = 1920

function resizeImageFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        let { width, height } = img
        if (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) {
          const scale = MAX_IMAGE_DIMENSION / Math.max(width, height)
          width = Math.round(width * scale)
          height = Math.round(height * scale)
        }
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL('image/jpeg', 0.8))
      }
      img.onerror = reject
      img.src = reader.result
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export default function Settings({ open, onClose }) {
  const { settings, updateSetting, updateWidgetVisibility, resetSettings, isDark } = useSettings()
  const fileInputRef = useRef(null)

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const dataUrl = await resizeImageFile(file)
      if (dataUrl.length > 4_000_000) {
        alert('Image is still too large after compression. Try a smaller image.')
        return
      }
      updateSetting('customBackground', dataUrl)
      updateSetting('backgroundType', 'custom')
    } catch {
      alert('Could not process that image.')
    }
  }

  const handleReset = () => {
    if (confirm('Reset all settings to default? This will not clear todos or links.')) {
      resetSettings()
    }
  }

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      />
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-sm z-50 overflow-y-auto transition-transform duration-300 glass ${
          isDark ? 'bg-swamp/95 border-l border-scale/20' : 'bg-card-light/95 border-l border-black/10'
        } ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-5">
          <div className="flex items-center justify-between mb-6">
            <h2 className={`font-display text-lg ${isDark ? 'text-bone' : 'text-void'}`}>Settings</h2>
            <button onClick={onClose} className="text-stone hover:text-rust text-xl leading-none">
              ✕
            </button>
          </div>

          <Section title="General" isDark={isDark}>
            <Field label="Display name" isDark={isDark}>
              <input
                value={settings.displayName}
                onChange={(e) => updateSetting('displayName', e.target.value)}
                className={inputCls(isDark)}
              />
            </Field>
            <Toggle
              label="24-hour clock"
              checked={settings.clock24h}
              onChange={(v) => updateSetting('clock24h', v)}
              isDark={isDark}
            />
          </Section>

          <Section title="Search" isDark={isDark}>
            <Field label="Search engine" isDark={isDark}>
              <select
                value={settings.searchEngine}
                onChange={(e) => updateSetting('searchEngine', e.target.value)}
                className={inputCls(isDark)}
              >
                {Object.entries(SEARCH_ENGINES).map(([key, e]) => (
                  <option key={key} value={key}>
                    {e.label}
                  </option>
                ))}
              </select>
            </Field>
          </Section>

          <Section title="Weather" isDark={isDark}>
            <Field label="Temperature unit" isDark={isDark}>
              <select
                value={settings.tempUnit}
                onChange={(e) => updateSetting('tempUnit', e.target.value)}
                className={inputCls(isDark)}
              >
                <option value="c">Celsius (°C)</option>
                <option value="f">Fahrenheit (°F)</option>
              </select>
            </Field>
            <Field label="Manual city override" isDark={isDark}>
              <input
                value={settings.manualCity}
                onChange={(e) => updateSetting('manualCity', e.target.value)}
                placeholder="Leave blank to use location"
                className={inputCls(isDark)}
              />
            </Field>
          </Section>

          <Section title="Appearance" isDark={isDark}>
            <Field label="Theme" isDark={isDark}>
              <select
                value={settings.theme}
                onChange={(e) => updateSetting('theme', e.target.value)}
                className={inputCls(isDark)}
              >
                <option value="system">System</option>
                <option value="dark">Dark</option>
                <option value="light">Light</option>
              </select>
            </Field>
            <Field label="Background type" isDark={isDark}>
              <select
                value={settings.backgroundType}
                onChange={(e) => updateSetting('backgroundType', e.target.value)}
                className={inputCls(isDark)}
              >
                <option value="daily">Daily photo</option>
                <option value="custom">Custom upload</option>
                <option value="color">Solid color</option>
                <option value="none">None</option>
              </select>
            </Field>
            {settings.backgroundType === 'custom' && (
              <Field label="Upload image" isDark={isDark}>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="text-xs text-stone" />
              </Field>
            )}
          </Section>

          <Section title="Widgets" isDark={isDark}>
            {Object.entries(WIDGET_LABELS).map(([id, label]) => (
              <Toggle
                key={id}
                label={label}
                checked={settings.widgetVisibility[id] ?? true}
                onChange={(v) => updateWidgetVisibility(id, v)}
                isDark={isDark}
              />
            ))}
          </Section>

          <Section title="Focus timer" isDark={isDark}>
            <Field label="Work (min)" isDark={isDark}>
              <input
                type="number"
                min="1"
                value={settings.pomodoroWork}
                onChange={(e) => updateSetting('pomodoroWork', Number(e.target.value) || 1)}
                className={inputCls(isDark)}
              />
            </Field>
            <Field label="Short break (min)" isDark={isDark}>
              <input
                type="number"
                min="1"
                value={settings.pomodoroShortBreak}
                onChange={(e) => updateSetting('pomodoroShortBreak', Number(e.target.value) || 1)}
                className={inputCls(isDark)}
              />
            </Field>
            <Field label="Long break (min)" isDark={isDark}>
              <input
                type="number"
                min="1"
                value={settings.pomodoroLongBreak}
                onChange={(e) => updateSetting('pomodoroLongBreak', Number(e.target.value) || 1)}
                className={inputCls(isDark)}
              />
            </Field>
          </Section>

          <button
            onClick={handleReset}
            className="w-full mt-4 rounded-lg border border-rust/50 text-rust py-2 text-sm hover:bg-rust/10 transition-colors"
          >
            Reset all settings to default
          </button>
        </div>
      </aside>
    </>
  )
}

function Section({ title, isDark, children }) {
  return (
    <div className="mb-6">
      <h3 className={`text-xs uppercase tracking-[0.2em] mb-2 ${isDark ? 'text-scale' : 'text-scale'}`}>{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  )
}

function Field({ label, isDark, children }) {
  return (
    <label className="block">
      <span className={`block text-xs mb-1 ${isDark ? 'text-stone' : 'text-stone'}`}>{label}</span>
      {children}
    </label>
  )
}

function Toggle({ label, checked, onChange, isDark }) {
  return (
    <label className="flex items-center justify-between text-sm cursor-pointer">
      <span className={isDark ? 'text-bone' : 'text-void'}>{label}</span>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="accent-scale w-4 h-4" />
    </label>
  )
}

function inputCls(isDark) {
  return `w-full rounded-lg border px-3 py-1.5 text-sm outline-none focus:border-scale ${
    isDark ? 'bg-swamp/60 border-scale/20 text-bone' : 'bg-white/70 border-black/10 text-void'
  }`
}
