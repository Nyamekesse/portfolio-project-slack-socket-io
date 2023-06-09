const username = prompt("What is your username?");
const host = window.location.hostname;
const protocol = window.location.protocol;
if (host.toLocaleLowerCase().includes("localhost")) {
  URL = "http://localhost:9000";
} else {
  // const URL = "https://slack-clone-project.onrender.com";
  const URL = `${protocol}//${host}`;
}
// const socket = io("http://localhost:9000");
const socket = io(`${URL}`, {
  query: {
    username,
  },
});
let nsSocket = "";
let namespaceDiv = document.querySelector(".namespaces");

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
      joinNameSpace(nsEndpoint);
    });
  });

  joinNameSpace("/wiki");
});
