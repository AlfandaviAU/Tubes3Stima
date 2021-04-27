let mysql = require('mysql');
const DB = require('./database.js');

//DB.createDatabase();
//DB.createTable();

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

function EngineTask1(inputString) {
  let kataKunci = ['Kuis', 'Ujian', 'Tucil', 'Tubes', 'Praktikum'];
  let arrIDMatkul = getIDMatkul(inputString);
  let arrDate = getAllDate(inputString);
  let tugas = false;
  let singleDate;

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

  if (tugas && arrIDMatkul && singleDate) {
    console.log("[TASK BERHASIL DICATAT]");
    console.log(`(ID: 1) - ${singleDate.toLocaleDateString()} - ${arrIDMatkul[0]} - ${tugas} - ${getDescription(inputString, arrIDMatkul[1])}`);
    
    let date = `${singleDate.getDate()}/${singleDate.getMonth()+1}/${singleDate.getFullYear()}`;
    
    DB.insertToDB(date, arrIDMatkul[0], tugas, getDescription(inputString, arrIDMatkul[1]).trim());
  } else {
    console.log("Non Valid");
  }
}

function EngineTask2(inputString) {
  let date = getAllDate(inputString);
  let description = 'String Matchings';

  DB.con.connect((err) => {  
    if (err) throw err;
    let sql = `SELECT * FROM jadwal WHERE deskripsi='${description}'`;

    DB.con.query(sql, (err, res) => {
      if (!err) {
        console.log(res);
        result = true;
      } else {
        console.log("Task tidak ditemukan");
      }
    });
  });
}

function isDataExist (deskripsi) {
  let result = false;

  DB.con.connect((err) => {  
    if (err) throw err;
    let sql = `SELECT * FROM jadwal WHERE deskripsi='${deskripsi}'`;

    DB.con.query(sql, (err, res) => {
      if (!err) {
        console.log(res);
        result = true;
      }
    });
  });

  return result;
}

let testString = 'Hallo bot tolong ingatkan Kuis IF2210 String Matching pada 12 Juli 2021';

// getAllDate(testString2);
// EngineTask1(testString);
//EngineTask2(testString);
//var newDate = new Date("12 Januari 2025");
//console.log(newDate);
//console.log(newDate.toLocaleString());
//console.log(newDate.getFullYear());
//console.log(newDate.getMonth()+1);
//console.log(newDate.getDate());


function help(){
  console.log('Fitur VCS Bot :\n- 1. Menambahkan task baru\n- 2. Melihat daftar task yang harus dikerjakan\n- 3. Menampilkan deadline dari suatu task tertentu\n- 4. Memperbaharui task tertentu\n- 5. Menandai bahwa suatu task sudah selesai dikerjakan\n\nDaftar kata penting yang harus anda muat salah satu didalam chat anda ialah : Kuis, Ujian, Tucil, Tubes, Praktikum\n\n- Periode date 1 sampai date 2, usage : Apa saja deadline antara date1 sampai date2 ?\n- N Minggu kedepan, usage : Deadline N minggu kedepan apa saja ?\n- N Hari kedepan, usage : Deadline N hari kedepan apa saja ?\n- Hari ini, usage : Apa saja deadline hari ini ?\n- Menampilkan deadline tertentu : Deadline tugas tugas123 itu kapan ?\n- Ingin menyesuaikan deadline task, usage : Deadline tugas tugas123 diundur/dimajukan menjadi date123\n- Menyelesaikan tugas, usage : Saya sudah selesai mengerjakan task task123 ( ID Task tersebut )')
}

help();


// function handleDate(date,asu,num){
//   if (asu == "minggu")
//   console.log(date.getFullYear());
//   console.log(date.getMonth()+1);
//   console.log(date.getDate());
// }

// handleDate(newDate);
































// function getDate(inputString, ptrRegexDate) {
//   let result = inputString.matchAll(ptrRegexDate);
//   let ptrDate = /([0-9]{2}|[0-9]{1})\s((J|j)anuari|(F|f)ebruari|(M|m)aret|(A|a)pril|(M|m)ei|(J|j)uni|(J|j)uli|(A|a)gustus|(S|s)eptember|(O|o)tokber|(N|n)ovember|(D|d)esember)\s[0-9]{4}/g; // dd mm yyyy

//   result = Array.from(result);

//   if (result.length > 0) {
//     if (result.length > 1) {
//       let arr = result;
//       let arrDate = [];
//       arr.forEach((item) => {
//         arrDate.push(new Date(item[0]));
//       });
//       return arrDate;
//     } 

//     return result[0][0];    
//   }

//   return false;
// }

// function getAllDate(inputString) {
//   let ptrDate1 = /[0-9]{2}([\-/ \.])[0-9]{2}[\-/ \.]([0-9]{4}|[0-9]{2}\s)/g; // dd/mm/yyyy
//   let ptrDate2 = /[0-9]{4}([\B\-/ \.])[0-9]{2}[\-/ \.][0-9]{2}/g; // yyyy/mm/dd
//   let ptrDate3 = /([0-9]{2}|[0-9]{1})\s((J|j)anuari|(F|f)ebruari|(M|m)aret|(A|a)pril|(M|m)ei|(J|j)uni|(J|j)uli|(A|a)gustus|(S|s)eptember|(O|o)tokber|(N|n)ovember|(D|d)ecember)\s[0-9]{4}/g; // dd mm yyyy

//   let arrPattern = [];
//   arrPattern.push(ptrDate1);
//   arrPattern.push(ptrDate2);
//   arrPattern.push(ptrDate3);

//   let result = [];

//   arrPattern.forEach((item) => {
//     result.push(getDate(inputString, item));
//   });

//   console.log(result);

//   return result;
// }