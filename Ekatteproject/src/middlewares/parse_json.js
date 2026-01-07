export { parseJsonBody }

function parseJsonBody(req, res, next) {
    if (!["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
        return next();
    }

    const contentType = req.headers["content-type"] || "";
    if (!contentType.includes("application/json")) {
        req.body = {};
        return next();
    }

    let body = "";

    req.on("data", chunk => body += chunk);
    req.on("end", () => {
        if (!body) {
            req.body = {};
            return next();
        }

        try {
            req.body = JSON.parse(body);
            return next();
        } catch {
            res.writeHead(400, { "Content-Type": "text/plain" });
            res.end("Invalid JSON");
        }
    });
}