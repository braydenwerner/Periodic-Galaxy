import {
  updateDirection,
  shootMissile,
  moveForward,
  slowDown,
} from "./socket.js";

function keyDown(e) {
  if (e.keyCode == 32) shootMissile(true);
  if (e.keyCode == 87) moveForward(true);
  if (e.keyCode == 83) slowDown(true);
}

function keyUp(e) {
  if (e.keyCode == 32) shootMissile(false);
  if (e.keyCode == 87) moveForward(false);
  if (e.keyCode == 83) slowDown(false);
}

function mouseMove(e) {
  handleMouse(e.clientX, e.clientY);
}

function handleMouse(x, y) {
  const direction = Math.atan2(
    x - window.innerWidth / 2,
    window.innerHeight / 2 - y
  );
  updateDirection(direction);
}

function mouseDown() {
  shootMissile(true);
}

function mouseUp() {
  shootMissile(false);
}

function touchMove(e) {
  handleMouse(e.clientX, e.clientY);
}

export function startCapturingInput() {
  window.addEventListener("keydown", keyDown);
  window.addEventListener("keyup", keyUp);
  window.addEventListener("mousemove", mouseMove);
  window.addEventListener("mousedown", mouseDown);
  window.addEventListener("mouseup", mouseUp);
  window.addEventListener("touchmove", touchMove);
}

export function stopCapturingInput() {
  window.removeEventListener("keydown", keyDown);
  window.removeEventListener("keyup", keyUp);
  window.removeEventListener("mousemove", mouseMove);
  window.removeEventListener("mousedown", mouseDown);
  window.removeEventListener("mouseup", mouseUp);
  window.addEventListener("touchmove", touchMove);
}
