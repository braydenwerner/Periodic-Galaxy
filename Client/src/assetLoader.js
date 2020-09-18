const IMAGES_FILES = [
  "commonShip.png",
  "cursor.png",
  "cursorSpeedUpgrade.png",
  "healthpack.png",
  "imperial.png",
  "jet.png",
  "blueMissile.png",
  "redMissile.png",
  "alienMissile.png",
  "spacebackground.png",
  "spaceship3.png",
  "speedBoost.png",
  "stinger.png",
  "valkyrie.png",
  "voidShip.png",
  "purpleMissile.png",
  "yellowMissile.png",
];

const images = {};
const downloadPromiseImage = Promise.all(IMAGES_FILES.map(downloadImage));

function downloadImage(imageName) {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => {
      images[imageName] = image;
      resolve();
    };

    image.src = `../Images/${imageName}`;
  });
}

export const downloadImages = () => downloadPromiseImage;
export const getImages = () => images;

const AUDIO_FILES = [
  "enemyDeath.wav",
  "playerDamage.wav",
  "shoot.wav",
  "shootHit.wav",
  "shootVariation1.wav",
  "shootVariation2.wav",
  "chargeUp.wav",
  "voidShoot.wav",
];

const audioObject = {};
const downloadPromiseAudio = Promise.all(AUDIO_FILES.map(downloadAudio));

function downloadAudio(audioName) {
  return new Promise((resolve) => {
    const audio = new Audio();
    audioObject[audioName] = audio;
    audio.src = `../audio/${audioName}`;
    resolve();
  });
}

export const downloadAudios = () => downloadPromiseAudio;
export const getAudio = () => audioObject;
