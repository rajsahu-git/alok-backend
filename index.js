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
app.use(express.json())
app.use(passport.initialize())
require('./src/controllers/authController')
// Routes
app.use('/api/auth', require('./src/routes/authRoutes'))
app.use('/api/users', require('./src/routes/userRoutes'))
app.use('/api/upload', require('./src/routes/uploadRoutes'))
app.use('/api/gallery', require('./src/routes/galleryRoutes'))
app.use('/api/blog', require('./src/routes/blogRoutes'))
app.use('/api/alumni', require('./src/routes/alumani'))




app.get('/', (req, res) => res.send('School API running 🚀'))

app.get('/api/health', (req, res) => {
  const state = mongoose.connection.readyState
  const status = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' }
  res.json({ server: 'ok thik hai ', db: status[state] || 'unknown' })
})

app.listen(process.env.PORT || 5000,  () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`)
})