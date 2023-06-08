function joinNameSpace(endpoint) {
  const messageForm = document.querySelector("#message-form");
  let roomList = document.querySelector(".room-list");
  nsSocket = io(`http://localhost:9000${endpoint}`);

  nsSocket.on("nsRoomLoad", (nsRooms) => {
    roomList.innerHTML = "";
    nsRooms.forEach((room) => {
      let glyph;
      if (room.privateRoom) {
        glyph = `<i class="fa-solid fa-lock" style="color: #ffffff;"></i>`;
      } else {
        glyph = `<i class="fa-solid fa-globe" style="color: #ffffff;"></i>`;
      }
      roomList.innerHTML += `<div class="room-wrap">${glyph} <li class="room">${room.roomTitle}</li></div>`;
    });
    // Add a click listener to each node
    let roomNodes = document.getElementsByClassName("room");
    Array.from(roomNodes).forEach((elem) => {
      elem.addEventListener("click", (e) => {
        console.log(e.target.innerText);
      });
    });

    // Automatically join a user to a room
    const topRoom = document.querySelector(".room");
    const topRoomName = topRoom.innerText;
    joinRoom(topRoomName);
  });

  nsSocket.on("messageToClients", (msg) => {
    const message = updateDom(msg);
    messageContainer = document.querySelector("#messages").innerHTML += message;
  });

  messageForm.addEventListener("submit", (event) => {
    event.preventDefault();
    userMessage = document.querySelector("#user-message").value;
    nsSocket.emit("newMessageToServer", { text: userMessage });
  });
}

function updateDom(messageObj) {
  const convertedDate = new Date(messageObj.time).toLocaleString();
  const HTMLLiteral = `
    <li>
        <div class="user-image">
            <img src=${messageObj.avatar} />
        </div>
        <div class="user-message">
            <div class="user-name-time">${messageObj.username} <span>${convertedDate}</span></div>
            <div class="message-text">${messageObj.text}</div>
        </div>
    </li>`;

  return HTMLLiteral;
}
