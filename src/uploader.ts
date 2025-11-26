import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

const s3 = new S3Client({ region: process.env.AWS_REGION });

export const uploadToS3 = async (filePath: string) => {
  const fileContent = fs.readFileSync(filePath);
  const filename = path.basename(filePath);
  const s3Key = `uploads/${Date.now()}-${filename}`;

  const upload = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: s3Key,
    Body: fileContent,
  });

  await s3.send(upload);

  return s3Key;
};
