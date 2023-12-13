

//Implementering af socket.io til juicechatten

const socket = io();

const messages = document.getElementById("messages");
const input = document.getElementById("input");

function sendChat() {
  if (input.value) {
    socket.emit("chat message", username + ": " + input.value);
    input.value = "";
  }
}

socket.on("chat message", (msg) => {
  const item = document.createElement("li");
  item.textContent = msg;
  messages.appendChild(item);
});

// Her tjekkes om brugeren er logget ind, hvis ikke så dirigeres brugeren til login-siden:

let username = getCookie("userAuth");
if (!username) location.href = "/login";

socket.emit("user joined", username);

// Her hentes brugerens cookie

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}




