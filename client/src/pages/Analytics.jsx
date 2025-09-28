import React, { useEffect, useState } from 'react'
import { api } from '../api'
import { Box, Paper, Typography, Grid } from '@mui/material'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

function Tile({ label, value }) {
  return (
    <Paper sx={{ p:2 }}>
      <Typography variant="caption">{label}</Typography>
      <Typography variant="h6">{typeof value === 'number' ? value.toFixed(2) : value}</Typography>
    </Paper>
  )
}

export default function Analytics() {
  const [data, setData] = useState(null)
  useEffect(() => { (async () => {
    const res = await api.get('/metrics/overview')
    setData(res.data)
  })() }, [])

  if (!data) return <Box p={2}>loading...</Box>
  const t = data.tiles
  const genres = data.chart?.topGenres || []
  const COLORS = ['#0288D1', '#26A69A', '#7E57C2', '#FF7043', '#29B6F6', '#66BB6A', '#AB47BC', '#FFA726', '#26C6DA', '#D4E157']
  return (
    <Box p={2}>
      <Grid container spacing={2}>
        <Grid item xs={6} md={3}><Tile label="Users" value={t.users} /></Grid>
        <Grid item xs={6} md={3}><Tile label="Movies" value={t.movies} /></Grid>
        <Grid item xs={6} md={3}><Tile label="Ratings" value={t.ratings} /></Grid>
        <Grid item xs={6} md={3}><Tile label="Avg ratings/user" value={t.avgRatingsPerUser} /></Grid>
      </Grid>
      <Box mt={3} height={360}>
        <Typography variant="h6" gutterBottom>Top Genres</Typography>
        <ResponsiveContainer>
          <PieChart>
            <Pie data={genres} dataKey="count" nameKey="_id" cx="50%" cy="50%" outerRadius={120} label>
              {genres.map((entry, index) => (
                <Cell key={`c-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  )
}
