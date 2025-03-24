const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const router = require('./router')
const { notFound, errorHandler } = require('./errorHandle');
const { PORT } = require('./config/config.default');

// 加一个注释，用以说明，本项目代码可以任意定制更改
const app = express()

// json 中间件
app.use(express.json())
// url解析中间件
app.use(express.urlencoded())
// 跨域中间件
app.use(cors())
// 静态资源中间件
app.use(express.static('uploads'))
// 日志中间件
app.use(morgan('dev'))
// 路由中间件
app.use('/api/v1', router)
// 路由错误中间件
app.use(notFound);
// 挂载统一处理服务端错误中间件
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`)
})
