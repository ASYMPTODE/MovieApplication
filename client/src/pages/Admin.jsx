import React, { useEffect, useState } from 'react'
import { api } from '../api'
import { Box, Tabs, Tab, Grid, Card, CardContent, Typography, TextField, Button, IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'

function MoviesTab() {
  const [form, setForm] = useState({ title: '', year: '', genres: '', overview: '' })
  const [list, setList] = useState([])
  async function load() {
    const res = await api.get('/movies', { params: { limit: 100 } })
    setList(res.data.items)
  }
  useEffect(() => { load() }, [])
  function onChange(k, v) { setForm({ ...form, [k]: v }) }
  async function create() {
    const payload = { ...form, year: form.year ? Number(form.year) : undefined, genres: form.genres ? form.genres.split(',').map(s => s.trim()) : [] }
    await api.post('/movies', payload)
    setForm({ title: '', year: '', genres: '', overview: '' })
    await load()
  }
  async function remove(id) { await api.delete('/movies/' + id); await load() }
  return (
    <Box>
      <Box display="flex" gap={2} flexWrap="wrap" mb={2}>
        <TextField label="Title" value={form.title} onChange={e => onChange('title', e.target.value)} />
        <TextField label="Year" value={form.year} onChange={e => onChange('year', e.target.value)} />
        <TextField label="Genres (comma)" value={form.genres} onChange={e => onChange('genres', e.target.value)} />
        <TextField label="Overview" value={form.overview} onChange={e => onChange('overview', e.target.value)} sx={{ minWidth: 300 }} />
        <Button variant="contained" onClick={create}>Add Movie</Button>
      </Box>
      <Grid container spacing={2}>
        {list.map(m => (
          <Grid item xs={12} md={6} lg={4} key={m._id}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6">{m.title}</Typography>
                  <IconButton color="error" onClick={() => remove(m._id)}><DeleteIcon/></IconButton>
                </Box>
                <Typography variant="body2" color="text.secondary">{m.year} • {(m.genres||[]).join(', ')}</Typography>
                <Typography variant="body2" mt={1}>{m.overview}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}


export default function Admin() {
  const [tab, setTab] = useState(0)
  return (
    <Box p={2}>
      <Tabs value={tab} onChange={(e, v) => setTab(v)}>
        <Tab label="Movies" />
      </Tabs>
      <Box mt={2}>
        <MoviesTab/>
      </Box>
    </Box>
  )
}
