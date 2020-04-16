const mongoose = require('./init')
const passportLocalMongoose = require('passport-local-mongoose')

const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 255,
    match: emailRegex
  },
  name: {
    type: String,
    maxlength: 255,
    required: true
  }
})

// Add passport middleware to User Schema
userSchema.plugin(passportLocalMongoose, {
  usernameField: 'email', // Use email, not the default 'username'
  usernameLowerCase: true, // Ensure that all emails are lowercase
  session: false // Disable sessions as we'll use JWTs
})

const User = mongoose.model('User', userSchema)

module.exports = User