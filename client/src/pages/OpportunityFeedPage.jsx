import { useEffect, useMemo, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faListCheck, faSortAmountDown } from '@fortawesome/free-solid-svg-icons'
import OpportunityCard from '../components/OpportunityCard'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const categoryOptions = [
  { value: '', label: 'All Categories' },
  { value: 'jobs', label: 'Jobs' },
  { value: 'scholarships', label: 'Scholarships' },
  { value: 'courses', label: 'Courses' },
  { value: 'volunteering', label: 'Volunteering' },
  { value: 'innovation', label: 'Innovation' },
  { value: 'mentorship', label: 'Mentorship' },
  { value: 'ngos', label: 'NGOs' },
  { value: 'remote-work', label: 'Remote Work' },
]

function OpportunityFeedPage() {
  const { isAuthenticated, user } = useAuth()
  const [items, setItems] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState('')
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    location: '',
    organization: '',
    skillLevel: '',
    mode: '',
    sort: 'deadline',
  })

  const queryParams = useMemo(
    () => ({
      page,
      limit: 9,
      search: filters.search || undefined,
      category: filters.category || undefined,
      location: filters.location || undefined,
      organization: filters.organization || undefined,
      skillLevel: filters.skillLevel || undefined,
      mode: filters.mode || undefined,
      sort: filters.sort || undefined,
    }),
    [filters, page],
  )

  const fetchFeed = async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await api.get('/jobs', { params: queryParams })
      setItems(data.jobs || [])
      setTotalPages(data.totalPages || 1)
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load the opportunity feed right now.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFeed()
  }, [queryParams])

  const handleApply = async (jobId) => {
    setFeedback('')
    setError('')
    try {
      await api.post(`/applications/${jobId}`, {})
      setFeedback('Application submitted successfully.')
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to submit application at this time.')
    }
  }

  const updateFilter = (name, value) => {
    setPage(1)
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-16 md:px-6">
      <section className="brand-card border border-slate-100 p-7">
        <h2 className="text-3xl font-extrabold text-kohText">
          <FontAwesomeIcon icon={faListCheck} className="mr-2" />
          Opportunity Feed
        </h2>
        <p className="mt-2 text-slate-600">
          Explore NGO jobs, scholarships, training centers, online courses, and community programs in one place.
        </p>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <input
            value={filters.search}
            onChange={(event) => updateFilter('search', event.target.value)}
            placeholder="Search opportunities"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-kohBlue transition focus:ring-2"
          />
          <input
            value={filters.location}
            onChange={(event) => updateFilter('location', event.target.value)}
            placeholder="Location"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-kohBlue transition focus:ring-2"
          />
          <input
            value={filters.organization}
            onChange={(event) => updateFilter('organization', event.target.value)}
            placeholder="Organization"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-kohBlue transition focus:ring-2"
          />
          <select
            value={filters.category}
            onChange={(event) => updateFilter('category', event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-kohBlue transition focus:ring-2"
          >
            {categoryOptions.map((option) => (
              <option key={option.value || 'all'} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <select
            value={filters.skillLevel}
            onChange={(event) => updateFilter('skillLevel', event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-kohBlue transition focus:ring-2"
          >
            <option value="">All Skill Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="all">All Levels</option>
          </select>
          <select
            value={filters.mode}
            onChange={(event) => updateFilter('mode', event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-kohBlue transition focus:ring-2"
          >
            <option value="">Online and Offline</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>

        <div className="mt-3 flex items-center justify-between gap-4">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
            <FontAwesomeIcon icon={faSortAmountDown} className="mr-2" />
            Sort
          </p>
          <select
            value={filters.sort}
            onChange={(event) => updateFilter('sort', event.target.value)}
            className="w-full max-w-xs rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-kohBlue transition focus:ring-2"
          >
            <option value="deadline">Urgent Deadlines First</option>
            <option value="recent">Most Recent</option>
          </select>
        </div>

        {feedback && <p className="mt-4 text-sm text-emerald-700">{feedback}</p>}
        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        {loading ? (
          <p className="mt-8 text-slate-600">Loading opportunity feed...</p>
        ) : (
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <OpportunityCard
                key={item._id}
                opportunity={item}
                canApply={isAuthenticated && user?.role === 'user'}
                onApply={handleApply}
              />
            ))}
          </div>
        )}

        {!loading && items.length === 0 && (
          <p className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            No opportunities match these filters yet. Try broadening your search.
          </p>
        )}

        <div className="mt-8 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
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
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
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

export default OpportunityFeedPage
