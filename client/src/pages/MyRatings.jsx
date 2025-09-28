import React, { useEffect, useState } from 'react'
import { api } from '../api'
import { Box, Table, TableHead, TableRow, TableCell, TableBody, IconButton, Button, Rating, Typography } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'

export default function MyRatings() {
  const [rows, setRows] = useState([])
  useEffect(() => { load() }, [])
  async function load() {
    const res = await api.get('/ratings/me')
    setRows(res.data.items)
  }
  async function update(id, movieId, value) {
    await api.post('/ratings', { movieId, value })
    await load()
  }
  async function remove(id) {
    await api.delete('/ratings/' + id)
    await load()
  }
  return (
    <Box p={2}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Movie</TableCell>
            <TableCell>Value</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(r => (
            <TableRow key={r._id}>
              <TableCell>{r.movie?.title}</TableCell>
              <TableCell>
                <Rating value={r.value} onChange={(e, v) => setRows(rows.map(x => x._id===r._id? { ...x, value: v||1 }: x))} />
                
              </TableCell>
              <TableCell align="right">
                <IconButton color="error" onClick={() => remove(r._id)}><DeleteIcon/></IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  )
}
