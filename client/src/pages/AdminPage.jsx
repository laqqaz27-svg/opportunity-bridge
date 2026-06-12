import { useEffect, useState } from 'react'
import api from '../services/api'

function AdminPage() {
  const [employers, setEmployers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [actionLoadingId, setActionLoadingId] = useState('')

  const fetchPendingEmployers = async () => {
    setLoading(true)
    setError('')

    try {
      const { data } = await api.get('/auth/employers/pending')
      setEmployers(data.employers || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load pending employer accounts.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPendingEmployers()
  }, [])

  const handleApprove = async (userId) => {
    setActionLoadingId(userId)
    setError('')
    setMessage('')

    try {
      const { data } = await api.patch(`/auth/employers/${userId}/approve`)
      setMessage(data.message || 'Employer approved successfully.')
      setEmployers((prev) => prev.filter((employer) => employer._id !== userId))
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to approve this employer right now.')
    } finally {
      setActionLoadingId('')
    }
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-16 md:px-6">
      <section className="brand-card border border-slate-100 p-7">
        <h2 className="text-3xl font-extrabold">Admin Panel</h2>
        <p className="mt-2 text-slate-600">Review and approve NGO or employer accounts before they can post.</p>

        {message && <p className="mt-4 text-sm text-emerald-700">{message}</p>}
        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        {loading ? (
          <p className="mt-8 text-slate-600">Loading pending employers...</p>
        ) : employers.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 p-6 text-center">
            <p className="text-slate-600">No pending employer approvals right now.</p>
          </div>
        ) : (
          <div className="mt-8 grid gap-4">
            {employers.map((employer) => (
              <article key={employer._id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h3 className="text-xl font-extrabold text-kohText">
                      {employer.organizationName || employer.name}
                    </h3>
                    <p className="mt-1 text-sm text-slate-600">{employer.email}</p>
                    <p className="mt-1 text-sm text-slate-600">
                      {employer.organizationType || 'Organization'} • {employer.location || 'Location not provided'}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      Email Verified: {employer.isVerified ? 'Yes' : 'No'}
                    </p>
                    {employer.website && (
                      <p className="mt-1 text-sm text-slate-600">Website: {employer.website}</p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleApprove(employer._id)}
                    disabled={actionLoadingId === employer._id}
                    className="rounded-full bg-kohBlue px-5 py-2 text-sm font-bold text-white transition hover:bg-blue-700 disabled:opacity-60"
                  >
                    {actionLoadingId === employer._id ? 'Approving...' : 'Approve'}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default AdminPage
