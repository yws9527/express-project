const { Schema } = require('mongoose')
const md5 = require('../utils/md5')
const baseModel = require('./baseModel')


module.exports = new Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: false,
    default: null
  },
  phone: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
    set: val => md5(val),
  },
  cover: {
    type: String,
    default: null
  },
  channelDes: {
    type: String,
    default: null,
  },
  subscribeCount: {
    type: Number,
    default: 0,
  },
  ...baseModel
})