import { Link, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'

function EntryGatePage() {
  const { authReady, isAuthenticated } = useAuth()
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('koh_theme') === 'dark')

  useEffect(() => {
    document.body.classList.add('entry-gate-active')

    return () => {
      document.body.classList.remove('entry-gate-active')
    }
  }, [])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('theme-dark')
      localStorage.setItem('koh_theme', 'dark')
      return
    }

    document.documentElement.classList.remove('theme-dark')
    localStorage.setItem('koh_theme', 'light')
  }, [darkMode])

  if (!authReady) {
    return null
  }

  if (isAuthenticated) {
    return <Navigate to="/home" replace />
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-12rem)] w-full max-w-5xl items-center px-4 py-14 md:px-6">
      <section className="brand-card w-full border border-slate-100 bg-gradient-to-br from-white via-amber-50/60 to-blue-50/70 p-8 md:p-10">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setDarkMode((prev) => !prev)}
            className="rounded-full border border-slate-300/90 bg-white/80 px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-kohBlue hover:text-kohBlue"
          >
            {darkMode ? 'Light' : 'Dark'}
          </button>
        </div>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-kohBlue">Opportunity Bridge</p>
        <h1 className="mt-4 max-w-3xl text-3xl font-extrabold leading-tight text-kohText md:text-5xl">
          Get started with your account before entering the platform.
        </h1>
        <p className="mt-4 max-w-2xl text-base text-slate-600 md:text-lg">
          Sign in or create an account to access jobs, opportunities, donations, and your role-based dashboard.
        </p>

        <div className="mt-8">
          <Link
            to="/register"
            className="btn-pill btn-animated-border btn-shimmer inline-flex items-center justify-center rounded-full bg-kohBlue px-7 py-3 text-sm font-bold text-white shadow-koh transition hover:bg-blue-800"
          >
            Get Started
          </Link>
        </div>
      </section>
    </main>
  )
}

export default EntryGatePage