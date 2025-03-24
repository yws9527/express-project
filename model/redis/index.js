const Redis = require('ioredis')
const redis = new Redis()

redis.on('error', function(err) {
  if (err) {
    console.log('Redis 链接失败')
    console.log(err)
    redis.quit()
  }
})

redis.on('ready', function() {
  console.log('Redis 链接成功')
})


module.exports = redis