require('dotenv').config()
const express = require('express')
const cors = require('cors')
const auth = require('./routes/auth')
const projects = require('./routes/projects')
const media = require('./routes/media')
const { cloudinaryConfig } = require('./config/cloudinary')

const server = express()

if( process.env.NODE_ENV === 'production') {
  server.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
  }))
} else {
  server.use(cors({
    origin: "http://localhost:3000",
    credentials: true
  }))
}


// Middleware Plugins
server.use(express.json())
server.use(express.urlencoded({ extended: true }))

server.use('*', cloudinaryConfig)

// Routes
server.use('/auth', auth)
server.use('/projects', projects)
server.use('/media', media)

// MULTER DEBUG
// server.use(function (err, req, res, next) {
//   console.log('This is the invalid field ->', err.field)
//   next(err)
// })

// Start the server
if (process.env.NODE_ENV === 'production') {
server.listen(process.env.PORT, error => {
  if (error) console.error('Error starting', error)
  else console.log(`Started at ${process.env.PORT}`)
})
} else {
  server.listen(3001, error => {
    if (error) console.error('Error starting', error)
    else console.log(`Started at ${process.env.PORT}`)
  })
}