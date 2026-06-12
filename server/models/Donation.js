const mongoose = require('mongoose')

const donationSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
    currency: {
      type: String,
      default: 'USD',
      uppercase: true,
      trim: true,
    },
    paymentMethod: {
      type: String,
      enum: ['M-Pesa', 'Visa/Mastercard', 'PayPal', 'Stripe'],
      required: true,
    },
    frequency: {
      type: String,
      enum: ['one-time', 'monthly'],
      default: 'one-time',
    },
    sponsorProgram: {
      type: String,
      default: '',
      trim: true,
    },
    message: {
      type: String,
      default: '',
      trim: true,
    },
    donorName: {
      type: String,
      default: 'Anonymous',
      trim: true,
    },
    donorEmail: {
      type: String,
      default: '',
      trim: true,
      lowercase: true,
    },
    donorPhone: {
      type: String,
      default: '',
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
    processorReference: {
      type: String,
      default: '',
      trim: true,
    },
    processorPayload: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    paidAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
)

donationSchema.index({ status: 1, createdAt: -1 })

module.exports = mongoose.model('Donation', donationSchema)
