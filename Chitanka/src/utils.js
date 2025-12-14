/////////////////////////////////////
const text2 = "Здравей! Как си? Днес е хубав ден, нали.";
console.log(text2);

const sentences = text2.split(/[.!?]+/).map(s => s.trim()).filter(s => s);
// console.log(sentences);

const words_in_sentance = sentences.map(sent => { return sent.match(/[А-Яа-я]+/g) ?? []; } );
console.log(words_in_sentance);

let sum = 0;
const avg_words_in_sentance = words_in_sentance.map(arr => { sum += arr.length; });
console.log( "Avarage word count in a sentence", (sum / words_in_sentance.length).toFixed(2));
console.log("/////////////////////////////");
/////////////////////////////////////
const text = `маг маг аа б в в б`;
console.log(text);

const words = text.match(/[А-Яа-я]+/g) ?? [];
// console.log(words);

// const unique_words = new Set(words);
function countNonRepeating(arr) {
  const freq = new Map();

  for (const el of arr) {
    freq.set(el, (freq.get(el) || 0) + 1);
  }
  console.log(freq);
//   return [...freq.values()].filter(count => count === 1);
  
  return Array.from(freq.entries())
    .filter(([key, value]) => value === 1)
    .map(([key]) => key);
}

const unique_words = countNonRepeating(words);
console.log(unique_words);
console.log(unique_words.length);

console.log("/////////////////////////////");
/////////////////////////////////////
const wordArr1 = [ 'е', 'хубав', 'ден']; [ 'Здравей', 'Как', 'е', 'си', 'хубав' ]
const wordArr2 = [ 'Здравей', 'Как', 'е', 'си', 'хубав' ];
console.log(wordArr1, wordArr2);

const concatArr = uniqueBetweenArrays(wordArr1, wordArr2);

console.log(concatArr);

function uniqueBetweenArrays(arr1, arr2) {
  const set2 = new Set(arr2);
  const set1 = new Set(arr1);

  const unique1 = arr1.filter(x => !set2.has(x));
  const unique2 = arr2.filter(x => !set1.has(x));

  return [...unique1, ...unique2];
}