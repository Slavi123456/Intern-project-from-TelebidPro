// "use strict";

const matrix = [
  ["0", "0", "1", "2"],
  ["0", "0", "0", "0"],
  ["3", "0", "0", "0"],
  ["0", "1", "0", "4"],
];

// console.log(matrix[0][1]);
// console.log(matrix[0].length);
// console.log(matrix.length);

// const m = [];
// console.log(m[0]);
// squares(m);

// console.log(Number.isInteger(Math.sqrt(9)));
// console.log(Number.isInteger(Math.sqrt(13)));
squares(matrix, ["1", "2", "3", "4"]);
function squares(matrix, symbols) {
  //validation
  if (!matrix || !matrix[0]) throw new Error("Cannot solve null matrix");
  if (matrix[0].length != matrix.length)
    throw new Error("Matrix is not with equal dimensions");
  const squareN = matrix.length;
  let n = Math.sqrt(squareN);
  //   if (squareN < 2 || squareN > 3)
  //     throw new Error("Matrix's dimension is not in the boundary");
  if (!Number.isInteger(Math.sqrt(squareN)))
    throw new Error("Matrix's dimension is not a square of whole number");

  for (let row = 0; row < squareN; ++row) {
    for (let col = 0; col < squareN; ++col) {
      if (matrix[row][col] === "0") continue;

      for (const c of symbols) {
        if (!canPlace(matrix, n, row, col, c)) {
          matrix[row][col] = c;
          break;
        }
      }
    }
  }
}
// void printMatrix(matrix) {
//     const matrX = matrix.length;
//     const matrY = matrix[0].length;

//     for (let i = 0; i < matrX; ++i) {
//         for (let y = 0; y < matrY; ++y) {
//             console.log(matrix[i][y], "");
//         }
//         console.log("");
//     }
// }

function canPlace(matrix, n, row, col, c) {
  let isReapeated = false;
  for (let i = 0; i < squareN; ++i) {
    if (matrix[row][i] === c) return false;
    if (matrix[i][col] === c) return false;
  }

  let boxIndRow = row / n;
  let boxIndCol = col / n;

  for (let i = boxIndRow; i < boxIndRow + n; ++i) {
    for (let y = boxIndCol; y < boxIndCol + n; ++y) {
      if (matrix[i][y] == c) return false;
    }
  }
  return true;
}
