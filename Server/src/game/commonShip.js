const Player = require("./player.js");
const Missile = require("./missile");

class commonShip extends Player {
  constructor(id, x, y, userData, socket) {
    super(
      id,
      x,
      y,
      26.5,
      35,
      0,
      10,
      650,
      0.1,
      0.4,
      5,
      5,
      0,
      0,
      100,
      0,
      0,
      [],
      0,
      userData.username,
      userData.profilePicture,
      userData.email,
      userData.canvasWidth,
      userData.canvasHeight,
      false,
      socket
    );
  }

  update(dt) {
    super.update(dt);

    if (this.shooting && this.shootCooldown == 0) {
      //emit a request to play audio
      this.socket.emit("/playerShoot", "commonShip");

      let bulletSpawnRadius = 20;
      let xOffset = Math.cos(this.direction) * bulletSpawnRadius;
      let yOffset = Math.sin(this.direction) * bulletSpawnRadius;
      let missile1 = new Missile(
        this.id,
        this.x - xOffset,
        this.y - yOffset,
        this.direction,
        3,
        3,
        1300,
        1,
        "blueMissile.png"
      );
      let missile2 = new Missile(
        this.id,
        this.x + xOffset,
        this.y + yOffset,
        this.direction,
        3,
        3,
        1300,
        1,
        "blueMissile.png"
      );
      this.missiles.push(missile1);
      this.missiles.push(missile2);

      this.shootCooldown = 15;
    }

    //update timers
    if (this.collisionCooldown > 0) this.collisionCooldown--;
    if (this.shootCooldown > 0) this.shootCooldown--;
  }

  serializeForUpdate() {
    return {
      ...super.serializeForUpdate(),
      spaceShipType: "commonShip.png",
    };
  }
}

module.exports = commonShip;
