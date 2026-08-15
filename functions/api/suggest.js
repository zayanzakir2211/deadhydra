const MAX_RESULTS = 8

function normalizeEngine(engine) {
  if (engine === 'google' || engine === 'bing' || engine === 'duckduckgo') return engine
  return 'duckduckgo'
}

function uniqueLimited(values, limit = MAX_RESULTS) {
  const seen = new Set()
  const out = []

  for (const raw of values) {
    if (typeof raw !== 'string') continue
    const phrase = raw.trim()
    if (!phrase) continue

    const key = phrase.toLowerCase()
    if (seen.has(key)) continue

    seen.add(key)
    out.push(phrase)
    if (out.length >= limit) break
  }

  return out
}

async function fetchGoogleSuggestions(query) {
  const url = `https://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(query)}`
  const res = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'User-Agent': 'deadhydra-suggest/1.0',
    },
  })
  if (!res.ok) throw new Error('Google suggestion request failed')

  const data = await res.json()
  return Array.isArray(data?.[1]) ? data[1] : []
}

async function fetchBingSuggestions(query) {
  const url = `https://api.bing.com/osjson.aspx?query=${encodeURIComponent(query)}`
  const res = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'User-Agent': 'deadhydra-suggest/1.0',
    },
  })
  if (!res.ok) throw new Error('Bing suggestion request failed')

  const data = await res.json()
  return Array.isArray(data?.[1]) ? data[1] : []
}

async function fetchDuckDuckGoSuggestions(query) {
  const url = `https://duckduckgo.com/ac/?q=${encodeURIComponent(query)}&type=list`
  const res = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'User-Agent': 'deadhydra-suggest/1.0',
    },
  })
  if (!res.ok) throw new Error('DuckDuckGo suggestion request failed')

  const data = await res.json()
  return Array.isArray(data) ? data.map((item) => item?.phrase) : []
}

async function fetchByEngine(engine, query) {
  if (engine === 'google') return fetchGoogleSuggestions(query)
  if (engine === 'bing') return fetchBingSuggestions(query)
  return fetchDuckDuckGoSuggestions(query)
}

export async function onRequestGet(context) {
  const { searchParams } = new URL(context.request.url)
  const query = (searchParams.get('q') || '').trim()
  const engine = normalizeEngine((searchParams.get('engine') || '').toLowerCase())

  if (query.length < 2) {
    return Response.json(
      {
        engine,
        usedFallback: false,
        suggestions: [],
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60',
        },
      },
    )
  }

  try {
    const primary = await fetchByEngine(engine, query)
    const normalized = uniqueLimited(primary)

    if (normalized.length > 0) {
      return Response.json(
        {
          engine,
          usedFallback: false,
          suggestions: normalized,
        },
        {
          headers: {
            'Cache-Control': 'public, s-maxage=120',
          },
        },
      )
    }
  } catch {
    // Fallback to DuckDuckGo below.
  }

  try {
    const fallback = await fetchDuckDuckGoSuggestions(query)
    return Response.json(
      {
        engine: 'duckduckgo',
        usedFallback: true,
        suggestions: uniqueLimited(fallback),
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=120',
        },
      },
    )
  } catch {
    return Response.json(
      {
        engine: 'duckduckgo',
        usedFallback: true,
        suggestions: [],
      },
      {
        status: 502,
        headers: {
          'Cache-Control': 'no-store',
        },
      },
    )
  }
}
