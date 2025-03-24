const Redis = require('ioredis')
const redis = new Redis()

const str = 'saiouw39tjkldxmvmsdlgm'
const mkValue = () => Math.round(Math.random() * 30 + 1)
const mkStrTap = () => Math.round(Math.random() * 20)

async function setRedis(n) {
  const last = mkStrTap()
  const value = mkValue()

  const key = str.slice(0, last)
  console.log('🚀 执行次数:', n, '次 ===>', key + ': ' + value)
  if (!key) return await setRedis(++n)
  
  const data = await redis.zscore('hots', key)
  if (data) {
    await redis.zincrby('hots', 1, key)
    console.log(key + '+1');
  } else {
    const write = await redis.zadd('hots', value, key)
    console.log('写入' + key + write);
  }
  if (n < 20) {
    await setRedis(++n)
  } else {
    const ob = {};
    const logs = await redis.zrevrange('hots', 0, -1, 'withscores')
    while (logs.length) {
      const _key = logs.shift()
      const _value = logs.shift()
      ob[_key] = _value
    }
    console.log('🚀 ~ result:', logs, ob)
  }
}

setRedis(0)

module.exports = redis