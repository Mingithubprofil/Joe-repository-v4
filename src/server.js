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

//app.use(express.static(path.join(__dirname, '../client')));

app.use("/", userRoute);

//home

app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/pages/home.html'));
  
});

//juicechat

app.get('/juicechat.js', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/scripts/juicechat.js'));
  
});

//location 

app.get("/location.js", (req, res) => {
  //res.header('Content-Type', 'text/javascript');
  res.sendFile(path.join(__dirname, "../client/scripts/location.js"));
});

//cart

app.get("/cart.js", (req, res) => {
  //res.header('Content-Type', 'text/javascript');
  res.sendFile(path.join(__dirname, "../client/scripts/cart.js"));
});

//customize juice

app.get('/customizeJuice.js', (req, res) => {
  //res.header('Content-Type', 'text/javascript');
  res.sendFile(path.join(__dirname, '../client/scripts/customizeJuice.js'));
//css
  
});
app.get('/global.css', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/styles/global.css'));
  
});

//socket io

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
