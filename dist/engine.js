let mysql = require('mysql');
const DB = require('./database.js');

// DB.createDatabase();
// DB.createTable();

function buildPatternTable(pattern) {
  const patternTable = [0];
  let prefixIndex = 0;
  let suffixIndex = 1;

  while (suffixIndex < pattern.length) {
    if (pattern[prefixIndex] === pattern[suffixIndex]) {
      patternTable[suffixIndex] = prefixIndex + 1;
      suffixIndex += 1;
      prefixIndex += 1;
    } else if (prefixIndex === 0) {
      patternTable[suffixIndex] = 0;
      suffixIndex += 1;
    } else {
      prefixIndex = patternTable[prefixIndex - 1];
    }
  }

  return patternTable;
}

function knuthMorrisPratt(text, word) {
  if (word.length === 0) {
    return 0;
  }

  let textIndex = 0;
  let wordIndex = 0;

  const patternTable = buildPatternTable(word);

  while (textIndex < text.length) {
    if (text[textIndex] === word[wordIndex]) {
      if (wordIndex === word.length - 1) {
        return (textIndex - word.length) + 1;
      }
      wordIndex += 1;
      textIndex += 1;
    } else if (wordIndex > 0) {
      wordIndex = patternTable[wordIndex - 1];
    } else {
      wordIndex = 0;
      textIndex += 1;
    }
  }

  return -1;
}

function getDate(inputString, ptrRegexDate) {
  let result = inputString.matchAll(ptrRegexDate);
  let ptrDate = /([0-9]{2}|[0-9]{1})\s((J|j)anuari|(F|f)ebruari|(M|m)aret|(A|a)pril|(M|m)ei|(J|j)uni|(J|j)uli|(A|a)gustus|(S|s)eptember|(O|o)tokber|(N|n)ovember|(D|d)esember)\s[0-9]{4}/g; // dd mm yyyy

  result = Array.from(result);

  if (result.length > 0) {
    if (result.length > 1) {
      let arr = result;
      let arrDate = [];
      arr.forEach((item) => {
        arrDate.push(new Date(item[0]));
      });
      return arrDate;
    } 

    return new Date(result[0][0]);    
  }

  return false;
}

function getAllDate(inputString) {
  let ptrDate = /([0-9]{2}|[0-9]{1})\s((J|j)anuari|(F|f)ebruari|(M|m)aret|(A|a)pril|(M|m)ei|(J|j)uni|(J|j)uli|(A|a)gustus|(S|s)eptember|(O|o)ktober|(N|n)ovember|(D|d)ecember)\s[0-9]{4}/g; // dd mm yyyy

  let arrPattern = [];
  arrPattern.push(ptrDate);

  let result = [];

  arrPattern.forEach((item) => {
    result.push(getDate(inputString, item));
  });

  return result;
}

function getIDMatkul(inputString) {
  let matkulPtr = /IF\d{4}/g;
  let result = inputString.matchAll(matkulPtr);
  result = Array.from(result);

  if (result.length > 0) {
    let arr = result;
    let arrIDMatkul = [];
    arr.forEach((item) => {
      arrIDMatkul.push(item[0]);
    });

    return [arrIDMatkul, result[0].index];
  }

  return false;
}

function getDescription(inputString, indexMatkul) {
  let indexPada = knuthMorrisPratt(inputString, "pada");
  let description;

  if (indexPada != -1) {
    description = inputString.slice(indexMatkul+7, indexPada);
  } else {
    description = false;
  }

  return description;
}

function getIDTask(inputString) {
  let matkulPtr = /ID_\d{4}IF\d{4}/g;
  let result = inputString.matchAll(matkulPtr);
  result = Array.from(result);
  return result;
}

