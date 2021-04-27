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
    var sql = "CREATE TABLE jadwal (id INT AUTO_INCREMENT PRIMARY KEY, id_tugas VARCHAR(255), tanggal VARCHAR(255), kode VARCHAR(255), nama_tugas VARCHAR(255), deskripsi VARCHAR(255), status VARCHAR(1))";
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Table created");
    });
  });
}

const insertToDB = (id_tugas,tgl, kode, nama, deskripsi,status) => {
  con.connect((err) => {
    if (err) throw err;

    let sql = `INSERT INTO jadwal (id_tugas, tanggal, kode, nama_tugas, deskripsi, status) VALUES ('${id_tugas}','${tgl}', '${kode}', '${nama}', '${deskripsi}','${status}')`;
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("1 record inserted");
    });
  });
}

module.exports = {
  createDatabase: createDatabase,
  createTable: createTable,
  insertToDB: insertToDB,
  con: con
}