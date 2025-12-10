import { describe, it, expect, vi } from "vitest";
import { withErrorHandling } from "../src/utils/errorHandling.js";

class FakeError extends Error {
  constructor(msg) {
    super(msg);
    this.name = "FakeError";
  }
}

describe("withErrorHandling", () => {
  it("returns the result of the wrapped function", async () => {
    const fn = vi.fn().mockResolvedValue("OK");

    const wrapped = withErrorHandling(fn);

    const result = await wrapped(1, 2, 3);

    expect(result).toBe("OK");
    expect(fn).toHaveBeenCalledWith(1, 2, 3);
  });

  it("works with synchronous functions too", async () => {
    const fn = vi.fn(() => 42);

    const wrapped = withErrorHandling(fn);

    const result = await wrapped();

    expect(result).toBe(42);
  });

  it("rethrows errors from the wrapped function", async () => {
    const fn = vi.fn().mockImplementation(() => {
      throw new FakeError("Something failed");
    });

    const wrapped = withErrorHandling(fn);

    await expect(wrapped()).rejects.toThrow(FakeError);
    await expect(wrapped()).rejects.toThrow("Something failed");
  });

  it("rethrows errors from async wrapped functions", async () => {
    const fn = vi.fn().mockRejectedValue(new FakeError("Async fail"));

    const wrapped = withErrorHandling(fn);

    await expect(wrapped()).rejects.toThrow(FakeError);
    await expect(wrapped()).rejects.toThrow("Async fail");
  });

  // This test is for future-proofing if you implement "notRethrow"
  it("ignores errors if notRethrow=true (when implemented)", async () => {
    const fn = vi.fn().mockRejectedValue(new FakeError("Error"));

    // Simulate the option (currently, your code ignores it)
    const wrapped = withErrorHandling(fn, { notRethrow: true });

    await expect(wrapped()).rejects.toThrow(FakeError);
  });
});
