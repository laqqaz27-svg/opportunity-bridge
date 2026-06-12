const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    role: {
      type: String,
      enum: ['user', 'employer', 'admin'],
      default: 'user',
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'prefer_not_to_say', ''],
      default: '',
    },
    ageRange: {
      type: String,
      enum: ['18-24', '25-34', '35-44', '45+', ''],
      default: '',
    },
    age: {
      type: Number,
      default: null,
      min: 0,
    },
    phoneNumber: {
      type: String,
      default: '',
      trim: true,
    },
    location: {
      type: String,
      default: '',
      trim: true,
    },
    nationality: {
      type: String,
      default: '',
      trim: true,
    },
    skills: {
      type: [String],
      default: [],
    },
    education: {
      type: String,
      default: '',
      trim: true,
    },
    experience: {
      type: String,
      default: '',
      trim: true,
    },
    bio: {
      type: String,
      default: '',
    },
    profileImage: {
      type: String,
      default: '',
      trim: true,
    },
    cvUrl: {
      type: String,
      default: '',
      trim: true,
    },
    certificates: {
      type: [String],
      default: [],
    },
    organizationName: {
      type: String,
      default: '',
      trim: true,
    },
    organizationType: {
      type: String,
      default: '',
      trim: true,
    },
    website: {
      type: String,
      default: '',
      trim: true,
    },
    organizationLogo: {
      type: String,
      default: '',
      trim: true,
    },
    organizationDescription: {
      type: String,
      default: '',
      trim: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      default: '',
    },
    verificationTokenExpires: {
      type: Date,
      default: null,
    },
    isApproved: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model('User', userSchema)
