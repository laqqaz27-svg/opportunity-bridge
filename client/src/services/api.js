import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
const TOKEN_KEY = 'koh_token'
const USER_KEY = 'koh_user'

const api = axios.create({
  baseURL: API_BASE_URL,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const statusCode = error.response?.status
    const requestUrl = error.config?.url || ''
    const isAuthRoute = requestUrl.includes('/auth/login') || requestUrl.includes('/auth/register')

    if (statusCode === 401 && !isAuthRoute) {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
    }

    return Promise.reject(error)
  },
)

export default api
