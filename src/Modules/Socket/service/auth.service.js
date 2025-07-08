import {socketConnections} from "../../../DB/models/User.model.js";
import {authentication} from "../../../middleWare/Socket/auth.middleware.js";

export const registerSocket = async (socket) => {
  const {data, valid} = await authentication({socket});
  console.log(socket);

  if (!valid) {
    return socket.emit("socket_Error", data);
  }
  socketConnections.set(data.user._id.toString(), socket.id);
  console.log(socketConnections);

  return "done";
};

export const logoutSocket = async (socket) => {
  socket.on("disconnect", async () => {
    const {data, valid} = await authentication({socket});
    console.log(socket);

    if (!valid) {
      return socket.emit("socket_Error", data);
    }
    socketConnections.delete(data.user._id.toString(), socket.id);
    console.log(socketConnections);

    console.log("user left");
  });
};
