const http = require("http");
const app = require("./backend/app");


const hostname = "127.0.0.1";
const port = 3010;

//express
app.set("port", port);

const server = http.createServer(app);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