function EngineTask1(inputString) {
  let kataKunci = ['Kuis', 'Ujian', 'Tucil', 'Tubes', 'Praktikum'];
  let arrIDMatkul = getIDMatkul(inputString);
  let arrDate = getAllDate(inputString);
  let tugas = false;
  let singleDate;
  let id_tugas;
  let status = "F";

  kataKunci.forEach((item) => {
    if (knuthMorrisPratt(inputString, item) != -1) {
      tugas = item;
    }
  });

  if (arrDate.length == 1) {
    singleDate = new Date(arrDate[0]);
  } else {
    singleDate = false;
  }

  if (singleDate.getMonth()+1 < 10){
    if (singleDate.getDate() < 10){
      id_tugas = "ID_0"+(singleDate.getMonth()+1) + "0"+ singleDate.getDate()+ arrIDMatkul[0];
    }else{
      id_tugas = "ID_0"+(singleDate.getMonth()+1) + singleDate.getDate()+ arrIDMatkul[0];
    }
  }else{
    if (singleDate.getDate() < 10){
      id_tugas = "ID_"+(singleDate.getMonth()+1) + "0"+ singleDate.getDate()+ arrIDMatkul[0];
    }else{
      id_tugas = "ID_"+(singleDate.getMonth()+1) + singleDate.getDate()+ arrIDMatkul[0];
    }
  }
  
  if (tugas && arrIDMatkul && singleDate) {
    console.log("[TASK BERHASIL DICATAT]");
    console.log(`(ID: 1) - ${singleDate.toLocaleDateString()} - ${arrIDMatkul[0]} - ${tugas} - ${getDescription(inputString, arrIDMatkul[1])}`);
    
    let date = `${singleDate.getDate()}/${singleDate.getMonth()+1}/${singleDate.getFullYear()}`;
    
    DB.insertToDB(id_tugas, date, arrIDMatkul[0], tugas, getDescription(inputString, arrIDMatkul[1]).trim(), status);
  } else {
    console.log("Non Valid");
  }
}

function formatDate(date) {
  let nDate = new Date(date);
  return `${nDate.getDate()}/${nDate.getMonth()+1}/${nDate.getFullYear()}`;
}

function EngineTask4(inputString) {
  let arrDate = getAllDate(inputString);
  let description = 'String Matching';
  let id_task = getIDTask(inputString);
  let date = formatDate(arrDate[0]);

  DB.con.connect((err) => {  
    if (err) throw err;
    let sql = `SELECT * FROM jadwal WHERE id_tugas='${id_task[0][0]}'`;

    DB.con.query(sql, (err, res) => {
      if (!err) {
        console.log(res.length);

        if (res.length != 0) {
            let sql = `UPDATE jadwal SET tanggal = '${date}' WHERE id_tugas = '${id_task[0][0]}'`;
            DB.con.query(sql, function (err, result) {
              if (err) throw err;
              console.log(result.affectedRows + " record(s) updated");
            });
          
        } else {
          console.log("Task tidak ditemukan");
        }
      }
    });
  });
}

let testString = 'Hallo bot tolong ingatkan Kuis IF2210 String Matching pada 2 December 2021';
let testString2 = 'Deadline task ID_1202IF2210 diundur menjadi 05 Maret 2015';

// getAllDate(testString2);
// EngineTask1(testString);
//EngineTask4(testString2);

var newDate = new Date("12 Januari 2025");
//console.log(newDate);
//console.log(newDate.toLocaleString());
//console.log(newDate.getFullYear());
//console.log(newDate.getMonth()+1);
//console.log(newDate.getDate());

function EngineTask5(text){
  let kataKunci = ['selesai', 'sudah', 'tuntas', 'telah', 'beres','kelar','rampung','mari'];
  let id_tugas = getIDTask(text);
  var i;
  var asuLagi = false;
  
  if (id_tugas.length != 1){
    console.log("Masukan invalid, silahkan masukkan 1 id_tugas saja");
  }else{
    for (i = 0; i < kataKunci.length; i++){
      let asu = knuthMorrisPratt(text,kataKunci[i]);
      if (asu != -1){
        asuLagi =true;
        break;
      }
    }
    
    var result = true;
  
    DB.con.connect((err) => {  
      if (err) throw err;
      let sql = `SELECT * FROM jadwal WHERE id_tugas='${id_tugas[0][0]}'`;
  
      DB.con.query(sql, (err, res) => {
        if (!err) {
          console.log(res.length);
  
          if (res.length != 0) {
              let sql = `UPDATE jadwal SET status = 'T' WHERE id_tugas = '${id_tugas[0][0]}'`;
              DB.con.query(sql, function (err, result) {
                if (err) throw err;
                console.log(result.affectedRows + " record(s) updated");
              });
            
          } else {
            console.log("Task tidak ditemukan");
          }
        }
      });
    });
  }

}

