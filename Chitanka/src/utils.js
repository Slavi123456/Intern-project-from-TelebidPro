export {getAvrWordCountInSetence, countNonRepeatingWords, uniqueBetweenArrays}
/////////////////////////////////////
// const text2 = "Здравей! Как си? Днес е хубав ден, нали.";
// getAvrWordCountInSetence("Здравей! Как си? Днес е хубав ден, нали.")

function getAvrWordCountInSetence(text) {
  console.log(text);

  const sentences = text
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s);
  // console.log(sentences);

  const words_in_sentance = sentences.map((sent) => {
    return sent.match(/[А-Яа-я]+/g) ?? [];
  });
  console.log(words_in_sentance);

  let sum = 0;
  words_in_sentance.forEach((arr) => {
    sum += arr.length;
  });
  const avr_count = (sum / words_in_sentance.length).toFixed(2);
  console.log(
    `Avarage word count in a sentence ${avr_count}`);
  console.log("/////////////////////////////");

  return avr_count;
}
/////////////////////////////////////
// const text = `маг маг аа б в в б`;
// console.log(text);

// const unique_words = countNonRepeatingWords(text);
// console.log(unique_words);

// console.log("/////////////////////////////");

function countNonRepeatingWords(text) {
  const words = text.match(/[А-Яа-я]+/g) ?? [];
  const freq = new Map();

  for (const el of words) {
    freq.set(el, (freq.get(el) || 0) + 1);
  }
  console.log(freq);
  //   return [...freq.values()].filter(count => count === 1);

  return Array.from(freq.entries())
    .filter(([key, value]) => value === 1)
    .map(([key]) => key);
}

/////////////////////////////////////
// const wordArr1 = [ 'е', 'хубав', 'ден']; [ 'Здравей', 'Как', 'е', 'си', 'хубав' ]
// const wordArr2 = [ 'Здравей', 'Как', 'е', 'си', 'хубав' ];
// console.log(wordArr1, wordArr2);

// const concatArr = uniqueBetweenArrays(wordArr1, wordArr2);
// console.log(concatArr);

function uniqueBetweenArrays(arr1, arr2) {
  const set2 = new Set(arr2);
  const set1 = new Set(arr1);

  const unique1 = arr1.filter((x) => !set2.has(x));
  const unique2 = arr2.filter((x) => !set1.has(x));

  return [...unique1, ...unique2];
}
