import { StreamChat } from "stream-chat";
import "dotenv/config";

const apiKey = process.env.STEAM_API_KEY;
const apiSecret = process.env.STEAM_API_SECRET;

if (!apiKey || !apiSecret) {
  console.error("Stream API key or Secret is missing");
}

const streamClient = StreamChat.getInstance(apiKey, apiSecret);

export const upsertStreamUser = async (userData) => {
  try {
    await streamClient.upsertUsers([userData]);
    return userData;
  } catch (error) {
    console.error("Error upserting Stream user:", error);
  }
};

export const generateStreamToken = (userId) => {
  try {
    // ensure userId is a string
    const userIdStr = userId.toString();
    return streamClient.createToken(userIdStr);
  } catch (error) {
    console.error("Error generating Stream token:", error);
  }
};

// Ensure a group channel exists and contains given members
export const ensureGroupChannel = async ({ groupId, name, image, memberIds = [] }) => {
  const channelId = `group-${groupId}`;
  try {
    const channel = streamClient.channel("messaging", channelId, { name, image });
    // Create if doesn't exist
    await channel.create();
    if (memberIds.length) {
      await channel.addMembers(memberIds.map((id) => id.toString()));
    }
    return channelId;
  } catch (error) {
    // If channel already exists, update its data and ensure members are present
    try {
      const channel = streamClient.channel("messaging", channelId);
      await channel.update({ name, image });
      if (memberIds.length) {
        await channel.addMembers(memberIds.map((id) => id.toString()));
      }
      return channelId;
    } catch (e) {
      console.error("Error ensuring group channel:", e?.message || e);
      return null;
    }
  }
};

export const addMemberToGroupChannel = async ({ groupId, userId }) => {
  const channelId = `group-${groupId}`;
  try {
    const channel = streamClient.channel("messaging", channelId);
    await channel.addMembers([userId.toString()]);
  } catch (error) {
    console.error("Error adding member to group channel:", error?.message || error);
  }
};

export const removeMemberFromGroupChannel = async ({ groupId, userId }) => {
  const channelId = `group-${groupId}`;
  try {
    const channel = streamClient.channel("messaging", channelId);
    await channel.removeMembers([userId.toString()]);
  } catch (error) {
    console.error("Error removing member from group channel:", error?.message || error);
  }
};
