import { parse_names_from_village_text } from "../src/utils/villageParser.js";
import { assertThrows, assertWithMessage } from "./test_utils.js";

// export {test_parsing_village_test}

import { describe, it, expect } from "vitest";

describe("parse_names_from_village_text()", () => {
  it("check for success", () => {
    expect(
      parse_names_from_village_text("(VAR06) общ. Варна, обл. Варна")
    ).toStrictEqual({
      code: "VAR06",
      settlement: "null",
      township: "Варна",
      district: "Варна",
    });
  });
  it("check for success with settlement", () => {
    expect(
      parse_names_from_village_text("(21141) с. Димчево, общ. Бургас, обл. Бургас")
    ).toStrictEqual({
        code: '21141',
        settlement: 'Димчево',
        township: 'Бургас',
        district: 'Бургас',
    });
  });
  it("check for success with settlement", () => {
    expect(
      parse_names_from_village_text("(27632) гр. Етрополе, общ. Етрополе, обл. София")
    ).toStrictEqual({
      code: '27632',
      settlement: 'Етрополе',
      township: 'Етрополе',
      district: 'София',
    });
  });

    // it("check for throw", () => {
  //   expect(
  //     parse_names_from_village_text("(жа) общ. Варна, обл. Варна")
  //   ).toThrow(SyntaxError);
  // });
  //  it("check for throw", () => {
  //   expect(
  //     parse_names_from_village_text("(12345678) общ. Варна, обл. Варна")
  //   ).toThrow(SyntaxError);
  // });
});

// function test_parsing_village_test() {

//     const test_village_parse_1 = assertWithMessage ('test_village_parse_1',
//       () => parse_names_from_village_text("(VAR06) общ. Варна, обл. Варна"),
//       {
//         code: 'VAR06',
//         settlement: 'null',
//         township: 'Варна',
//         district: 'Варна',
//       });
//     test_village_parse_1();

//     const test_village_parse_2 = assertWithMessage ('test_village_parse_2',
//       () => parse_names_from_village_text("(21141) с. Димчево, общ. Бургас, обл. Бургас"),
//       {
//         code: '21141',
//         settlement: 'Димчево',
//         township: 'Бургас',
//         district: 'Бургас',
//     });
//     test_village_parse_2();
//     const test_village_parse_3 = assertWithMessage ('test_village_parse_3',
//       () => parse_names_from_village_text("(27632) гр. Етрополе, общ. Етрополе, обл. София"),
//       {
//       code: '27632',
//       settlement: 'Етрополе',
//       township: 'Етрополе',
//       district: 'София',
//     });
//     test_village_parse_3();

//     //////////////////////////////////////////////////
//     // console.log(parse_names_from_village_text("(жа) общ. Варна, обл. Варна"));
//     //These should fail
//     const test_village_parse_4 = assertThrows ('test_village_parse_4',
//       () => parse_names_from_village_text("(жа) общ. Варна, обл. Варна"),
//     );
//     test_village_parse_4();

//     const test_village_parse_5 = assertThrows ('test_village_parse_5',
//       () => parse_names_from_village_text("(12345678) общ. Варна, обл. Варна"),
//     );
//     test_village_parse_5();

//     const test_village_parse_6 = assertThrows ('test_village_parse_6',
//       () => parse_names_from_village_text("(123) общ. Варна, обл. Варна"),
//     );
//     test_village_parse_6();

//     const test_village_parse_7 = assertThrows ('test_village_parse_7',
//       () => parse_names_from_village_text("(12_45) общ. Варна, обл. Варна"),
//     );
//     test_village_parse_7();

//     const test_village_parse_8 = assertThrows ('test_village_parse_8',
//       () => parse_names_from_village_text("(12345) общ. , обл. Варна"),
//     );
//     test_village_parse_8();

//     const test_village_parse_9 = assertThrows ('test_village_parse_9',
//       () => parse_names_from_village_text("(12345) общ. Варна, обл. "),
//     );
//     test_village_parse_9();

//     const test_village_parse_10 = assertThrows ('test_village_parse_10',
//       () => parse_names_from_village_text(""),
//     );
//     test_village_parse_10();
// }
////////////////////////////////////////////////////

// import test from 'node::test';

// // const test = require('node:test');

// test('synchronous passing test', (t) => {
//   assert.strictEqual(1, 1);
// });

// try {
//   assert.strictEqual(1,2);

//   console.log('All tests passed!');
// }
// catch (err) {
//   console.error('Test failed:');
// }
// finally {

// }

// function assertWithMessage(name, func, expected, err_message) {
//   return function (...args) {
//     const result = func(...args);
//     try {
//       assert.strictEqual(result, expected);
//       console.log(`Test ${name} passed!`);
//     } catch (err) {
//       console.error(`Test ${name} failed. Expected ${expected}, got ${result}. ${err_message}`);
//     }
//   }
// }

// const test_village_parse = assertWithMessage ('test_village_parse', add, 5, '...');
// test_village_parse(2,3);
