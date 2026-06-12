const Job = require('../models/Job')
const { uploadFileToCloudinary } = require('../utils/cloudinary')

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

const parseOptionalDate = (value) => {
  if (!value) {
    return null
  }

  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    return null
  }

  return parsed
}

const canManageJob = (job, req) => req.userRole === 'admin' || String(job.postedBy) === String(req.userId)

const listJobs = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page || '1', 10), 1)
    const limit = Math.min(Math.max(parseInt(req.query.limit || '10', 10), 1), 50)
    const skip = (page - 1) * limit

    const query = { status: 'published' }
    if (req.query.search) {
      query.$text = { $search: req.query.search }
    }
    if (req.query.category) {
      query.category = req.query.category
    }
    if (req.query.type) {
      query.type = req.query.type
    }
    if (req.query.mode) {
      query.mode = req.query.mode
    }
    if (req.query.skillLevel) {
      query.skillLevel = req.query.skillLevel
    }
    if (req.query.location) {
      query.location = { $regex: req.query.location, $options: 'i' }
    }
    if (req.query.organization) {
      query.organization = { $regex: req.query.organization, $options: 'i' }
    }
    if (req.query.deadlineBefore || req.query.deadlineAfter) {
      query.deadline = {}
      if (req.query.deadlineBefore) {
        query.deadline.$lte = new Date(req.query.deadlineBefore)
      }
      if (req.query.deadlineAfter) {
        query.deadline.$gte = new Date(req.query.deadlineAfter)
      }
    }

    let sort = { createdAt: -1 }
    if (req.query.sort === 'deadline') {
      sort = { deadline: 1, createdAt: -1 }
    }
    if (req.query.sort === 'recent') {
      sort = { createdAt: -1 }
    }

    const [jobs, total] = await Promise.all([
      Job.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('postedBy', 'name email role'),
      Job.countDocuments(query),
    ])

    return res.status(200).json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      jobs,
    })
  } catch (error) {
    return next(error)
  }
}

const createJob = async (req, res, next) => {
  try {
    const {
      title,
      organization,
      description,
      location,
      type,
      category,
      mode,
      skillLevel,
      deadline,
      salaryRange,
      skills,
      organizationLogo: organizationLogoUrl,
      opportunityImage: opportunityImageUrl,
    } = req.body

    if (!title || !organization || !description) {
      return res.status(400).json({ message: 'Title, organization, and description are required' })
    }

    const organizationLogoFile = req.files?.organizationLogo?.[0]
    const opportunityImageFile = req.files?.opportunityImage?.[0]

    const organizationLogo = organizationLogoFile
      ? await uploadFileToCloudinary(organizationLogoFile, 'opportunity-bridge/jobs/logos')
      : organizationLogoUrl

    const opportunityImage = opportunityImageFile
      ? await uploadFileToCloudinary(opportunityImageFile, 'opportunity-bridge/jobs/images')
      : opportunityImageUrl

    const job = await Job.create({
      title,
      organization,
      description,
      location,
      type,
      category,
      mode,
      skillLevel,
      deadline,
      salaryRange,
      skills: sanitizeStringArray(skills),
      organizationLogo,
      opportunityImage,
      postedBy: req.userId,
    })

    return res.status(201).json(job)
  } catch (error) {
    return next(error)
  }
}

const listMyJobs = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page || '1', 10), 1)
    const limit = Math.min(Math.max(parseInt(req.query.limit || '10', 10), 1), 50)
    const skip = (page - 1) * limit

    const query = req.userRole === 'admin' ? {} : { postedBy: req.userId }
    if (req.query.status) {
      query.status = req.query.status
    }
    if (req.query.search) {
      query.$text = { $search: req.query.search }
    }

    const [jobs, total] = await Promise.all([
      Job.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('postedBy', 'name email role'),
      Job.countDocuments(query),
    ])

    return res.status(200).json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      jobs,
    })
  } catch (error) {
    return next(error)
  }
}

const updateJob = async (req, res, next) => {
  try {
    const { jobId } = req.params
    const job = await Job.findById(jobId)

    if (!job) {
      return res.status(404).json({ message: 'Opportunity not found' })
    }

    if (!canManageJob(job, req)) {
      return res.status(403).json({ message: 'You can only edit your own opportunities' })
    }

    const editableFields = [
      'title',
      'organization',
      'description',
      'location',
      'type',
      'category',
      'mode',
      'skillLevel',
      'salaryRange',
    ]

    editableFields.forEach((field) => {
      if (typeof req.body[field] !== 'undefined') {
        job[field] = req.body[field]
      }
    })

    if (typeof req.body.skills !== 'undefined') {
      job.skills = sanitizeStringArray(req.body.skills)
    }

    if (typeof req.body.deadline !== 'undefined') {
      job.deadline = parseOptionalDate(req.body.deadline)
    }

    const organizationLogoFile = req.files?.organizationLogo?.[0]
    const opportunityImageFile = req.files?.opportunityImage?.[0]

    if (organizationLogoFile) {
      job.organizationLogo = await uploadFileToCloudinary(organizationLogoFile, 'opportunity-bridge/jobs/logos')
    } else if (typeof req.body.organizationLogo !== 'undefined') {
      job.organizationLogo = req.body.organizationLogo
    }

    if (opportunityImageFile) {
      job.opportunityImage = await uploadFileToCloudinary(opportunityImageFile, 'opportunity-bridge/jobs/images')
    } else if (typeof req.body.opportunityImage !== 'undefined') {
      job.opportunityImage = req.body.opportunityImage
    }

    await job.save()
    return res.status(200).json(job)
  } catch (error) {
    return next(error)
  }
}

const updateJobStatus = async (req, res, next) => {
  try {
    const { jobId } = req.params
    const { status } = req.body

    if (!['draft', 'published', 'closed'].includes(status)) {
      return res.status(400).json({ message: 'Status must be draft, published, or closed' })
    }

    const job = await Job.findById(jobId)
    if (!job) {
      return res.status(404).json({ message: 'Opportunity not found' })
    }

    if (!canManageJob(job, req)) {
      return res.status(403).json({ message: 'You can only update your own opportunities' })
    }

    job.status = status
    await job.save()

    return res.status(200).json(job)
  } catch (error) {
    return next(error)
  }
}

const deleteJob = async (req, res, next) => {
  try {
    const { jobId } = req.params
    const job = await Job.findById(jobId)

    if (!job) {
      return res.status(404).json({ message: 'Opportunity not found' })
    }

    if (!canManageJob(job, req)) {
      return res.status(403).json({ message: 'You can only delete your own opportunities' })
    }

    await Job.deleteOne({ _id: job._id })
    return res.status(200).json({ message: 'Opportunity deleted successfully' })
  } catch (error) {
    return next(error)
  }
}

module.exports = { listJobs, createJob, listMyJobs, updateJob, updateJobStatus, deleteJob }
