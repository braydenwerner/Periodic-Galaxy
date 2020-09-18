const GameObject = require("./gameObject.js");

class Missile extends GameObject {
  constructor(id, x, y, direction, width, height, speed, damage, type) {
    super(id, x, y, width, height);
    this.direction = direction;
    this.speed = speed;
    this.damage = damage;
    this.type = type;
  }

  update(dt) {
    this.x += dt * this.speed * Math.sin(this.direction);
    this.y -= dt * this.speed * Math.cos(this.direction);
  }

  serializeForUpdate() {
    return {
      ...super.serializeForUpdate(),
      direction: this.direction,
      type: this.type,
    };
  }
}

module.exports = Missile;
