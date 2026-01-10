import { fix_request } from "./middlewares/fix_request.js";
import { loggerMiddleware } from "./middlewares/logger.js";
import { parseJsonBody } from "./middlewares/parse_json.js";
import { serve_static_files } from "./services/static_files.js";

import { routes } from "./routes.js";
import "./controllers/get_controller.js";
import "./controllers/post_controller.js";
import "./controllers/put_controller.js";
import "./controllers/delete_controller.js";
import { BadRequestError, MethodNotAllowed } from "./errors/custom_error.js";

export { handler };

const middlewares = [];

middlewares.push(parseJsonBody);
middlewares.push(fix_request);
middlewares.push(loggerMiddleware);

function handler(req, res) {
  let ind = 0;
  async function next() {
    const mw = middlewares[ind++];
    if (mw) {
      return mw(req, res, next);
    }

    return await routing_dispatcher(req, res);
  }

  return next();
}

async function routing_dispatcher(req, res) {
  try {
    const methodRoutes = routes.get(req.method);
    
    if (!methodRoutes) {
      throw MethodNotAllowed("Method Not Allowed");
    }

    const handler = methodRoutes.get(req.pathname);

    if (!handler) {
      await serve_static_files(req, res, "public");
      return;
    }

    await handler(req, res);
  } catch (err) {
    handle_errors(err);
  }
}

async function handle_errors(err) {
  if (err instanceof MethodNotAllowed) {
    res.writeHead(405);
    res.end("Method Not Allowed");
    return;
  }
  if (err instanceof BadRequestError) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('Bad Request:', err.message);
    return;
  }
  res.writeHead(500);
  res.end("Internal server error:", err);
}
