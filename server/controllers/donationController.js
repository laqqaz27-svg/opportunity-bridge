const Donation = require('../models/Donation')
const { createPaymentSession } = require('../utils/paymentGateway')

const DONATION_GOAL = Number(process.env.DONATION_GOAL || 10000)

const createCheckout = async (req, res, next) => {
  try {
    const {
      amount,
      currency = 'USD',
      paymentMethod,
      frequency = 'one-time',
      sponsorProgram = '',
      message = '',
      donorName = 'Anonymous',
      donorEmail = '',
      donorPhone = '',
    } = req.body

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ message: 'Valid donation amount is required.' })
    }

    if (!paymentMethod) {
      return res.status(400).json({ message: 'Payment method is required.' })
    }

    const donation = await Donation.create({
      amount: Number(amount),
      currency,
      paymentMethod,
      frequency,
      sponsorProgram,
      message,
      donorName,
      donorEmail,
      donorPhone,
      status: 'pending',
    })

    const paymentSession = await createPaymentSession({
      donationId: donation._id,
      amount: donation.amount,
      currency: donation.currency,
      paymentMethod: donation.paymentMethod,
      donorEmail: donation.donorEmail,
    })

    donation.processorReference = paymentSession.reference || ''
    donation.processorPayload = paymentSession
    await donation.save()

    return res.status(201).json({
      donationId: donation._id,
      payment: paymentSession,
      message: 'Donation checkout initialized successfully.',
    })
  } catch (error) {
    return next(error)
  }
}

const markDonationPaid = async (req, res, next) => {
  try {
    const donation = await Donation.findById(req.params.donationId)
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found.' })
    }

    donation.status = 'paid'
    donation.paidAt = new Date()
    await donation.save()

    return res.status(200).json({ message: 'Donation marked as paid.', donation })
  } catch (error) {
    return next(error)
  }
}

const getDonationStats = async (req, res, next) => {
  try {
    const [aggregate] = await Donation.aggregate([
      { $match: { status: 'paid' } },
      { $group: { _id: null, totalRaised: { $sum: '$amount' } } },
    ])

    const totalRaised = aggregate?.totalRaised || 0

    return res.status(200).json({
      totalRaised,
      goal: DONATION_GOAL,
      progressPercent: DONATION_GOAL > 0 ? Math.min(Math.round((totalRaised / DONATION_GOAL) * 100), 100) : 0,
    })
  } catch (error) {
    return next(error)
  }
}

module.exports = {
  createCheckout,
  markDonationPaid,
  getDonationStats,
}
