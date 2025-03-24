const express = require('express')
const router = express.Router()
const { videoCtr } = require('../controller')
const jwt = require('../utils/jwt')
const { videoValidator, videoList, videoDetail, commentValidator, commentDeleteValidator, videoLikeValidator, updateOrDeleteValidator, collectValidator } = require('../middleware/videoValidator')

router
  .get('/getHots/:topNum', videoCtr.getHots)
  .post('/collect/:videoId', jwt.verify(), collectValidator, videoCtr.collectFunc)
  .get('/videoList', jwt.verify(false), videoList, videoCtr.videoListFunc)
  .get('/:videoId', jwt.verify(false), videoDetail, videoCtr.getVideoDetailFunc)
  .post('/createVideo', jwt.verify(), videoValidator, videoCtr.createVideoFunc)
  .post('/comment/:videoId', jwt.verify(), commentValidator, videoCtr.commentFunc)
  .delete('/comment/:videoId/:commentId', jwt.verify(), commentDeleteValidator, videoCtr.commentDeleteFunc)
  .get('/commentList/:videoId', jwt.verify(false), videoCtr.commentListFunc)
  .post('/like/:videoId', jwt.verify(), videoLikeValidator, videoCtr.likeFunc)
  .post('/disLike/:videoId', jwt.verify(), videoLikeValidator, videoCtr.disLikeFunc)
  .get('/like/list', jwt.verify(), videoCtr.likeListFunc)
  .put('/update/:videoId', jwt.verify(), updateOrDeleteValidator, videoCtr.updateVideoFunc)
  .delete('/delete/:videoId', jwt.verify(), updateOrDeleteValidator, videoCtr.deleteVideoFunc)

module.exports = router