import { useEffect, useState } from 'react'

// OMDb usage: set VITE_OMDB_API_KEY in client/.env
// We search by title and year and return Poster URL when available.

export function usePoster(title, year) {
  const [url, setUrl] = useState('')
  useEffect(() => {
    let cancel = false
    async function run() {
      try {
        const key = import.meta.env.VITE_OMDB_API_KEY
        if (!key || !title) return
        const q = encodeURIComponent(title)
        const y = year ? `&y=${encodeURIComponent(year)}` : ''
        const res = await fetch(`https://www.omdbapi.com/?apikey=${key}&t=${q}${y}`)
        const data = await res.json()
        if (!cancel && data && data.Response === 'True' && data.Poster && data.Poster !== 'N/A') {
          setUrl(data.Poster)
        }
      } catch {}
    }
    run()
    return () => { cancel = true }
  }, [title, year])
  return url
}
