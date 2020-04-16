require('dotenv').config()
const express = require('express')
const cors = require('cors')
const auth = require('./routes/auth')
const projects = require('./routes/projects')
const { cloudinaryConfig } = require('./config/cloudinary')

const server = express()

server.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}))


// Middleware Plugins
server.use(express.json())
server.use(express.urlencoded({ extended: true }))

server.use('*', cloudinaryConfig)

// Routes
server.use('/auth', auth)
server.use('/projects', projects)

// MULTER DEBUG
// server.use(function (err, req, res, next) {
//   console.log('This is the invalid field ->', err.field)
//   next(err)
// })

// Start the server
server.listen(3001, error => {
  if (error) console.error('Error starting', error)
  else console.log('Started at http://localhost:3001')
})