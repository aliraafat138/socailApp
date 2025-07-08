import {roleTypes, userModel} from "../../../DB/models/User.model.js";
import {emailEvent} from "../../../utilis/email/events/email.event.js";
import {asyncHandler} from "../../../utilis/error/error.js";
import {compareHash, generateHash} from "../../../utilis/security/hash.js";
import {generateToken, verifyToken} from "../../../utilis/security/token.js";
import {successResponse} from "../../../utilis/successResponse/response.js";
import * as dbService from "../../../DB/db.service.js";
import {decodedToken, tokenTypes} from "../../../utilis/security/token.js";

export const login = asyncHandler(async (req, res, next) => {
  const {email, password} = req.body;
  const user = await dbService.findOne({model: userModel, filter: {email}});
  if (!user) {
    return next(new Error("User not found", {cause: 404}));
  }
  if (!user.confirmEmail) {
    return next(new Error("Please Confirm Your Email First", {cause: 404}));
  }
  if (!compareHash({plainText: password, hashValue: user.password})) {
    return next(new Error("Invalid Login", {cause: 400}));
  }
  const refreshToken = generateToken({
    payload: {id: user._id},
    signature: [roleTypes.superAdmin, roleTypes.Admin].includes(user.role)
      ? process.env.ADMIN_REFRESH_SIGNATURE
      : process.env.USER_REFRESH_SIGNATURE,
    options: {expiresIn: 31536000},
  });
  const accessToken = generateToken({
    payload: {id: user._id},
    signature: [roleTypes.superAdmin, roleTypes.Admin].includes(user.role)
      ? process.env.ADMIN_ACCESS_SIGNATURE
      : process.env.USER_ACCESS_SIGNATURE,
    options: {expiresIn: "1h"},
  });

  return successResponse({res, data: {token: {accessToken, refreshToken}}});
});

export const refreshToken = asyncHandler(async (req, res, next) => {
  const {authorization} = req.headers;
  const user = await decodedToken({
    authorization,
    tokenType: tokenTypes.refresh,
    next,
  });
  const accessToken = generateToken({
    payload: {id: user._id},
    signature: [roleTypes.superAdmin, roleTypes.Admin].includes(user.role)
      ? process.env.ADMIN_ACCESS_SIGNATURE
      : process.env.USER_ACCESS_SIGNATURE,
    options: {expiresIn: "1h"},
  });
  const refreshToken = generateToken({
    payload: {id: user._id},
    signature: [roleTypes.superAdmin, roleTypes.Admin].includes(user.role)
      ? process.env.ADMIN_REFRESH_SIGNATURE
      : process.env.USER_REFRESH_SIGNATURE,
    options: {expiresIn: 31536000},
  });

  return successResponse({res, data: {token: {accessToken, refreshToken}}});
});

export const forgetPassword = asyncHandler(async (req, res, next) => {
  const {email} = req.body;
  const user = await dbService.findOne({model: userModel, filter: {email}});
  if (!user) {
    return next(new Error("User Not Found", {cause: 404}));
  }
  if (!user.confirmEmail) {
    return next(new Error("Please Confirm Email", {cause: 400}));
  }
  emailEvent.emit("ForgetPassword", {id: user.id, email});
  return successResponse({res});
});

export const resetPassword = asyncHandler(async (req, res, next) => {
  const {email, code, password} = req.body;
  const user = await dbService.find({model: userModel, filter: {email}});
  if (!user) {
    return next(new Error("User Not Found", {cause: 404}));
  }
  if (!user.confirmEmail) {
    return next(new Error("Please Confirm Email First", {cause: 400}));
  }
  if (!compareHash({plainText: code, hashValue: user.resetPasswordOTP})) {
    return next(new Error("Invalid Code", {cause: 400}));
  }
  await dbService.UpdateOne({
    model: userModel,
    filter: {email},
    data: {
      password: generateHash({plainText: password}),
      changeTimeCredential: Date.now(),
      $unset: {resetPasswordOTP: 0},
    },
  });
  return successResponse({res});
});
