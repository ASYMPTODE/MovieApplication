import React, { createContext, useContext, useEffect, useState } from 'react'
import { api } from './api'

const Ctx = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const s = localStorage.getItem('user');
    return s ? JSON.parse(s) : null;
  })

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user))
    else localStorage.removeItem('user')
  }, [user])

  async function signup(name, email, password) {
    const res = await api.post('/auth/signup', { name, email, password })
    setUser(res.data)
  }
  async function login(email, password) {
    const res = await api.post('/auth/login', { email, password })
    setUser(res.data)
  }
  function logout() { setUser(null) }

  const isAdmin = !!user && user.role === 'admin'
  return <Ctx.Provider value={{ user, isAdmin, signup, login, logout }}>{children}</Ctx.Provider>
}

export function useAuth() { return useContext(Ctx) }
