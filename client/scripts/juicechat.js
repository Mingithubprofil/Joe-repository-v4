const socket = io();

const messages = document.getElementById("messages");
const input = document.getElementById("input");


// form.addEventListener('submit', (e) => {
//   e.preventDefault();
//   if (input.value) {
//     socket.emit('chat message', input.value);
//     input.value = '';
//   }
// });


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

/*
//visning af username på siden

if (username) {
  
  const elements = document.querySelectorAll(".username_on_page");

  elements.forEach(element => {
    element.innerHTML = username;
  });
} */














