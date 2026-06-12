import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

function ProfilePage() {
  const { user } = useAuth()
  const [form, setForm] = useState({
    name: '',
    phoneNumber: '',
    location: '',
    nationality: '',
    skills: '',
    education: '',
    experience: '',
    bio: '',
    profileImage: '',
    cvUrl: '',
    certificates: '',
    organizationName: '',
    organizationType: '',
    website: '',
    organizationDescription: '',
    organizationLogo: '',
  })
  const [profileImageFile, setProfileImageFile] = useState(null)
  const [cvFile, setCvFile] = useState(null)
  const [certificateFiles, setCertificateFiles] = useState([])
  const [organizationLogoFile, setOrganizationLogoFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/auth/me')
        setForm({
          name: data.name || '',
          phoneNumber: data.phoneNumber || '',
          location: data.location || '',
          nationality: data.nationality || '',
          skills: Array.isArray(data.skills) ? data.skills.join(', ') : '',
          education: data.education || '',
          experience: data.experience || '',
          bio: data.bio || '',
          profileImage: data.profileImage || '',
          cvUrl: data.cvUrl || '',
          certificates: Array.isArray(data.certificates) ? data.certificates.join(', ') : '',
          organizationName: data.organizationName || '',
          organizationType: data.organizationType || '',
          website: data.website || '',
          organizationDescription: data.organizationDescription || '',
          organizationLogo: data.organizationLogo || '',
        })
      } catch (fetchError) {
        setError(fetchError.response?.data?.message || 'Unable to load your profile right now.')
      }
    }

    fetchProfile()
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)
    setUploadProgress(0)

    try {
      const payload = new FormData()
      Object.entries(form).forEach(([key, value]) => {
        payload.append(key, value)
      })

      if (profileImageFile) {
        payload.append('profileImage', profileImageFile)
      }
      if (cvFile) {
        payload.append('cvFile', cvFile)
      }
      certificateFiles.forEach((file) => {
        payload.append('certificates', file)
      })
      if (organizationLogoFile) {
        payload.append('organizationLogo', organizationLogoFile)
      }

      const { data } = await api.patch('/auth/profile', payload, {
        onUploadProgress: (event) => {
          if (!event.total) {
            return
          }
          setUploadProgress(Math.round((event.loaded * 100) / event.total))
        },
      })

      setForm((prev) => ({
        ...prev,
        profileImage: data.profileImage || prev.profileImage,
        cvUrl: data.cvUrl || prev.cvUrl,
        certificates: Array.isArray(data.certificates) ? data.certificates.join(', ') : prev.certificates,
        organizationLogo: data.organizationLogo || prev.organizationLogo,
      }))

      setProfileImageFile(null)
      setCvFile(null)
      setCertificateFiles([])
      setOrganizationLogoFile(null)
      setUploadProgress(0)
      setMessage('Profile updated successfully.')
    } catch (submitError) {
      setError(submitError.response?.data?.message || 'Unable to update profile right now.')
      setUploadProgress(0)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-16 md:px-6">
      <section className="brand-card border border-slate-100 p-7">
        <h2 className="text-3xl font-extrabold">Profile</h2>
        <p className="mt-2 text-slate-600">Manage your personal and professional information.</p>

        {user && (
          <div className="mt-4 text-sm text-slate-700">
            <p>
              <span className="font-bold">Signed in as:</span> {user.email} ({user.role})
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
          <label>
            <span className="mb-1 block text-sm font-semibold text-slate-700">Name</span>
            <input name="name" value={form.name} onChange={handleChange} className="form-control" />
          </label>
          <label>
            <span className="mb-1 block text-sm font-semibold text-slate-700">Phone Number</span>
            <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} className="form-control" />
          </label>
          <label>
            <span className="mb-1 block text-sm font-semibold text-slate-700">Location</span>
            <input name="location" value={form.location} onChange={handleChange} className="form-control" />
          </label>
          <label>
            <span className="mb-1 block text-sm font-semibold text-slate-700">Nationality</span>
            <input name="nationality" value={form.nationality} onChange={handleChange} className="form-control" />
          </label>
          <label className="md:col-span-2">
            <span className="mb-1 block text-sm font-semibold text-slate-700">Skills (comma separated)</span>
            <input name="skills" value={form.skills} onChange={handleChange} className="form-control" />
          </label>
          <label>
            <span className="mb-1 block text-sm font-semibold text-slate-700">Education</span>
            <input name="education" value={form.education} onChange={handleChange} className="form-control" />
          </label>
          <label>
            <span className="mb-1 block text-sm font-semibold text-slate-700">Experience</span>
            <input name="experience" value={form.experience} onChange={handleChange} className="form-control" />
          </label>
          <label className="md:col-span-2">
            <span className="mb-1 block text-sm font-semibold text-slate-700">Bio</span>
            <textarea name="bio" value={form.bio} onChange={handleChange} rows={3} className="form-textarea" />
          </label>

          <label className="md:col-span-2">
            <span className="mb-1 block text-sm font-semibold text-slate-700">Upload Profile Photo (optional)</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(event) => setProfileImageFile(event.target.files?.[0] || null)}
              className="form-control"
            />
            {profileImageFile && <p className="mt-1 text-xs text-slate-600">Selected: {profileImageFile.name}</p>}
          </label>
          <label className="md:col-span-2">
            <span className="mb-1 block text-sm font-semibold text-slate-700">Profile Photo URL Fallback</span>
            <input name="profileImage" value={form.profileImage} onChange={handleChange} className="form-control" />
          </label>

          <label className="md:col-span-2">
            <span className="mb-1 block text-sm font-semibold text-slate-700">Upload CV/Resume (optional)</span>
            <input
              type="file"
              accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={(event) => setCvFile(event.target.files?.[0] || null)}
              className="form-control"
            />
            {cvFile && <p className="mt-1 text-xs text-slate-600">Selected: {cvFile.name}</p>}
          </label>
          <label className="md:col-span-2">
            <span className="mb-1 block text-sm font-semibold text-slate-700">CV URL Fallback</span>
            <input name="cvUrl" value={form.cvUrl} onChange={handleChange} className="form-control" />
          </label>

          <label className="md:col-span-2">
            <span className="mb-1 block text-sm font-semibold text-slate-700">Upload Certificates (optional, multiple)</span>
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={(event) => setCertificateFiles(Array.from(event.target.files || []))}
              className="form-control"
            />
            {certificateFiles.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {certificateFiles.map((file) => (
                  <span key={file.name} className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700">
                    {file.name}
                  </span>
                ))}
              </div>
            )}
          </label>
          <label className="md:col-span-2">
            <span className="mb-1 block text-sm font-semibold text-slate-700">Certificates URLs Fallback</span>
            <input name="certificates" value={form.certificates} onChange={handleChange} className="form-control" />
          </label>

          {user?.role === 'employer' && (
            <>
              <label>
                <span className="mb-1 block text-sm font-semibold text-slate-700">Organization Name</span>
                <input name="organizationName" value={form.organizationName} onChange={handleChange} className="form-control" />
              </label>
              <label>
                <span className="mb-1 block text-sm font-semibold text-slate-700">Organization Type</span>
                <input name="organizationType" value={form.organizationType} onChange={handleChange} className="form-control" />
              </label>
              <label>
                <span className="mb-1 block text-sm font-semibold text-slate-700">Website</span>
                <input name="website" value={form.website} onChange={handleChange} className="form-control" />
              </label>
              <label className="md:col-span-2">
                <span className="mb-1 block text-sm font-semibold text-slate-700">Organization Description</span>
                <textarea
                  name="organizationDescription"
                  value={form.organizationDescription}
                  onChange={handleChange}
                  rows={3}
                  className="form-textarea"
                />
              </label>
              <label className="md:col-span-2">
                <span className="mb-1 block text-sm font-semibold text-slate-700">Upload Organization Logo</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(event) => setOrganizationLogoFile(event.target.files?.[0] || null)}
                  className="form-control"
                />
                {organizationLogoFile && <p className="mt-1 text-xs text-slate-600">Selected: {organizationLogoFile.name}</p>}
              </label>
              <label className="md:col-span-2">
                <span className="mb-1 block text-sm font-semibold text-slate-700">Organization Logo URL Fallback</span>
                <input name="organizationLogo" value={form.organizationLogo} onChange={handleChange} className="form-control" />
              </label>
            </>
          )}

          {error && <p className="md:col-span-2 text-sm text-red-600">{error}</p>}
          {message && <p className="md:col-span-2 text-sm text-emerald-700">{message}</p>}
          {loading && uploadProgress > 0 && (
            <div className="md:col-span-2">
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                <div className="h-full bg-kohBlue transition-all" style={{ width: `${uploadProgress}%` }} />
              </div>
              <p className="mt-1 text-xs text-slate-600">Uploading files: {uploadProgress}%</p>
            </div>
          )}

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-kohBlue px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </section>
    </main>
  )
}

export default ProfilePage
