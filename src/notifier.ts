import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export const notify = async (text: string) => {
  if (!process.env.WEBHOOK_URL) return;
  try {
    await axios.post(process.env.WEBHOOK_URL, { text });
  } catch (err) {
    console.error("Notification failed:", err);
  }
};
