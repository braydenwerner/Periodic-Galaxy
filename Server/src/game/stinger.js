const Player = require("./player.js");
const Missile = require("./missile");

class Stinger extends Player {
  constructor(id, x, y, userData, socket) {
    super(
      id,
      x,
      y,
      30,
      37.5,
      0,
      15,
      800,
      0.3,
      0.6,
      4,
      4,
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
      this.socket.emit("/playerShoot", "stinger");

      let missile = new Missile(
        this.id,
        this.x + this.width / 2 - 15,
        this.y + this.height / 2 - 18,
        this.direction,
        2,
        9,
        1300,
        0.5,
        "redMissile.png"
      );
      this.missiles.push(missile);

      this.shootCooldown = 5;
    }

    //update timers
    if (this.collisionCooldown > 0) this.collisionCooldown--;
    if (this.shootCooldown > 0) this.shootCooldown--;
  }

  serializeForUpdate() {
    return {
      ...super.serializeForUpdate(),
      spaceShipType: "stinger.png",
    };
  }
}

module.exports = Stinger;
