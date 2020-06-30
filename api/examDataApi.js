const router = require('express').Router()
const { getExamData, getRankData } = require('../services/examData')
const { User } = require('../model/user')
const ERROR = require('../types/error')
const jwt = require('jsonwebtoken')

router.get('/getExamData', async (req, res) => {
  const authHeader = await req.headers.authorization
  const token = authHeader.split(' ')[1]
  const user = await jwt.verify(token, process.env.JWT_SECRET, async (err, tokenPayload) => {
    if (err) {
      return await res.status(401).json(ERROR.INVALID_TOKEN)
    } else {
      const user = await User.findOne({
        username: tokenPayload.username
      }).select(['-hash', '-salt'])
      if (user) {
        return user
      } else {
        return res.status(500).json(ERROR.INTERNAL_ERROR)
      }
    }
  })
  const examData = await getExamData(user)
  return res.json(examData)
})

router.get('/ranking', async (req, res) => {
  try {
    const data = await getRankData()
    return res.json(data)
  } catch {
    return res.status(500).json(ERROR.INTERNAL_ERROR)
  }
})

module.exports = router
