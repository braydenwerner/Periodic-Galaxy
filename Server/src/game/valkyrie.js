const Player = require("./player.js");
const Missile = require("./missile");

class Valkyrie extends Player {
  constructor(id, x, y, userData, socket) {
    super(
      id,
      x,
      y,
      65,
      50,
      0,
      8,
      500,
      0.2,
      0.4,
      10,
      10,
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
      this.socket.emit("/playerShoot", "valkyrie");

      let bulletSpawnRadius = 20;
      let xOffset = Math.cos(this.direction) * bulletSpawnRadius;
      let yOffset = Math.sin(this.direction) * bulletSpawnRadius;
      let missile1 = new Missile(
        this.id,
        this.x - xOffset,
        this.y - yOffset,
        this.direction,
        2,
        9,
        1300,
        1,
        "yellowMissile.png"
      );
      let missile2 = new Missile(
        this.id,
        this.x + xOffset,
        this.y + yOffset,
        this.direction,
        2,
        9,
        1300,
        1,
        "yellowMissile.png"
      );
      this.missiles.push(missile1);
      this.missiles.push(missile2);

      this.shootCooldown = 10;
    }

    //update timers
    if (this.collisionCooldown > 0) this.collisionCooldown--;
    if (this.shootCooldown > 0) this.shootCooldown--;
  }

  serializeForUpdate() {
    return {
      ...super.serializeForUpdate(),
      spaceShipType: "valkyrie.png",
    };
  }
}

module.exports = Valkyrie;
