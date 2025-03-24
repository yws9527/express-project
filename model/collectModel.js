const { Schema } = require("mongoose");
const baseModel = require('./baseModel')

module.exports = new Schema({
  user: {
    type: Schema.ObjectId,
    required: true,
    ref: 'User'
  },
  video: {
    type: Schema.ObjectId,
    required: true,
    ref: 'Video'
  },
  ...baseModel
})