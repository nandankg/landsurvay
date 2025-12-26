import { createContext, useContext, useState, useEffect } from 'react'
import api from '../config/api'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for stored auth on mount
    const token = localStorage.getItem('token')
    const storedAdmin = localStorage.getItem('admin')

    if (token && storedAdmin) {
      setAdmin(JSON.parse(storedAdmin))
    }
    setLoading(false)
  }, [])

  const login = async (username, password) => {
    const response = await api.post('/admin/login', { username, password })
    const { token, admin: adminData } = response.data.data

    localStorage.setItem('token', token)
    localStorage.setItem('admin', JSON.stringify(adminData))
    setAdmin(adminData)

    return adminData
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('admin')
    setAdmin(null)
  }

  const isAuthenticated = () => {
    return !!admin && !!localStorage.getItem('token')
  }

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export default AuthContext
