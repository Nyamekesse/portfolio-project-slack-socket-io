function joinNameSpace(endpoint) {
  const messageForm = document.querySelector("#message-form");
  let roomList = document.querySelector(".room-list");
  let nsSocket = io(`http://localhost:9000/${endpoint}`);

  nsSocket.on("nsRoomLoad", (nsRooms) => {
    roomList.innerHTML = "";
    nsRooms.forEach((room) => {
      let glyph;
      if (room.privateRoom) {
        glyph = "lock";
      } else {
        glyph = "globe";
      }
      roomList.innerHTML += `<li class="room"><span class="glyphicon glyphicon-${glyph}"></span>${room.roomTitle}</li>`;
    });
    // Add a click listener to each node
    let roomNodes = document.getElementsByClassName("room");
    Array.from(roomNodes).forEach((elem) => {
      elem.addEventListener("click", (e) => {
        console.log(e.target.innerText);
      });
    });
  });

  nsSocket.on("messageToClients", (msg) => {
    messageContainer = document.querySelector(
      "#messages"
    ).innerHTML += `<li>${msg.text}</li>`;
  });

  messageForm.addEventListener("submit", (event) => {
    event.preventDefault();
    userMessage = document.querySelector("#user-message").value;
    socket.emit("newMessageToServer", { text: userMessage });
  });
}
