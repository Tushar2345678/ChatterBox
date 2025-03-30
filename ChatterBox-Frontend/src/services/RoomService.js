import { httpClient } from "../config/AxiosHelper";

// ✅ Create Room API (with Error Handling)
export const createRoomApi = async (roomDetail) => {
    try {
        const response = await httpClient.post(`/api/v1/rooms`, roomDetail, {
            headers: { "Content-Type": "application/json" },
        });
        return response.data;
    } catch (error) {
        console.error("Error creating room:", error);
        throw error;
    }
};

// ✅ Join Chat API (with `roomId` validation)
export const joinChatApi = async (roomId) => {
    if (!roomId) {
        toast.error("Error: Room ID is undefined!");
        return null;
    }
    try {
        console.log(`Joining room: ${roomId}`);
        const response = await httpClient.get(`/api/v1/rooms/${roomId}`);
        return response.data;
    } catch (error) {
        console.error(`Error joining room ${roomId}:`, error);
        throw error;
    }
};

// ✅ Get Messages API (with Error Handling)
export const getMessages = async (roomId, size = 50, page = 0) => {
    if (!roomId) {
        console.error("Error: Room ID is undefined!");
        return [];
    }
    try {
        console.log(`Fetching messages for Room ID: ${roomId}`);
        const response = await httpClient.get(`/api/v1/rooms/${roomId}/messages?size=${size}&page=${page}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching messages for room ${roomId}:`, error);
        return [];
    }
};
