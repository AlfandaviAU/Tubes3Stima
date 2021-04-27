let mysql = require('mysql');

let con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "stima"
});

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
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    var sql = "CREATE TABLE jadwal (id INT AUTO_INCREMENT PRIMARY KEY, tanggal VARCHAR(255), kode VARCHAR(255), nama_tugas VARCHAR(255), deskripsi VARCHAR(255))";
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Table created");
    });
  });
}

const insertToDB = (tgl, kode, nama, deskripsi) => {
  con.connect((err) => {
    if (err) throw err;

    let sql = `INSERT INTO jadwal (tanggal, kode, nama_tugas, deskripsi) VALUES ('${tgl}', '${kode}', '${nama}', '${deskripsi}')`;
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("1 record inserted");
    });
  });
}


module.exports = {
  createDatabase: createDatabase,
  createTable: createTable,
  insertToDB: insertToDB
}