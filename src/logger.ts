import fs from "fs";
import { FileMeta } from "./types";

const LOG_FILE = "file-log.json";

export const logFileMeta = (meta: FileMeta) => {
  let logs: FileMeta[] = [];

  if (fs.existsSync(LOG_FILE)) {
    logs = JSON.parse(fs.readFileSync(LOG_FILE, "utf8"));
  }

  logs.push(meta);
  fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2));
};
