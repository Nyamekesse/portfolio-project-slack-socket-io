const socket = io("http://localhost:9000");
const messageForm = document.querySelector("#message-form");
let namespaceDiv = document.querySelector(".namespaces");
let roomList = document.querySelector(".room-list");

// listen for ns list which is a list of all the namespaces
socket.on("nsList", (nsData) => {
  namespaceDiv.innerHTML = "";
  nsData.forEach((ns) => {
    namespaceDiv.innerHTML += `<div class="namespace" ns=${ns.endpoint}><img src=${ns.img} /></div>`;
  });

  // Add click listener for each namespace
  Array.from(document.getElementsByClassName("namespace")).forEach((elem) => {
    elem.addEventListener("click", (e) => {
      const nsEndpoint = elem.getAttribute("ns");
      console.log(`${nsEndpoint} I should go to now`);
    });
  });

  const nsSocket = io("http://localhost:9000/wiki");
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
});

socket.on("messageFromServer", (dataFromServer) => {
  console.log(dataFromServer);
  socket.emit("messageToServer", { data: "This is the message from Client" });
});

socket.on("joined", (msg) => {
  console.log(msg);
});

messageForm.addEventListener("submit", (event) => {
  event.preventDefault();
  userMessage = document.querySelector("#user-message").value;
  socket.emit("newMessageToServer", { text: userMessage });
});

socket.on("messageToClients", (msg) => {
  messageContainer = document.querySelector(
    "#messages"
  ).innerHTML += `<li>${msg.text}</li>`;
});
