import chokidar from "chokidar";
import path from "path";
import { uploadToS3 } from "./uploader";
import { logFileMeta } from "./logger";
import { notify } from "./notifier";
import dotenv from "dotenv";
dotenv.config();

export const startWatcher = () => {
  const watchFolder = process.env.WATCH_FOLDER || "./input";

  const watcher = chokidar.watch(watchFolder, {
    persistent: true,
    ignoreInitial: true
  });

  watcher.on("add", async (filePath) => {
    const filename = path.basename(filePath);
    console.log(`🔍 Detected new file: ${filename}`);

    try {
      const s3Key = await uploadToS3(filePath);

      const meta = {
        filename,
        size: require("fs").statSync(filePath).size,
        uploadedAt: new Date().toISOString(),
        s3Key
      };

      logFileMeta(meta);

      notify(`📤 Uploaded *${filename}* to S3 as \`${s3Key}\``);

      console.log(`✅ Uploaded ${filename} → ${s3Key}`);
    } catch (err) {
      console.error(`❌ Error handling ${filename}`, err);
    }
  });

  console.log(`👀 Watching folder: ${watchFolder}`);
};
