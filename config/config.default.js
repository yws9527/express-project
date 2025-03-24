/**
 * 默认配置
 */

const { mongo } = require("mongoose");

module.exports = {
  JWT: 'secret',
  SALT: 'abc',
  MONGO_PATH: 'mongodb://127.0.0.1:27017/express-video',
  PORT: process.env.PORT || 5008,
  UPLOAD_PATH: 'uploads/',
  // 视频热度规则
  // 观看 +1 点赞 +2 评论 +2 收藏 +3 转发 +3
  RULE: {
    PLAY: 1,
    LIKE: 2,
    COMMENT: 2,
    COLLECT: 3,
    TRANSMIT: 3
  }
}
