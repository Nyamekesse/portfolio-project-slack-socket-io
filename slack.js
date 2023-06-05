const express = require("express");
const socketio = require("socket.io");

const app = express();
app.use(express.static(__dirname + "/public"));

const expressServer = app.listen(9000);
const io = socketio(expressServer);

io.on("connection", (socket) => {
  socket.emit("messageFromServer", { data: "Welcome to the Socket.io server" });
  socket.on("messageToServer", (dataFromClient) => {
    console.log(dataFromClient);
  });
  socket.on("newMessageToServer", (msg) => {
    io.emit("messageToClients", { text: msg.text });
    io.of("/").emit("messageToClients", { text: msg.text });
  });
  socket.join("level1");
  io.of("/")
    .to("level1")
    .emit("joined", `${socket.id} says I have joined the level 1 room`);
});

io.of("/admin").on("connection", (socket) => {
  console.log("Someone connected to the main admin namespace");
  io.of("/admin").emit("welcome", "welcome to main admin channel");
});
