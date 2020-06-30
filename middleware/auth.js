const jwt = require('jsonwebtoken')
const { User } = require('../model/user')
const ERROR = require('../types/error')

const authMdw = (option = { optional: false }) => (req, res, next) => {
  //get jwt from req.headers.authorization
  const authHeader = req.headers.authorization
  if (authHeader) {
    const token = authHeader.split(' ')[1] //ignore the "Bearer"
    jwt.verify(token, process.env.JWT_SECRET, async (err, tokenPayload) => {
      if (err) {
        return res
          .status(401)
          .json({ success: false, err: ERROR.INVALID_TOKEN })
      }
      //find user
      const user = await User.findOne({
        username: tokenPayload.username
      }).select(['-hash', '-salt'])
      if (user) {
        req.user = user
        req.token = token
        next()
      } else {
        return res.status(401).json({ success: false, err: ERROR.AUTH_REQUIRED })
      }
    })
  } 
  else {
    if (option.optional) {
      next()
    } else {
      res.status(401).json({ success: false, err: ERROR.AUTH_REQUIRED })
    }
  }
}

module.exports = authMdw
