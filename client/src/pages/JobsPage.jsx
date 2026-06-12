import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

function JobsPage({
  pageTitle = 'Jobs & Training Opportunities',
  pageDescription = 'Browse and apply for verified opportunities in the community.',
  fixedFilter = '',
}) {
  const { isAuthenticated, user } = useAuth()
  const location = useLocation()
  const [jobs, setJobs] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [listingFilter, setListingFilter] = useState(fixedFilter || 'all')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState('')
  const [applyingJobId, setApplyingJobId] = useState('')
  const [resumeFile, setResumeFile] = useState(null)
  const [supportingDocumentFile, setSupportingDocumentFile] = useState(null)
  const [coverLetter, setCoverLetter] = useState('')
  const [applyLoading, setApplyLoading] = useState(false)
  const [applyUploadProgress, setApplyUploadProgress] = useState(0)

  const fetchJobs = async (nextPage = page, nextSearch = search, nextFilter = listingFilter) => {
    setLoading(true)
    setError('')
    try {
      const effectiveFilter = fixedFilter || nextFilter
      const params = {
        page: nextPage,
        limit: 6,
        search: nextSearch || undefined,
      }

      if (effectiveFilter === 'jobs') {
        params.category = 'jobs'
      }
      if (effectiveFilter === 'courses') {
        params.category = 'courses'
      }
      if (effectiveFilter === 'training') {
        params.type = 'training'
      }

      const { data } = await api.get('/jobs', {
        params,
      })
      setJobs(data.jobs)
      setPage(data.page)
      setTotalPages(data.totalPages || 1)
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load opportunities right now.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setListingFilter(fixedFilter || 'all')
    fetchJobs(1, '', fixedFilter || 'all')
  }, [fixedFilter])

  const handleSearch = async (event) => {
    event.preventDefault()
    await fetchJobs(1, search, listingFilter)
  }

  const handleFilterChange = async (nextFilter) => {
    if (fixedFilter) {
      return
    }
    setListingFilter(nextFilter)
    await fetchJobs(1, search, nextFilter)
  }

  const handleApply = async (jobId) => {
    setFeedback('')
    setError('')

    if (!resumeFile) {
      setError('Please attach your resume before applying.')
      return
    }

    setApplyLoading(true)
    setApplyUploadProgress(0)

    try {
      const payload = new FormData()
      payload.append('coverLetter', coverLetter)
      payload.append('resume', resumeFile)
      if (supportingDocumentFile) {
        payload.append('supportingDocument', supportingDocumentFile)
      }

      await api.post(`/applications/${jobId}`, payload, {
        onUploadProgress: (event) => {
          if (!event.total) {
            return
          }
          setApplyUploadProgress(Math.round((event.loaded * 100) / event.total))
        },
      })
      setFeedback('Application submitted successfully.')
      setApplyingJobId('')
      setResumeFile(null)
      setSupportingDocumentFile(null)
      setCoverLetter('')
      setApplyUploadProgress(0)
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to submit application at this time.')
      setApplyUploadProgress(0)
    } finally {
      setApplyLoading(false)
    }
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-16 md:px-6">
      <section className="brand-card border border-slate-100 p-7">
        <div className="mb-6 flex flex-wrap gap-2">
          {[
            { href: '/jobs', label: 'Jobs' },
            { href: '/training', label: 'Training' },
            { href: '/courses', label: 'Courses' },
          ].map((tab) => {
            const isActive = location.pathname === tab.href
            return (
              <Link
                key={tab.href}
                to={tab.href}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  isActive
                    ? 'bg-kohBlue text-white'
                    : 'border border-slate-300 text-slate-700 hover:border-kohBlue hover:text-kohBlue'
                }`}
              >
                {tab.label}
              </Link>
            )
          })}
        </div>

        <h2 className="text-3xl font-extrabold">{pageTitle}</h2>
        <p className="mt-2 text-slate-600">{pageDescription}</p>

        <form onSubmit={handleSearch} className="mt-6 flex flex-col gap-3 md:flex-row">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search opportunities by title"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-kohBlue transition focus:ring-2"
          />
          <button
            type="submit"
            className="rounded-full bg-kohBlue px-6 py-2 text-sm font-bold text-white transition hover:bg-blue-700"
          >
            Search
          </button>
        </form>

        {!fixedFilter && (
          <div className="mt-4 flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'All' },
              { key: 'jobs', label: 'Jobs' },
              { key: 'training', label: 'Training' },
              { key: 'courses', label: 'Courses' },
            ].map((filter) => (
              <button
                key={filter.key}
                type="button"
                onClick={() => handleFilterChange(filter.key)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  listingFilter === filter.key
                    ? 'bg-kohBlue text-white'
                    : 'border border-slate-300 text-slate-700 hover:border-kohBlue hover:text-kohBlue'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        )}

        {feedback && <p className="mt-4 text-sm text-emerald-700">{feedback}</p>}
        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        {loading ? (
          <p className="mt-8 text-slate-600">Loading opportunities...</p>
        ) : (
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {jobs.map((job) => (
              <article key={job._id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-xl font-extrabold text-kohText">{job.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{job.organization}</p>
                <p className="mt-2 text-sm text-slate-600">
                  {job.location} • {job.type}
                </p>
                <p className="mt-3 line-clamp-3 text-sm text-slate-700">{job.description}</p>

                {isAuthenticated && user?.role === 'user' && (
                  <div className="mt-4">
                    {applyingJobId === job._id ? (
                      <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                        <textarea
                          value={coverLetter}
                          onChange={(event) => setCoverLetter(event.target.value)}
                          rows={3}
                          placeholder="Cover letter (optional)"
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-kohBlue transition focus:ring-2"
                        />
                        <input
                          type="file"
                          accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                          onChange={(event) => setResumeFile(event.target.files?.[0] || null)}
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-kohBlue transition focus:ring-2"
                        />
                        {resumeFile && <p className="text-xs text-slate-600">Resume: {resumeFile.name}</p>}
                        <input
                          type="file"
                          accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                          onChange={(event) => setSupportingDocumentFile(event.target.files?.[0] || null)}
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-kohBlue transition focus:ring-2"
                        />
                        {supportingDocumentFile && (
                          <p className="text-xs text-slate-600">Supporting document: {supportingDocumentFile.name}</p>
                        )}
                        {applyLoading && applyUploadProgress > 0 && (
                          <div>
                            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                              <div className="h-full bg-kohBlue transition-all" style={{ width: `${applyUploadProgress}%` }} />
                            </div>
                            <p className="mt-1 text-xs text-slate-600">Uploading files: {applyUploadProgress}%</p>
                          </div>
                        )}
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleApply(job._id)}
                            disabled={applyLoading}
                            className="rounded-full bg-kohOrange px-4 py-2 text-sm font-bold text-white transition hover:bg-orange-600 disabled:opacity-60"
                          >
                            {applyLoading ? 'Submitting...' : 'Submit Application'}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setApplyingJobId('')
                              setResumeFile(null)
                              setSupportingDocumentFile(null)
                              setCoverLetter('')
                            }}
                            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setError('')
                          setFeedback('')
                          setApplyingJobId(job._id)
                        }}
                        className="rounded-full bg-kohOrange px-5 py-2 text-sm font-bold text-white transition hover:bg-orange-600"
                      >
                        Apply Job
                      </button>
                    )}
                  </div>
                )}
              </article>
            ))}
          </div>
        )}

        <div className="mt-8 flex items-center justify-between">
          <button
            type="button"
            onClick={() => fetchJobs(Math.max(page - 1, 1), search, listingFilter)}
            disabled={page <= 1 || loading}
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold disabled:opacity-50"
          >
            Previous
          </button>
          <p className="text-sm text-slate-600">
            Page {page} of {Math.max(totalPages, 1)}
          </p>
          <button
            type="button"
            onClick={() => fetchJobs(Math.min(page + 1, totalPages), search, listingFilter)}
            disabled={page >= totalPages || loading}
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </section>
    </main>
  )
}

export default JobsPage
