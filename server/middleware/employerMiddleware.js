const User = require('../models/User')

const employerMiddleware = async (req, res, next) => {
  try {
    if (req.userRole === 'admin') {
      return next()
    }

    if (req.userRole !== 'employer') {
      return res.status(403).json({ message: 'Employer access required' })
    }

    const user = await User.findById(req.userId).select('isApproved')
    if (!user || !user.isApproved) {
      return res.status(403).json({ message: 'Employer account is pending admin approval' })
    }

    return next()
  } catch (error) {
    return next(error)
  }
}

module.exports = employerMiddleware
