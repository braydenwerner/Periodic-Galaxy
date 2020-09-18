const mysql = require("mysql");

const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

function getUser(id, callback) {
  pool.query(`SELECT * FROM users WHERE id = "${id}"`, (err, results) => {
    if (err) callback("Error");
    if (results.length != 0) callback(results);
  });
}

function addUser(id, name, email, kills) {
  pool.query(
    `INSERT INTO users(id,name,email,kills) VALUES ("${id}","${name}","${email}",${kills})`
  );
}

function addKill(email) {
  pool.query(`UPDATE users SET kills = kills + 1 WHERE email = "${email}"`);
}

module.exports = { getUser, addUser, addKill };
