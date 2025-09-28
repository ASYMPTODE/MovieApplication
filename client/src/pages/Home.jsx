import React, { useEffect, useState } from 'react'
import { api } from '../api'
import { Box, TextField, Button, Grid, Card, CardContent, Typography, Pagination, Rating, Stack } from '@mui/material'
import { useAuth } from '../AuthContext'
import { usePoster } from '../usePoster'

function MovieCard({ m, onRate }) {
  const poster = usePoster(m.title, m.year)
  return (
    <Card>
      <CardContent>
        {poster && <img src={poster} alt={m.title} style={{ width: '100%', height: 220, objectFit: 'cover', borderRadius: 6, marginBottom: 8 }} />}
        <Typography variant="h6">{m.title} ({m.year})</Typography>
        <Typography variant="body2">Genres: {(m.genres||[]).join(', ')}</Typography>
        <Typography variant="body2">Avg: {m.avgRating?.toFixed?.(2) || 0} ({m.ratingCount || 0})</Typography>
        <Stack direction="row" alignItems="center" spacing={1} mt={1}>
          <Rating value={0} onChange={(e, v) => onRate(m._id, v)} />
          <Typography variant="caption" color="text.secondary">Tap stars to rate</Typography>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default function Home() {
  const [q, setQ] = useState('')
  const [page, setPage] = useState(1)
  const [data, setData] = useState({ items: [], total: 0, limit: 20 })
  const { user } = useAuth()

  async function load() {
    const res = await api.get('/movies', { params: { q, page, limit: 8 } })
    setData(res.data)
  }
  useEffect(() => { load() }, [page])
  useEffect(() => {
    const t = setTimeout(() => { setPage(1); load() }, 300)
    return () => clearTimeout(t)
  }, [q])

  async function rate(movieId, value) {
    if (!user) return alert('please login first')
    await api.post('/ratings', { movieId, value })
    await load()
  }

  const pages = Math.max(1, Math.ceil((data.total || 0) / 8))
  return (
    <Box p={2}>
      <Typography variant="h5" mb={1}>Welcome {user?.name ? user.name : 'there'} 👋</Typography>
      <Typography variant="body2" color="text.secondary" mb={2}>Find a movie and leave a quick rating to get better recommendations.</Typography>
      <Box display="flex" gap={1} mb={2}>
        <TextField size="small" value={q} onChange={e => setQ(e.target.value)} placeholder="Search movies"
          sx={{ flex: 1, maxWidth: 480 }} />
        <Button variant="contained" onClick={() => { setPage(1); load() }}>Search</Button>
      </Box>
      <Grid container spacing={2}>
        {data.items.map(m => (
          <Grid item xs={12} md={6} lg={3} key={m._id}>
            <MovieCard m={m} onRate={rate} />
          </Grid>
        ))}
      </Grid>
      <Box mt={2} display="flex" justifyContent="center">
        <Pagination count={pages} page={page} onChange={(e, p) => setPage(p)} />
      </Box>
    </Box>
  )
}
