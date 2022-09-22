const { Server: HTTPServer } = require("http");
const express = require("express");
const { Server: SocketServer } = require("socket.io");

const app = express();
const httpServer = HTTPServer(app);
const io = new SocketServer(httpServer);
const mensajes = [];
const onlineUsers = [];

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
  let myUser = {};
  myUser.id = socket.id;
  const colors = ["purple", "green", "blue"];
  const randomNum = Math.floor(Math.random() * 3);
  const color = colors[randomNum];
  socket.emit("ping", mensajes);
  socket.on("message", (username, message) => {
    validateUsername(username);
    validateMsg(message.text);
    mensajes.push({
      username: username,
      message: message.text,
      date: message.date,
      color: color,
    });
    io.sockets.emit("newmsg", mensajes);
  });
  socket.on("online", (username) => {
    validateUsername(username);
    myUser.username = username;
    onlineUsers.push(username);
    io.sockets.emit("newonline", onlineUsers);
    console.log(
      `User logged in, username: "${myUser.username}" id: "${myUser.id}"`
    );
  });
  socket.on("disconnect", () => {
    console.log(
      `Disconnected, username: "${myUser.username}" id: "${myUser.id}"`
    );
    onlineUsers.splice(onlineUsers.indexOf(myUser.username), 1);
    io.sockets.emit("newonline", onlineUsers);
  });
});

httpServer.listen(8080, () => {
  console.log("Server open, port: ", 8080);
});
