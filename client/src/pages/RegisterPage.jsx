import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function RegisterPage() {
  const { register, loading } = useAuth()
  const [step, setStep] = useState(1)

  const [form, setForm] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    gender: 'prefer_not_to_say',
    ageRange: '18-24',
    location: '',
    nationality: '',
    skills: '',
    education: '',
    experience: '',
    bio: '',
    profileImage: '',
    cvUrl: '',
    certificates: '',
  })
  const [profileImageFile, setProfileImageFile] = useState(null)
  const [cvFile, setCvFile] = useState(null)
  const [certificateFiles, setCertificateFiles] = useState([])
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [verificationLink, setVerificationLink] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (event) => {
    const { name, files } = event.target

    if (name === 'profileImageFile') {
      setProfileImageFile(files?.[0] || null)
    }

    if (name === 'cvFile') {
      setCvFile(files?.[0] || null)
    }

    if (name === 'certificateFiles') {
      setCertificateFiles(Array.from(files || []))
    }
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
      payload.append('role', 'user')
      payload.append('name', form.name)
      payload.append('email', form.email)
      payload.append('phoneNumber', form.phoneNumber)
      payload.append('password', form.password)
      payload.append('gender', form.gender)
      payload.append('ageRange', form.ageRange)
      payload.append('location', form.location)
      payload.append('nationality', form.nationality)
      payload.append('skills', form.skills)
      payload.append('education', form.education)
      payload.append('experience', form.experience)
      payload.append('bio', form.bio)
      payload.append('profileImage', form.profileImage)
      payload.append('cvUrl', form.cvUrl)
      payload.append('certificates', form.certificates)

      if (profileImageFile) {
        payload.append('profileImage', profileImageFile)
      }

      if (cvFile) {
        payload.append('cvFile', cvFile)
      }

      certificateFiles.forEach((file) => {
        payload.append('certificates', file)
      })

      const result = await register(payload, {
        onUploadProgress: (event) => {
          if (!event.total) {
            return
          }
          setUploadProgress(Math.round((event.loaded * 100) / event.total))
        },
      })
      setSuccess(result.message || 'Registration successful. Please verify your email.')
      setVerificationLink(result.verificationLink || '')
      setStep(1)
      setProfileImageFile(null)
      setCvFile(null)
      setCertificateFiles([])
      setUploadProgress(0)
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to create account right now.')
      setUploadProgress(0)
    }
  }

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 4))
  const previousStep = () => setStep((prev) => Math.max(prev - 1, 1))

  const isStepOneValid = form.name && form.email && form.phoneNumber && form.password && form.confirmPassword
  const isStepTwoValid = form.location

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-12 md:px-6 md:py-16">
      <section className="brand-card border border-slate-100 p-7">
        <h2 className="text-3xl font-extrabold">Create Job Seeker Account</h2>
        <p className="mt-2 text-slate-600">Step {step} of 4. Build your profile and start applying for opportunities.</p>
        <p className="mt-2 text-sm text-slate-600">
          Registering an organization?{' '}
          <Link to="/register/employer" className="font-semibold text-kohBlue hover:underline">
            Go to Employer / NGO Registration
          </Link>
        </p>

        <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
          {step === 1 && (
            <>
              <label className="md:col-span-2">
                <span className="mb-1 block text-sm font-semibold text-slate-700">Full Name</span>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
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
            </>
          )}

          {step === 2 && (
            <>
              <label>
                <span className="mb-1 block text-sm font-semibold text-slate-700">Gender</span>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="prefer_not_to_say">Prefer not to say</option>
                </select>
              </label>
              <label>
                <span className="mb-1 block text-sm font-semibold text-slate-700">Age Range</span>
                <select
                  name="ageRange"
                  value={form.ageRange}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="18-24">18-24</option>
                  <option value="25-34">25-34</option>
                  <option value="35-44">35-44</option>
                  <option value="45+">45+</option>
                </select>
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
                <span className="mb-1 block text-sm font-semibold text-slate-700">Nationality</span>
                <input
                  name="nationality"
                  value={form.nationality}
                  onChange={handleChange}
                  className="form-control"
                />
              </label>
            </>
          )}

          {step === 3 && (
            <>
              <label className="md:col-span-2">
                <span className="mb-1 block text-sm font-semibold text-slate-700">Skills (comma separated)</span>
                <input
                  name="skills"
                  value={form.skills}
                  onChange={handleChange}
                  className="form-control"
                />
              </label>
              <label>
                <span className="mb-1 block text-sm font-semibold text-slate-700">Education</span>
                <input
                  name="education"
                  value={form.education}
                  onChange={handleChange}
                  className="form-control"
                />
              </label>
              <label>
                <span className="mb-1 block text-sm font-semibold text-slate-700">Experience</span>
                <input
                  name="experience"
                  value={form.experience}
                  onChange={handleChange}
                  className="form-control"
                />
              </label>
              <label className="md:col-span-2">
                <span className="mb-1 block text-sm font-semibold text-slate-700">Bio</span>
                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  rows={3}
                  className="form-textarea"
                />
              </label>
            </>
          )}

          {step === 4 && (
            <>
              <label className="md:col-span-2">
                <span className="mb-1 block text-sm font-semibold text-slate-700">Profile Photo Upload (optional, JPG/PNG/WebP, max 5MB)</span>
                <input
                  type="file"
                  name="profileImageFile"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="form-control"
                />
                {profileImageFile && <p className="mt-1 text-xs text-slate-600">Selected: {profileImageFile.name}</p>}
              </label>
              <label className="md:col-span-2">
                <span className="mb-1 block text-sm font-semibold text-slate-700">Profile Photo URL Fallback (optional)</span>
                <input
                  name="profileImage"
                  value={form.profileImage}
                  onChange={handleChange}
                  className="form-control"
                />
              </label>
              <label className="md:col-span-2">
                <span className="mb-1 block text-sm font-semibold text-slate-700">CV/Resume Upload (optional, PDF/DOC/DOCX, max 10MB)</span>
                <input
                  type="file"
                  name="cvFile"
                  accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={handleFileChange}
                  className="form-control"
                />
                {cvFile && <p className="mt-1 text-xs text-slate-600">Selected: {cvFile.name}</p>}
              </label>
              <label className="md:col-span-2">
                <span className="mb-1 block text-sm font-semibold text-slate-700">CV/Resume URL Fallback (optional)</span>
                <input
                  name="cvUrl"
                  value={form.cvUrl}
                  onChange={handleChange}
                  className="form-control"
                />
              </label>
              <label className="md:col-span-2">
                <span className="mb-1 block text-sm font-semibold text-slate-700">Certificates Upload (optional, multiple, max 5MB each)</span>
                <input
                  type="file"
                  name="certificateFiles"
                  multiple
                  accept="image/jpeg,image/png,image/webp,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={handleFileChange}
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
                <span className="mb-1 block text-sm font-semibold text-slate-700">Certificates URLs Fallback (comma separated)</span>
                <input
                  name="certificates"
                  value={form.certificates}
                  onChange={handleChange}
                  className="form-control"
                />
              </label>
            </>
          )}

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
                Verify your account
              </a>
            </p>
          )}

          <div className="md:col-span-2 flex flex-wrap gap-3">
            {step > 1 && (
              <button
                type="button"
                onClick={previousStep}
                className="rounded-full border border-slate-300 px-6 py-3 text-sm font-bold text-slate-700 transition hover:border-kohBlue hover:text-kohBlue"
              >
                Back
              </button>
            )}
            {step < 4 && (
              <button
                type="button"
                onClick={nextStep}
                disabled={(step === 1 && !isStepOneValid) || (step === 2 && !isStepTwoValid)}
                className="rounded-full bg-kohBlue px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:opacity-60"
              >
                Continue
              </button>
            )}
            {step === 4 && (
              <button
                type="submit"
                disabled={loading}
                className="rounded-full bg-kohBlue px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:opacity-60"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            )}
          </div>
        </form>

        <p className="mt-5 text-sm text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-kohBlue hover:underline">
            Sign In
          </Link>
        </p>
      </section>
    </main>
  )
}

export default RegisterPage
