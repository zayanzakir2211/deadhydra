import { useSettings } from '../context/SettingsContext'

export default function WidgetCard({ title, dragHandleProps, children, className = '' }) {
  const { isDark } = useSettings()
  return (
    <div
      className={`glass scale-texture rounded-2xl border p-5 shadow-lg shadow-black/20 ${
        isDark ? 'bg-card/60 border-scale/15' : 'bg-white/70 border-black/10'
      } ${className}`}
    >
      {title && (
        <div className="flex items-center justify-between mb-3">
          <h2 className={`font-display text-xs uppercase tracking-[0.2em] ${isDark ? 'text-stone' : 'text-stone'}`}>
            {title}
          </h2>
          {dragHandleProps && (
            <span
              {...dragHandleProps}
              className="cursor-grab active:cursor-grabbing text-stone hover:text-scale px-1"
              title="Drag to reorder"
            >
              ⠿
            </span>
          )}
        </div>
      )}
      {children}
    </div>
  )
}
