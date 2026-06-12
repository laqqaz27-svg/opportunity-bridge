import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import CustomCursor from './components/CustomCursor'
import Footer from './components/Footer'
import FloatingBlobs from './components/FloatingBlobs'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import RoleRoute from './components/RoleRoute'
import { useAuth } from './context/AuthContext'
import AdminPage from './pages/AdminPage'
import CoursesPage from './pages/CoursesPage'
import DashboardPage from './pages/DashboardPage'
import EmployerDashboardPage from './pages/EmployerDashboardPage'
import EmployerRegisterPage from './pages/EmployerRegisterPage'
import EntryGatePage from './pages/EntryGatePage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import HomePage from './pages/HomePage'
import JobsPage from './pages/JobsPage'
import LoginPage from './pages/LoginPage'
import DonatePage from './pages/DonatePage'
import OpportunityFeedPage from './pages/OpportunityFeedPage'
import PostOpportunityPage from './pages/PostOpportunityPage'
import ProfilePage from './pages/ProfilePage'
import RegisterPage from './pages/RegisterPage'
import TrainingPage from './pages/TrainingPage'
import VerifyEmailPage from './pages/VerifyEmailPage'

function DashboardRedirect() {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (user.role === 'employer') {
    return <Navigate to="/employer-dashboard" replace />
  }

  if (user.role === 'admin') {
    return <Navigate to="/admin" replace />
  }

  return <Navigate to="/dashboard" replace />
}

function AppLayout() {
  const location = useLocation()
  const isEntryGateRoute = location.pathname === '/'

  useEffect(() => {
    const revealElements = Array.from(document.querySelectorAll('[data-reveal]'))
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) {
      revealElements.forEach((element) => element.classList.add('is-visible'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.18,
        rootMargin: '0px 0px -8% 0px',
      },
    )

    revealElements.forEach((element) => observer.observe(element))

    return () => {
      observer.disconnect()
    }
  }, [location.pathname, location.hash])

  useEffect(() => {
    const supportsFinePointer = window.matchMedia('(pointer: fine)').matches
    const magneticButtons = Array.from(document.querySelectorAll('.magnetic-btn'))
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion || !supportsFinePointer || magneticButtons.length === 0) {
      return
    }

    const cleanups = magneticButtons.map((button) => {
      const handleMouseMove = (event) => {
        const rect = button.getBoundingClientRect()
        const relativeX = event.clientX - rect.left - rect.width / 2
        const relativeY = event.clientY - rect.top - rect.height / 2
        const strength = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--magnetic-strength')) || 0.22
        const clampedX = Math.max(-18, Math.min(18, relativeX * strength))
        const clampedY = Math.max(-14, Math.min(14, relativeY * strength))

        button.style.setProperty('--mx', `${clampedX}px`)
        button.style.setProperty('--my', `${clampedY}px`)
      }

      const handleMouseLeave = () => {
        button.style.setProperty('--mx', '0px')
        button.style.setProperty('--my', '0px')
      }

      button.addEventListener('mousemove', handleMouseMove)
      button.addEventListener('mouseleave', handleMouseLeave)

      return () => {
        button.removeEventListener('mousemove', handleMouseMove)
        button.removeEventListener('mouseleave', handleMouseLeave)
      }
    })

    return () => {
      cleanups.forEach((cleanup) => cleanup())
    }
  }, [location.pathname, location.hash])

  return (
    <div className="app-shell min-h-screen">
      {!isEntryGateRoute && <FloatingBlobs />}
      {!isEntryGateRoute && <CustomCursor />}
      {!isEntryGateRoute && <Navbar />}
      <div className="route-transition">
        <Routes>
          <Route path="/" element={<EntryGatePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/donate" element={<DonatePage />} />
          <Route path="/opportunity-feed" element={<OpportunityFeedPage />} />
          <Route
            path="/jobs"
            element={
              <ProtectedRoute>
                <JobsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/training"
            element={
              <ProtectedRoute>
                <TrainingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses"
            element={
              <ProtectedRoute>
                <CoursesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/post-opportunity"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={['employer', 'admin']}>
                  <PostOpportunityPage />
                </RoleRoute>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/register/employer" element={<EmployerRegisterPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={['user']}>
                  <DashboardPage />
                </RoleRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/employer-dashboard"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={['employer']}>
                  <EmployerDashboardPage />
                </RoleRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={['admin']}>
                  <AdminPage />
                </RoleRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/auth-redirect"
            element={
              <ProtectedRoute>
                <DashboardRedirect />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      {!isEntryGateRoute && <Footer />}
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  )
}

export default App
