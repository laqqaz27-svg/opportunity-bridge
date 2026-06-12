import { useAuth } from '../context/AuthContext'
import { useEffect, useState } from 'react'
import api from '../services/api'

function DashboardPage() {
  const { user } = useAuth()
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchMyApplications = async () => {
      if (!user || user.role !== 'user') {
        return
      }

      setLoading(true)
      setError('')
      try {
        const { data } = await api.get('/applications/my')
        setApplications(data)
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load your applications right now.')
      } finally {
        setLoading(false)
      }
    }

    fetchMyApplications()
  }, [user])

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-16 md:px-6">
      <section className="brand-card border border-slate-100 p-7">
        <h2 className="text-3xl font-extrabold">Dashboard</h2>
        <p className="mt-2 text-slate-600">Welcome back, {user?.name}. Your account is protected by JWT authentication.</p>
        <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
          <p>
            <span className="font-bold">Role:</span> {user?.role}
          </p>
          <p>
            <span className="font-bold">Email:</span> {user?.email}
          </p>
        </div>

        {user?.role === 'user' && (
          <section className="mt-7">
            <h3 className="text-xl font-extrabold">My Applications</h3>
            {loading && <p className="mt-2 text-slate-600">Loading your applications...</p>}
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            {!loading && !error && applications.length === 0 && (
              <p className="mt-2 text-slate-600">You have not applied for any opportunities yet.</p>
            )}
            {!loading && applications.length > 0 && (
              <div className="mt-4 grid gap-3">
                {applications.map((application) => (
                  <article key={application._id} className="rounded-xl border border-slate-200 bg-white p-4 text-sm">
                    <p className="font-bold text-kohText">{application.job?.title || 'Opportunity removed'}</p>
                    <p className="mt-1 text-slate-600">{application.job?.organization || 'Organization unavailable'}</p>
                    <p className="mt-1 text-slate-600">Status: {application.status}</p>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}
      </section>
    </main>
  )
}

export default DashboardPage
