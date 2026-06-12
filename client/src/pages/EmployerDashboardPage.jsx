import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

function EmployerDashboardPage() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [actionLoadingId, setActionLoadingId] = useState('')

  const fetchMyJobs = async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await api.get('/jobs/my', {
        params: { limit: 50 },
      })
      setJobs(data.jobs || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load your opportunities right now.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMyJobs()
  }, [])

  const handleStatusChange = async (jobId, status) => {
    setActionLoadingId(jobId)
    setError('')
    setMessage('')

    try {
      await api.patch(`/jobs/${jobId}/status`, { status })
      setMessage(`Opportunity moved to ${status}.`)
      await fetchMyJobs()
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update status at this time.')
    } finally {
      setActionLoadingId('')
    }
  }

  const handleDelete = async (jobId) => {
    setActionLoadingId(jobId)
    setError('')
    setMessage('')

    try {
      await api.delete(`/jobs/${jobId}`)
      setMessage('Opportunity deleted successfully.')
      setJobs((prev) => prev.filter((job) => job._id !== jobId))
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to delete opportunity right now.')
    } finally {
      setActionLoadingId('')
    }
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-16 md:px-6">
      <section className="brand-card border border-slate-100 p-7">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-extrabold">Employer Dashboard</h2>
            <p className="mt-2 text-slate-600">Manage your jobs, training, and courses from one place.</p>
          </div>
          <Link
            to="/post-opportunity"
            className="inline-flex items-center justify-center rounded-full bg-kohBlue px-5 py-2 text-sm font-bold text-white transition hover:bg-blue-700"
          >
            Post New Opportunity
          </Link>
        </div>

        {message && <p className="mt-4 text-sm text-emerald-700">{message}</p>}
        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        {loading ? (
          <p className="mt-8 text-slate-600">Loading your opportunities...</p>
        ) : jobs.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 p-6 text-center">
            <p className="text-slate-600">You have not posted any opportunities yet.</p>
          </div>
        ) : (
          <div className="mt-8 grid gap-4">
            {jobs.map((job) => {
              const isActionLoading = actionLoadingId === job._id
              return (
                <article key={job._id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h3 className="text-xl font-extrabold text-kohText">{job.title}</h3>
                      <p className="mt-1 text-sm text-slate-600">
                        {job.organization} • {job.category} • {job.type}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">Status: {job.status}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={isActionLoading || job.status === 'published'}
                        onClick={() => handleStatusChange(job._id, 'published')}
                        className="rounded-full border border-emerald-300 px-4 py-2 text-sm font-semibold text-emerald-700 disabled:opacity-50"
                      >
                        Publish
                      </button>
                      <button
                        type="button"
                        disabled={isActionLoading || job.status === 'closed'}
                        onClick={() => handleStatusChange(job._id, 'closed')}
                        className="rounded-full border border-amber-300 px-4 py-2 text-sm font-semibold text-amber-700 disabled:opacity-50"
                      >
                        Close
                      </button>
                      <button
                        type="button"
                        disabled={isActionLoading || job.status === 'draft'}
                        onClick={() => handleStatusChange(job._id, 'draft')}
                        className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-50"
                      >
                        Draft
                      </button>
                      <button
                        type="button"
                        disabled={isActionLoading}
                        onClick={() => handleDelete(job._id)}
                        className="rounded-full border border-red-300 px-4 py-2 text-sm font-semibold text-red-700 disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <p className="mt-3 text-sm text-slate-700">{job.description}</p>
                </article>
              )
            })}
          </div>
        )}
      </section>
    </main>
  )
}

export default EmployerDashboardPage
