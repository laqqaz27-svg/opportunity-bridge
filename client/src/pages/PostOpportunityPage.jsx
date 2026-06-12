import { useState } from 'react'
import api from '../services/api'

function PostOpportunityPage() {
  const [form, setForm] = useState({
    title: '',
    organization: '',
    description: '',
    location: '',
    type: 'full-time',
    category: 'jobs',
    mode: 'offline',
    skillLevel: 'all',
    deadline: '',
    organizationLogo: '',
    opportunityImage: '',
    salaryRange: '',
    skills: '',
  })
  const [organizationLogoFile, setOrganizationLogoFile] = useState(null)
  const [opportunityImageFile, setOpportunityImageFile] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (event) => {
    const { name, files } = event.target
    if (name === 'organizationLogoFile') {
      setOrganizationLogoFile(files?.[0] || null)
    }
    if (name === 'opportunityImageFile') {
      setOpportunityImageFile(files?.[0] || null)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setMessage('')
    setError('')
    setLoading(true)

    try {
      setUploadProgress(0)
      const payload = new FormData()
      payload.append('title', form.title)
      payload.append('organization', form.organization)
      payload.append('description', form.description)
      payload.append('location', form.location)
      payload.append('type', form.type)
      payload.append('category', form.category)
      payload.append('mode', form.mode)
      payload.append('skillLevel', form.skillLevel)
      payload.append('deadline', form.deadline)
      payload.append('salaryRange', form.salaryRange)
      payload.append('skills', form.skills)
      payload.append('organizationLogo', form.organizationLogo)
      payload.append('opportunityImage', form.opportunityImage)

      if (organizationLogoFile) {
        payload.append('organizationLogo', organizationLogoFile)
      }

      if (opportunityImageFile) {
        payload.append('opportunityImage', opportunityImageFile)
      }

      await api.post('/jobs', payload, {
        onUploadProgress: (event) => {
          if (!event.total) {
            return
          }
          setUploadProgress(Math.round((event.loaded * 100) / event.total))
        },
      })
      setMessage('Opportunity posted successfully.')
      setForm({
        title: '',
        organization: '',
        description: '',
        location: '',
        type: 'full-time',
        category: 'jobs',
        mode: 'offline',
        skillLevel: 'all',
        deadline: '',
        organizationLogo: '',
        opportunityImage: '',
        salaryRange: '',
        skills: '',
      })
      setOrganizationLogoFile(null)
      setOpportunityImageFile(null)
      setUploadProgress(0)
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to post opportunity at this time.')
      setUploadProgress(0)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-16 md:px-6">
      <section className="brand-card border border-slate-100 p-7">
        <h2 className="text-3xl font-extrabold">Post Opportunities</h2>
        <p className="mt-2 text-slate-600">Share jobs, internships, grants, and training programs with the community.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Opportunity title"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-kohBlue transition focus:ring-2"
            required
          />
          <input
            name="organization"
            value={form.organization}
            onChange={handleChange}
            placeholder="Organization"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-kohBlue transition focus:ring-2"
            required
          />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            rows={4}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-kohBlue transition focus:ring-2"
            required
          />
          <div className="grid gap-4 md:grid-cols-2">
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Location"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-kohBlue transition focus:ring-2"
            />
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-kohBlue transition focus:ring-2"
            >
              <option value="full-time">Full-Time</option>
              <option value="part-time">Part-Time</option>
              <option value="internship">Internship</option>
              <option value="volunteer">Volunteer</option>
              <option value="training">Training</option>
            </select>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-kohBlue transition focus:ring-2"
            >
              <option value="jobs">Jobs</option>
              <option value="scholarships">Scholarships</option>
              <option value="courses">Courses</option>
              <option value="volunteering">Volunteering</option>
              <option value="innovation">Innovation</option>
              <option value="mentorship">Mentorship</option>
              <option value="ngos">NGOs</option>
              <option value="remote-work">Remote Work</option>
            </select>
            <select
              name="mode"
              value={form.mode}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-kohBlue transition focus:ring-2"
            >
              <option value="offline">Offline</option>
              <option value="online">Online</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <select
              name="skillLevel"
              value={form.skillLevel}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-kohBlue transition focus:ring-2"
            >
              <option value="all">All Skill Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
            <input
              name="deadline"
              type="date"
              value={form.deadline}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-kohBlue transition focus:ring-2"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="w-full">
              <span className="mb-1 block text-sm font-semibold text-slate-700">Organization Logo Upload (optional)</span>
              <input
                type="file"
                name="organizationLogoFile"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-kohBlue transition focus:ring-2"
              />
              {organizationLogoFile && <p className="mt-1 text-xs text-slate-600">Selected: {organizationLogoFile.name}</p>}
            </label>
            <label className="w-full">
              <span className="mb-1 block text-sm font-semibold text-slate-700">Opportunity Image Upload (optional)</span>
              <input
                type="file"
                name="opportunityImageFile"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-kohBlue transition focus:ring-2"
              />
              {opportunityImageFile && <p className="mt-1 text-xs text-slate-600">Selected: {opportunityImageFile.name}</p>}
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <input
              name="organizationLogo"
              value={form.organizationLogo}
              onChange={handleChange}
              placeholder="Organization logo URL (optional)"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-kohBlue transition focus:ring-2"
            />
            <input
              name="opportunityImage"
              value={form.opportunityImage}
              onChange={handleChange}
              placeholder="Opportunity image URL (optional)"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-kohBlue transition focus:ring-2"
            />
          </div>

          <input
            name="salaryRange"
            value={form.salaryRange}
            onChange={handleChange}
            placeholder="Salary / Stipend (optional)"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-kohBlue transition focus:ring-2"
          />
          <input
            name="skills"
            value={form.skills}
            onChange={handleChange}
            placeholder="Skills (comma separated)"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-kohBlue transition focus:ring-2"
          />

          {message && <p className="text-sm text-emerald-700">{message}</p>}
          {error && <p className="text-sm text-red-600">{error}</p>}
          {loading && uploadProgress > 0 && (
            <div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                <div className="h-full bg-kohBlue transition-all" style={{ width: `${uploadProgress}%` }} />
              </div>
              <p className="mt-1 text-xs text-slate-600">Uploading files: {uploadProgress}%</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-kohOrange px-6 py-3 text-sm font-bold text-white transition hover:bg-orange-600 disabled:opacity-60"
          >
            {loading ? 'Posting...' : 'Post Opportunity'}
          </button>
        </form>
      </section>
    </main>
  )
}

export default PostOpportunityPage
