import { getQueryParams } from "./query_params.js";
export { fix_request };

function fix_request(req, res, next) {
  const url = new URL(req.url, `http://${req.headers.host}`);

  req.path = url.pathname;
  req.query = Object.fromEntries(url.searchParams);
  req.rawQuery = url.search;
  req.params = getQueryParams(url);

  console.log("Clean request:", req.path, req.query);

  next();
}
