const express = require('express')
const { userCtr } = require('../controller')
const validator = require('../middleware/userValidator')
const upload = require('../middleware/upload')
const jwt = require('../utils/jwt')

const router = express.Router()

router
  .get('/', userCtr.indexFunc)
  .post('/login', validator.login, userCtr.loginFunc)
  .post('/register', validator.register, userCtr.registerFunc)
  .get('/list', jwt.verify(), userCtr.listFunc)
  .put('/', jwt.verify(), validator.update, userCtr.channelUpdateFunc)
  .post('/headImg', jwt.verify(), upload.single('headImg'), userCtr.headImgFunc)
  .post('/video', jwt.verify(), upload.single('video'), userCtr.videoFunc)
  .delete('/', jwt.verify(), userCtr.deleteFunc)
  .get('/getChannel', jwt.verify(), userCtr.getChannelFunc)
  .get('/getSubscribe/:userId', userCtr.getSubscribeFunc)
  .get('/getUser/:userId', jwt.verify(false), userCtr.channelDetailFunc)
  .post('/subscribe/:userId', jwt.verify(), userCtr.subscribeUserFunc)
  .delete('/subscribe/:userId', jwt.verify(), userCtr.unsubscribeUserFunc)


module.exports = router;
