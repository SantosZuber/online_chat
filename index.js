const { Server: HTTPServer } = require("http");
const express = require("express");
const { Server: SocketServer } = require("socket.io");

const app = express();
const httpServer = HTTPServer(app);
const io = new SocketServer(httpServer);

app.use(express.static("public"));

httpServer.listen(8080, () => {
  console.log("Server open, port: ", 8080);
});
