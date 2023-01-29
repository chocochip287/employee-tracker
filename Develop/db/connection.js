const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  // Local username
  user: "root",
  // Local password
  password: "meepmoop",
  // Employee Tracker database
  database: "employee_trk_db"
});

connection.connect(function (err) {
  if (err) throw err;
});

module.exports = connection;
