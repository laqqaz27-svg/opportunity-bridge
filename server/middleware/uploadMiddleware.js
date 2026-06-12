const multer = require('multer')

const MB = 1024 * 1024
const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]
const CERTIFICATE_TYPES = [...IMAGE_TYPES, ...DOCUMENT_TYPES]

const RULES = {
  profileImage: { types: IMAGE_TYPES, maxBytes: 5 * MB },
  cvFile: { types: DOCUMENT_TYPES, maxBytes: 10 * MB },
  certificates: { types: CERTIFICATE_TYPES, maxBytes: 5 * MB },
  organizationLogo: { types: IMAGE_TYPES, maxBytes: 5 * MB },
  opportunityImage: { types: IMAGE_TYPES, maxBytes: 8 * MB },
  resume: { types: DOCUMENT_TYPES, maxBytes: 10 * MB },
  supportingDocument: { types: DOCUMENT_TYPES, maxBytes: 10 * MB },
}

const buildUploadMiddleware = (fieldConfig) => {
  const fieldNames = Object.keys(fieldConfig)
  const maxFileSize = Math.max(...fieldNames.map((name) => RULES[name].maxBytes))

  const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: maxFileSize },
    fileFilter: (req, file, cb) => {
      const rule = RULES[file.fieldname]
      if (!rule) {
        return cb(new Error(`Unexpected file field: ${file.fieldname}`))
      }

      if (!rule.types.includes(file.mimetype)) {
        return cb(new Error(`Invalid file type for ${file.fieldname}`))
      }

      return cb(null, true)
    },
  }).fields(fieldNames.map((name) => ({ name, maxCount: fieldConfig[name] })))

  return (req, res, next) => {
    upload(req, res, (error) => {
      if (error) {
        if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ message: 'One of the uploaded files is too large.' })
        }

        return res.status(400).json({ message: error.message || 'Invalid upload payload.' })
      }

      const files = req.files || {}
      for (const [fieldName, uploads] of Object.entries(files)) {
        const rule = RULES[fieldName]
        for (const file of uploads) {
          if (file.size > rule.maxBytes) {
            return res.status(400).json({ message: `${fieldName} exceeds allowed size.` })
          }
        }
      }

      return next()
    })
  }
}

const registerUpload = buildUploadMiddleware({
  profileImage: 1,
  cvFile: 1,
  certificates: 5,
  organizationLogo: 1,
})

const profileUpload = buildUploadMiddleware({
  profileImage: 1,
  cvFile: 1,
  certificates: 5,
  organizationLogo: 1,
})

const jobUpload = buildUploadMiddleware({
  organizationLogo: 1,
  opportunityImage: 1,
})

const applicationUpload = buildUploadMiddleware({
  resume: 1,
  supportingDocument: 1,
})

module.exports = {
  registerUpload,
  profileUpload,
  jobUpload,
  applicationUpload,
}
