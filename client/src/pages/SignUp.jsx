import React, { useState } from 'react'
import { Box, Paper, Typography, TextField, Button } from '@mui/material'
import { useAuth } from '../AuthContext'
import { useNavigate, Link } from 'react-router-dom'

export default function SignUp() {
  const { signup } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  async function submit(e) {
    e.preventDefault()
    try {
      await signup(name, email, password)
      navigate('/')
    } catch (e) {
      setError('Could not sign up')
    }
  }
  return (
    <Box display="flex" justifyContent="center" mt={6}>
      <Paper sx={{ p:4, width: 360 }}>
        <Typography variant="h5" mb={2}>Sign Up</Typography>
        <form onSubmit={submit}>
          <TextField label="Name" fullWidth margin="normal" value={name} onChange={e => setName(e.target.value)} />
          <TextField label="Email" fullWidth margin="normal" value={email} onChange={e => setEmail(e.target.value)} />
          <TextField label="Password" type="password" fullWidth margin="normal" value={password} onChange={e => setPassword(e.target.value)} />
          {error && <Typography color="error" variant="body2">{error}</Typography>}
          <Button type="submit" variant="contained" fullWidth sx={{ mt:2 }}>Create Account</Button>
        </form>
        <Typography variant="body2" mt={2}>Already have an account? <Link to="/signin">Sign In</Link></Typography>
      </Paper>
    </Box>
  )
}
