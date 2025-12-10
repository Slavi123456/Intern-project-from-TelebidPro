export { getQueryParam, getQueryParams };

function getQueryParam(url, param) {
  const params = new URL(`http://${process.env.HOST}${url}`).searchParams;
  return params.get(param)
    ? params.get(param)
    : `this parameter: ${param} is not defined`;
}
function getQueryParams(url) {
  const params = new URL(`http://${process.env.HOST}${url}`).searchParams;
  const paramsObj = {};
  params.forEach((value, key) => {
    paramsObj[key] = value;
  });
  return paramsObj;
}
