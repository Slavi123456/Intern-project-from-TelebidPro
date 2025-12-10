import { describe, it, expect, beforeAll } from "vitest";
import { getQueryParam, getQueryParams } from "../src/middlewares/query_params.js";

describe("getQueryParam()", () => {
  beforeAll(() => {
    process.env.HOST = "localhost";
  });

  it("returns the value of a query parameter", () => {
    const result = getQueryParam("/api/test?name=Ivan", "name");
    expect(result).toBe("Ivan");
  });

  it("returns custom message when param is missing", () => {
    const result = getQueryParam("/api/test?name=Ivan", "age");
    expect(result).toBe("this parameter: age is not defined");
  });
});

describe("getQueryParams()", () => {
  beforeAll(() => {
    process.env.HOST = "localhost";
  });

  it("returns all query params as an object", () => {
    const result = getQueryParams("/api/test?name=Ivan&age=20");
    expect(result).toEqual({ name: "Ivan", age: "20" });
  });

  it("returns empty object when no params exist", () => {
    const result = getQueryParams("/api/test");
    expect(result).toEqual({});
  });
});
