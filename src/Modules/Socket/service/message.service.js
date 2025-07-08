import {chatModel} from "../../../DB/models/ChatModel.js";
import * as dbService from "../../../DB/db.service.js";
import {successResponse} from "../../../utilis/successResponse/response.js";
import {socketConnections} from "../../../DB/models/User.model.js";
export const sendMessage = (socket) => {
  return socket.on("sendMessage", async (messageData) => {
    const {data, valid} = await authentication({socket});
    if (!valid) {
      return socket.emit("socket_Error", data);
    }
    const {userId} = data.user._id;
    const {message, destId} = messageData;
    console.log(userId, message, destId);
    let chat = await dbService.findOneAndUpdate({
      model: chatModel,
      filter: {
        $or: [
          {
            mainUser: req.user._id,
            subParticipant: destId,
          },
          {
            mainUser: destId,
            subParticipant: req.user._id,
          },
        ],
      },
      data: {
        $push: {messages: message, senderId: userId},
      },
      populate: [
        {
          path: "mainUser",
          select: "userName image",
        },
        {
          path: "subParticipant",
          select: "userName image",
        },
        {
          path: "messages.senderId",
          select: "userName image",
        },
      ],
    });
    if (!chat) {
      chat = await dbService.create({
        model: chatModel,
        data: {
          mainUser: userId,
          subParticipant: destId,
          $push: {messages: message, senderId: userId},
        },
      });
      return successResponse({res, data: {chat}});
    }
    socket.emit("successMessage", {message});
    socket.to(socketConnections.get(destId)).emit("receiveMessage", {message});
    return "done";
  });
};
