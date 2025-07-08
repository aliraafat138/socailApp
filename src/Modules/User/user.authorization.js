import { roleTypes } from "../../DB/models/User.model.js";

export const endPoint = {
    changeRoles: [roleTypes.superAdmin, roleTypes.Admin]
}