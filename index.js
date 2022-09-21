const { Server: HTTPServer } = require("http");
const express = require("express");
const { Server: SocketServer } = require("socket.io");

const app = express();
const httpServer = HTTPServer(app);
const io = new SocketServer(httpServer);

function validateUsername(data) {
  if (data.includes("<", ">", "*", "/")) {
    data = "Hacker";
  } else if (data.includes(" ")) {
    data = "Hacker";
  } else if (data === null) {
    data = "Hacker";
  }
}
function validateMsg(data) {
  if (data.includes("<", ">", "*", "/")) {
    data = "There was an error on this message";
  } else if (data === null) {
    data = "There was an error on this message";
  }
}

app.use(express.static("public"));

io.on("connection", (socket) => {
  const mensajes = [];
  console.log("Cliente conectado: ", socket.id);
  const colors = ["purple", "green", "blue"];
  const randomNum = Math.floor(Math.random() * 3);
  console.log(randomNum)
  const color = colors[randomNum];
  socket.on("message", (username, message) => {
    validateUsername(username);
    validateMsg(message);
    mensajes.push({ username: username, message: message, color: color });
    io.sockets.emit("newmsg", mensajes);
  });
});

httpServer.listen(8080, () => {
  console.log("Server open, port: ", 8080);
});
