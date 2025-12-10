import { fix_request } from "../src/middlewares/fix_request.js";
import {describe, it, expect, vi} from "vitest";


describe("fix_request()", () => {
    it("return succesful result", () => () => {
    const req = {
      url: "/api/test?name=Ivan&age=20",
      headers: { host: "localhost:3000" }
    };
    const res = {};
    const next = vi.fn();

    fix_request(req, res, next);

    expect(req.path).toBe("/api/test");
    expect(req.query).toEqual({ name: "Ivan", age: "20" });
    expect(req.rawQuery).toBe("?name=Ivan&age=20");

    expect(next).toHaveBeenCalled();
  })

  it("handles requests with no query", () => {
    const req = {
      url: "/api/users",
      headers: { host: "localhost" }
    };
    const res = {};
    const next = vi.fn();

    fix_request(req, res, next);

    expect(req.path).toBe("/api/users");
    expect(req.query).toEqual({});
    expect(req.rawQuery).toBe("");

    expect(next).toHaveBeenCalled();
  });

   it("works with full URL", () => {
    const req = {
      url: "http://localhost/api/x?x=1",
      headers: { host: "localhost" }
    };
    const res = {};
    const next = vi.fn();

    fix_request(req, res, next);

    expect(req.path).toBe("/api/x");
    expect(req.query).toEqual({ x: "1" });

    expect(next).toHaveBeenCalled();
  });
});