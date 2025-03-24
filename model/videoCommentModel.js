const { Schema } = require("mongoose");
const baseModel = require("./baseModel");

module.exports = new Schema({
  content: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  video: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Video',
  },
  ...baseModel,
})