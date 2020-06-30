const { ExamData } = require('../model/examData')
const { RankingPoint } = require('../model/rankingPoint')
const { User } = require('../model/user')
const ERROR = require('../types/error')

const getExamData = async userId => {
  const examData = await ExamData.find(
    { owner: userId },
    'subject type result createdAt'
  ).sort({ createdAt: 'descending' })
  //catch noUsername ? return err
  return examData
}

const getRankData = async () => {
  const rankingData = await RankingPoint.find()
    .select(['-hash', '-salt'])
    .sort({point : 'descending'})
    .limit(5)
  let dataArray = []
  for (let i = 0; i < rankingData.length; i++) {
    let user = await User.findOne({_id : rankingData[i].owner})
    let point = rankingData[i].point
    dataArray.push({username : user.username, point : point})
  }
  return dataArray
}


module.exports = { getExamData, getRankData }
