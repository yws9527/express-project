const { Schema } = require("mongoose");
const baseModel = require("./baseModel");

module.exports = new Schema({
  video: {
    type: Schema.Types.ObjectId,
    ref: 'Video',
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  like: {
    type: Number,
    required: true,
    enum: [1, -1],
  },
  ...baseModel,
})