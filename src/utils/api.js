// Weather + quote fetch helpers. All calls are keyless/free-tier.

const WEATHER_CODE_MAP = {
  0: { label: 'Clear sky', icon: 'sun' },
  1: { label: 'Mostly clear', icon: 'sun' },
  2: { label: 'Partly cloudy', icon: 'cloud-sun' },
  3: { label: 'Overcast', icon: 'cloud' },
  45: { label: 'Fog', icon: 'fog' },
  48: { label: 'Rime fog', icon: 'fog' },
  51: { label: 'Light drizzle', icon: 'drizzle' },
  53: { label: 'Drizzle', icon: 'drizzle' },
  55: { label: 'Heavy drizzle', icon: 'drizzle' },
  61: { label: 'Light rain', icon: 'rain' },
  63: { label: 'Rain', icon: 'rain' },
  65: { label: 'Heavy rain', icon: 'rain' },
  71: { label: 'Light snow', icon: 'snow' },
  73: { label: 'Snow', icon: 'snow' },
  75: { label: 'Heavy snow', icon: 'snow' },
  80: { label: 'Rain showers', icon: 'rain' },
  81: { label: 'Rain showers', icon: 'rain' },
  82: { label: 'Violent showers', icon: 'rain' },
  95: { label: 'Thunderstorm', icon: 'storm' },
  96: { label: 'Thunderstorm + hail', icon: 'storm' },
  99: { label: 'Thunderstorm + hail', icon: 'storm' },
}

export function describeWeatherCode(code) {
  return WEATHER_CODE_MAP[code] || { label: 'Unknown', icon: 'cloud' }
}

export async function fetchWeatherByCoords(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=auto`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Weather request failed')
  const data = await res.json()
  return {
    temp: data.current.temperature_2m,
    code: data.current.weather_code,
    high: data.daily.temperature_2m_max[0],
    low: data.daily.temperature_2m_min[0],
  }
}

export async function geocodeCity(city) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Geocoding failed')
  const data = await res.json()
  if (!data.results || !data.results.length) throw new Error('City not found')
  const { latitude, longitude, name, country } = data.results[0]
  return { lat: latitude, lon: longitude, name, country }
}

export async function fetchQuote() {
  try {
    const res = await fetch('/api/quote')
    if (!res.ok) throw new Error('Quote request failed')
    const quote = await res.json()
    if (!quote || !quote.content) throw new Error('Bad quote payload')
    return quote
  } catch {
    return null
  }
}

export function dailyPicsumUrl(seedDateKey) {
  // Picsum supports a seed param so the same "day" gets the same photo.
  return `https://picsum.photos/seed/${encodeURIComponent(seedDateKey)}/1920/1080`
}

export async function fetchSearchSuggestions(query, engine, signal) {
  const q = query.trim()
  if (q.length < 2) return []

  const url = `/api/suggest?q=${encodeURIComponent(q)}&engine=${encodeURIComponent(engine || 'duckduckgo')}`
  const res = await fetch(url, { signal })
  if (!res.ok) throw new Error('Suggestion request failed')

  const data = await res.json()
  return Array.isArray(data?.suggestions) ? data.suggestions : []
}
