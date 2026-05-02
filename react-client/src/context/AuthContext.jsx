import { createContext, useContext, useState, useCallback } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('authToken')
    const role = localStorage.getItem('userRole')
    const userId = localStorage.getItem('userId')
    const nickname = localStorage.getItem('username')
    if (token) return { token, role, userId, nickname }
    return null
  })

  const login = useCallback((data) => {
    localStorage.setItem('authToken', data.token)
    localStorage.setItem('userRole', data.role)
    localStorage.setItem('userId', String(data.user_id))
    localStorage.setItem('username', data.nickname)
    setUser({ token: data.token, role: data.role, userId: data.user_id, nickname: data.nickname })
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('userRole')
    localStorage.removeItem('userId')
    localStorage.removeItem('username')
    setUser(null)
  }, [])

  const getAuthHeader = useCallback(() => ({
    Authorization: `Bearer ${user?.token}`,
    'Content-Type': 'application/json'
  }), [user])

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, getAuthHeader }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
