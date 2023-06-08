function joinRoom(roomName) {
  //   Send room name to server
  nsSocket.emit("joinRoom", roomName, (newNumberOfMembers) => {
    // update the room member total after a member joins

    document.querySelector(
      ".curr-room-num-users"
    ).innerHTML = `<i class="fa-regular fa-user" style="color: #eef1f7;"></i></span> ${newNumberOfMembers}`;
  });
}
