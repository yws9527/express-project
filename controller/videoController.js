const { Video, VideoComment, VideoLike, Subscribe, CollectModel } = require("../model");
const { hotInc, topHots } = require("../model/redis/hotsinc");
const config = require('../config/config.default')

const hasVideo = async function(_id, videoId) {
  const video = await Video.findOne({ user: _id, _id: videoId })
  return video;
}

exports.getHots = async function(req, res) {
  const { params: { topNum } } = req
  const sortData = await topHots(topNum)
  res.status(200).json({ data: sortData || {} })
}

exports.videoListFunc = async function(req, res) {
  const { page = 1, pageSize = 10 } = req.query
  const skip = (page - 1) * pageSize
  const total = await Video.countDocuments()
  const dbBack = await Video.find()
    .skip(skip)
    .limit(Number(pageSize))
    .sort({ createdAt: -1 })
    .populate('user', '_id username cover')
  if (!dbBack) {
    return res.status(400).send('查询失败')
  }
  res.status(200).json({
    list: dbBack,
    total,
    page: Number(page),
    pageSize: Number(pageSize)
  })
}

exports.getVideoDetailFunc = async function(req, res) {
  const {
    params: { videoId }
  } = req;
  let detail = await Video.findById(videoId)
    .populate('user', '_id username cover')
  detail = detail.toJSON()
  if (!detail) {
    return res.status(400).send('查询失败')
  }
  let isLike = false
  let isDisLike = false
  let isSubscribe = false
  const userId = req?.user?._id
  if (userId) {
    const hasLike = await VideoLike.findOne({ user: userId, video: videoId, like: 1 })
    const hasDisLike = await VideoLike.findOne({ user: userId, video: videoId, like: -1 })
    const hasSubscribe = await Subscribe.findOne({ user: userId, channel: detail.user._id })
    isLike = !!hasLike
    isDisLike = !!hasDisLike
    isSubscribe = !!hasSubscribe
  }
  res.status(200).json({
    ...detail,
    isLike,
    isDisLike,
    isSubscribe,
  })
}

exports.createVideoFunc = async function(req, res) {
  req.body.user = req.user._id
  const videoModel = new Video(req.body)
  const dbBack = await videoModel.save()
  await hotInc(dbBack._id, config.RULE.PLAY)
  if (!dbBack) {
    return res.status(400).send('创建失败')
  }
  res.status(200).json({data: dbBack})
}

exports.commentFunc = async function(req, res) {
  const {
    user: { _id },
    body: { comment },
    params: { videoId }
  } = req
  const video = await Video.findById(videoId)
  if (!video) {
    return res.status(400).send('视频不存在')
  }
  const dbBack = await new VideoComment({
    video: videoId,
    user: _id,
    content: comment
  }).save()
  await hotInc(videoId, config.RULE.COMMENT)
  if (dbBack) {
    await Video.findByIdAndUpdate(videoId, { $inc: { commentCount: 1 } })
    res.status(200).json({msg: '评论成功'})
  } else {
    res.status(400).json({msg: '评论失败'})
  }
}

exports.commentListFunc = async function(req, res) {
  let {
    params: { videoId },
    query: { page = 1, pageSize = 10 }
  } = req
  pageSize = Number(pageSize)
  const skip = (page - 1) * pageSize
  const dbBack = await VideoComment
    .find({ video: videoId })
    .populate('user', '_id username image')
    .skip(skip)
    .limit(pageSize)
  if (!dbBack) {
    return res.status(400).json({msg: '查询失败'})
  }
  res.status(200).json({
    list: dbBack,
    total: dbBack.length,
    page: Number(page),
    pageSize: Number(pageSize)
  })
}

exports.commentDeleteFunc = async function(req, res) {
  const { videoId, commentId } = req.params
  const video = await Video.findById(videoId)
  if (!video) {
    return res.status(400).json({msg: '视频不存在'})
  }
  const comment = await VideoComment.findById(commentId)
  if (!comment) {
    return res.status(400).json({msg: '评论不存在'})
  }
  if (comment.user.toString() !== req.user._id) {
    return res.status(400).send('无权限删除')
  }
  const dbBack = await VideoComment.findByIdAndDelete(commentId)
  if (dbBack) {
    await Video.findByIdAndUpdate(dbBack.video, { $inc: { commentCount: -1 } })
    res.status(200).json({ msg: '删除成功' })
  } else { 
    res.status(400).json({ msg: '删除失败' })
  }
}

