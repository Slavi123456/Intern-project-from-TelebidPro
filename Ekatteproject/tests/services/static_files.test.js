import { describe, it, expect, vi, beforeEach } from "vitest";
import path from "path";
import fs from "fs/promises";

vi.mock("fs/promises");

global.__projectdir = "/project";
global.mimeTypes = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
};

import { serve_static_files } from "../../src/services/static_files.js";

function createMockResponse() {
  return {
    status: null,
    headers: null,
    body: null,
    writeHead(code, headers = {}) {
      this.status = code;
      this.headers = headers;
    },
    end(data) {
      this.body = data;
    },
  };
}

describe("serve_static_files", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("with correct file", async () => {
    const fakeContent = "<h1>Hello</h1>";

    fs.readFile.mockResolvedValue(fakeContent);

    const req = {
      url: "/index.html",
      headers: { host: "localhost" },
    };
    const res = createMockResponse();

    await serve_static_files(req, res, "public");

    expect(res.status).toBe(200);
    expect(res.headers["Content-Type"]).toBe("text/html");
    expect(res.body).toBe(fakeContent);

    expect(fs.readFile).toHaveBeenCalledWith(
      expect.stringContaining(path.join("public", "index.html"))
    );
  });

  it("missing file", async () => {
    fs.readFile.mockRejectedValue(new Error("File not found"));

    const req = {
      url: "/missing.html",
      headers: { host: "localhost" },
    };
    const res = createMockResponse();

    await serve_static_files(req, res, "public");

    expect(res.status).toBe(404);
    expect(res.body).toBe("/missing.html not found");
  });

  it("with correct extension", async () => {
    fs.readFile.mockResolvedValue("dummy js");

    const req = { url: "/script.js", headers: { host: "localhost" } };
    const res = createMockResponse();

    await serve_static_files(req, res, "static");

    expect(res.status).toBe(200);
    expect(res.headers["Content-Type"]).toBe("application/javascript");
  });

  it("with non existing response mimeType", async () => {
    fs.readFile.mockResolvedValue("dummy js");

    const req = { url: "/script.exe", headers: { host: "localhost" } };
    const res = createMockResponse();

    await serve_static_files(req, res, "static");

    expect(res.status).toBe(200);
    expect(res.headers["Content-Type"]).toBe("application/octet-stream");
  });
});
