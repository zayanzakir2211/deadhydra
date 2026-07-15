import { useState, useEffect, useCallback } from 'react'

function readValue(key, defaultValue) {
  if (typeof window === 'undefined') return defaultValue
  try {
    const item = window.localStorage.getItem(key)
    return item !== null ? JSON.parse(item) : defaultValue
  } catch (err) {
    console.warn(`useLocalStorage: failed to read "${key}"`, err)
    return defaultValue
  }
}

export function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => readValue(key, defaultValue))

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (err) {
      console.warn(`useLocalStorage: failed to write "${key}"`, err)
    }
  }, [key, value])

  const remove = useCallback(() => {
    try {
      window.localStorage.removeItem(key)
      setValue(defaultValue)
    } catch (err) {
      console.warn(`useLocalStorage: failed to remove "${key}"`, err)
    }
  }, [key, defaultValue])

  return [value, setValue, remove]
}
