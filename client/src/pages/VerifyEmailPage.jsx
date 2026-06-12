import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import api from '../services/api'

function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const [status, setStatus] = useState('verifying')
  const [message, setMessage] = useState('Verifying your email...')

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus('error')
        setMessage('Verification token is missing.')
        return
      }

      try {
        const { data } = await api.get(`/auth/verify-email/${token}`)
        setStatus('success')
        setMessage(data.message)
      } catch (err) {
        setStatus('error')
        setMessage(err.response?.data?.message || 'Unable to verify email at this time.')
      }
    }

    verify()
  }, [token])

  return (
    <main className="mx-auto w-full max-w-xl px-4 py-16 md:px-6">
      <section className="brand-card border border-slate-100 p-7">
        <h2 className="text-3xl font-extrabold">Email Verification</h2>
        <p className={`mt-4 text-sm ${status === 'error' ? 'text-red-600' : status === 'success' ? 'text-emerald-700' : 'text-slate-600'}`}>
          {message}
        </p>
        <p className="mt-3 text-xs text-slate-500">
          If you cannot find the verification email, check your spam or junk folder, then try resending it from the sign in page.
        </p>
        <p className="mt-5 text-sm text-slate-600">
          Continue to{' '}
          <Link to="/login" className="font-semibold text-kohBlue hover:underline">
            Sign In
          </Link>
        </p>
      </section>
    </main>
  )
}

export default VerifyEmailPage
