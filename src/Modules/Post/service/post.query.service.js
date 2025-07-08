import * as dbService from "../../../DB/db.service.js";
import {postModel} from "../../../DB/models/Post.model.js";
export const posList = async (parent, args) => {
  const posts = await dbService.find({
    model: postModel,
    populate: [
      {
        path: "createdBy",
      },
    ],
  });
  return {message: "Done", statusCode: 200, data: posts};
};
