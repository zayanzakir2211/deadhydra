import { useState } from 'react'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { useSettings } from '../../context/SettingsContext'
import { DEFAULT_LINKS } from '../../utils/defaults'

function faviconUrl(url) {
  try {
    const domain = new URL(url).hostname
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`
  } catch {
    return ''
  }
}

export default function QuickLinks() {
  const [links, setLinks] = useLocalStorage('deadhydra:links', DEFAULT_LINKS)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [label, setLabel] = useState('')
  const [url, setUrl] = useState('')
  const { isDark } = useSettings()

  const openForm = (link) => {
    if (link) {
      setEditingId(link.id)
      setLabel(link.label)
      setUrl(link.url)
    } else {
      setEditingId(null)
      setLabel('')
      setUrl('')
    }
    setShowForm(true)
  }

  const saveLink = (e) => {
    e.preventDefault()
    if (!label.trim() || !url.trim()) return
    let normalizedUrl = url.trim()
    if (!/^https?:\/\//i.test(normalizedUrl)) normalizedUrl = `https://${normalizedUrl}`

    if (editingId) {
      setLinks((prev) => prev.map((l) => (l.id === editingId ? { ...l, label: label.trim(), url: normalizedUrl } : l)))
    } else {
      setLinks((prev) => [...prev, { id: Date.now().toString(), label: label.trim(), url: normalizedUrl }])
    }
    setShowForm(false)
  }

  const deleteLink = (id) => {
    setLinks((prev) => prev.filter((l) => l.id !== id))
  }

  const tileClasses = isDark
    ? 'bg-swamp/60 border-scale/15 hover:border-scale'
    : 'bg-white/60 border-black/10 hover:border-scale'

  return (
    <div>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">
        {links.map((link) => (
          <div key={link.id} className="relative group">
            <a
              href={link.url}
              className={`flex flex-col items-center gap-1 rounded-xl border px-2 py-3 text-center transition-colors ${tileClasses}`}
            >
              <img src={faviconUrl(link.url)} alt="" className="w-6 h-6 rounded" onError={(e) => (e.target.style.visibility = 'hidden')} />
              <span className={`text-xs truncate w-full ${isDark ? 'text-bone' : 'text-void'}`}>{link.label}</span>
            </a>
            <div className="absolute -top-1 -right-1 hidden group-hover:flex gap-1">
              <button
                onClick={() => openForm(link)}
                className="w-5 h-5 rounded-full bg-scale text-void text-[10px] flex items-center justify-center"
                title="Edit"
              >
                ✎
              </button>
              <button
                onClick={() => deleteLink(link.id)}
                className="w-5 h-5 rounded-full bg-rust text-bone text-[10px] flex items-center justify-center"
                title="Delete"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
        <button
          onClick={() => openForm(null)}
          className={`flex flex-col items-center justify-center gap-1 rounded-xl border border-dashed px-2 py-3 text-stone hover:text-scale hover:border-scale transition-colors ${
            isDark ? 'border-scale/20' : 'border-black/15'
          }`}
        >
          <span className="text-lg leading-none">+</span>
          <span className="text-xs">Add</span>
        </button>
      </div>

      {showForm && (
        <form onSubmit={saveLink} className="flex flex-col gap-2 text-sm">
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Label"
            className={`rounded-lg border px-3 py-2 outline-none focus:border-scale ${
              isDark ? 'bg-swamp/60 border-scale/20 text-bone' : 'bg-white/70 border-black/10 text-void'
            }`}
          />
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="URL"
            className={`rounded-lg border px-3 py-2 outline-none focus:border-scale ${
              isDark ? 'bg-swamp/60 border-scale/20 text-bone' : 'bg-white/70 border-black/10 text-void'
            }`}
          />
          <div className="flex gap-2">
            <button type="submit" className="flex-1 rounded-lg bg-scale text-void py-1.5 hover:bg-scale-bright">
              Save
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="flex-1 rounded-lg border border-stone/30 text-stone py-1.5 hover:text-bone"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
