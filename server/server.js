const cors = require('cors')
const dotenv = require('dotenv')
const express = require('express')
const connectDB = require('./config/db')
const applicationRoutes = require('./routes/applicationRoutes')
const authRoutes = require('./routes/authRoutes')
const donationRoutes = require('./routes/donationRoutes')
const jobRoutes = require('./routes/jobRoutes')

dotenv.config()

if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is missing in environment variables')
  process.exit(1)
}

if (!process.env.MONGO_URI) {
  console.error('MONGO_URI is missing in environment variables')
  process.exit(1)
}

connectDB()

const app = express()

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || '*',
  }),
)
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Kakuma Opportunity Hub API Running')
})

app.use('/api/auth', authRoutes)
app.use('/api/jobs', jobRoutes)
app.use('/api/applications', applicationRoutes)
app.use('/api/donations', donationRoutes)

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ message: 'Internal server error' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
