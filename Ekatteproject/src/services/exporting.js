import ExcelJS from "exceljs";
import { getStatistics } from "./statistics.js";

export { exportData };

const mimeTypes = {
    csv: "text/csv",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
};

async function exportData(req, res, data, extension) {
    if (!mimeTypes[extension]) {
        throw new Error("Invalid export format");
    }

    if (!Array.isArray(data) || data.length === 0) {
        throw new Error("No data to export");
    }

    const startTime = process.hrtime.bigint();
    const memStart = process.memoryUsage().heapUsed;
    const cpuStart = process.cpuUsage();

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Statistics");

    const statistics = await getStatistics();

    sheet.addRow(["Table", "Count rows"]);
    Object.entries(statistics).forEach(([key, value]) => {
        // console.log(key, value);
        sheet.addRow([key, value]);
    });

    const endTime = process.hrtime.bigint();
    const memEnd = process.memoryUsage().heapUsed;
    const cpuEnd = process.cpuUsage(cpuStart);

    const stats = {
        executionTimeMs: Number(endTime - startTime) / 1e6,
        memoryUsedMB: ((memEnd - memStart) / 1024 / 1024).toFixed(2),
        cpuUsedMs: ((cpuEnd.user + cpuEnd.system) / 1000).toFixed(2),
    };
    console.log("->>[EXPORT]", stats);

    res.setHeader("Content-Type", mimeTypes[extension]);
    res.setHeader(
        "Content-Disposition",
        `attachment; filename="statistics.${extension}"`
    );

    if (extension === "csv") {
        sheet.addRow(["--- EXPORT STATISTICS ---"]);
        sheet.addRow(["Execution time (ms)", stats.executionTimeMs]);
        sheet.addRow(["Memory used (MB)", stats.memoryUsedMB]);
        sheet.addRow(["CPU used (ms)", stats.cpuUsedMs]);

        await workbook.csv.write(res, { sheetName: "Statistics" });
    } else {
        const statsSheet = workbook.addWorksheet("Export Stats");
        statsSheet.addRow(["Execution time (ms)", stats.executionTimeMs]);
        statsSheet.addRow(["Memory used (MB)", stats.memoryUsedMB]);
        statsSheet.addRow(["CPU used (ms)", stats.cpuUsedMs]);

        await workbook.xlsx.write(res);
    }
    res.end();
}
