import { exportData } from "../services/exporting.js";

export { exportHandler };

const mimeTypes = {
    csv: "text/csv",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
};

async function exportHandler(req, res, extension) {
  try {
    res.setHeader("Content-Type", mimeTypes[extension]);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="statistics.${extension}"`
    );
    await exportData(req, res, extension);

    res.end();
  } catch (err) {
    console.error(err);
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end(`Failed to generate ${extension}`);
  }
}