import { useEffect, useState } from 'react'
import { useSettings } from '../../context/SettingsContext'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { fetchWeatherByCoords, geocodeCity, describeWeatherCode } from '../../utils/api'

const CACHE_KEY = 'deadhydra:weatherCache'
const CACHE_TTL_MS = 1000 * 60 * 30 // 30 min

// Hardcoded fallback location (used unless a manual city is set in Settings).
const FIXED_LOCATION = { lat: 23.54547, lon: 89.178315 }

function toF(c) {
  return (c * 9) / 5 + 32
}

const ICONS = {
  sun: '☀️',
  'cloud-sun': '⛅',
  cloud: '☁️',
  fog: '🌫️',
  drizzle: '🌦️',
  rain: '🌧️',
  snow: '🌨️',
  storm: '⛈️',
}

export default function Weather() {
  const { settings, isDark } = useSettings()
  const [cache, setCache] = useLocalStorage(CACHE_KEY, null)
  const [error, setError] = useState(null)
  const useManualCity = Boolean(settings.manualCity)
  const coords = FIXED_LOCATION

  useEffect(() => {
    let cancelled = false

    async function load() {
      const now = Date.now()
      const cacheKeyLabel = useManualCity ? settings.manualCity : `${coords.lat.toFixed(2)},${coords.lon.toFixed(2)}`
      if (
        cache &&
        cache.locationKey === cacheKeyLabel &&
        now - cache.timestamp < CACHE_TTL_MS
      ) {
        return
      }

      try {
        let lat, lon, placeName
        if (useManualCity) {
          const geo = await geocodeCity(settings.manualCity)
          lat = geo.lat
          lon = geo.lon
          placeName = geo.name
        } else {
          lat = coords.lat
          lon = coords.lon
          placeName = 'Jhenaidah, BD'
        }
        const w = await fetchWeatherByCoords(lat, lon)
        if (!cancelled) {
          setCache({ ...w, placeName, locationKey: cacheKeyLabel, timestamp: now })
          setError(null)
        }
      } catch (err) {
        if (!cancelled) setError(err.message)
      }
    }

    load()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coords, useManualCity, settings.manualCity])

  const isF = settings.tempUnit === 'f'
  const format = (c) => Math.round(isF ? toF(c) : c)

  if (!cache && error) {
    return <p className="text-sm text-stone">Weather unavailable. {error}</p>
  }

  if (!cache) {
    return <p className="text-sm text-stone animate-pulse">Fetching weather…</p>
  }

  const { label, icon } = describeWeatherCode(cache.code)

  return (
    <div className="flex items-center justify-between">
      <div>
        <p className={`text-4xl font-display ${isDark ? 'text-bone' : 'text-void'}`}>
          {format(cache.temp)}°{isF ? 'F' : 'C'}
        </p>
        <p className="text-sm text-stone">{label}</p>
        <p className="text-xs text-stone mt-1">
          H {format(cache.high)}° / L {format(cache.low)}°
        </p>
        <p className="text-xs text-scale mt-1">{cache.placeName}</p>
      </div>
      <div className="text-5xl" aria-hidden>
        {ICONS[icon] || '☁️'}
      </div>
    </div>
  )
}