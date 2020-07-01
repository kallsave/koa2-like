function bodyParse() {
  return async function (req, res, next) {
    if (req.method !== 'POST' || req.headers['content-type'] !== 'application/json') {
      await next()
    } else {
      function getData(resolve) {
        return new Promise(() => {
          let postData = ''
          req.on('data', (chunk) => {
            postData += chunk.toString()
          })
          req.on('end', () => {
            req.body = !postData ? {} : JSON.parse(postData)
            resolve()
          })
        })
      }
      await getData()
      await next()
    }
  }
}

module.exports = bodyParse
