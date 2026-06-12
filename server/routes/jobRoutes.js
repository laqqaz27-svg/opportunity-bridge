const express = require('express')
const {
	createJob,
	deleteJob,
	listJobs,
	listMyJobs,
	updateJob,
	updateJobStatus,
} = require('../controllers/jobController')
const authMiddleware = require('../middleware/authMiddleware')
const employerMiddleware = require('../middleware/employerMiddleware')
const { jobUpload } = require('../middleware/uploadMiddleware')
const uploadRateLimit = require('../middleware/uploadRateLimitMiddleware')

const router = express.Router()

router.get('/', listJobs)
router.get('/my', authMiddleware, employerMiddleware, listMyJobs)
router.post('/', authMiddleware, employerMiddleware, uploadRateLimit, jobUpload, createJob)
router.patch('/:jobId', authMiddleware, employerMiddleware, uploadRateLimit, jobUpload, updateJob)
router.patch('/:jobId/status', authMiddleware, employerMiddleware, updateJobStatus)
router.delete('/:jobId', authMiddleware, employerMiddleware, deleteJob)

module.exports = router
