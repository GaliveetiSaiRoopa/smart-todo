


const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();
const routes = require("./routes.json");
const rewriter = jsonServer.rewriter(routes);

server.use(middlewares);
server.use(rewriter);
server.use(router);

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`🚀 JSON Server running at http://localhost:${PORT}`);
});
