const Player = require("./player.js");
const Missile = require("./missile");

class Spaceship3 extends Player {
  constructor(id, x, y, userData, socket) {
    super(
      id,
      x,
      y,
      30,
      37.5,
      0,
      10,
      550,
      0.2,
      0.4,
      6,
      6,
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
      this.socket.emit("/playerShoot", "spaceship3");

      let missile = new Missile(
        this.id,
        this.x + this.width / 2 - 15,
        this.y + this.height / 2 - 20,
        this.direction,
        6,
        6,
        1300,
        3,
        "alienMissile.png"
      );

      this.missiles.push(missile);

      this.shootCooldown = 30;
    }

    //update timers
    if (this.collisionCooldown > 0) this.collisionCooldown--;
    if (this.shootCooldown > 0) this.shootCooldown--;
  }

  serializeForUpdate() {
    return {
      ...super.serializeForUpdate(),
      spaceShipType: "spaceship3.png",
    };
  }
}

module.exports = Spaceship3;
