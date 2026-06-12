import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProtectedRoute({ children }) {
  const { authReady, isAuthenticated } = useAuth()
  const location = useLocation()

  if (!authReady) {
    return null
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace state={{ from: `${location.pathname}${location.search}${location.hash}` }} />
  }

  return children
}

export default ProtectedRoute
