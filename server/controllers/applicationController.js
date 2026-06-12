const Application = require('../models/Application')
const Job = require('../models/Job')
const { uploadFileToCloudinary } = require('../utils/cloudinary')

const applyToJob = async (req, res, next) => {
  try {
    if (req.userRole !== 'user') {
      return res.status(403).json({ message: 'Only job seekers can apply to jobs' })
    }

    const { jobId } = req.params
    const { coverLetter, resumeUrl: resumeUrlInput, supportingDocumentUrl: supportingDocumentUrlInput } = req.body

    const job = await Job.findById(jobId)
    if (!job || job.status !== 'published') {
      return res.status(404).json({ message: 'Job not found or not open for applications' })
    }

    const existing = await Application.findOne({ applicant: req.userId, job: jobId })
    if (existing) {
      return res.status(409).json({ message: 'You have already applied to this opportunity' })
    }

    const resumeFile = req.files?.resume?.[0]
    const supportingDocumentFile = req.files?.supportingDocument?.[0]

    const resumeUrl = resumeFile
      ? await uploadFileToCloudinary(resumeFile, 'opportunity-bridge/applications/resumes')
      : String(resumeUrlInput || '').trim()

    const supportingDocumentUrl = supportingDocumentFile
      ? await uploadFileToCloudinary(supportingDocumentFile, 'opportunity-bridge/applications/supporting-documents')
      : String(supportingDocumentUrlInput || '').trim()

    if (!resumeUrl) {
      return res.status(400).json({ message: 'Resume file is required to apply.' })
    }

    const application = await Application.create({
      applicant: req.userId,
      job: jobId,
      coverLetter,
      resumeUrl,
      supportingDocumentUrl,
    })

    return res.status(201).json(application)
  } catch (error) {
    return next(error)
  }
}

const listMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ applicant: req.userId })
      .sort({ createdAt: -1 })
      .populate({
        path: 'job',
        select: 'title organization location type status createdAt',
      })

    return res.status(200).json(applications)
  } catch (error) {
    return next(error)
  }
}

module.exports = { applyToJob, listMyApplications }
