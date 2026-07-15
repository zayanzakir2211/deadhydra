import { useState, useEffect } from 'react'

export function useGeolocation({ enabled = true } = {}) {
  const [coords, setCoords] = useState(null)
  const [error, setError] = useState(null)
  const [status, setStatus] = useState('idle') // idle | loading | success | error

  useEffect(() => {
    if (!enabled) return
    if (!('geolocation' in navigator)) {
      setError('Geolocation not supported')
      setStatus('error')
      return
    }
    setStatus('loading')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude })
        setStatus('success')
      },
      (err) => {
        setError(err.message)
        setStatus('error')
      },
      { timeout: 8000, maximumAge: 1000 * 60 * 60 }
    )
  }, [enabled])

  return { coords, error, status }
}
