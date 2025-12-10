import { get_controller } from "./controllers/get_controller.js";
import { fix_request } from "./middlewares/fix_request.js";
import { loggerMiddleware } from "./middlewares/logger.js";

export { handler };

const middlewares = [];

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
  switch (req.method) {
    case "GET": {
      await get_controller(req, res);
      break;
    }
    default: {
      res.statusCode = 404;
      res.end("Not found");
    }
  }
}
