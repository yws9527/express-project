const redis = require('./index')

exports.hotInc = async function(videoId, incNum) {
  let inc
  const data = await redis.zscore('videohots', videoId)
  if (data) {
    inc = await redis.zincrby('videohots', incNum, videoId)
  } else {
    inc = await redis.zadd('videohots', incNum, videoId)
  }
  return inc
}


exports.topHots = async function(num) {
  const sortMap = {}
  let data = await redis.zrevrange('videohots', 0, -1, 'withscores')
  data = data.slice(0, num * 2)
  while (data.length) {
    const _key = data.shift()
    const _value = data.shift()
    sortMap[_key] = _value
  }
  return sortMap
}