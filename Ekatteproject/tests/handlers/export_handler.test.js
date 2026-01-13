import { describe, it, expect, vi, beforeEach } from "vitest";
import { exportHandler } from "../../src/handlers/exporting_handler.js";
import { exportData } from "../../src/services/exporting.js";

// Mock exportData
vi.mock("../../src/services/exporting.js", () => ({
  exportData: vi.fn(),
}));

function mockRes() {
  return {
    setHeader: vi.fn(),
    writeHead: vi.fn(),
    end: vi.fn(),
  };
}

describe("exportHandler", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("sets headers and calls exportData for CSV", async () => {
    const req = {};
    const res = mockRes();

    exportData.mockResolvedValue();

    await exportHandler(req, res, "csv");

    expect(res.setHeader).toHaveBeenCalledWith(
      "Content-Type",
      "text/csv"
    );
    expect(res.setHeader).toHaveBeenCalledWith(
      "Content-Disposition",
      'attachment; filename="statistics.csv"'
    );

    expect(exportData).toHaveBeenCalledWith(req, res, "csv");
    expect(res.end).toHaveBeenCalled();
  });

  it("sets headers and calls exportData for XLSX", async () => {
    const req = {};
    const res = mockRes();

    exportData.mockResolvedValue();

    await exportHandler(req, res, "xlsx");

    expect(res.setHeader).toHaveBeenCalledWith(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    expect(res.setHeader).toHaveBeenCalledWith(
      "Content-Disposition",
      'attachment; filename="statistics.xlsx"'
    );
  });

  it("returns 500 if exportData throws", async () => {
    const req = {};
    const res = mockRes();

    exportData.mockRejectedValue(new Error("Boom"));

    await exportHandler(req, res, "csv");

    expect(res.writeHead).toHaveBeenCalledWith(500, {
      "Content-Type": "text/plain",
    });
    expect(res.end).toHaveBeenCalledWith("Failed to generate csv");
  });
});
