import dotenv from "dotenv";
import { getQueryParams } from "./query_params.js";
export { loggerMiddleware };

dotenv.config();

function loggerMiddleware(req, res, next) {
  const { method, url } = req;
  const whole_url = new URL(`http://${req.headers.host}${req.url}`);
  console.log(`[${new Date().toISOString()}] ${method} ${whole_url.pathname}`);
  console.log("URL:", `http://${process.env.HOST}${req.url}`);
  console.log("Query:", whole_url.search);
  console.log("Params:", getQueryParams(url));
  req.pathname = whole_url.pathname;
  // console.log(whole_url.searchParams.get('api'));
  // console.log("Body:", body);

  next();
}
