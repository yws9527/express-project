const fs = require('fs')
const { User, Subscribe } = require('../model')
const jwt = require('../utils/jwt')

exports.indexFunc = function(req, res) {
  res.send('/index')
}

exports.loginFunc = async function(req, res) {
  const userModel = new User(req.body)
  const userBb = await User.findOne(req.body)
  const samePassword = userModel.password === userBb?.password;
  
  if (userBb && samePassword) {
    const _user = userBb.toJSON()
    _user.token = jwt(_user)
    Reflect.deleteProperty(_user, 'password')
    return res.status(200).send(_user)
  } else {
    return res.status(402).json({ msg: '邮箱或者密码不正确' })
  }
}

exports.registerFunc = async function(req, res) {
  const userModel = new User(req.body)
  const dbBack = await userModel.save()
  res.status(201).send(dbBack)
}

exports.listFunc = async function(req, res) {
  const userListModel = await User.find()
  res.status(200).json(userListModel)
}

exports.channelUpdateFunc = async function(req, res) {
  const userModel = await User.findByIdAndUpdate(req.user._id, req.body, { new: true })
  if (userModel) {
    return res.status(200).send(userModel)
  }
  res.status(400).json({ msg: '更新失败, 用户不存在'})
}

exports.headImgFunc = async function(req, res) {
  const ext = req.file.originalname.split('.').pop()
  const imgPath = req.file.path + '.' + ext
  fs.rename(req.file.path, imgPath, err => {
    if (err) {
      return res.status(400).json({ msg: '上传失败' })
    }
  })
  const _id = req.user._id
  const userModel = await User.findByIdAndUpdate(_id, { image: imgPath }, { new: true })
  if (userModel) {
    return res.status(200).send(userModel)
  }
  res.status(400).json({ msg: '上传失败'})
}

exports.videoFunc = async function(req, res) {
  const ext = req.file.originalname.split('.').pop()
  const videoPath = req.file.path + '.' + ext
  fs.rename(req.file.path, videoPath, err => {
    if (err) {
      return res.status(400).json({ msg: '上传失败' })
    }
  })
  const _id = req.user._id
  const userModel = await User.findByIdAndUpdate(_id, { video: videoPath }, { new: true })
  if (userModel) {
    return res.status(200).send(userModel)
  }
  res.status(400).json({ msg: '上传失败'})
}

exports.deleteFunc = async function(req, res) {
  const userModel = await User.findByIdAndDelete(req.user._id)
  if (userModel) {
    return res.status(200).send(userModel)
  }
  res.status(400).json({ msg: '删除失败, 用户不存在'})
}

exports.subscribeUserFunc = async function(req, res) {
  const channelId = req.params.userId
  const userId = req.user._id
  if (channelId === userId) {
    res.status(400).json({ msg: '不能关注自己' })
  } else {
    const hasSubscribe = await Subscribe.findOne({ channel: channelId, user: userId })
    if (hasSubscribe) {
      return res.status(400).json({ msg: '已关注, 不能重复订阅' })
    }
    const subscribeModel = new Subscribe({ channel: channelId, user: userId })
    await subscribeModel.save()
    await User.findByIdAndUpdate(channelId, { $inc: { subscribeCount: 1 } })
    res.status(200).json({msg: '订阅成功'})
  }
}

exports.unsubscribeUserFunc = async function(req, res) {
  const channelId = req.params.userId
  const userId = req.user._id

  if (channelId === userId) {
    return res.status(400).json({ msg: '不能取消关注自己' })
  } else {
    const subscribeModel = await Subscribe.findOneAndDelete({ channel: channelId, user: userId })
    if (subscribeModel) {
      await User.findByIdAndUpdate(channelId, { $inc: { subscribeCount: -1 } })
      return res.status(200).json({msg: '取消订阅成功'})
    }
    res.status(400).json({ msg: '取消失败, 未关注' })
  }
}

exports.channelDetailFunc = async function(req, res) {
  const channelId = req.params.userId
  const userId = req.user._id
  if (userId) {
    const subscribeModel = await Subscribe.findOne({ channel: channelId, user: userId })
    if (subscribeModel) {
      const userModel = await User.findById(channelId, '-password -__v')
      const _user = userModel.toJSON()
      _user.isSubscribe = true
      res.status(200).json({ data: _user })
    } else {
      res.status(400).json({ msg: '未关注' })
    }
  } else {
    res.status(400).json({ msg: '用户不存在' })
  }
}

// 关注列表
exports.getSubscribeFunc = async function(req, res) {
  let {
    params: { userId },
    query: { page = 1, pageSize = 10 },
  } = req
  pageSize = Number(pageSize)
  skip = (page - 1) * pageSize
  const subscribeListModel = await Subscribe.find({ user: userId })
  const channelIds = subscribeListModel.map(item => item.channel)
  const idIns = { _id: { $in: channelIds } }
  const unDisplay = '-password -__v -phone -email -updateAt -createAt -subscribeCount'
  const total = await User.countDocuments(idIns)
  const userListModel = await User
    .find(idIns, unDisplay)
    .skip(skip)
    .limit(pageSize)
  res.status(200).json({
    list: userListModel,
    page: Number(page),
    pageSize,
    total
  })
}

// 粉丝列表
exports.getChannelFunc = async function(req, res) {
  let {
    user: { _id },
    query: { page = 1, pageSize = 10 },
  } = req;
  pageSize = Number(pageSize)
  skip = (page - 1) * pageSize
  const subscribeListModel = await Subscribe.find({ channel: _id })
  const userIds = subscribeListModel.map(item => item.user)
  const idIns = { _id: { $in: userIds } }
  const unDisplay = '-password -__v -phone -email -updateAt -createAt -subscribeCount'
  const total = await User.countDocuments(idIns)
  const userListModel = await User
    .find(idIns, unDisplay)
    .skip(skip)
    .limit(pageSize)
  
  res.status(200).json({
    list: userListModel,
    page: Number(page),
    pageSize,
    total
  })
}