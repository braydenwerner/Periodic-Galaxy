import { connect, play } from "./socket.js";
import {
  startRendering,
  renderMenuTips,
  stopRenderMenuTips,
} from "./render.js";
import { startCapturingInput } from "./input.js";
import { initState } from "./state.js";
import { downloadImages, downloadAudios } from "./assetLoader.js";

const userInput = document.getElementById("userInput");
const submitUser = document.getElementById("submitUser");
const canvas = document.getElementById("display");
const loginForm = document.getElementById("loginForm");

canvas.style.display = "none";

renderMenuTips();

Promise.all([connect(onGameOver), downloadImages(), downloadAudios()]).then(
  () => {
    userInput.focus();

    submitUser.onclick = () => {
      if (!userInput.value.trim()) return;
      loginForm.style.display = "none";
      canvas.style.display = "initial";

      //play some aryan kapoor <3
      //let gameMusic = document.getElementById("audio");
      //gameMusic.src = "./audio/Aryan Kapoor & TVT- She Don’t Know (Music Video).mp3";
      //gameMusic.play();

      let profilePicture;
      if (document.getElementById("imageElement")) {
        profilePicture = document.getElementById("imageElement").src;
      }

      let email;
      if (document.getElementById("emailElement")) {
        let text = document.getElementById("emailElement").textContent;
        email = text.substring(0, text.indexOf("'"));
      }

      play({
        username: userInput.value,
        profilePicture: profilePicture,
        email: email,
        canvasWidth: canvas.width,
        canvasHeight: canvas.height,
      });

      stopRenderMenuTips();
      initState();
      startCapturingInput();
      startRendering();
    };
  }
);

function onGameOver() {
  window.location.reload();
}
