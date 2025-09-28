import React, { useEffect, useState } from 'react'
import { api } from '../api'
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material'

export default function Profile() {
  const [mine, setMine] = useState([])
  const [recs, setRecs] = useState([])
  useEffect(() => { (async () => {
    const r1 = await api.get('/ratings/me')
    setMine(r1.data.items.slice(0, 5))
    const r2 = await api.get('/recommendations/content')
    setRecs(r2.data.items.slice(0, 5))
  })() }, [])
  return (
    <Box p={2}>
      <Typography variant="h6">Recent Ratings</Typography>
      <List>
        {mine.map(r => <ListItem key={r._id}><ListItemText primary={r.movie?.title} secondary={`Rated ${r.value}`} /></ListItem>)}
      </List>
      <Typography variant="h6" mt={2}>Top Recommendations</Typography>
      <List>
        {recs.map(m => <ListItem key={m._id}><ListItemText primary={m.title} secondary={`Score ${m._score?.toFixed?.(3) || 0}`} /></ListItem>)}
      </List>
    </Box>
  )
}
