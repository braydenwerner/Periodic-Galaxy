const commonShip = require("./commonShip.js");
const Jet = require("./jet.js");
const Spaceship3 = require("./spaceship3.js");
const Imperial = require("./imperial.js");
const Stinger = require("./stinger.js");
const voidShip = require("./voidShip.js");
const PowerUp = require("./powerUp.js");
const Constants = require("../serverConstants");
const {
  cursorCollision,
  powerUpCollision,
  missileCollision,
} = require("./collisions.js");
const Valkyrie = require("./valkyrie.js");

class Game {
  constructor() {
    //keep track of all sockets connected. Can loop through sockets and update players
    this.sockets = {};
    this.players = {};
    this.missiles = [];
    this.lastUpdateTime = Date.now();
    this.shouldSendUpdate = false;

    this.powerUp = new PowerUp();
    this.powerUp.spawnPowerUp();

    setInterval(this.update.bind(this), 1000 / 60);
  }

  addPlayer(socket, userData) {
    this.sockets[socket.id] = socket;

    const x = Constants.MAP_SIZE * (0.25 + Math.random() * 0.5);
    const y = Constants.MAP_SIZE * (0.25 + Math.random() * 0.5);

    let spaceship = Math.floor(Math.random() * 7);
    if (spaceship == 0) {
      this.players[socket.id] = new commonShip(
        socket.id,
        x,
        y,
        userData,
        socket
      );
    } else if (spaceship == 1) {
      this.players[socket.id] = new Jet(socket.id, x, y, userData, socket);
    } else if (spaceship == 2) {
      this.players[socket.id] = new Spaceship3(
        socket.id,
        x,
        y,
        userData,
        socket
      );
    } else if (spaceship == 3) {
      this.players[socket.id] = new Imperial(socket.id, x, y, userData, socket);
    } else if (spaceship == 4) {
      this.players[socket.id] = new Stinger(socket.id, x, y, userData, socket);
    } else if (spaceship == 5) {
      this.players[socket.id] = new Valkyrie(socket.id, x, y, userData, socket);
    } else if (spaceship == 6) {
      this.players[socket.id] = new voidShip(socket.id, x, y, userData, socket);
    }
  }

  removePlayer(socket) {
    delete this.sockets[socket.id];
    delete this.players[socket.id];
  }

  updateDirection(socket, input) {
    if (this.players[socket.id]) this.players[socket.id].updateDirection(input);
  }

  shootMissile(socket, input) {
    if (this.players[socket.id]) this.players[socket.id].shootMissile(input);
  }

  moveForward(socket, input) {
    if (this.players[socket.id]) this.players[socket.id].moveForward(input);
  }

  slowDown(socket, input) {
    if (this.players[socket.id]) this.players[socket.id].slowDown(input);
  }

  update() {
    // Calculate time elapsed
    const now = Date.now();
    const dt = (now - this.lastUpdateTime) / 1000;
    this.lastUpdateTime = now;

    //Concat all player's missiles to missiles
    let playerList = Object.values(this.players);
    this.missiles = [];
    for (let i = 0; i < playerList.length; i++) {
      this.missiles = this.missiles.concat(playerList[i].getMissiles());
    }

    // Update each player
    Object.keys(this.sockets).forEach((playerID) => {
      const player = this.players[playerID];
      player.update(dt);
    });

    // Check if any players are dead
    Object.keys(this.sockets).forEach((playerID) => {
      const socket = this.sockets[playerID];
      const player = this.players[playerID];
      if (player.hp <= 0) {
        socket.emit("/gameOver");
        this.removePlayer(socket);
      }
    });

    // Send a game update to each player every other time
    if (this.shouldSendUpdate) {
      Object.keys(this.sockets).forEach((playerID) => {
        const socket = this.sockets[playerID];
        const player = this.players[playerID];
        socket.emit("/gameUpdate", this.createUpdate(player));
      });
      this.shouldSendUpdate = false;
    } else {
      this.shouldSendUpdate = true;
    }

    cursorCollision(Object.values(this.players), 0);
    powerUpCollision(Object.values(this.players), this.powerUp, this.sockets);
    missileCollision(Object.values(this.players), this.missiles, this.sockets);
  }

  createUpdate(player) {
    const nearbyPlayers = Object.values(this.players).filter(
      (p) => p !== player && p.distanceTo(player) <= Constants.MAP_SIZE / 2
    );

    const nearbyMissiles = this.missiles.filter(
      (m) => m.distanceTo(player) <= Constants.MAP_SIZE / 2
    );

    return {
      t: Date.now(),
      player: player.serializeForUpdate(),
      otherPlayers: nearbyPlayers.map((player) => player.serializeForUpdate()),
      powerUp: this.powerUp.serializeForUpdate(),
      missiles: nearbyMissiles.map((missile) => missile.serializeForUpdate()),
    };
  }
}

module.exports = Game;
