import { io } from "socket.io-client";

export function connectSocket() {
  const token = localStorage.getItem("token");

  // Backend runs on port 4000 by default in this project.
  // Use that port (or set via env) so the client can establish a websocket connection.
  const socket = io("http://localhost:4000", {
    auth: {
      token: `Bearer ${token}`
    }
  });

  return socket;
}
