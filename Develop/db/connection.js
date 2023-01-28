const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  // Your username
  user: "root",
  // Your password
  password: "meepmoop",
  // Employee Tracker database
  database: "employee_trk_db"
});

connection.connect(function (err) {
  if (err) throw err;
});

module.exports = connection;
