const express = require("express");
const socketio = require("socket.io");

const app = express();

app.use(express.static(__dirname + "/public"));

const expressServer = app.listen(9000);
const io = socketio(expressServer);

let namespaces = require("./data/namespace");

io.on("connection", (socket) => {
  // build an array to send back with the image and endpoint for each namespace
  let nsData = namespaces.map((ns) => {
    return {
      img: ns.img,
      endpoint: ns.endpoint,
    };
  });

  // send nsData back to client using the socket not io because we want it to go to just the client
  socket.emit("nsList", nsData);
});

// loop through each namespace and listen for a connection
namespaces.forEach((namespace) => {
  io.of(namespace.endpoint).on("connection", (nsSocket) => {
    console.log(`${nsSocket.id} has joined ${namespace.endpoint}`);

    // send the namespace group info to client
    nsSocket.emit("nsRoomLoad", namespaces[0].rooms);

    nsSocket.on("joinRoom", (roomToJoin, numberOfUsersCallback) => {
      nsSocket.join(roomToJoin);

      // deal with history.. once we have it
      const nsRoom = namespaces[0].rooms.find((room) => {
        return room.roomTitle === roomToJoin;
      });
      nsSocket.emit("historyMessages", nsRoom.history);

      // Get a list of connected sockets in the namespace
      // push the total number of users to sockets connected to the room
      io.of("/wiki")
        .in(roomToJoin)
        .clients((error, clients) => {
          io.of("/wiki")
            .in(roomToJoin)
            .emit("updateNumberOfSockets", clients.length);
        });
    });
    nsSocket.on("newMessageToServer", (msg) => {
      const fullMessage = {
        text: msg.text,
        time: Date.now(),
        username: "Eye",
        avatar: "https://via.placeholder.com/30",
      };

      // forward the message to the room of this socket is in
      const roomTitle = Object.keys(nsSocket.rooms)[1];

      // find room object for the room
      const nsRoom = namespaces[0].rooms.find(
        (room) => room.roomTitle === roomTitle
      );
      nsRoom.addMessage(fullMessage);
      console.log(nsRoom);
      io.of("/wiki").to(roomTitle).emit("messageToClients", fullMessage);
    });
  });
});
