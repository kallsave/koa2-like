const fs = require('fs')
const url = require('url')
const path = require('path')
const mime = require('mime2')

function static(root, options = {}) {

  const fallthrough = options.fallthrough || true

  root = path.resolve(root)

  return async function (req, res, next) {

    const pathname = url.parse(req.url).pathname

    if (req.method !== 'GET' || pathname === '/') {
      await next()
      return
    }

    const filename = path.join(root, pathname)

    function readFile() {
      return new Promise((resolve) => {
        fs.stat(filename, (err, stat) => {
          if (err) {
            if (fallthrough) {
              resolve()
              return
            }
            resolve()
            return
          }
          const type = mime.lookup(filename)
          res.setHeader('Content-Type', type)
          fs.createReadStream(filename).pipe(res)
        })
      })
    }

    await readFile()
    await next()
  }
}

module.exports = static
