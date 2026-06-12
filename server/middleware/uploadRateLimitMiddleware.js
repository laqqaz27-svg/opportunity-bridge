const WINDOW_MS = 10 * 60 * 1000
const MAX_UPLOAD_REQUESTS = 20

const buckets = new Map()

const getKey = (req) => req.userId || req.ip || 'anonymous'

const uploadRateLimit = (req, res, next) => {
  const now = Date.now()
  const cutoff = now - WINDOW_MS
  const key = getKey(req)

  const existing = buckets.get(key) || []
  const recent = existing.filter((timestamp) => timestamp > cutoff)

  if (recent.length >= MAX_UPLOAD_REQUESTS) {
    const retryAfterMs = WINDOW_MS - (now - recent[0])
    return res.status(429).json({
      message: 'Too many upload requests. Please try again shortly.',
      retryAfterSeconds: Math.max(Math.ceil(retryAfterMs / 1000), 1),
    })
  }

  recent.push(now)
  buckets.set(key, recent)
  return next()
}

module.exports = uploadRateLimit
