const mongoose = require('mongoose')

const applicationSchema = new mongoose.Schema(
  {
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    coverLetter: {
      type: String,
      default: '',
      trim: true,
    },
    resumeUrl: {
      type: String,
      default: '',
      trim: true,
    },
    supportingDocumentUrl: {
      type: String,
      default: '',
      trim: true,
    },
    status: {
      type: String,
      enum: ['submitted', 'reviewing', 'shortlisted', 'rejected', 'accepted'],
      default: 'submitted',
    },
  },
  {
    timestamps: true,
  },
)

applicationSchema.index({ applicant: 1, job: 1 }, { unique: true })
applicationSchema.index({ job: 1, status: 1 })

module.exports = mongoose.model('Application', applicationSchema)
