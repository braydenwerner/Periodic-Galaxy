import { getCurrentState } from "./state.js";
import { MAP_SIZE } from "./clientConstants.js";
import { getImages } from "./assetLoader.js";

const IMAGES = getImages();
const canvas = document.getElementById("display");
const ctx = canvas.getContext("2d");

const tip = document.getElementById("tip");
tip.style.visibility = "hidden";
const tips = [
  "Hold spacebar to shoot!",
  "Hold W to move faster!",
  "Collect powerups!",
];

let interval;
let index = 0;
export function renderMenuTips() {
  interval = setInterval(renderRandomMessage, 1500);
}

export function stopRenderMenuTips() {
  clearInterval(interval);
}

let waitTime = 0;
function renderRandomMessage() {
  if (waitTime > 0) {
    tip.classList.toggle("fade");

    if (waitTime % 2 == 0) {
      tip.innerText = tips[index++];
      if (index === tips.length) index = 0;
    }
  } else {
    tip.innerText = tips[index++];
    if (index === tips.length) index = 0;
    tip.style.visibility = "visible";
  }
  waitTime++;
}

export function startRendering() {
  setInterval(render, 1000 / 60);
}

setCanvasDimensions();
function setCanvasDimensions() {
  const scaleRatio = Math.max(1, 800 / window.innerWidth);
  canvas.width = scaleRatio * window.innerWidth;
  canvas.height = scaleRatio * window.innerHeight;
}
window.addEventListener("resize", setCanvasDimensions);

function render() {
  const { player, otherPlayers, powerUp, missiles } = getCurrentState();
  if (!player) return;

  ctx.fillStyle = "BLACK";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  renderBackground(player.x, player.y);
  renderPlayer(player, player);
  otherPlayers.forEach((otherPlayer) => renderPlayer(player, otherPlayer));
  renderCursor(player, player);
  otherPlayers.forEach((otherPlayer) => renderCursor(player, otherPlayer));
  renderPowerUp(player, powerUp);
  missiles.forEach((missile) => renderMissile(player, missile));
}

function renderBackground(x, y) {
  const backgroundX = canvas.width / 2 - x;
  const backgroundY = canvas.height / 2 - y;

  ctx.save();
  ctx.translate(backgroundX, backgroundY);
  ctx.drawImage(IMAGES["spacebackground.png"], 0, 0, MAP_SIZE, MAP_SIZE);
  ctx.restore();
}

function renderPlayer(player, otherPlayer) {
  const canvasX = canvas.width / 2 - player.x + otherPlayer.x;
  const canvasY = canvas.height / 2 - player.y + otherPlayer.y;

  ctx.save();
  ctx.translate(canvasX, canvasY);
  ctx.rotate(otherPlayer.direction);
  ctx.fillStyle = "RED";
  ctx.drawImage(
    IMAGES[otherPlayer.spaceShipType],
    -otherPlayer.width,
    -otherPlayer.height,
    otherPlayer.width * 2,
    otherPlayer.height * 2
  );
  ctx.restore();

  //render HP
  ctx.fillStyle = "WHITE";
  ctx.fillRect(
    canvasX - otherPlayer.width,
    canvasY - otherPlayer.height - 5,
    otherPlayer.width * 2,
    2
  );
  ctx.fillStyle = "RED";
  ctx.fillRect(
    canvasX -
      otherPlayer.width +
      (otherPlayer.width * 2 * otherPlayer.hp) / otherPlayer.maxHP,
    canvasY - otherPlayer.height - 5,
    otherPlayer.width * 2 * (1 - otherPlayer.hp / otherPlayer.maxHP),
    2
  );

  //render nametag
  ctx.fillStyle = "WHITE;";
  ctx.textAlign = "center";
  ctx.font = "15px Arial";
  ctx.fillText(
    otherPlayer.username,
    canvasX,
    canvasY - otherPlayer.height - 10
  );
}

function renderCursor(player, otherPlayer) {
  const canvasX = canvas.width / 2 + otherPlayer.cursorX - player.x;
  const canvasY = canvas.height / 2 + otherPlayer.cursorY - player.y;

  ctx.save();
  ctx.translate(canvasX, canvasY);
  ctx.fillStyle = "RED";
  ctx.drawImage(IMAGES["cursor.png"], 0, 0, 10, 10);
  ctx.restore();
}

function renderMissile(player, missile) {
  const canvasX = canvas.width / 2 + missile.x - player.x;
  const canvasY = canvas.height / 2 + missile.y - player.y;
  ctx.save();
  ctx.translate(canvasX, canvasY);
  ctx.rotate(missile.direction);
  ctx.drawImage(
    IMAGES[missile.type],
    -missile.width,
    -missile.height,
    missile.width * 2,
    missile.height * 2
  );
  ctx.restore();
}

function renderPowerUp(player, powerUp) {
  ctx.drawImage(
    IMAGES[powerUp.type],
    canvas.width / 2 + powerUp.x - player.x - powerUp.width,
    canvas.height / 2 + powerUp.y - player.y - powerUp.height,
    powerUp.width * 2,
    powerUp.height * 2
  );
}
