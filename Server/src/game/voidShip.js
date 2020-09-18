const Player = require("./player.js");
const Missile = require("./missile");

class voidShip extends Player {
  constructor(id, x, y, userData, socket) {
    super(
      id,
      x,
      y,
      30,
      37.5,
      0,
      8,
      350,
      0.2,
      0.4,
      13,
      13,
      0,
      0,
      100,
      0,
      0,
      [],
      25,
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

    //charge up sound effect
    if (this.shootCooldown == 5) {
      this.socket.emit("/chargeUp");
    }

    if (this.shooting && this.shootCooldown == 0) {
      //emit a request to play audio
      this.socket.emit("/playerShoot", "voidShip");

      let missile = new Missile(
        this.id,
        this.x,
        this.y,
        this.direction,
        12,
        23.5,
        2900,
        5,
        "purpleMissile.png"
      );
      this.missiles.push(missile);

      this.shootCooldown = 100;
    }

    //update timers
    if (this.collisionCooldown > 0) this.collisionCooldown--;
    if (this.shootCooldown > 0) this.shootCooldown--;
  }

  serializeForUpdate() {
    return {
      ...super.serializeForUpdate(),
      spaceShipType: "voidShip.png",
    };
  }
}

module.exports = voidShip;
