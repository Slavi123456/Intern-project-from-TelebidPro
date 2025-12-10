// import { test_parsing_village_test } from "./pasing_test.js";

// tests();

// function tests() {
//     test_parsing_village_test();
// }

import { describe, it, expect } from 'vitest';

describe('sum()', () => {
  it('adds numbers', () => {
    expect(sum(1, 2)).toBe(3);
  });
});

function sum(a, b) {
  return a + b;
}
