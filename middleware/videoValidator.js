const validator = require('./errorBack')
const { body, query, param } = require('express-validator')
const { Video } = require('../model')


exports.videoList = validator([
  query('page')
    .optional()
    .isInt().withMessage('page必须是数字').bail(),
  query('pageSize')
    .optional()
    .isInt().withMessage('pageSize必须是数字').bail(),
])

exports.videoDetail = validator([
  param('videoId')
    .notEmpty().withMessage('videoId不能为空').bail(),
])

exports.videoValidator = validator([
  body('title')
    .notEmpty().withMessage('视频名称不能为空').bail()
    .isLength({ max: 20 }).withMessage('标题长度不能大于20').bail(),
  body('vodVideoId')
    .notEmpty().withMessage('vodVideoId不能为空').bail()
    .custom(async vodVideoId => {
      const hasVideo = await Video.findOne({ vodVideoId })
      if (hasVideo) {
        return Promise.reject('视频已存在')
      }
    }).bail(),
  body('cover')
    .notEmpty().withMessage('封面不能为空').bail(),
])

exports.commentValidator = validator([
  body('comment')
    .notEmpty().withMessage('评论不能为空').bail(),
  param('videoId')
    .notEmpty().withMessage('videoId不能为空').bail(),
])

exports.commentDeleteValidator = validator([
  param('videoId')
    .notEmpty().withMessage('videoId不能为空').bail(),
  param('commentId')
    .notEmpty().withMessage('commentId不能为空').bail(),
])

exports.videoLikeValidator = validator([
  param('videoId')
    .notEmpty().withMessage('videoId不能为空').bail(),
  body('like')
    .notEmpty().withMessage('like不能为空').bail()
    .isIn([1, -1]).withMessage('like只能是1或-1').bail(),
])

exports.updateOrDeleteValidator = validator([
  param('videoId')
    .notEmpty().withMessage('videoId不能为空').bail(),
])

exports.collectValidator = validator([
  param('videoId')
    .notEmpty().withMessage('videoId不能为空').bail(),
])