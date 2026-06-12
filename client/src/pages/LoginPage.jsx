import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

function LoginPage() {
  const RESEND_COOLDOWN_SECONDS = 60
  const navigate = useNavigate()
  const location = useLocation()
  const { login, googleSignIn, loading } = useAuth()
  const googleButtonRef = useRef(null)
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''
  const [googleReady, setGoogleReady] = useState(false)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [resendMessage, setResendMessage] = useState('')
  const [resendLoading, setResendLoading] = useState(false)
  const [showResendVerification, setShowResendVerification] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)

  const redirectAfterLogin = (role, fallbackPath) => {
    if (fallbackPath) {
      navigate(fallbackPath, { replace: true })
      return
    }

    if (role === 'employer') {
      navigate('/employer-dashboard', { replace: true })
      return
    }

    if (role === 'admin') {
      navigate('/admin', { replace: true })
      return
    }

    navigate('/dashboard', { replace: true })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setResendMessage('')
    setShowResendVerification(false)

    try {
      const user = await login({ email, password })
      redirectAfterLogin(user.role, location.state?.from)
    } catch (err) {
      const serverMessage = err.response?.data?.message || 'Unable to login. Please try again.'
      setError(serverMessage)
      const shouldShowResend =
        err.response?.status === 403 && serverMessage.toLowerCase().includes('verify your email')
      setShowResendVerification(shouldShowResend)
    }
  }

  const handleResendVerification = async () => {
    if (!email) {
      setError('Enter your email address first.')
      return
    }

    setResendLoading(true)
    setError('')
    setResendMessage('')

    try {
      const { data } = await api.post('/auth/resend-verification', { email })
      setResendMessage(data.message)
      setResendCooldown(RESEND_COOLDOWN_SECONDS)
      if (data.verificationLink) {
        setResendMessage(`${data.message} ${data.verificationLink}`)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to resend verification email right now.')
    } finally {
      setResendLoading(false)
    }
  }

  useEffect(() => {
    if (resendCooldown <= 0) {
      return
    }

    const intervalId = window.setInterval(() => {
      setResendCooldown((seconds) => (seconds > 0 ? seconds - 1 : 0))
    }, 1000)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [resendCooldown])

  useEffect(() => {
    if (!googleClientId || !googleButtonRef.current) {
      return
    }

    const renderGoogleButton = () => {
      if (!window.google?.accounts?.id || !googleButtonRef.current) {
        return
      }

      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: async (response) => {
          try {
            setError('')
            const user = await googleSignIn(response.credential)
            redirectAfterLogin(user.role, location.state?.from)
          } catch (err) {
            setError(err.response?.data?.message || 'Google sign in failed. Please try again.')
          }
        },
      })

      googleButtonRef.current.innerHTML = ''
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: 'outline',
        size: 'large',
        shape: 'pill',
        text: 'continue_with',
        width: 360,
      })

      setGoogleReady(true)
    }

    if (window.google?.accounts?.id) {
      renderGoogleButton()
      return
    }

    const existingScript = document.getElementById('google-identity-services')
    if (existingScript) {
      existingScript.addEventListener('load', renderGoogleButton)
      return () => existingScript.removeEventListener('load', renderGoogleButton)
    }

    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.id = 'google-identity-services'
    script.addEventListener('load', renderGoogleButton)
    document.body.appendChild(script)

    return () => {
      script.removeEventListener('load', renderGoogleButton)
    }
  }, [googleClientId, googleSignIn, location.state?.from])

  return (
    <main className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-12 md:grid-cols-[1fr_1fr] md:px-6 md:py-16">
      <section className="brand-card hidden border border-slate-100 bg-gradient-to-br from-kohBlue to-blue-900 p-8 text-white md:block">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-200">Welcome Back</p>
        <h2 className="mt-4 text-4xl font-extrabold leading-tight">
          Continue Building Opportunity in Kakuma
        </h2>
        <p className="mt-5 text-base text-blue-100">
          Sign in to access your dashboard, track opportunities, and connect with organizations driving impact.
        </p>
        <div className="mt-8 rounded-2xl border border-blue-400/30 bg-white/10 p-5">
          <p className="text-sm text-blue-50">
            KOH supports job seekers, employers, and community partners with secure role-based access.
          </p>
        </div>
      </section>

      <section className="brand-card border border-slate-100 p-7">
        <h2 className="text-3xl font-extrabold">Sign In</h2>
        <p className="mt-2 text-slate-600">Access your KOH dashboard and continue your opportunity journey.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="form-field block">
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder=" "
              className="form-control"
              required
            />
            <span className="form-label">Email</span>
          </label>

          <label className="form-field block">
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder=" "
              className="form-control"
              required
            />
            <span className="form-label">Password</span>
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {resendMessage && <p className="text-sm text-emerald-700">{resendMessage}</p>}

          {showResendVerification && (
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleResendVerification}
                disabled={resendLoading || resendCooldown > 0}
                className="rounded-full border border-kohBlue/40 px-5 py-2 text-sm font-bold text-kohBlue transition hover:bg-kohBlue/5 disabled:opacity-60"
              >
                {resendLoading
                  ? 'Sending Verification...'
                  : resendCooldown > 0
                    ? `Resend in ${resendCooldown}s`
                    : 'Resend Verification Email'}
              </button>
              <p className="text-xs text-slate-500">
                Check your spam or junk folder if the verification email is not in your inbox.
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="magnetic-btn btn-pill btn-animated-border btn-shimmer rounded-full bg-kohBlue px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>

          <div className="relative py-1">
            <div className="h-px bg-slate-200" />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              Or
            </span>
          </div>

          {googleClientId ? (
            <div className="flex justify-center">
              <div ref={googleButtonRef} />
            </div>
          ) : (
            <p className="text-sm text-slate-500">Google sign in is not configured for this client.</p>
          )}

          {googleClientId && !googleReady && (
            <p className="text-sm text-slate-500">Loading Google sign in...</p>
          )}
        </form>

        <div className="mt-5 space-y-2 text-sm">
          <p>
            <Link to="/forgot-password" className="font-semibold text-kohBlue hover:underline">
              Forgot Password?
            </Link>
          </p>
          <p className="text-slate-600">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="font-semibold text-kohBlue hover:underline">
              Job Seeker Register
            </Link>
            {' | '}
            <Link to="/register/employer" className="font-semibold text-kohBlue hover:underline">
              Employer Register
            </Link>
          </p>
        </div>
      </section>
    </main>
  )
}

export default LoginPage
