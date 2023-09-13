const http = require('http');

const { json } = require('./middlewares/json.js')
const { routes } = require('./routes.js')
const { extractQueryParams } = require('./utils/extract-query-params.js')

const server = http.createServer(async (req, res) => {
  const { method, url } = req

  await json(req, res)

  const route = routes.find(route => {
    return route.method === method && route.path.test(url)
  })

  if (route) {
    const routeParams = req.url.match(route.path)

    const { query, ...params } = routeParams.groups

    req.params = params
    req.query = query ? extractQueryParams(query) : {}

    return route.handler(req, res)
  }

  return res.writeHead(404).end()
})

const PORT = 3333;

server.listen(PORT, () => {
  console.log("Servidor está online...");
});