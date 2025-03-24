const { body } = require('express-validator')
const validator = require('./errorBack')
const { User } = require('../model')

exports.register = validator([
  body('username')
  .notEmpty().withMessage('用户名不能为空').bail()
  .isLength({ min: 3 }).withMessage('用户名长度不能小于3').bail(),
  body('email')
    .notEmpty().withMessage('邮箱不能为空').bail()
    .isEmail().withMessage('邮箱格式不正确').bail()
    .custom(async email => {
      const hasEmail = await User.findOne({ email })
      if (hasEmail) {
        return Promise.reject('邮箱已存在')
      }
    }).bail(),
  body('phone')
    .notEmpty().withMessage('手机号不能为空').bail()
    .isMobilePhone().withMessage('手机号格式不正确').bail()
    .custom(async phone => {
      const hasPhone = await User.findOne({ phone })
      if (hasPhone) {
        return Promise.reject('手机号已存在')
      }
    }).bail(),
  body('password')
  .notEmpty().withMessage('密码不能为空').bail()
  .isLength({ min: 5 }).withMessage('密码长度不能小于5').bail(),
  body('image')
    .optional()
    .isURL().withMessage('头像地址不正确')
])

exports.login = validator([
  body('email')
    .notEmpty().withMessage('邮箱不能为空').bail()
    .isEmail().withMessage('邮箱格式不正确').bail(),
  body('password')
    .notEmpty().withMessage('密码不能为空').bail()
    .isLength({ min: 5 }).withMessage('密码长度不能小于5').bail(),
])

exports.update = validator([
  body('username')
    .optional()
    .isLength({ min: 3 }).withMessage('用户名长度不能小于3').bail()
    .custom(async (username, { req }) => {
      const hasUsername = await User.findOne({ username })
      if (hasUsername && hasUsername._id.toString() !== req.user._id) {
        return Promise.reject('用户名已存在, 请更换用户名')
      }
    }
    ).bail(),
  body('email')
    .optional()
    .isEmail().withMessage('邮箱格式不正确').bail()
    .custom(async (email, { req }) => {
      const hasEmail = await User.findOne({ email })
      if (hasEmail && hasEmail._id.toString() !== req.user._id) {
        return Promise.reject('邮箱已绑定, 请更换邮箱')
      }
    }).bail(),
  body('phone')
    .optional()
    .isMobilePhone().withMessage('手机号格式不正确').bail()
    .custom(async (phone, { req }) => {
      const hasPhone = await User.findOne({ phone })
      if (hasPhone && hasPhone._id.toString() !== req.user._id) {
        return Promise.reject('手机号已绑定, 请更换手机号')
      }
    }).bail(),
  body('password')
    .optional()
    .isLength({ min: 5 }).withMessage('密码长度不能小于5').bail(),
  body('image')
    .optional()
    .isURL().withMessage('头像地址不正确')
])