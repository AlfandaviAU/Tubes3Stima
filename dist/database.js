let mysql = require('mysql');

const createDatabase = () => {
  let con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root"
  });
  
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    con.query("CREATE DATABASE stima", function (err, result) {
      if (err) throw err;
      console.log("Database created");
    });
  });
}

const createTable = () => {
  let con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "stima"
  });
  
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    var sql = "CREATE TABLE jadwal (id INT AUTO_INCREMENT PRIMARY KEY, tanggal DATE, kode VARCHAR(255), nama_tugas VARCHAR(255), deskripsi VARCHAR(255))";
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Table created");
    });
  });
}


module.exports = {
  createDatabase: createDatabase,
  createTable: createTable
}