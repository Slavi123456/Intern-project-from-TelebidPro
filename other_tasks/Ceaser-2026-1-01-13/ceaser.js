// const words = ["pa", "pc", "mpac", "mama", "maca"];
const words = [
"mpor",
"porqts",
"ots",
"rqtsv",
"qns",
"tbadcf",
"svuxwz",
"vunwz",
"uxmnyba",
"xwzyb",
"wayba",
"zybad",
"yba",
"badcf",
"adcfe",
"dcf",
"cfehgj",
"fehg",
"ehgnmpo",
"hgjxwz",
"gci",
"jzyb",
"ilkn",
"lanm",
"ktsvu",
];
// console.log(words[0][0]);

let counter = 0;
const letters = {};
const encrypt = {};

for (let i = 0; i < 26; i++) {
  const ch = String.fromCharCode(97 + i); // 97 = 'a'
  letters[ch] = [];
  encrypt[ch] = "";
}

// console.log(letters);
ceaser();

function ceaser() {
  const lenWords = words.length;
  for (let i = 0; i < lenWords - 1; ++i) {
    const w1 = words[i];
    const w2 = words[i + 1];

    for (let y = 0; y < Math.min(w1.length, w2.length); ++y) {
      if (w1[y] !== w2[y]) {
        letters[w1[y]].push(w2[y]);
        break;
      }
    }
  }
  console.log(haveCycle(letters));
  if (haveCycle(letters)) {
    console.log("NO");
    return;
  }

  encrypt[words[0][0]] = String.fromCharCode(97 + counter);
  counter++;
  assignLetters(words[0][0], letters, encrypt, new Set());
  Object.entries(encrypt).forEach(([key, value]) => {
    if (value === "") {
      encrypt[key] = String.fromCharCode(97 + counter);
      counter++;
    }
    // console.log(key, value);
  });
  // console.log(letters);
  console.log("YES");
  console.log(encrypt);
}

function assignLetters(startLetter, letters, encrypt, visited) {
  if (visited.has(startLetter)) return;

  visited.add(startLetter);

  for (const next of letters[startLetter]) {
    if (encrypt[next] == "") {
      encrypt[next] = String.fromCharCode(97 + counter);
      counter++;
    } else {
      return;
    }
  }

  for (const next of letters[startLetter]) {
    assignLetters(next, letters, encrypt, visited);
  }
}

function haveCycle(letters) {
  const visited = new Set();
  const recStack = new Set();

  function dfs(node) {
    if (recStack.has(node)) return true;
    if (visited.has(node)) return false;

    visited.add(node);
    recStack.add(node);

    for (const neighbor of letters[node]) {
      if (dfs(neighbor)) return true;
    }

    recStack.delete(node);
    return false;
  }

  for (const node in letters) {
    if (dfs(node)) return true;
  }
  return false;
}

// const dataStructure = [];
// let counter = 0;
// let code = {};
// // dataStructure.set('a', new Set());
// // const mySet = new Set();

// // mySet.add("a");
// // mySet.add("b");
// // mySet.add("c");
// // mySet.add("a"); // duplicate, ignored

// // console.log([...mySet]);
// console.log("abc"[-1]);

// ceaser();
// function ceaser() {
//     words.forEach(el => { console.log(el[0])});

// }

// function addNtLetter(n) {
//     const set = new Set();
//     let isRight = true;
//     words.forEach(el => {
//         if (!el[n]) return;

//         if(set.has(el[n])) {
//             isRight = false;
//             return;
//         }
//         set.add(el[n]);
//         if(code) {}
//     });
//     if(!isRight) return false;
// }
