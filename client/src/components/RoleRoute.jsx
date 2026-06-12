import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function RoleRoute({ allowedRoles, children }) {
  const { authReady, user } = useAuth()
  const location = useLocation()

  if (!authReady) {
    return null
  }

  if (!user) {
    return <Navigate to="/" replace state={{ from: `${location.pathname}${location.search}${location.hash}` }} />
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/home" replace />
  }

  return children
}

export default RoleRoute
