import assert from 'assert';

export {assertThrows, assertWithMessage};

///////////////////////
//Example
// function add (a,b) {
//   // console.log(add.name);
//   return a+b;
// }
// const test_add = assertWithMessage1 ('test_add', () => add(2,3), 5);
// test_add();

function assertWithMessage(test_name, func, expected) {
  return function () {
    const result = func();
    try {
      assert.deepStrictEqual(result, expected);
      console.log(`Test ${test_name} passed!`);
    } catch (err) {
      console.error(`Test ${test_name} failed. Expected ${JSON.stringify(expected)}, got ${JSON.stringify(result)}.`);
      throw new Error (`Test ${test_name} failed.`);
    }
  }
}

///////////////////////
//Example
// function division (a,b) {
//   return a \ b;
// }
// const test_division = assertThrows ('test_division', () => add(2,0));
// test_division();

function assertThrows(test_name, func) {
  return function () {
    try {
      func();
      console.error(`Test ${test_name} failed. Expected an error, but the function returned normally.`);
    } catch (err) {
      console.log(`Test ${test_name} passed! Threw expected error: ${err.message}`);
    }
  }
}
