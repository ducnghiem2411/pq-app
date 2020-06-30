const router = require('express').Router()
const jwt = require('jsonwebtoken')
const ERROR = require('../types/error')
const { User } = require('../model/user')
const {
  addQuestion,
  getQuestion,
  getResult,
  saveResult,
  updatePoint
} = require('../services/test')
const { ExamData } = require('../model/examData')
const { setLimitMdw } = require('../middleware/setLimit')

router.post('/addQuestion', async (req, res) => {
  const { subject, title, result, options } = req.body
  const authHeader = await req.headers.authorization
  const token = authHeader.split(' ')[1]
  jwt.verify(token, process.env.JWT_SECRET, async (err, tokenPayload) => {
    if (err) {
      return res.status(401).json(result)
    } else {
      const user = await User.findOne({
        username: tokenPayload.username
      })
      if (user.username === 'admin123') {
        await addQuestion(subject, title, result, options)
        return res.json({ success: true })
      } else {
        return res.status(500).json(ERROR.INTERNAL_ERROR)
      }
    }
  })
})

router.post('/getQuestion', async (req, res) => {
  const { subject, amount } = req.body
  const authHeader = req.headers.authorization
  const token = authHeader.split(' ')[1]
  const data = await getQuestion(subject, amount)

  jwt.verify(token, process.env.JWT_SECRET, async (err, tokenPayload) => {
    if (!token) {
      return await res.json(data)
    }
    if (err) {
      return res.status(401).json({ success: false, err: ERROR.INVALID_TOKEN })
    }
    const userId = await User.findOne({
      username: tokenPayload.username
    }).select(['_id'])

    const recentExam = await ExamData.find(
      { owner: userId },
      'subject type result createdAt'
    )
      .sort({ createdAt: 'descending' })
      .limit(3)

    if (!recentExam || recentExam.length < 3) {
      return res.json(data)
    }
    let currentDate = new Date().toISOString().substr(0, 10)
    for (let i = 0; i < recentExam.length; i++) {
      let recentDate = recentExam[i].createdAt.toISOString().substr(0, 10)
      if (recentDate != currentDate) {
        return res.status(200).json(data)
      }
      if (i == 2 && recentDate == currentDate) {
        //got 3 results in 1 day ?
        return res.status(403).json({ success: false, err: ERROR.FORBIDDEN })
      }
    }
    return res.json(data)
  })
})

router.post('/getResult', async (req, res) => {
  const { subject, amount, resultArray } = await req.body
  const authHeader = await req.headers.authorization
  // userToken valid ? (save result, return result) : return result
  const result = await getResult(resultArray)
  if (authHeader) {
    const token = authHeader.split(' ')[1] //ignore the "Bearer"
    jwt.verify(token, process.env.JWT_SECRET, async (err, tokenPayload) => {
      if (err) {
        return await res.json(result)
      } else {
        console.log(tokenPayload)
        const user = await User.findOne({
          username: tokenPayload.username
        }).select(['-hash', '-salt'])
        if (user) {
          await saveResult(subject, amount, result, user)
          await updatePoint(result, user)
          return await res.json(result)
        } else {
          return res.status(500).json(ERROR.INTERNAL_ERROR)
        }
      }
    })
  } else {
    return await res.json(result)
  }
})

module.exports = router
