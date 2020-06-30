const { Question } = require('../model/question')
const ERROR = require('../types/error')
const { ExamData } = require('../model/examData')
const { RankingPoint } = require('../model/rankingPoint')

const addQuestion = async (subject, title, result, options) => {
  const newQuestion = await new Question({
    subject: subject,
    title: title,
    result: result,
    options: options
  })
  console.log(newQuestion)
  await newQuestion.save()
  return newQuestion
}

const getQuestion = async (subject, amount) => {
  if (subject && !amount) {
    return (questions = await Question.find(
      { subject: subject },
      '_id subject title options'
    ))
  } else if (!amount) {
    return (allQuestion = await Question.find('_id subject title options'))
  } else if (subject && amount >= 1) {
    const questions = await Question.aggregate()
      .match({ subject: subject }) //find documents match this condition
      .project('-result') //exclude "result" field of picked documents
      .sample(amount) //amount of random documents to pick
      .exec()
    return questions
  } else {
    throw new Error(ERROR.BAD_REQUEST)
  }
}

const getResult = async resultArray => {
  let totalPoint = 0
  for (let i = 0; i < resultArray.length; i++) {
    const question = await Question.findById(resultArray[i]._id)
    if (question.result == resultArray[i].userResult) {
      totalPoint += 1
    }
  }
  console.log(`Result : ${totalPoint}/${resultArray.length}`)
  return `${totalPoint}/${resultArray.length}`
}

const saveResult = async (subject, amount, result, user) => {
  const newExamData = await new ExamData({
    subject: subject,
    type: amount + ' minutes',
    result: result,
    owner: user._id
  })
  await newExamData.save()
}

const updatePoint = async (point, userId) => {
  let userPoint = await RankingPoint.findOne({ owner: userId })
  let rankPoint = point.split('/')[0]
  if (userPoint) {
    let currentPoint = userPoint.point
    let newPoint = (currentPoint + rankPoint)
    await userPoint.updateOne({ point: newPoint })
  } else {
    const newUserPoint = await new RankingPoint({
      owner: userId,
      point: rankPoint
    })
    await newUserPoint.save()
  }
}

module.exports = { addQuestion, getQuestion, getResult, saveResult, updatePoint }
