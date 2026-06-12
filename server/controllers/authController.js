const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const { OAuth2Client } = require('google-auth-library')
const User = require('../models/User')
const { deleteFileFromCloudinary, uploadFileToCloudinary } = require('../utils/cloudinary')
const { sendEmail } = require('../utils/email')

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

const normalizeEmail = (email = '') => String(email).trim().toLowerCase()

const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  })

const normalizeRole = (roleInput) => {
  const role = (roleInput || 'user').toLowerCase().trim()
  if (role === 'jobseeker' || role === 'job_seeker') {
    return 'user'
  }
  return role
}

const sanitizeStringArray = (value) => {
  if (!value) {
    return []
  }

  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean)
  }

  return String(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

const firstUploadedFile = (req, fieldName) => req.files?.[fieldName]?.[0] || null

const uploadUserRegistrationFiles = async (req, currentValues) => {
  const profileImageFile = firstUploadedFile(req, 'profileImage')
  const cvFile = firstUploadedFile(req, 'cvFile')
  const certificateFiles = req.files?.certificates || []
  const organizationLogoFile = firstUploadedFile(req, 'organizationLogo')

  const profileImage = profileImageFile
    ? await uploadFileToCloudinary(profileImageFile, 'opportunity-bridge/users/profile-images')
    : currentValues.profileImage

  const cvUrl = cvFile
    ? await uploadFileToCloudinary(cvFile, 'opportunity-bridge/users/cvs')
    : currentValues.cvUrl

  const uploadedCertificates = await Promise.all(
    certificateFiles.map((file) => uploadFileToCloudinary(file, 'opportunity-bridge/users/certificates')),
  )

  const certificates =
    uploadedCertificates.length > 0 ? uploadedCertificates : sanitizeStringArray(currentValues.certificates)

  const organizationLogo = organizationLogoFile
    ? await uploadFileToCloudinary(organizationLogoFile, 'opportunity-bridge/employers/logos')
    : currentValues.organizationLogo

  return {
    profileImage,
    cvUrl,
    certificates,
    organizationLogo,
  }
}

const getVerificationLink = (token) =>
  `${process.env.CLIENT_ORIGIN || 'http://localhost:5173'}/verify-email?token=${token}`

const sendVerificationEmail = async ({ email, name, token }) => {
  const verificationLink = getVerificationLink(token)
  const displayName = name || 'there'
  const subject = 'Verify your Opportunity Bridge email'
  const text = `Hello ${displayName}, verify your email by opening this link: ${verificationLink}`
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #0f172a;">
      <h2 style="margin-bottom: 8px;">Verify your email address</h2>
      <p>Hello ${displayName},</p>
      <p>Thanks for registering with Opportunity Bridge. Please verify your email to activate your account.</p>
      <p>
        <a href="${verificationLink}" style="display:inline-block;padding:10px 16px;border-radius:9999px;background:#1d4ed8;color:#ffffff;text-decoration:none;font-weight:700;">
          Verify Email
        </a>
      </p>
      <p>If the button does not work, copy this link into your browser:</p>
      <p>${verificationLink}</p>
      <p>This link expires in 24 hours.</p>
    </div>
  `

  return sendEmail({
    to: email,
    subject,
    text,
    html,
  })
}

const register = async (req, res, next) => {
  try {
    const {
      name,
      email: rawEmail,
      password,
      role: rawRole,
      phoneNumber,
      location,
      nationality,
      gender,
      ageRange,
      age,
      skills,
      education,
      experience,
      bio,
      profileImage,
      cvUrl,
      certificates,
      organizationName,
      organizationType,
      website,
      organizationLogo,
      organizationDescription,
    } = req.body

    const role = normalizeRole(rawRole)
    const email = normalizeEmail(rawEmail)
    if (!['user', 'employer'].includes(role)) {
      return res.status(400).json({ message: 'Role must be user or employer' })
    }

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address' })
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long' })
    }

    if (role === 'user' && !name) {
      return res.status(400).json({ message: 'Full name is required for job seekers' })
    }

    if (role === 'employer' && !organizationName) {
      return res.status(400).json({ message: 'Organization name is required for employer accounts' })
    }

    if (role === 'employer' && !organizationType) {
      return res.status(400).json({ message: 'Organization type is required for employer accounts' })
    }

    if (role === 'user' && !phoneNumber) {
      return res.status(400).json({ message: 'Phone number is required for job seekers' })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(409).json({ message: 'Email already in use' })
    }

    const verificationToken = crypto.randomBytes(32).toString('hex')
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000)

    const hashedPassword = await bcrypt.hash(password, 10)
    const uploadedFiles = await uploadUserRegistrationFiles(req, {
      profileImage,
      cvUrl,
      certificates,
      organizationLogo,
    })

    const user = await User.create({
      name: role === 'employer' ? organizationName : name,
      email,
      password: hashedPassword,
      role,
      phoneNumber,
      location,
      nationality,
      gender,
      ageRange,
      age,
      skills: sanitizeStringArray(skills),
      education,
      experience,
      bio,
      profileImage: uploadedFiles.profileImage,
      cvUrl: uploadedFiles.cvUrl,
      certificates: uploadedFiles.certificates,
      organizationName,
      organizationType,
      website,
      organizationLogo: uploadedFiles.organizationLogo,
      organizationDescription,
      isVerified: false,
      verificationToken,
      verificationTokenExpires,
      isApproved: role === 'employer' ? false : true,
    })

    const verificationLink = getVerificationLink(verificationToken)
    const verificationEmailSent = await sendVerificationEmail({
      email: user.email,
      name: user.name,
      token: verificationToken,
    }).catch(() => false)

    return res.status(201).json({
      message:
        'Registration successful. Please verify your email address before signing in.',
      verificationLink: verificationEmailSent ? '' : verificationLink,
      verificationEmailSent,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        isApproved: user.isApproved,
      },
    })
  } catch (error) {
    return next(error)
  }
}

const login = async (req, res, next) => {
  try {
    const { email: rawEmail, password } = req.body
    const email = normalizeEmail(rawEmail)

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address' })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: 'Please verify your email before signing in' })
    }

    if (user.role === 'employer' && !user.isApproved) {
      return res.status(403).json({ message: 'Organization account pending admin approval' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const token = signToken(user)

    return res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        isApproved: user.isApproved,
      },
    })
  } catch (error) {
    return next(error)
  }
}

const googleSignIn = async (req, res, next) => {
  try {
    const { idToken } = req.body

    if (!process.env.GOOGLE_CLIENT_ID) {
      return res.status(500).json({ message: 'Google sign-in is not configured on the server' })
    }

    if (!idToken) {
      return res.status(400).json({ message: 'Google ID token is required' })
    }

    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    })

    const payload = ticket.getPayload()
    const email = normalizeEmail(payload?.email)

    if (!payload?.email_verified || !email || !EMAIL_REGEX.test(email)) {
      return res.status(401).json({ message: 'Google account email could not be verified' })
    }

    let user = await User.findOne({ email })

    if (!user) {
      const generatedPassword = crypto.randomBytes(32).toString('hex')
      const hashedPassword = await bcrypt.hash(generatedPassword, 10)

      user = await User.create({
        name: payload?.name || email.split('@')[0],
        email,
        password: hashedPassword,
        role: 'user',
        profileImage: payload?.picture || '',
        isVerified: true,
        isApproved: true,
      })
    }

    if (!user.isVerified) {
      user.isVerified = true
      user.verificationToken = ''
      user.verificationTokenExpires = null
      await user.save()
    }

    if (user.role === 'employer' && !user.isApproved) {
      return res.status(403).json({ message: 'Organization account pending admin approval' })
    }

    const token = signToken(user)

    return res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        isApproved: user.isApproved,
      },
    })
  } catch (error) {
    return res.status(401).json({ message: 'Google sign-in failed' })
  }
}

const me = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select('-password')
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    return res.status(200).json(user)
  } catch (error) {
    return next(error)
  }
}

const logout = async (req, res) => {
  return res.status(200).json({ message: 'Logged out successfully' })
}

const forgotPassword = async (req, res) => {
  const email = normalizeEmail(req.body?.email)
  const supportEmail = process.env.SUPPORT_EMAIL || 'support@opportunitybridge.org'

  if (email && !EMAIL_REGEX.test(email)) {
    return res.status(400).json({ message: 'Please provide a valid email address' })
  }

  return res.status(200).json({
    message:
      `If an account with that email exists, a password reset link will be sent when this feature is enabled. For urgent help, contact ${supportEmail}.`,
  })
}

const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: new Date() },
    })

    if (!user) {
      return res.status(400).json({ message: 'Verification link is invalid or expired' })
    }

    user.isVerified = true
    user.verificationToken = ''
    user.verificationTokenExpires = null
    await user.save()

    return res.status(200).json({ message: 'Email verified successfully. You can now sign in.' })
  } catch (error) {
    return next(error)
  }
}

const resendVerificationEmail = async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body?.email)

    if (!email || !EMAIL_REGEX.test(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address' })
    }

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(200).json({
        message: 'If an account exists for this email, a verification link has been sent.',
      })
    }

    if (user.isVerified) {
      return res.status(200).json({ message: 'This email is already verified. You can sign in.' })
    }

    const verificationToken = crypto.randomBytes(32).toString('hex')
    user.verificationToken = verificationToken
    user.verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000)
    await user.save()

    const verificationLink = getVerificationLink(verificationToken)
    const verificationEmailSent = await sendVerificationEmail({
      email: user.email,
      name: user.name,
      token: verificationToken,
    }).catch(() => false)

    return res.status(200).json({
      message: verificationEmailSent
        ? 'Verification email sent. Please check your inbox.'
        : 'Email delivery is not configured. Use the verification link below.',
      verificationEmailSent,
      verificationLink: verificationEmailSent ? '' : verificationLink,
    })
  } catch (error) {
    return next(error)
  }
}

const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const profileImageFile = firstUploadedFile(req, 'profileImage')
    const cvFile = firstUploadedFile(req, 'cvFile')
    const certificateFiles = req.files?.certificates || []
    const organizationLogoFile = firstUploadedFile(req, 'organizationLogo')
    const previousProfileImage = user.profileImage
    const previousCvUrl = user.cvUrl
    const previousOrganizationLogo = user.organizationLogo
    const previousCertificates = Array.isArray(user.certificates) ? [...user.certificates] : []

    const updatableFields = [
      'name',
      'phoneNumber',
      'location',
      'nationality',
      'education',
      'experience',
      'bio',
      'organizationName',
      'organizationType',
      'website',
      'organizationDescription',
    ]

    for (const field of updatableFields) {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        user[field] = req.body[field]
      }
    }

    if (Object.prototype.hasOwnProperty.call(req.body, 'skills')) {
      user.skills = sanitizeStringArray(req.body.skills)
    }

    if (Object.prototype.hasOwnProperty.call(req.body, 'certificates') && certificateFiles.length === 0) {
      user.certificates = sanitizeStringArray(req.body.certificates)
    }

    if (Object.prototype.hasOwnProperty.call(req.body, 'profileImage') && !profileImageFile) {
      user.profileImage = String(req.body.profileImage || '').trim()
    }

    if (Object.prototype.hasOwnProperty.call(req.body, 'cvUrl') && !cvFile) {
      user.cvUrl = String(req.body.cvUrl || '').trim()
    }

    if (Object.prototype.hasOwnProperty.call(req.body, 'organizationLogo') && !organizationLogoFile) {
      user.organizationLogo = String(req.body.organizationLogo || '').trim()
    }

    if (profileImageFile) {
      user.profileImage = await uploadFileToCloudinary(
        profileImageFile,
        'opportunity-bridge/users/profile-images',
      )

      if (previousProfileImage && previousProfileImage !== user.profileImage) {
        await deleteFileFromCloudinary(previousProfileImage).catch(() => false)
      }
    }

    if (cvFile) {
      user.cvUrl = await uploadFileToCloudinary(cvFile, 'opportunity-bridge/users/cvs')

      if (previousCvUrl && previousCvUrl !== user.cvUrl) {
        await deleteFileFromCloudinary(previousCvUrl).catch(() => false)
      }
    }

    if (certificateFiles.length > 0) {
      user.certificates = await Promise.all(
        certificateFiles.map((file) => uploadFileToCloudinary(file, 'opportunity-bridge/users/certificates')),
      )

      await Promise.all(
        previousCertificates
          .filter((url) => !user.certificates.includes(url))
          .map((url) => deleteFileFromCloudinary(url).catch(() => false)),
      )
    }

    if (organizationLogoFile) {
      user.organizationLogo = await uploadFileToCloudinary(
        organizationLogoFile,
        'opportunity-bridge/employers/logos',
      )

      if (previousOrganizationLogo && previousOrganizationLogo !== user.organizationLogo) {
        await deleteFileFromCloudinary(previousOrganizationLogo).catch(() => false)
      }
    }

    await user.save()

    const safeUser = await User.findById(user._id).select('-password')
    return res.status(200).json(safeUser)
  } catch (error) {
    return next(error)
  }
}

const approveEmployer = async (req, res, next) => {
  try {
    const { userId } = req.params
    const user = await User.findById(userId)

    if (!user || user.role !== 'employer') {
      return res.status(404).json({ message: 'Employer account not found' })
    }

    user.isApproved = true
    await user.save()

    return res.status(200).json({ message: 'Employer account approved successfully' })
  } catch (error) {
    return next(error)
  }
}

const listPendingEmployers = async (req, res, next) => {
  try {
    const employers = await User.find({ role: 'employer', isApproved: false })
      .select('name email organizationName organizationType website location phoneNumber isVerified createdAt')
      .sort({ createdAt: -1 })

    return res.status(200).json({ employers })
  } catch (error) {
    return next(error)
  }
}

module.exports = {
  register,
  login,
  googleSignIn,
  me,
  logout,
  forgotPassword,
  verifyEmail,
  resendVerificationEmail,
  updateProfile,
  approveEmployer,
  listPendingEmployers,
}
