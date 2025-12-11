square(19500);

function square(A) {
  let x1 = 0;
  const y1 = 0;

  const x2 = A;
  let y2 = 1;
  const sizeSquare = A + 1;

  let maxLen = 0;
  let countWholeLen = 0;

  for (let i = 0; i < sizeSquare; ++i) {
    let B = sizeSquare - i;
    for (let y = 1; y < B; ++y) {
      x1 = i;
      y2 = y;
      let len = Math.sqrt(((x2 - x1) * (x2 - x1)) + ((y2 - y1) * (y2 - y1)));
      // console.log(x1, y1, " - ", x2, y2, "with len ", len);
      if (Number.isInteger(len)) {
        countWholeLen++;
        maxLen = Math.max(len, maxLen);
      }
    }
    // console.log(" ");
  }
  console.log(maxLen, countWholeLen);
}
