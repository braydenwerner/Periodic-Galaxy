const Constants = require("../serverConstants.js");
const GameObject = require("./gameObject.js");

class Player extends GameObject {
  constructor(
    id,
    x,
    y,
    width,
    height,
    direction,
    acceleration,
    maxSpeed,
    angleSpeed,
    maxAngleSpeed,
    hp,
    maxHP,
    collisionCooldown,
    angle,
    radius,
    cursorX,
    cursorY,
    missiles,
    shootCooldown,
    username,
    profilePicture,
    email,
    canvasWidth,
    canvasHeight,
    shooting,
    socket
  ) {
    super(id, x, y, width, height);
    this.direction = direction;

    //minSpeed when player not holding w
    this.movingForward = false;
    this.DECELERATION = 5;
    this.minSpeed = 100;
    this.acceleration = acceleration;
    this.speed = this.minSpeed;
    this.maxSpeed = maxSpeed;

    this.slowingDown = false;

    this.angleSpeed = angleSpeed;
    this.maxAngleSpeed = maxAngleSpeed;

    this.maxHP = maxHP;
    this.hp = hp;

    this.collisionCooldown = collisionCooldown;

    this.angle = angle;
    this.radius = radius;
    this.cursorX = cursorX;
    this.cursorY = cursorY;

    this.missiles = missiles;
    this.shootCooldown = shootCooldown;

    this.username = username;
    this.profilePicture = profilePicture;
    this.email = email;

    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;

    this.shooting = shooting;

    this.socket = socket;
  }

  update(dt) {
    if (this.slowingDown) this.speed -= this.DECELERATION;

    if (this.movingForward) {
      this.speed += this.acceleration;

      if (this.speed > this.maxSpeed) this.speed = this.maxSpeed;
    } else {
      this.speed -= this.DECELERATION;

      if (this.speed < this.minSpeed) this.speed = this.minSpeed;
    }

    //update player position
    this.x += dt * this.speed * Math.sin(this.direction);
    this.y -= dt * this.speed * Math.cos(this.direction);

    //Updates cursor position based on angle
    this.angle += this.angleSpeed;
    this.cursorX = Math.cos(this.angle) * this.radius + this.x;
    this.cursorY = Math.sin(this.angle) * this.radius + this.y;

    // check bounds
    this.x = Math.max(0, Math.min(Constants.MAP_SIZE - this.width, this.x));
    this.y = Math.max(0, Math.min(Constants.MAP_SIZE - this.width, this.y));

    //update missiles
    for (let i = 0; i < this.missiles.length; i++) {
      let missile = this.missiles[i];
      missile.update(dt);
      let remove = this.checkMissileBounds(
        missile.x,
        missile.y,
        missile.width,
        missile.height
      );

      if (remove) {
        this.missiles.splice(i, 1);
        i--;
      }
    }
  }

  updateDirection(input) {
    this.direction = input;
  }

  shootMissile(input) {
    this.shooting = input;
  }

  moveForward(input) {
    this.movingForward = input;
  }

  slowDown(input) {
    if (input) this.movingForward = false;
    this.slowingDown = input;
  }

  checkMissileBounds(x, y, width, height) {
    if (
      x + width > Constants.MAP_SIZE ||
      x < 0 ||
      y + height > Constants.MAP_SIZE ||
      y < 0
    ) {
      return true;
    }

    return false;
  }

  serializeForUpdate() {
    return {
      ...super.serializeForUpdate(),
      username: this.username,
      direction: this.direction,
      hp: this.hp,
      maxHP: this.maxHP,
      cursorX: this.cursorX,
      cursorY: this.cursorY,
      profilePicture: this.profilePicture,
      email: this.email,
    };
  }

  setCollisionCooldown(cooldown) {
    this.collisionCooldown = cooldown;
  }

  getCollisionCooldown() {
    return this.collisionCooldown;
  }

  setSpeed(speed) {
    this.speed = speed;

    if (this.speed > this.maxSpeed) this.speed = this.maxSpeed;
  }

  getSpeed() {
    return this.speed;
  }

  setAngleSpeed(angleSpeed) {
    this.angleSpeed = angleSpeed;

    if (this.angleSpeed > this.maxAngleSpeed)
      this.angleSpeed = this.maxAngleSpeed;
  }

  getAngleSpeed() {
    return this.angleSpeed;
  }

  setHP(hp) {
    this.hp = hp;

    if (this.hp > this.maxHP) this.hp = this.maxHP;
  }

  getHP() {
    return this.hp;
  }

  getMissiles() {
    return this.missiles;
  }
}

module.exports = Player;
