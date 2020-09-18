import { getAudio } from "./assetLoader.js";

const AUDIO = getAudio();

export function playerShoot(shipType) {
  console.log(shipType);
  let shootAudio;
  if (
    shipType === "valkyrie" ||
    shipType === "stinger" ||
    shipType === "jet" ||
    shipType == "imperial" ||
    shipType == "spaceship3" ||
    shipType === "commonShip"
  ) {
    shootAudio = AUDIO["shootVariation1.wav"].cloneNode();
  } else if (shipType === "voidShip") {
    shootAudio = AUDIO["voidShoot.wav"];
  }
  shootAudio.volume = ".1";
  shootAudio.play();
}

export function enemyKill() {
  let killAudio = AUDIO["enemyDeath.wav"].cloneNode();
  killAudio.volume = ".4";
  killAudio.play();
}

export function enemyDamage() {
  let hitAudio = AUDIO["shootHit.wav"].cloneNode();
  hitAudio.volume = ".4";
  hitAudio.play();
}

export function takeDamage() {
  let damageAudio = AUDIO["playerDamage.wav"].cloneNode();
  damageAudio.volume = ".2";
  damageAudio.play();
}

export function chargeUp() {
  let chargeAudio = AUDIO["chargeUp.wav"].cloneNode();
  chargeAudio.volume = ".2";
  chargeAudio.play();
}
