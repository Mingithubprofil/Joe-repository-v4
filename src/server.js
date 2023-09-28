const express = require("express");
const bodyParser = require('body-parser');

const app = express();
const port = 3000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

const http = require('http').Server(app);
const io = require('socket.io')(http);
const host = 'localhost';
const path = require('path')
const userRoute = require("./routes/userRoute");

app.use(express.static(__dirname + '../client'));

app.use("/", userRoute);

app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/pages/home.html'));
  
});

app.get('/home.js', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/scripts/home.js'));
  
});

app.get('/global.css', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/styles/global.css'));
  
});


io.on('connection', (socket) => {
  socket.on('chat message', msg => {
    io.emit('chat message', msg);
  });
  socket.on('user joined', username => {
    console.log(username + " joined the chat")
    io.emit('chat message', username + " joined the chat");
  });
});

http.listen(port, host, () => {
  console.log(`Socket.IO server running at http://${host}:${port}/`);
});
