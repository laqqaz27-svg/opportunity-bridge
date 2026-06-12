import { useState } from 'react'
import api from '../services/api'
import { SUPPORT_EMAIL } from '../config/support'

function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    try {
      const { data } = await api.post('/auth/forgot-password', { email })
      setMessage(data.message)
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to process your request right now.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto w-full max-w-xl px-4 py-16 md:px-6">
      <section className="brand-card border border-slate-100 p-7">
        <h2 className="text-3xl font-extrabold">Forgot Password</h2>
        <p className="mt-2 text-slate-600">Enter your email to request a password reset link.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="form-field block">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=" "
              className="form-control"
              required
            />
            <span className="form-label">Email</span>
          </label>

          <button
            type="submit"
            className="rounded-full bg-kohBlue px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        {message && <p className="mt-4 text-sm text-emerald-700">{message}</p>}
        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
        <p className="mt-4 text-sm text-slate-600">
          Need help now? Contact support at{' '}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="font-semibold text-kohBlue hover:underline">
            {SUPPORT_EMAIL}
          </a>
          .
        </p>
      </section>
    </main>
  )
}

export default ForgotPasswordPage
