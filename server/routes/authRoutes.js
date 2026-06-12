const express = require('express')
const {
	approveEmployer,
	forgotPassword,
	googleSignIn,
	listPendingEmployers,
	login,
	logout,
	me,
	resendVerificationEmail,
	register,
	updateProfile,
	verifyEmail,
} = require('../controllers/authController')
const authMiddleware = require('../middleware/authMiddleware')
const adminMiddleware = require('../middleware/adminMiddleware')
const { profileUpload, registerUpload } = require('../middleware/uploadMiddleware')
const uploadRateLimit = require('../middleware/uploadRateLimitMiddleware')

const router = express.Router()

router.post('/register', uploadRateLimit, registerUpload, register)
router.post('/login', login)
router.post('/google', googleSignIn)
router.post('/logout', authMiddleware, logout)
router.post('/forgot-password', forgotPassword)
router.post('/resend-verification', resendVerificationEmail)
router.get('/verify-email/:token', verifyEmail)
router.get('/me', authMiddleware, me)
router.get('/employers/pending', authMiddleware, adminMiddleware, listPendingEmployers)
router.patch('/profile', authMiddleware, uploadRateLimit, profileUpload, updateProfile)
router.patch('/employers/:userId/approve', authMiddleware, adminMiddleware, approveEmployer)

module.exports = router
