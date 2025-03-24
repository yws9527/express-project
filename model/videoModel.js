const { Schema } = require("mongoose");
const baseModel = require("./baseModel");

module.exports =  new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  vodVideoId: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  cover: {
    type: String,
    required: true,
  },
  commentCount: {
    type: Number,
    default: 0,
  },
  likeCount: {
    type: Number,
    default: 0,
  },
  disLikeCount: {
    type: Number,
    default: 0,
  },
  ...baseModel,
})