const socket = io("http://localhost:9000");
const socket2 = io("http://localhost:9000/admin");

socket.on("messageFromServer", (dataFromServer) => {
  console.log(dataFromServer);
  socket.emit("messageToServer", { data: "This is the message from Client" });
});

socket.on("joined", (msg) => {
  console.log(msg);
});

socket2.on("welcome", (dataFromServer) => {
  console.log(dataFromServer);
});

const messageForm = document.querySelector("#message-form");

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
