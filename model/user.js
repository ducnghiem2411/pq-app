const mongoose = require('mongoose')
const crypto = require('crypto')
const Schema = mongoose.Schema

const userSchema = Schema({
  username: {
    type: String,
    required: true
  },
  hash: {
    type: String,
    required: true
  },
  salt: {
    type: String,
    required: true
  },
  photoURL: String,
  location: String,
  education: String
})

userSchema.methods.generatePassword = function(password) {
  this.salt = crypto.randomBytes(16).toString('hex')
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, 'sha512')
    .toString('hex')
}

userSchema.methods.validatePassword = function(password) {
  console.log(password)
  const hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, 'sha512')
    .toString('hex')
  console.log(hash, this.hash)
  return hash === this.hash
}


const User = mongoose.model('User', userSchema)

module.exports = { User, userSchema }
