import {asyncHandler} from "../../../utilis/error/error.js";
import * as dbService from "../../../DB/db.service.js";
import {chatModel} from "../../../DB/models/ChatModel.js";
import {successResponse} from "../../../utilis/successResponse/response.js";
export const getChat = asyncHandler(async (req, res, next) => {
  const {friendId} = req.params;
  const chat = await dbService.findOne({
    model: chatModel,
    filter: {
      $or: [
        {
          mainUser: req.user._id,
          subParticipant: friendId,
        },
        {
          mainUser: friendId,
          subParticipant: req.user._id,
        },
      ],
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
    },
  });
  return successResponse({res, data: {chat}});
});
