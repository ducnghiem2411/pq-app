const mongoose = require('mongoose')
const Schema = mongoose.Schema

const rankingPointSchema = Schema(
  {
    point: {
      type: Number,
      required: true
    },
    owner: {
      type: Schema.Types.ObjectId,
      required: true
    }
  },
  { timestamps: true }
)

const RankingPoint = mongoose.model('RankingPoint', rankingPointSchema)

module.exports = { RankingPoint, rankingPointSchema }
