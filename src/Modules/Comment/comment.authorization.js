import { roleTypes } from "../../DB/models/User.model.js";

export const endPoint = {
    create: [roleTypes.user],
    update: [roleTypes.user],
    freeze: [roleTypes.user, roleTypes.Admin],
    Unfreeze: [roleTypes.user, roleTypes.Admin],
    like: [roleTypes.user]
}