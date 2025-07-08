import * as dbService from "../../DB/db.service.js";
import {userModel} from "../../DB/models/User.model.js";
import {verifyToken} from "../../utilis/security/token.js";
export const tokenTypes = {access: "access", refresh: "refresh"};
export const authentication = async ({
  socket = {},
  tokenType = tokenTypes.access,
  next = {},
} = {}) => {
  const [bearer, token] =
    socket?.handshake?.auth?.authorization?.split(" ") || [];
  if (!bearer || !token) {
    return {data: {message: "Invalid Token Parts", status: 400}};
  }
  let access_signature = "";
  let refresh_signature = "";
  switch (bearer) {
    case "System":
      access_signature = process.env.ADMIN_ACCESS_SIGNATURE;
      refresh_signature = process.env.ADMIN_REFRESH_SIGNATURE;
      break;
    case "Bearer":
      access_signature = process.env.USER_ACCESS_SIGNATURE;
      refresh_signature = process.env.USER_REFRESH_SIGNATURE;
      break;
    default:
      break;
  }
  const decoded = verifyToken({
    token,
    signature:
      tokenType === tokenTypes.access ? access_signature : refresh_signature,
  });
  if (!decoded || !decoded.id) {
    return {data: {message: "Invalid Token", status: 404}};
  }
  const user = await dbService.findOne({
    model: userModel,
    filter: {_id: decoded.id, isDeleted: {$exists: false}},
  });
  if (!user) {
    return {data: {message: "User not found", status: 404}};
  }
  if (
    user.changeTimeCredential &&
    user.changeTimeCredential.getTime() > decoded.iat * 1000
  ) {
    return {data: {message: "Invalid Login Credential", status: 400}};
  }

  return {data: {message: "Done", user}, valid: true};
};
