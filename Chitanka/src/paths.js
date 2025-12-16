import path from "path";
import { fileURLToPath } from "url";

export {__scrappedFileDir, __websiteUrl};

const __filename = fileURLToPath(import.meta.url);
const __srcFolderDirectory = path.dirname(__filename);
const __projectDir = path.dirname(__srcFolderDirectory);
const __scrappedFileDir = path.join(__projectDir, "books");

const __websiteUrl = "https://chitanka.info";
// console.log(__filename);
// console.log(__srcFolderDirectory);
// console.log(__projectDir);
// console.log(__scrappedFileDir);
