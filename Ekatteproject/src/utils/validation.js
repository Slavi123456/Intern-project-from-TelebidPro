import dotenv from "dotenv";

dotenv.config();

export { validate, validateMany };

///Еxample
//function fun(arg1, agr2, ...) {
// validateMany(
//   {
//     arg1: process.env.VALIDATION_TYPE_OBJECT,
//     arg2: process.env.VALIDATION_TYPE_DB_CLIENT,
//      ...
//   },
//   arguments
// );

function validate(name, value, type) {
  switch (type) {
    case process.env.VALIDATION_TYPE_STRING:
      if (typeof value !== process.env.VALIDATION_TYPE_STRING) {
        throw new TypeError(`${name} must be a string`);
      }
      return;

    case process.env.VALIDATION_TYPE_NONEMPTY_STRING:
      if (
        typeof value !== process.env.VALIDATION_TYPE_STRING ||
        value.trim() === ""
      ) {
        throw new TypeError(`${name} must be a non-empty string`);
      }
      return;

    case process.env.VALIDATION_TYPE_FUNCTION:
      if (typeof value !== process.env.VALIDATION_TYPE_FUNCTION) {
        throw new TypeError(`${name} must be a function`);
      }
      return;

    case process.env.VALIDATION_TYPE_ARRAY:
      if (!Array.isArray(value)) {
        throw new TypeError(`${name} must be an array`);
      }
      return;

    // case process.env.VALIDATION_TYPE_DB_CLIENT:
    //   if (
    //     !value ||
    //     typeof value.query !== process.env.VALIDATION_TYPE_FUNCTION
    //   ) {
    //     throw new TypeError(
    //       `${name} must be a database client with a .query() method`
    //     );
    //   }
    //   return;
    case process.env.VALIDATION_TYPE_OBJECT:
      if (!value || typeof value !== process.env.VALIDATION_TYPE_OBJECT) {
        throw new TypeError(`${name} must be an object`);
      }
      return;
    default:
      throw new Error(`Unknown validation type "${type}"`);
  }
}

function validateMany(schema, args) {
  const keys = Object.keys(schema);

  keys.forEach((paramName, index) => {
    const type = schema[paramName];
    const value = args[index];
    validate(paramName, value, type);
  });
}
