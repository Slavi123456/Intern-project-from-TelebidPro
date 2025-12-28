import path from "path";
import fs from "fs/promises";

export { bulkCreateDirectory };

async function bulkCreateDirectory(folder, directoryNames) {
  let newDirectories = [];
  for (const name of directoryNames) {
    // console.log(name);

    const newPath = path.join(folder, name);

    if (await createDirectory(newPath)) {
      newDirectories.push(newPath);
    }
  }
  return newDirectories;
}

async function createDirectory(directoryPath) {
  try {
    await fs.mkdir(directoryPath, { recursive: true });
    console.log(`Directory '${directoryPath}' created (or already exists).`);
    return true;
  } catch (err) {
    console.error(`Error creating directory: ${err.message}`);
    return false;
  }
}
