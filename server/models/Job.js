const mongoose = require('mongoose')

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    organization: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      default: 'Kakuma',
      trim: true,
    },
    type: {
      type: String,
      enum: ['full-time', 'part-time', 'internship', 'volunteer', 'training'],
      default: 'full-time',
    },
    category: {
      type: String,
      enum: [
        'jobs',
        'scholarships',
        'courses',
        'volunteering',
        'innovation',
        'mentorship',
        'ngos',
        'remote-work',
      ],
      default: 'jobs',
    },
    mode: {
      type: String,
      enum: ['online', 'offline', 'hybrid'],
      default: 'offline',
    },
    skillLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'all'],
      default: 'all',
    },
    deadline: {
      type: Date,
      default: null,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    organizationLogo: {
      type: String,
      default: '',
      trim: true,
    },
    opportunityImage: {
      type: String,
      default: '',
      trim: true,
    },
    salaryRange: {
      type: String,
      default: 'Negotiable',
    },
    skills: {
      type: [String],
      default: [],
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'closed'],
      default: 'published',
    },
  },
  {
    timestamps: true,
  },
)

jobSchema.index({ title: 'text' })
jobSchema.index({ status: 1, category: 1, location: 1, deadline: 1, mode: 1 })

module.exports = mongoose.model('Job', jobSchema)
