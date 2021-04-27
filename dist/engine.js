const DB = require('./database.js');

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

function isChatValid() {
  let kataKunci = ['Kuis', 'Ujian', 'Tucil', 'Tubes', 'Praktikum'];
  let countKataKunci = 0;
  let isValid = false;

  kataKunci.forEach((item) => {
    let result = knuthMorrisPratt(testString, item);

    if (result != -1) {
      countKataKunci += 1;
    }
  });

  if (countKataKunci > 1) {
    isValid = false;
  } else if (countKataKunci == 1) {
    isValid = true;
  } else {
    isValid = false;
  }

  return isValid;
}

function getDate(inputString, ptrRegexDate) {
  let result = inputString.matchAll(ptrRegexDate);
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
    let date = new Date(result[0][0]);
    return date;
  }

  return false;
}

function getAllDate(inputString) {
  let ptrDate1 = /[0-9]{2}([\-/ \.])[0-9]{2}[\-/ \.]([0-9]{4}|[0-9]{2}\s)/g; // dd/mm/yyyy
  let ptrDate2 = /[0-9]{4}([\B\-/ \.])[0-9]{2}[\-/ \.][0-9]{2}/g; // yyyy/mm/dd
  let ptrDate3 = /[0-9]{2}\s((J|j)anuari|(F|f)ebruari|(M|m)aret|(A|a)pril|(M|m)ei|(J|j)uni|(J|j)uli|(A|a)gustus|(S|s)eptember|(O|o)tokber|(N|n)ovember|(D|d)esember)\s[0-9]{4}/g; // dd mm yyyy

  let arrPattern = [];
  arrPattern.push(ptrDate1);
  arrPattern.push(ptrDate2);
  arrPattern.push(ptrDate3);

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

    console.log(arrIDMatkul);
    return arrIDMatkul;
    
  }

  return false;
}

let testString = 'Hallo bisa bantu IF2210 tugasku ga 01/09/2021 IF2300 sampai 05/12/24 12 maret 2020 sampai 2020/12/06';

// console.log(getAllDate(testString));
getIDMatkul(testString);

DB.createTable();