EngineTask5("asu ancok ancok selesai ID_0712IF2210 ID_1212IF2210");

function help(){
  console.log('Fitur VCS Bot :\n- 1. Menambahkan task baru\n- 2. Melihat daftar task yang harus dikerjakan\n- 3. Menampilkan deadline dari suatu task tertentu\n- 4. Memperbaharui task tertentu\n- 5. Menandai bahwa suatu task sudah selesai dikerjakan\n\nDaftar kata penting yang harus anda muat salah satu didalam chat anda ialah : Kuis, Ujian, Tucil, Tubes, Praktikum\n\n- Periode date 1 sampai date 2, usage : Apa saja deadline antara date1 sampai date2 ?\n- N Minggu kedepan, usage : Deadline N minggu kedepan apa saja ?\n- N Hari kedepan, usage : Deadline N hari kedepan apa saja ?\n- Hari ini, usage : Apa saja deadline hari ini ?\n- Menampilkan deadline tertentu : Deadline tugas tugas123 itu kapan ?\n- Ingin menyesuaikan deadline task, usage : Deadline tugas tugas123 diundur/dimajukan menjadi date123\n- Menyelesaikan tugas, usage : Saya sudah selesai mengerjakan task task123 ( ID Task tersebut )')
}

//help();


// function handleDate(date,asu,num){
//   if (asu == "minggu")
//   console.log(date.getFullYear());
//   console.log(date.getMonth()+1);
//   console.log(date.getDate());
// }

// handleDate(newDate);
































// // function getDate(inputString, ptrRegexDate) {
// //   let result = inputString.matchAll(ptrRegexDate);
// //   let ptrDate = /([0-9]{2}|[0-9]{1})\s((J|j)anuari|(F|f)ebruari|(M|m)aret|(A|a)pril|(M|m)ei|(J|j)uni|(J|j)uli|(A|a)gustus|(S|s)eptember|(O|o)tokber|(N|n)ovember|(D|d)esember)\s[0-9]{4}/g; // dd mm yyyy

// //   result = Array.from(result);

// //   if (result.length > 0) {
// //     if (result.length > 1) {
// //       let arr = result;
// //       let arrDate = [];
// //       arr.forEach((item) => {
// //         arrDate.push(new Date(item[0]));
// //       });
// //       return arrDate;
// //     } 

// //     return result[0][0];    
// //   }

// //   return false;
// // }

// // function getAllDate(inputString) {
// //   let ptrDate1 = /[0-9]{2}([\-/ \.])[0-9]{2}[\-/ \.]([0-9]{4}|[0-9]{2}\s)/g; // dd/mm/yyyy
// //   let ptrDate2 = /[0-9]{4}([\B\-/ \.])[0-9]{2}[\-/ \.][0-9]{2}/g; // yyyy/mm/dd
// //   let ptrDate3 = /([0-9]{2}|[0-9]{1})\s((J|j)anuari|(F|f)ebruari|(M|m)aret|(A|a)pril|(M|m)ei|(J|j)uni|(J|j)uli|(A|a)gustus|(S|s)eptember|(O|o)tokber|(N|n)ovember|(D|d)ecember)\s[0-9]{4}/g; // dd mm yyyy

// //   let arrPattern = [];
// //   arrPattern.push(ptrDate1);
// //   arrPattern.push(ptrDate2);
// //   arrPattern.push(ptrDate3);

// //   let result = [];

// //   arrPattern.forEach((item) => {
// //     result.push(getDate(inputString, item));
// //   });

// //   console.log(result);

// //   return result;
// // }