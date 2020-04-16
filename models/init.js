const mongoose = require('mongoose')

// Use the Promise functionality built into Node.js
mongoose.Promise = global.Promise

let mongoURL = ''

// Connect to our local database
  switch(process.env.NODE_ENV) {
    case 'test':
      mongoURL = 'mongodb://localhost/folioCMS-test'
      break
    case 'development':
      mongoURL = 'mongodb://localhost/folioCMS'
      break
    case 'production':
      mongoURL = process.env.MONGO_URL
      break
    default:
      console.log('No valid Node Environment detected - closing.')
      process.exit(1)
  }

  mongoose
      .connect(mongoURL, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true})
      .then(() => {
        console.log(`Successfully connected to ${process.env.NODE_ENV} database`)
      })
      .catch(error => {
        //   If there was an error connecting to the database
        if (error) console.log('Error connecting to MongoDB database', error)
      })

  

module.exports = mongoose
