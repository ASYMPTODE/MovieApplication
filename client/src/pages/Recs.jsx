import React, { useEffect, useState } from 'react'
import { api } from '../api'
import { Box, Tabs, Tab, Card, CardContent, Typography, Grid } from '@mui/material'
import { usePoster } from '../usePoster'

function ItemCard({ m }) {
  const poster = usePoster(m.title, m.year)
  return (
    <Card>
      <CardContent>
        {poster && <img src={poster} alt={m.title} style={{ width:'100%', height:220, objectFit:'cover', borderRadius:6, marginBottom:8 }} />}
        <Typography variant="h6">{m.title}</Typography>
        <Typography variant="body2">Score: {m._score?.toFixed?.(3) || 0}</Typography>
      </CardContent>
    </Card>
  )
}

function List({ items }) {
  return (
    <Grid container spacing={2}>
      {items.map(m => (
        <Grid item xs={12} md={6} lg={3} key={m._id}>
          <ItemCard m={m} />
        </Grid>
      ))}
    </Grid>
  )
}

export default function Recs() {
  const [tab, setTab] = useState(0)
  const [content, setContent] = useState([])
  const [cf, setCf] = useState([])

  useEffect(() => { (async () => {
    const r1 = await api.get('/recommendations/content');
    setContent(r1.data.items);
    const r2 = await api.get('/recommendations/cf');
    setCf(r2.data.items);
  })() }, [])

  return (
    <Box p={2}>
      <Tabs value={tab} onChange={(e, v) => setTab(v)}>
        <Tab label="Content-based" />
        <Tab label="Collaborative" />
      </Tabs>
      <Box mt={2}>
        {tab === 0 ? <List items={content} /> : <List items={cf} />}
      </Box>
    </Box>
  )
}
