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

function getAllDate(inputString, ptrRegexDate) {
  let result = inputString.matchAll(ptrRegexDate);
  result = Array.from(result);

  if (result.length > 0) {  
    console.log(result);
    let date = new Date(result[0][0]);
    return date;
  }

  return false;
}

let testString = 'Hallo bisa bantu tugasku ga 01/09/2021 sampai 2023-05-01 sampai 05/12/24';
let testString2 = "test doang ini";

let ptrDate1 = /[0-9]{2}([\-/ \.])[0-9]{2}[\-/ \.][0-9]{4}/g; // dd/mm/yyyy
let ptrDate2 = /[0-9]{4}([\-/ \.])[0-9]{2}[\-/ \.][0-9]{2}/g; // mm/dd/yyyy

let item = getAllDate(testString, ptrDate1);
console.log(item.getFullYear());

// let result = knuthMorrisPratt('abcxabcdabxaabaabaaaabcdabcdabcy', 'ababababca');
// console.log(result);