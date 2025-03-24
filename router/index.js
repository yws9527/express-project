const express = require('express')
const router = express.Router()

const users = require('./users')
const videos = require('./videos')

router.use('/user', users)
router.use('/video', videos)

module.exports = router;