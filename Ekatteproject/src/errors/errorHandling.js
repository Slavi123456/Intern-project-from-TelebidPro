import * as errors from "./custom_error.js";

export { withErrorHandling }
export { errorHandler };

function errorHandler(err, res) {
  let status = 500;
  let message = "Internal server error";
  if (err instanceof errors.MethodNotAllowed) {
    status = 405;
    message = "Method Not Allowed";
  }
  if (err instanceof errors.BadRequestError) {
    status = 400;
    message = `Bad Request: ${err.message}`;
  }
  else if (err instanceof errors.ValidationError) {
    status = 400;
    message = err.message;
  } else if (err instanceof errors.NotFoundError) {
    status = 404;
    message = err.message;
  } else if (err.code === "23505") {
    // unique constraint in database fields
    status = 409;
    message = "Village with this name already exists";
  } else if (err.code === "23503") {
    // foreign key in database fields
    status = 400;
    message = "Invalid township or district";
  } else if (err.code === "23502") {
    // not null in database fields
    status = 400;
    message = "Missing required field";
  }

  res.writeHead(status, { "Content-Type": "text/plain" });
  res.end(message);
}



/////////////
//Example
// function throws() {
//     const a = 5;
//     throw new NotFoundError(`A is ${a}`);
// }
//
// function callsThrows() {
//     throws();
// }
//
// const safe_callsThrows = withErrorHandling(callsThrows);
// safe_callsThrows();

function withErrorHandling(fn, options = {}) {
  return async function (...args) {
    try {
      return await fn(...args);
    } catch (err) {
      // console.log(options.notRethrow);
      // if (options.notRethrow) return;
      // console.log(err);
      throw err;
    }
  };
}


////////////////////////////////////
// const tryCatch = (action) => async (...args) => {
//     try {
//         await action(...args);
//     }
//     catch (err) {
//         console.log("Error: ", err);
//     }
// };

// async function tryCatchWrapper(func) {
//     return async function (...args) {
//         try {
//             return await func(args);
//         }
//         catch (err) {
//             console.log(err);

//             return null;
//         }
//     }
// }
