import { io } from "socket.io-client";

// Backend base URL
const SOCKET_URL = "http://localhost:5000";

// Create socket instance
const socket = io(SOCKET_URL, {
  withCredentials: true,
  autoConnect: false,
  auth: {
    token: localStorage.getItem("token"), // ✅ attach JWT for auth (future-proof)
  },
});

// ================= CONNECT / DISCONNECT =================
export const connectSocket = () => {
  if (!socket.connected) {
    socket.auth = {
      token: localStorage.getItem("token"), // ✅ refresh token on reconnect
    };
    socket.connect();
  }
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

// ================= JOIN ROOMS =================

// Join personal room (student/admin id)
export const joinUserRoom = (userId) => {
  if (!userId) return;
  const idStr = userId.toString();
  const join = () => socket.emit("joinUser", idStr);

  if (socket.connected) {
    join();
    return;
  }

  connectSocket();
  socket.once("connect", join);
};

// Join hostel group room
export const joinHostelRoom = (hostelId) => {
  if (!hostelId) return;
  const idStr = hostelId.toString();
  const join = () => socket.emit("joinHostel", idStr);

  if (socket.connected) {
    join();
    return;
  }

  connectSocket();
  socket.once("connect", join);
};

export default socket;
