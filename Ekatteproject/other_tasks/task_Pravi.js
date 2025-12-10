// Правата AY е с дължина n метра. Като започнал от началото на правата A,
// Георги отбелязал върху правата на всеки a метра по една точка. Като започнала
// от края на правата Y, Гергана отбелязала върху отсечката на всеки b метра по една
// точка. След това двамата намерили всички такива двойки от отбелязаните точки,
// за които разстоянието между точките в двойката е равно на c метра и свързали за
// всяка такава двойка точките й с червена отсечка. Напишете програма segments,
// която извежда дължината в метри на неоцветената в червено част от правата AY.

// Вход
// целите положителни числа n, a, b и c
// Изход
// сантиметри на неоцветената в червено част от отсечката AY.
// Ограничения:
// n, a, b и c са целите положителни числа < 100 000.
// ПРИМЕР
// Вход
// 10 2 3 1
// Изход
// 6

let ger = 3;
let geor = 2;
let n = 10;
let c = 1;

function pravi() {
  if (ger < 0 || geor < 0 || n < 0 || c < 0) {
    throw new Error("Illegal arguments");
  }
  let begGer = n % ger;
  let begGeor = 0;

  const gerArr = [];
  for (let i = begGer; i <= n; i += ger) gerArr.push(i);
  console.log(gerArr);

  const georArr = [];
  for (let i = begGeor; i <= n; i += geor) georArr.push(i);
  console.log(georArr);

  let gerInd = 0;
  let georInd = 0;

  let sumLen = 0;
  let lines = [];
  while (gerInd < gerArr.length && georInd < georArr.length) {
    console.log(gerArr[gerInd], " ", georArr[georInd]);
    if (Math.abs(gerArr[gerInd] - georArr[georInd]) == c) {
      sumLen += c;
      lines.push([gerArr[gerInd],georArr[georInd]]);
    }
    if (gerArr[gerInd] == georArr[georInd]) {
      gerInd++;
      //   georInd++;
    } else if (gerArr[gerInd] < georArr[georInd]) {
      gerInd++;
    } else {
      georInd++;
    }
  }

  console.log(n - sumLen);
  console.log(lines);
}

pravi();
