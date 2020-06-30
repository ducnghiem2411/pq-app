const { User } = require('../model/user.js')
const jwt = require('jsonwebtoken')
const ERROR = require('../types/error')

const register = async (username, password) => {
  //check if user is existed
  //create new user
  //generate hash & salt to password (encrypt the password)
  //save into db
  const user = await User.findOne({ username: username })
  if (user) throw new Error(ERROR.USERNAME_EXISTED)
  const newUser = new User({
    username: username
  })
  newUser.generatePassword(password)
  console.log(newUser)
  return newUser.save()
}

const login = async (username, password) => {
  //check if user is existed
  //check if password is correct
  const user = await User.findOne({ username: username })
  if (!user) {
    throw new Error(ERROR.USERNAME_NOT_EXISTED)
  }
  if (!user.validatePassword(password)) {
    throw new Error(ERROR.PASSWORD_NOT_MATCHED)
  }
  return user
}

const generateJWT = user => {
  const accessToken = jwt.sign(
    { 
      username: user.username,
    },
    process.env.JWT_SECRET || demo_secret_key,
    { expiresIn: '12h' }
  )
  return accessToken
}

module.exports = { register, login, generateJWT }
