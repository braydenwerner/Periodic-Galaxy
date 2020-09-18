const Constants = require("../serverConstants.js");
class PowerUp {
  constructor() {
    this.types = ["speedBoost.png", "cursorSpeedUpgrade.png", "healthpack.png"];
    this.type = this.types[Math.floor(Math.random() * this.types.length)];

    this.x = 0;
    this.y = 0;

    this.width = 30;
    this.height = 37.5;
  }

  spawnPowerUp() {
    this.type = this.types[Math.floor(Math.random() * this.types.length)];
    this.x = Math.floor(Math.random() * (Constants.MAP_SIZE - this.width));
    this.y = Math.floor(Math.random() * (Constants.MAP_SIZE - this.height));
  }

  serializeForUpdate() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      type: this.type,
    };
  }
}

module.exports = PowerUp;
