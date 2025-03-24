const { Schema } = require("mongoose");
const baseModel = require("./baseModel");

module.exports = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  channel: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  status: {
    type: Number,
    default: 0,
  },
  ...require("./baseModel"),
})