exports.likeFunc = async function(req, res) {
  const {
    user: { _id },
    body: { like },
    params: { videoId },
  } = req
  const video = await Video.findById(videoId, '-__v')
  if (!video) {
    return res.status(404).json({msg: '视频不存在'})
  }
  let isLike = true
  const videoLike = await VideoLike.findOne({ video: videoId, user: _id })

  if (videoLike && videoLike.like === 1) {
    await videoLike.deleteOne()
    isLike = false
  } else if (videoLike && videoLike.like === -1) {
    videoLike.like = 1
    await videoLike.save()
    await hotInc(videoId, config.RULE.LIKE)
  } else {
    await new VideoLike({ video: videoId, user: _id, like: 1 }).save()
    await hotInc(videoId, config.RULE.LIKE)
  }
  const likeCount = await VideoLike.countDocuments({ video: videoId, like: 1 })
  const disLikeCount = await VideoLike.countDocuments({ video: videoId, like: -1 })
  video.likeCount = likeCount
  video.disLikeCount = disLikeCount
  await video.save()

  res.status(200).json({
    data: {
      isLike,
      ...video.toJSON(),
    }
  })
}

exports.disLikeFunc = async function(req, res) {
  const {
    user: { _id },
    body: { like },
    params: { videoId },
  } = req
  const video = await Video.findById(videoId, '-__v')
  if (!video) {
    return res.status(404).json({msg: '视频不存在'})
  }
  let isDisLike = true
  const videoLike = await VideoLike.findOne({ video: videoId, user: _id })

  if (videoLike && videoLike.like === -1) {
    await videoLike.deleteOne()
    isDisLike = false
  } else if (videoLike && videoLike.like === 1) {
    videoLike.like = -1
    await videoLike.save()
  } else {
    await new VideoLike({ video: videoId, user: _id, like: -1 }).save()
  }
  const likeCount = await VideoLike.countDocuments({ video: videoId, like: 1 })
  const disLikeCount = await VideoLike.countDocuments({ video: videoId, like: -1 })
  video.likeCount = likeCount
  video.disLikeCount = disLikeCount
  await video.save()

  res.status(200).json({
    data: {
      isDisLike,
      ...video.toJSON(),
    }
  })
}

exports.likeListFunc = async function(req, res) {
  let {
    user: { _id },
    query: { page = 1, pageSize = 10 },
  } = req
  pageSize = Number(pageSize)
  const skip = (Number(page) - 1) * pageSize
  const _data = { user: _id, like: 1 };
  const total = await VideoLike.countDocuments(_data)
  const likes = await VideoLike.find(_data, '-__v')
    .skip(skip)
    .limit(pageSize)
    .populate('video', '_id title user vodVideoId')
  res.status(200).json({
    list: likes,
    total,
    pageSize,
    page: Number(page),
  })
}

exports.updateVideoFunc = async function(req, res) {
  const { params: { videoId }, user: { _id } } = req
  const video = await Video.findOne({ user: _id, _id: videoId })
  if (!video) {
    return res.status(404).json({ msg: '视频不存在' })
  }
  await Video.findByIdAndUpdate(videoId, req.body)
  res.status(200).json({ msg: '更新成功' })
}

exports.deleteVideoFunc = async function(req, res) {
  const { params: { videoId }, user: { _id } } = req
  const video = await Video.findOne({ user: _id, _id: videoId })
  if (!video) {
    return res.status(404).json({ msg: '视频不存在' })
  }
  await video.deleteOne()
  res.status(200).json({ msg: '删除成功' })
}

exports.collectFunc = async function(req, res) {
  const { params: { videoId }, user: { _id } } = req;
  const video = await hasVideo(_id, videoId)
  if (!video) return res.status(404).json({ msg: '视频不存在' })
  const collect = await CollectModel.findOne({
    user: _id,
    video: videoId
  })
  if (collect) {
    return res.status(403).json({ msg: '视频已经收藏' })
  } else {
    const myCollect = await CollectModel({
      user: _id,
      video: videoId,
    }).save()
    myCollect && await hotInc(videoId, config.RULE.COLLECT)
    if (myCollect) {
      return res.status(200).json({ data: myCollect, msg: '视频收藏成功' })
    }
  }
}