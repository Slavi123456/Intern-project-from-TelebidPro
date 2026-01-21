import { fix_request } from "./middlewares/fix_request.js";
import { loggerMiddleware } from "./middlewares/logger.js";
import { parseJsonBody } from "./middlewares/parse_json.js";
import { serve_static_files } from "./services/static_files.js";

import { routes } from "./config/routes.js";
import "./controllers/get_controller.js";
import "./controllers/post_controller.js";
import "./controllers/put_controller.js";
import "./controllers/delete_controller.js";
import { BadRequestError, MethodNotAllowed } from "./errors/custom_error.js";
import { errorHandler } from "./errors/errorHandling.js";

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

    if (methodRoutes.has(req.pathname)) {
      const handler = methodRoutes.get(req.pathname);
      return await handler(req, res);
    }

    // console.log("Method routes: ", methodRoutes.entries());
    for (const [route, fn] of methodRoutes.entries()) {
      if (req.url.startsWith("/assets/")) {
        // console.log("Succes match, ", route, "fn ", fn);
        return await fn(req, res);
      }
    }
    return await serve_static_files(req, res, "public");
  } catch (err) {
    errorHandler(err, res);
  }
}
