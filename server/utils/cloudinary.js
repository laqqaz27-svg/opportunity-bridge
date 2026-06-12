const cloudinary = require('cloudinary').v2

const hasCloudinaryConfig =
  Boolean(process.env.CLOUDINARY_CLOUD_NAME) &&
  Boolean(process.env.CLOUDINARY_API_KEY) &&
  Boolean(process.env.CLOUDINARY_API_SECRET)

if (hasCloudinaryConfig) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  })
}

const uploadFileToCloudinary = async (file, folder) => {
  if (!hasCloudinaryConfig) {
    throw new Error('Cloudinary upload is not configured')
  }

  const dataUri = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`

  const result = await cloudinary.uploader.upload(dataUri, {
    folder,
    resource_type: 'auto',
  })

  return result.secure_url
}

const extractPublicIdFromUrl = (fileUrl) => {
  if (!fileUrl || !fileUrl.includes('res.cloudinary.com')) {
    return ''
  }

  const marker = '/upload/'
  const markerIndex = fileUrl.indexOf(marker)
  if (markerIndex === -1) {
    return ''
  }

  let pathPart = fileUrl.slice(markerIndex + marker.length)
  const versionMatch = pathPart.match(/^v\d+\//)
  if (versionMatch) {
    pathPart = pathPart.slice(versionMatch[0].length)
  }

  const withoutQuery = pathPart.split('?')[0]
  return withoutQuery.replace(/\.[^./]+$/, '')
}

const deleteFileFromCloudinary = async (fileUrl) => {
  if (!hasCloudinaryConfig) {
    return false
  }

  const publicId = extractPublicIdFromUrl(fileUrl)
  if (!publicId) {
    return false
  }

  const result = await cloudinary.uploader.destroy(publicId, { resource_type: 'auto' })
  return result.result === 'ok' || result.result === 'not found'
}

module.exports = {
  hasCloudinaryConfig,
  uploadFileToCloudinary,
  deleteFileFromCloudinary,
}
