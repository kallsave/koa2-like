const querystring = require('querystring')

function compose(middleware) {
  return function (...rest) {
    return dispatch(0)

    function dispatch(i) {
      const fn = middleware[i]
      if (i === middleware.length) {
        return Promise.resolve()
      }
      return Promise.resolve(fn(...rest, function next() {
        return dispatch(i + 1)
      }))
    }
  }
}

function setReq(req, res) {
  const url = req.url
  const reqPath = url.split('?')[0]
  const paramPath = url.split('?')[1]
  req.reqPath = reqPath
  req.query = querystring.parse(paramPath)
}

function koa() {
  if (this.app) {
    return this.app
  }
  function app(req, res) {
    setReq(req, res)
    const middleware = app.middleware
    const fn = compose(middleware)
    fn(req, res).then(() => {
      if (res.body) {
        res.setHeader('Conent-Type', 'application/json')
        res.end(JSON.stringify(res.body))
      }
    })
  }

  app.middleware  = []

  app.use = function(expOrFn, fn) {
    if (typeof expOrFn === 'string') {
      fn.expOrFn = expOrFn
      app.middleware.push(fn)
    } else {
      app.middleware.push(expOrFn)
    }
  }
  this.app = app
  return this.app
}

const methods = {
  get: 'GET',
  post: 'POST'
}

koa.Router = function () {
  router.map = {}
  function router() {
    const app = koa()
    for (const key in router.map) {
      const fn = router.map[key]
      app.use(fn)
    }
    return async function (req, res ,next) {
      await next()
    }
  }
  for (const key in methods) {
    router[key] = function (url, fn) {
      const originFn = fn
      fn = async function (req, res, next) {
        const reqPath = router.prefixer + url
        if (req.reqPath === reqPath && req.method === methods[key]) {
          return originFn(req, res, next)
        } else {
          await next()
        }
      }
      router.map[url] = fn
    }
  }
  return router
}

module.exports = koa
