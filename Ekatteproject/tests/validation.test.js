import { describe, it, expect } from "vitest";
import { validateMany } from "../src/utils/validation";
import dotenv from "dotenv";

dotenv.config();

describe("test validate and validateMany", () => {
  it("check for string", () => {
    const str = "a";
    expect(() =>
      validateMany({ str: process.env.VALIDATION_TYPE_STRING }, str)
    );
  });
  it("throw for non-string", () => {
    const str = 1;
    expect(() =>
      validateMany({ str: process.env.VALIDATION_TYPE_STRING }, str)
    ).toThrow(TypeError);
  });

  /////////////////////////
  it("check for nonempty-string", () => {
    const str = "abc";
    expect(() =>
      validateMany({ str: process.env.VALIDATION_TYPE_NONEMPTY_STRING }, str)
    );
  });
  it("throw for nonempty-string", () => {
    const str = "    ";
    expect(() =>
      validateMany({ str: process.env.VALIDATION_TYPE_NONEMPTY_STRING }, str)
    ).toThrow(TypeError);
  });

  /////////////////////////
  it("check for function", () => {
    const func = () => 5;
    expect(() =>
      validateMany({ func: process.env.VALIDATION_TYPE_FUNCTION }, func)
    );
  });
  it("throw for function", () => {
    const func = 5;
    expect(() =>
      validateMany({ func: process.env.VALIDATION_TYPE_FUNCTION }, func)
    ).toThrow(TypeError);
  });

  /////////////////////////
  it("check for empty array", () => {
    const n = [];
    expect(() =>
      validateMany({ func: process.env.VALIDATION_TYPE_ARRAY }, n)
    );
  });
  it("check for array", () => {
    const n = [1,2,3];
    expect(() =>
      validateMany({ func: process.env.VALIDATION_TYPE_ARRAY }, n)
    );
  });
  it("throw for array", () => {
    const n = 5;
    expect(() =>
      validateMany({ func: process.env.VALIDATION_TYPE_ARRAY }, n)
    ).toThrow(TypeError);
  });

   /////////////////////////
  it("check for object", () => {
    const obj = {};
    expect(() =>
      validateMany({ obj: process.env.VALIDATION_TYPE_OBJECT }, obj)
    );
  });
  it("throw for object", () => {
    const obj = 5;
    expect(() =>
      validateMany({ obj: process.env.VALIDATION_TYPE_OBJECT }, obj)
    ).toThrow(TypeError);
  });

  it("throw for null argument", () => {
    const obj = null;
    expect(() =>
      validateMany({ obj: process.env.VALIDATION_TYPE_OBJECT }, obj)
    ).toThrow(TypeError);
  });

  it("throw for invalid type", () => {
    const str = "abc";
    expect(() =>
      validateMany({ str: process.env.abs }, str)
    ).toThrow(Error);
  });
});
