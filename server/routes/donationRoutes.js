const express = require('express')
const {
  createCheckout,
  getDonationStats,
  markDonationPaid,
} = require('../controllers/donationController')
const authMiddleware = require('../middleware/authMiddleware')
const adminMiddleware = require('../middleware/adminMiddleware')

const router = express.Router()

router.get('/stats', getDonationStats)
router.post('/checkout', createCheckout)
router.patch('/:donationId/mark-paid', authMiddleware, adminMiddleware, markDonationPaid)

module.exports = router
