import ExcelJS from "exceljs";
import { getStatistics } from "./statistics.js";

export { exportData };

async function exportData(req, res, extension) {
    const startStats = getProccessStatistics();

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Statistics");

    const statistics = await getStatistics();

    sheet.addRow(["Table", "Count rows"]);
    Object.entries(statistics).forEach(([key, value]) => {
        // console.log(key, value);
        sheet.addRow([key, value]);
    });

    const endStats = getProccessStatistics();

    const stats = calculateUsedProcessStats(startStats, endStats);
    console.log("->>[EXPORT]", stats);

    if (extension === "csv") {
        writeStatisticsToSheet(sheet, stats);
        await workbook.csv.write(res, { sheetName: "Statistics" });
    } 
    else if(extension === "xlsx") {
        const statsSheet = workbook.addWorksheet("Export Stats");
        writeStatisticsToSheet(statsSheet, stats);
        await workbook.xlsx.write(res);
    }
}
function writeStatisticsToSheet(sheet, stats) {
    sheet.addRow(["--- EXPORT STATISTICS ---"]);
    sheet.addRow(["Execution time (ms)", stats.executionTimeMs]);
    sheet.addRow(["Memory used (MB)", stats.memoryUsedMB]);
    sheet.addRow(["CPU used (ms)", stats.cpuUsedMs]);
}

function getProccessStatistics() {
    return {
        time: process.hrtime.bigint(),
        memory: process.memoryUsage().heapUsed,
        cpuUsage: process.cpuUsage(),
    };
}

function calculateUsedProcessStats(startStats, endStats) {
    return {
        executionTimeMs: Number(endStats.time - startStats.time) / 1e6,
        memoryUsedMB: ((endStats.memory - startStats.memory) / 1024 / 1024).toFixed(2),
        cpuUsedMs: ((endStats.cpuUsage.user + endStats.cpuUsage.system) / 1000).toFixed(2),
    }
}