const path = require('path')
const send = require('send')

const koa = require('./plugins/koa/index')
const bodyParse = require('./plugins/koa-body-parse/index')
const static = require('./plugins/koa-static/index')

const app = koa()

app.use(bodyParse({}))

// 用nginx就不需要static处理了
app.use(static(path.join(__dirname, 'public')))

app.use(async (req, res, next) => {
  // favion.ico也被当做一次请求了
  if (req.url === '/favicon.ico') {
    res.end()
    return
  } else {
    await next()
  }
})

app.use(async (req, res, next) => {
  send(req, path.join(__dirname, 'views/404.html')).pipe(res)
  await next()
})

module.exports = app
