const http = require('http');
const { appRoutes } = require('./http/routes');
const { json } = require('micro'); 

const routes = appRoutes; 

const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  try {
    const body = await json(req);

    const route = routes.find(route => {
      return route.method === method && route.path.test(url);
    });

    if (route) {
      const routeParams = req.url.match(route.path);

      const { query, ...params } = routeParams.groups;

      req.params = params;
      req.query = query ? extractQueryParams(query) : {};
      req.body = body; 

      return route.handler(req, res);
    }

    res.writeHead(404).end('Rota não encontrada');
  } catch (error) {
    console.error(error);
    res.writeHead(500).end('Ocorreu um erro interno no servidor');
  }
});

const PORT = 3333;

server.listen(PORT, () => {
  console.log("Servidor online...");
});
