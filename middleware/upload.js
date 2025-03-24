const multer = require('multer')
const { UPLOAD_PATH } = require('../config/config.default')

const upload = multer({ dest: UPLOAD_PATH })

module.exports = upload