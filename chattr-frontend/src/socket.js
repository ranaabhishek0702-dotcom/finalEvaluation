import { io } from "socket.io-client";

export function connectSocket() {
  const token = localStorage.getItem("token");


  const socket = io("http://localhost:4000", {
    auth: {
      token: `Bearer ${token}`
    }
  });

  return socket;
}
