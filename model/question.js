const mongoose = require("mongoose");
const Schema = mongoose.Schema

const questionSchema = Schema({
  subject: { type: String, required: true },
  title: { type: String, required: true },
  photoUrl: String,
  result: {type: String, required: true},
  options: {type: Array, required: true}
});

const Question = mongoose.model("Question", questionSchema);

module.exports = { Question, questionSchema };
