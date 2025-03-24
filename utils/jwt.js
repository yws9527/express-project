const _jwt = require('jsonwebtoken')
const { JWT } = require('../config/config.default')

const jwt = function (params) {
  const token = _jwt.sign(params, JWT, { expiresIn: '24h' })
  return token
}

jwt.verify = function(required = true) {
  return function (req, res, next) {
    const token = req.headers.authorization.replace('Bearer ', '')
    if (token) {
      try {
        const userInfo = _jwt.verify(token, JWT)
        req.user = userInfo
        next()
      } catch (error) {
        return res.status(402).json({ msg: '无效的token' })
      }
    } else if (required) {
      res.status(402).json({ msg: '请传入token' })
    } else {
      next()
    }
  }
}

module.exports = jwt