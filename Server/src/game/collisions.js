const database = require("../database");

function cursorCollision(players) {
  for (let i = 0; i < players.length; i++) {
    for (let j = 0; j < players.length; j++) {
      if (
        players[i].x < players[j].cursorX + 10 &&
        players[i].x + players[i].width > players[j].cursorX &&
        players[i].y < players[j].cursorY + 10 &&
        players[i].y + players[i].height > players[j].cursorY
      ) {
        if (players[i].getCollisionCooldown() == 0) {
          players[i].setHP(players[i].getHP() - 1);
          players[i].setCollisionCooldown(10);

          if (players[i].getHP() <= 0) {
            if (players[j].email) {
              database.addKill(players[j].email);
            }
          }
        }
      }
    }
  }
}

function powerUpCollision(players, powerUp, sockets) {
  for (let i = 0; i < players.length; i++) {
    if (
      players[i].x < powerUp.x + powerUp.width &&
      players[i].x + players[i].width > powerUp.x &&
      players[i].y < powerUp.y + powerUp.height &&
      players[i].y + players[i].height > powerUp.y
    ) {
      //remove powerup, add buff, return false because powerup is no longer on the board
      if (powerUp.type === "speedBoost.png") {
        players[i].setSpeed(players[i].getSpeed() + 50);
      } else if (powerUp.type === "cursorSpeedUpgrade.png") {
        players[i].setAngleSpeed(players[i].getAngleSpeed() + 0.04);
      } else if (powerUp.type === "healthpack.png") {
        players[i].setHP(players[i].getHP() + 2);
      }

      powerUp.spawnPowerUp();
    }
  }
}

function missileCollision(players, missiles, sockets) {
  for (let i = 0; i < players.length; i++) {
    for (let j = 0; j < missiles.length; j++) {
      if (
        players[i].x < missiles[j].x + missiles[j].width &&
        players[i].x + players[i].width > missiles[j].x &&
        players[i].y < missiles[j].y + missiles[j].height &&
        players[i].y + players[i].height > missiles[j].y &&
        players[i].id != missiles[j].id
      ) {
        //player that shot missile
        let player = players.filter((p) => p.id === missiles[j].id);
        let enemySocket = Object.values(sockets).filter(
          (s) => s.id === player[0].id
        );

        if (players[i].getCollisionCooldown() == 0) {
          //emit take damage to player that got hit
          let playerSocket = Object.values(sockets).filter(
            (s) => s.id === players[i].id
          );
          if (playerSocket) playerSocket[0].emit("/takeDamage");

          players[i].setHP(players[i].getHP() - missiles[j].damage);
          players[i].setCollisionCooldown(5);

          if (players[i].getHP() <= 0) {
            database.addKill(player[0].email);

            //emit socket events to player that shot missile
            if (enemySocket) enemySocket[0].emit("/enemyKill");
          } else {
            if (enemySocket) enemySocket[0].emit("/enemyDamage");
          }
        }
      }
    }
  }
}

module.exports = { cursorCollision, powerUpCollision, missileCollision };
