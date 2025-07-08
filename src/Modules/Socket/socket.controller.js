import {Server} from "socket.io";
import {logoutSocket, registerSocket} from "./service/auth.service.js";
import {sendMessage} from "./service/message.service.js";

export const runIo = (httpSever) => {
  const io = new Server(httpSever, {cors: "*"});

  return io.on("connection", async (socket) => {
    await registerSocket(socket);
    await sendMessage(socket);
    await logoutSocket(socket);
  });
};
