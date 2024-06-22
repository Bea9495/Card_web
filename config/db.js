const mysql = require('mysql2');
require('dotenv').config();


const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

connection.connect(function(err){
  if(err){
    console.log('error connecting: ' + err.stack);
  }
  console.log('conectado a la db');
});

module.exports = connection;