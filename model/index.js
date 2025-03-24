const mongoose = require('mongoose');
const { MONGO_PATH } = require('../config/config.default');

async function main() {
  await mongoose.connect(MONGO_PATH);
}


main()
  .then(res => {
    console.log('Mongo 链接成功');
  })
  .catch(err => {
    console.log('Mongo 链接失败', err);
  })

module.exports = {
  User: mongoose.model('User', require('./userModel')),
  Video: mongoose.model('Video', require('./videoModel')),
  Subscribe: mongoose.model('Subscribe', require('./subscribeModel')),
  VideoComment: mongoose.model('VideoComment', require('./videoCommentModel')),
  VideoLike: mongoose.model('VideoLike', require('./videoLikeModel')),
  CollectModel: mongoose.model('Collect', require('./collectModel'))
}