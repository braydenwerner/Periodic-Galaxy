require("dotenv").config();
const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const cors = require("cors");

const Game = require("./game/game.js");
const database = require("./database");

const app = express();
app.use(express.json());

let corsOptions = {
  origin: "https://www.periodicgang.com",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));

const server = http.createServer(app);
const io = socketio(server);

app.get("/", (req, res) => {
  res.send("The server is live!");
});

app.get("/userId/:id", (req, res) => {
  database.getUser(req.params.id, (result) => {
    return res.json(result);
  });
});

app.post("/addUser", (req, res) => {
  database.addUser(req.body.id, req.body.name, req.body.email, 0);
  return res.json("Recieved POST request");
});

io.on("connection", (socket) => {
  console.log("Player connected!", socket.id);

  socket.on("/play", (userData) => {
    console.log("Adding player!");
    game.addPlayer(socket, userData);
  });

  socket.on("/updateDirection", (input) => {
    game.updateDirection(socket, input);
  });

  socket.on("/shootMissile", (input) => {
    game.shootMissile(socket, input);
  });

  socket.on("/moveForward", (input) => {
    game.moveForward(socket, input);
  });

  socket.on("/slowDown", (input) => {
    game.slowDown(socket, input);
  });

  socket.on("disconnect", () => {
    game.removePlayer(socket);
  });
});

const game = new Game();

const PORT = process.env.PORT || 4000;
server.listen(PORT);
console.log(`Server listening on port ${PORT}`);
