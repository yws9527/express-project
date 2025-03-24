const { validationResult } = require('express-validator')

module.exports = validators => {
  return async (req, res, next) => {
    for (let validator of validators) {
      await validator.run(req)
    }
    const errors = validationResult(req)
    if (errors.isEmpty()) return next()
    res.status(400).json({ errors: errors.array() })
  }
}