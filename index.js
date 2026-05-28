const dotenv = require('dotenv')
dotenv.config()

const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const passport = require('passport')
const connectDB = require('./config/db')
connectDB()

const app = express()

app.use(cors({ origin: ['http://localhost:3000','https://alok-school.vercel.app'] })) 
app.use((req, res, next) => {
  if (req.headers['content-type']?.includes('multipart/form-data')) return next()
  express.json()(req, res, next)
})
app.use(passport.initialize())
require('./src/controllers/authController')
// Routes
app.use('/api/auth', require('./src/routes/authRoutes'))
app.use('/api/users', require('./src/routes/userRoutes'))
app.use('/api/upload', require('./src/routes/uploadRoutes'))
app.use('/api/gallery', require('./src/routes/galleryRoutes'))
app.use('/api/blog', require('./src/routes/blogRoutes'))
app.use('/api/alumni', require('./src/routes/alumani'))
app.use('/api/team', require('./src/routes/teamRoutes'))
app.use('/api/admission', require('./src/routes/admissionRoutes'))
app.use('/api/tc', require('./src/routes/tcRoutes'))
app.use('/api/alumni-form', require('./src/routes/alumniFormRoutes'))
app.use('/api/career', require('./src/routes/careerRoutes'))
app.use('/api/achievement', require('./src/routes/achievementRoutes'))
app.use('/api/popup', require('./src/routes/popupRoutes'))
app.use('/api/notice', require('./src/routes/noticeRoutes'))
app.use('/api/exam-notice', require('./src/routes/examNoticeRoutes'))
app.use('/api/result', require('./src/routes/resultRoutes'))
app.use('/api/allowed-users', require('./src/routes/userAcessRoutes'))
app.use('/api/contact', require('./src/routes/contactRoutes'))
app.use('/api/question-bank', require('./src/routes/questionBankRoute'))


app.get('/', (req, res) => res.send('School API running 🚀'))

app.get('/api/health', (req, res) => {
  const state = mongoose.connection.readyState
  const status = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' }
  res.json({ server: 'ok thik hai ', db: status[state] || 'unknown' })
})

app.listen(process.env.PORT || 5000,  () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`)
})