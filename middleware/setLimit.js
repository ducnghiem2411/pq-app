const jwt = require('jsonwebtoken')
const ERROR = require('../types/error')
const { ExamData } = require('../model/examData')
const { User } = require('../model/user')

const setLimitMdw = (req, res, next) => {
  const authHeader = req.headers.authorization
  const token = authHeader.split(' ')[1]
  if (!token) {
    next()
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, tokenPayload) => {
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
        next()
    }
    let currentDate = new Date().toISOString().substr(8, 2)
    console.log(recentExam[0].createdAt.toISOString().substr(8, 2))
    console.log(currentDate)
    for (let i = 0; i < recentExam.length; i++) {
      let recentDate = recentExam[i].createdAt.toISOString().substr(8, 2)
      if (recentDate != currentDate) {
        next()
      }
      if (i == 2 && recentDate == currentDate) { //got 3 results in 1 day ? 
        return res.status(403).json({ success: false, err: ERROR.FORBIDDEN })
      }
    }

  })
}

module.exports = { setLimitMdw }
