import { watch, open, stat, unlink, rename } from "node:fs/promises";
import process from "node:process";

const ADD_FILE = "ADD_FILE";
const RENAME_FILE = "RENAME_FILE";
const DELETE_FILE = "DELETE_FILE";
const APPEND_FILE = "APPEND_FILE";
const EXIT = "EXIT";

const watcher = watch("./command.txt");
const commandFile = await open("./command.txt");
const stats = await stat("./command.txt");

async function addFile(payload) {
  try {
    const exitingFile = await open(payload, "r");
    console.log(`file already Exit: ${payload}`);
    exitingFile.close();
  } catch (e) {
    const newFile = await open(payload, "a");
    console.log(` new file added: ${payload}`);
    newFile.close();
  }
}

async function deleteFile(payload) {
  try {
    await unlink(payload);
    console.log(`file successfully deleted:${payload}`);
  } catch (e) {
    if (e.code === "ENOENT") {
      console.log("file path does not exists.", e.message);
    } else {
      console.log("something went wrong!!", e.message);
    }
  }
}

async function renameFile(payload) {
  const [prevName, newName] = payload.split(" ");
  try {
    await rename(prevName, newName);
    console.log(`successfully renamed file from ${prevName} to ${newName}`);
  } catch (e) {
    if (e.code === "ENOENT") {
      console.log("file path does not exists.");
    } else {
      console.log("something went wrong!!", e.message);
    }
  }
}

async function appendFile(payload) {
  try {
    const [filePath, content] = payload.split(" @ ");
    const fileHandler = await open(filePath, "a");
    await fileHandler.appendFile(content);
    fileHandler.close();
    console.log(
      `File ${filePath} appended successfully with content: ${content}`
    );
  } catch (e) {
    if (e.code === "ENOENT") {
      console.log("file path doesnot exist!", e.message);
    } else {
      console.log("something went wrong!", e.message);
    }
  }
}

// execute specific file operation based on command
commandFile.on("change", async () => {
  const command = await commandFileContent();
  const [action, payload] = command.split(":");
  switch (action) {
    case ADD_FILE:
      addFile(payload);
      break;
    case DELETE_FILE:
      deleteFile(payload);
      break;
    case RENAME_FILE:
      renameFile(payload);
      break;
    case APPEND_FILE:
      appendFile(payload);
      break;
    case EXIT:
      process.exit();
    default:
      console.log("Invalid command");
  }
});

// get the command and payload from command.txt
async function commandFileContent() {
  const buff = Buffer.alloc(stats.size);
  const content = await commandFile.read(buff, 0, stats.size, 0);
  return content.buffer.toString("utf8");
}

// iterate over commands via watcher
(async function () {
  try {
    console.log("********* File App Started***********");
    for await (const item of watcher) {
      commandFile.emit("change");
    }
  } catch (err) {
    console.log("something went wrong!!", err.message);
  }
})();

process.on("exit", (code) => {
  console.log(`********* File App Ended***********`);
});
