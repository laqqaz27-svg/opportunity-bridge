import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

const TOKEN_KEY = 'koh_token'
const USER_KEY = 'koh_user'

const readCachedUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch (error) {
    localStorage.removeItem(USER_KEY)
    return null
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || '')
  const [user, setUser] = useState(readCachedUser)
  const [loading, setLoading] = useState(false)
  const [authReady, setAuthReady] = useState(false)

  const persistAuth = useCallback((nextToken, nextUser) => {
    setToken(nextToken)
    setUser(nextUser)
    localStorage.setItem(TOKEN_KEY, nextToken)
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser))
  }, [])

  const clearAuth = useCallback(() => {
    setToken('')
    setUser(null)
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }, [])

  const login = useCallback(
    async (payload) => {
      setLoading(true)
      try {
        const { data } = await api.post('/auth/login', payload)
        persistAuth(data.token, data.user)
        return data.user
      } finally {
        setLoading(false)
      }
    },
    [persistAuth],
  )

  const register = useCallback(
    async (payload, requestConfig = {}) => {
      setLoading(true)
      try {
        const { data } = await api.post('/auth/register', payload, requestConfig)
        if (data.token && data.user) {
          persistAuth(data.token, data.user)
        }
        return data
      } finally {
        setLoading(false)
      }
    },
    [persistAuth],
  )

  const googleSignIn = useCallback(
    async (idToken) => {
      setLoading(true)
      try {
        const { data } = await api.post('/auth/google', { idToken })
        persistAuth(data.token, data.user)
        return data.user
      } finally {
        setLoading(false)
      }
    },
    [persistAuth],
  )

  const logout = useCallback(async () => {
    try {
      if (token) {
        await api.post('/auth/logout')
      }
    } catch (error) {
      // Logout should always complete on client even if API call fails.
    } finally {
      clearAuth()
    }
  }, [token, clearAuth])

  useEffect(() => {
    if (!token) {
      setAuthReady(true)
      return
    }

    const hydrateUser = async () => {
      try {
        const { data } = await api.get('/auth/me')
        const hydratedUser = {
          id: data._id,
          name: data.name,
          email: data.email,
          role: data.role,
          isVerified: data.isVerified,
          isApproved: data.isApproved,
        }
        setUser(hydratedUser)
        localStorage.setItem(USER_KEY, JSON.stringify(hydratedUser))
      } catch (error) {
        clearAuth()
      } finally {
        setAuthReady(true)
      }
    }

    hydrateUser()
  }, [token, clearAuth])

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      authReady,
      isAuthenticated: Boolean(token && user),
      login,
      register,
      googleSignIn,
      logout,
    }),
    [token, user, loading, authReady, login, register, googleSignIn, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
