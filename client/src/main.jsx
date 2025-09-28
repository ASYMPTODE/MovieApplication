import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom'
import { AppBar, Toolbar, Button, Box } from '@mui/material'
import Home from './pages/Home'
import MyRatings from './pages/MyRatings'
import Recs from './pages/Recs'
import Analytics from './pages/Analytics'
import Profile from './pages/Profile'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import { AuthProvider, useAuth } from './AuthContext'
import { ThemeProvider } from '@mui/material/styles'
import { theme } from './theme'
import Admin from './pages/Admin'

function LoginBox() {
  const { user, logout, isAdmin } = useAuth()
  if (user) {
    return <Box display="flex" gap={1} alignItems="center">
      <span style={{ fontSize: 14, fontWeight: 600 }}>{user.name || user.email}</span>
      {isAdmin && <Button color="inherit" component={Link} to="/admin">Admin</Button>}
      <Button color="inherit" onClick={logout}>Logout</Button>
    </Box>
  }
  return (
    <Box display="flex" gap={1}>
      <Button color="inherit" component={Link} to="/signin">Sign In</Button>
      <Button color="inherit" component={Link} to="/signup" variant="outlined" sx={{ borderColor: 'white', color: 'white' }}>Sign Up</Button>
    </Box>
  )
}

function App() {
  const { isAdmin } = useAuth()
  return (
    <BrowserRouter>
      <AppBar position="static" color="primary">
        <Toolbar sx={{ display: 'flex', gap: 2 }}>
          <Button color="inherit" component={Link} to="/">Home</Button>
          <Button color="inherit" component={Link} to="/ratings">My Ratings</Button>
          <Button color="inherit" component={Link} to="/profile">Profile</Button>
          <Button color="inherit" component={Link} to="/recs">Recommendations</Button>
          {isAdmin && <Button color="inherit" component={Link} to="/analytics">Analytics</Button>}
          <Box sx={{ flex: 1 }} />
          <LoginBox />
        </Toolbar>
      </AppBar>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/ratings" element={<MyRatings/>} />
        <Route path="/recs" element={<Recs/>} />
        <Route path="/analytics" element={<Analytics/>} />
        <Route path="/profile" element={<Profile/>} />
        <Route path="/signin" element={<SignIn/>} />
        <Route path="/signup" element={<SignUp/>} />
        <Route path="/admin" element={<Admin/>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </AuthProvider>
)
