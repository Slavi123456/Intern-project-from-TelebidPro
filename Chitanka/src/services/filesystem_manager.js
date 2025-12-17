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

async function readFile(folder, file) {
  try {
    const filePath = path.join(folder, file);
    console.log(filePath);
    const data = await fs.readFile(filePath, { encoding: "utf8" });

    // console.log(data);
    return data;
  } catch (err) { }
}

async function saveFile(data, directoryPath, fileName) {
  const filePath = path.join(directoryPath, fileName);
  await fs.writeFile(filePath, data, "utf8");
  console.log("Saved to", filePath);
}