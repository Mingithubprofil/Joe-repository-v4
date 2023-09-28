const socket = io();

const messages = document.getElementById("messages");
const input = document.getElementById("input");
// let username = "Anonymous";

// if (localStorage.getItem("Username") != null) {
//   username = localStorage.getItem("Username");
// }


// form.addEventListener('submit', (e) => {
//   e.preventDefault();
//   if (input.value) {
//     socket.emit('chat message', input.value);
//     input.value = '';
//   }
// });

// function changeUsername() {
//   username = document.getElementById("username").value;
//   if (!username == "") {
//     localStorage.setItem("Username", username);
//   } else {
//     localStorage.setItem("Username", "Anonymous");
//   }
//   socket.emit("user joined", username);
//   document.getElementById("username").value = "";
// }

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
  window.scrollTo(0, document.body.scrollHeight);
});


// Cookie her:

let username = getCookie("userAuth");
if (!username) location.href = "/login";


socket.emit("user joined", username);

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

function changeUsername() {
  username = document.getElementById("username").value;

  if (username == "") {
    alert("Skriv et nyt brugernavn");
    return;
  } else document.cookie = `userAuth=${username}`;

  socket.emit("user joined", username);
  document.getElementById("username").value = "";
}
