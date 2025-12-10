export {withErrorHandling}

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
