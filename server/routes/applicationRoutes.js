const express = require('express')
const { applyToJob, listMyApplications } = require('../controllers/applicationController')
const authMiddleware = require('../middleware/authMiddleware')
const { applicationUpload } = require('../middleware/uploadMiddleware')
const uploadRateLimit = require('../middleware/uploadRateLimitMiddleware')

const router = express.Router()

router.get('/my', authMiddleware, listMyApplications)
router.post('/:jobId', authMiddleware, uploadRateLimit, applicationUpload, applyToJob)

module.exports = router
