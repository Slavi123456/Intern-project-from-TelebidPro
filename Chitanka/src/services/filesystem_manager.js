import path from "path";
import fs from "fs/promises";

export { bulkCreateDirectory, readBookText };

async function readBookText(folder) {
  const files = await fs.readdir(folder);
  const txtFile = files.find((f) => f.endsWith(".txt"));

  if (!txtFile) throw new Error("No TXT file found in ZIP");

  const content = await fs.readFile(path.join(folder, txtFile), "utf8");
  return content;
}


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
