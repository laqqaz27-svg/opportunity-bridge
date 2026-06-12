import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function EmployerRegisterPage() {
  const { register, loading } = useAuth()
  const [form, setForm] = useState({
    organizationName: '',
    organizationType: 'NGO',
    email: '',
    phoneNumber: '',
    location: '',
    website: '',
    organizationDescription: '',
    password: '',
    confirmPassword: '',
    organizationLogo: '',
  })
  const [organizationLogoFile, setOrganizationLogoFile] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [verificationLink, setVerificationLink] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (event) => {
    setOrganizationLogoFile(event.target.files?.[0] || null)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    try {
      setUploadProgress(0)
      const payload = new FormData()
      payload.append('role', 'employer')
      payload.append('organizationName', form.organizationName)
      payload.append('organizationType', form.organizationType)
      payload.append('email', form.email)
      payload.append('phoneNumber', form.phoneNumber)
      payload.append('location', form.location)
      payload.append('website', form.website)
      payload.append('organizationDescription', form.organizationDescription)
      payload.append('password', form.password)
      payload.append('organizationLogo', form.organizationLogo)

      if (organizationLogoFile) {
        payload.append('organizationLogo', organizationLogoFile)
      }

      const result = await register(payload, {
        onUploadProgress: (event) => {
          if (!event.total) {
            return
          }
          setUploadProgress(Math.round((event.loaded * 100) / event.total))
        },
      })

      setSuccess(
        `${result.message || 'Registration successful.'} After email verification, your organization will be reviewed by admin before posting jobs.`,
      )
      setVerificationLink(result.verificationLink || '')
      setUploadProgress(0)
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to create organization account right now.')
      setUploadProgress(0)
    }
  }

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-12 md:px-6 md:py-16">
      <section className="brand-card border border-slate-100 p-7">
        <h2 className="text-3xl font-extrabold">Employer / NGO Registration</h2>
        <p className="mt-2 text-slate-600">Create an organization account to post verified opportunities.</p>

        <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
          <label>
            <span className="mb-1 block text-sm font-semibold text-slate-700">Organization Name</span>
            <input
              name="organizationName"
              value={form.organizationName}
              onChange={handleChange}
              className="form-control"
              required
            />
          </label>

          <label>
            <span className="mb-1 block text-sm font-semibold text-slate-700">Organization Type</span>
            <select
              name="organizationType"
              value={form.organizationType}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="NGO">NGO</option>
              <option value="Business">Business</option>
              <option value="Training Center">Training Center</option>
              <option value="School">School</option>
              <option value="Company">Company</option>
            </select>
          </label>

          <label>
            <span className="mb-1 block text-sm font-semibold text-slate-700">Email</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="form-control"
              required
            />
          </label>

          <label>
            <span className="mb-1 block text-sm font-semibold text-slate-700">Phone Number</span>
            <input
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              className="form-control"
              required
            />
          </label>

          <label>
            <span className="mb-1 block text-sm font-semibold text-slate-700">Location</span>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              className="form-control"
              required
            />
          </label>

          <label>
            <span className="mb-1 block text-sm font-semibold text-slate-700">Website</span>
            <input
              name="website"
              value={form.website}
              onChange={handleChange}
              className="form-control"
            />
          </label>

          <label className="md:col-span-2">
            <span className="mb-1 block text-sm font-semibold text-slate-700">Description</span>
            <textarea
              name="organizationDescription"
              value={form.organizationDescription}
              onChange={handleChange}
              rows={3}
              className="form-textarea"
            />
          </label>

          <label className="md:col-span-2">
            <span className="mb-1 block text-sm font-semibold text-slate-700">Organization Logo Upload (optional, JPG/PNG/WebP)</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="form-control"
            />
            {organizationLogoFile && <p className="mt-1 text-xs text-slate-600">Selected: {organizationLogoFile.name}</p>}
          </label>

          <label className="md:col-span-2">
            <span className="mb-1 block text-sm font-semibold text-slate-700">Organization Logo URL Fallback (optional)</span>
            <input
              name="organizationLogo"
              value={form.organizationLogo}
              onChange={handleChange}
              className="form-control"
            />
          </label>

          <label>
            <span className="mb-1 block text-sm font-semibold text-slate-700">Password</span>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="form-control"
              required
            />
          </label>

          <label>
            <span className="mb-1 block text-sm font-semibold text-slate-700">Confirm Password</span>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              className="form-control"
              required
            />
          </label>

          {error && <p className="md:col-span-2 text-sm text-red-600">{error}</p>}
          {success && <p className="md:col-span-2 text-sm text-emerald-700">{success}</p>}
          {loading && uploadProgress > 0 && (
            <div className="md:col-span-2">
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                <div className="h-full bg-kohBlue transition-all" style={{ width: `${uploadProgress}%` }} />
              </div>
              <p className="mt-1 text-xs text-slate-600">Uploading files: {uploadProgress}%</p>
            </div>
          )}
          {verificationLink && (
            <p className="md:col-span-2 text-sm text-slate-600">
              Verification link (development):{' '}
              <a href={verificationLink} className="font-semibold text-kohBlue hover:underline">
                Verify organization email
              </a>
            </p>
          )}

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-kohBlue px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? 'Creating Account...' : 'Create Organization Account'}
            </button>
          </div>
        </form>

        <p className="mt-5 text-sm text-slate-600">
          Looking for personal registration?{' '}
          <Link to="/register" className="font-semibold text-kohBlue hover:underline">
            Job Seeker Registration
          </Link>
        </p>
      </section>
    </main>
  )
}

export default EmployerRegisterPage
