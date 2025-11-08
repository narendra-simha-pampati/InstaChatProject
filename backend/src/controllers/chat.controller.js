import { generateStreamToken } from "../lib/stream.js";

export async function getStreamToken(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: user not found in request" });
    }

    if (!process.env.STREAM_API_KEY || !process.env.STREAM_API_SECRET) {
      return res.status(500).json({ message: "Stream API keys are not configured on the server" });
    }

    const token = generateStreamToken(req.user.id);

    if (!token) {
      return res.status(500).json({ message: "Failed to generate Stream token" });
    }

    res.status(200).json({ token });
  } catch (error) {
    console.log("Error in getStreamToken controller:", error);
    res.status(500).json({ message: error?.message || "Internal Server Error" });
  }
}
