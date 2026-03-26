import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('authToken'))
  const [loading, setLoading] = useState(true)

  const logout = useCallback(() => {
    localStorage.removeItem('authToken')
    setToken(null)
    setUser(null)
    window.location.href = '/booking'
  }, [])

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }
    fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => {
        if (!r.ok) throw new Error('Invalid token')
        return r.json()
      })
      .then(u => { setUser(u); setLoading(false) })
      .catch(() => { logout(); setLoading(false) })
  }, [token, logout])

  const login = async (email, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Login failed')
    localStorage.setItem('authToken', data.token)
    setToken(data.token)
    setUser(data.user)
    return data.user
  }

  const signup = async (email, password, role, firstName, lastName) => {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role, firstName, lastName }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Signup failed')
    localStorage.setItem('authToken', data.token)
    setToken(data.token)
    setUser(data.user)
    return data.user
  }

  const authFetch = useCallback(async (url, options = {}) => {
    const headers = { ...options.headers, Authorization: `Bearer ${token}` }
    if (options.body && typeof options.body === 'string') {
      headers['Content-Type'] = headers['Content-Type'] || 'application/json'
    }
    const res = await fetch(url, { ...options, headers })
    if (res.status === 401) { logout(); throw new Error('Session expired') }
    return res
  }, [token, logout])

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout, authFetch }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
