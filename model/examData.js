const mongoose = require('mongoose')
const Schema = mongoose.Schema

const examDataSchema = Schema(
  {
    subject: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    owner: {
      type: Schema.Types.ObjectId,
      required: true
    },
    result: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
)



const ExamData = mongoose.model('ExamData', examDataSchema)

module.exports = { ExamData, examDataSchema }
