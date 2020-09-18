import { processGameUpdate } from "./state.js";
import {
  playerShoot,
  enemyKill,
  enemyDamage,
  takeDamage,
  chargeUp,
} from "./playAudio.js";

const ENDPOINT = "https://pgio.herokuapp.com/";

// eslint-disable-next-line
const socket = io(ENDPOINT);

const connectedPromise = new Promise((resolve) => {
  socket.on("connect", () => {
    resolve();
  });
});

export const connect = (onGameOver) =>
  connectedPromise.then(() => {
    // Register callbacks
    socket.on("/gameUpdate", processGameUpdate);
    socket.on("/gameOver", onGameOver);
    socket.on("/playerShoot", (shipType) => playerShoot(shipType));
    socket.on("/enemyKill", () => enemyKill());
    socket.on("/enemyDamage", () => enemyDamage());
    socket.on("/takeDamage", () => takeDamage());
    socket.on("/chargeUp", () => chargeUp());
  });

export const play = (userData) => {
  socket.emit("/play", userData);
};

export const updateDirection = (direction) => {
  socket.emit("/updateDirection", direction);
};

export const shootMissile = (shooting) => {
  socket.emit("/shootMissile", shooting);
};

export const moveForward = (forward) => {
  socket.emit("/moveForward", forward);
};

export const slowDown = (slowing) => {
  socket.emit("/slowDown", slowing);
};
