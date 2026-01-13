import { describe, vi, it, expect, beforeEach } from "vitest";

import { parseJsonBody } from "../../src/middlewares/parse_json";

describe("")
describe("parseJsonBody()", () => {
  let req,res,next;
  beforeEach(() => {
    req = { on: vi.fn(), method: "POST", headers: {} };
    res = { writeHead: vi.fn(), end: vi.fn() };
    next = vi.fn();
  });

  it("calls next if method is not allowed", () => {
    req.method = "GET";

    parseJsonBody(req, res, next);

    expect(next).toHaveBeenCalledOnce();
  });

  it("sets empty body and calls next if content-type is not application/json", () => {
    req.headers["content-type"] = "text/plain";

    parseJsonBody(req, res, next);

    expect(req.body).toEqual({});
    expect(next).toHaveBeenCalledOnce();
  });

    it("parses valid JSON body", () => {
    req.headers["content-type"] = "application/json";

    req.on.mockImplementation((event, callback) => {
      if (event === "data") {
        callback('{"a":1}');
      }
      if (event === "end") {
        callback();
      }
    });

    parseJsonBody(req, res, next);

    expect(req.body).toEqual({ a: 1 });
    expect(next).toHaveBeenCalledOnce();
  });

  it("sets empty body when JSON body is empty", () => {
    req.headers["content-type"] = "application/json";

    req.on.mockImplementation((event, callback) => {
      if (event === "end") {
        callback();
      }
    });

    parseJsonBody(req, res, next);

    expect(req.body).toEqual({});
    expect(next).toHaveBeenCalledOnce();
  });

   it("returns 400 on invalid JSON", () => {
    req.headers["content-type"] = "application/json";

    req.on.mockImplementation((event, callback) => {
      if (event === "data") {
        callback("{invalid json");
      }
      if (event === "end") {
        callback();
      }
    });

    parseJsonBody(req, res, next);

    expect(res.writeHead).toHaveBeenCalledWith(400, {
      "Content-Type": "text/plain",
    });
    expect(res.end).toHaveBeenCalledWith("Invalid JSON");
    expect(next).not.toHaveBeenCalled();
  });
});
