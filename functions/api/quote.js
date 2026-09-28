export async function onRequestGet() {
  try {
    const response = await fetch('https://zenquotes.io/api/random')
    if (!response.ok) {
      return Response.json({ error: 'Quote request failed' }, { status: 502 })
    }

    const data = await response.json()
    const quote = data?.[0]
    if (!quote?.q) {
      return Response.json({ error: 'Bad quote payload' }, { status: 502 })
    }

    return Response.json({ content: quote.q, author: quote.a || 'Unknown' }, {
      headers: { 'Cache-Control': 'no-store' },
    })
  } catch {
    return Response.json({ error: 'Quote service unavailable' }, { status: 502 })
  }
}