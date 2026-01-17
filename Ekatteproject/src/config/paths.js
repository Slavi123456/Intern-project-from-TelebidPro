import path from "path";
import { fileURLToPath } from "url";

export {__projectdir, __srcdir};

const __filename = fileURLToPath(import.meta.url);
const __srcdir = path.dirname(__filename);
const __projectdir = path.dirname(__srcdir);

// console.log( __srcdir, "\n", __projectdir);