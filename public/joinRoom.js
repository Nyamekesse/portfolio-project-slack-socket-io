function joinRoom(roomName) {
  //   Send room name to server
  nsSocket.emit("joinRoom", roomName, (newNumberOfMembers) => {
    // update the room member total after a member joins

    document.querySelector(
      ".curr-room-num-users"
    ).innerHTML = `<i class="fa-regular fa-user" style="color: #eef1f7;"></i></span> ${newNumberOfMembers}`;
  });

  nsSocket.on("historyMessages", (historyMessages) => {
    const messageView = document.querySelector("#messages");
    messageView.innerHTML = "";
    historyMessages.forEach((message) => {
      const newMessage = updateDom(message);
      const currentMessages = messageView.innerHTML;
      messageView.innerHTML = currentMessages + newMessage;
    });
    messageView.scrollTo(0, messageView.scrollHeight);
  });

  nsSocket.on("updateNumberOfSockets", (updatedNumberOfMembers) => {
    document.querySelector(
      ".curr-room-num-users"
    ).innerHTML = `<i class="fa-regular fa-user" style="color: #eef1f7;"></i></span> ${updatedNumberOfMembers}`;
    document.querySelector(".curr-room-text").innerText = `${roomName}`;
  });
}
