const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VoteModel = new Schema({
  voteUserId: {
    type: String,
    required: true,
  },
  updated: {
    type: Date, default: Date.now,
    required: true
  },
  area: {
    type: String,
    default: 'employee',
    enum: ["teamPlayer", "technicalReferent", "keyPlayer", "clientSatisfaction", "motivation", "fun"],
    required: true
  },
  votedUserId: {
    type: String,
    required: true
  }
})

const Vote = mongoose.model('vote', VoteModel)

module.exports = Vote;