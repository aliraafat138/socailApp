import { roleTypes } from "../../DB/models/User.model.js";

export const endPoint = {
    createPost: [roleTypes.user],
    freezePost: [roleTypes.user, roleTypes.Admin],
    likePost: [roleTypes.user, roleTypes.Admin],
    unlikePost: [roleTypes.user, roleTypes.Admin],
    archivepost: [roleTypes.user],
    undopost: [roleTypes.user]
}