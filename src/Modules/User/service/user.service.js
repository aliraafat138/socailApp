import {asyncHandler} from "../../../utilis/error/error.js";
import {successResponse} from "../../../utilis/successResponse/response.js";
import * as dbService from "../../../DB/db.service.js";
import {roleTypes, userModel} from "../../../DB/models/User.model.js";
import {postModel} from "../../../DB/models/Post.model.js";
import {emailEvent} from "../../../utilis/email/events/email.event.js";
import {compareHash, generateHash} from "../../../utilis/security/hash.js";
import {confirmEmail} from "../../Auth/service/registration.service.js";
import {cloud} from "../../../utilis/multer/cloudinary.js";
import {friendRequestModel} from "../../../DB/models/FriendRequestModel.js";
export const profile = asyncHandler(async (req, res, next) => {
  const user = await dbService.findOne({
    model: userModel,
    filter: {_id: req.user._id},
    populate: [
      {
        path: "viewers.userId",
        select: "email userName",
      },
    ],
  });
  return successResponse({res, data: {user}});
});

export const dashboard = asyncHandler(async (req, res, next) => {
  const result = await Promise.allSettled([
    await dbService.findOne({
      model: userModel,
      filter: {},
      populate: [
        {
          path: "viewers.userId",
          select: "email userName",
        },
      ],
    }),
    await dbService.findOne({
      model: postModel,
      filter: {},
    }),
  ]);

  return successResponse({res, data: {result}});
});

export const changeRole = asyncHandler(async (req, res, next) => {
  const {userId} = req.params;
  const {role} = req.body;
  const roles =
    req.user.role === roleTypes.superAdmin
      ? {role: {$nin: [roleTypes.superAdmin]}}
      : {role: {$nin: [roleTypes.Admin, roleTypes.superAdmin]}};
  const user = await dbService.findOneAndUpdate({
    model: userModel,
    filter: {_id: userId, isDeleted: {$exists: false}, ...roles},
    data: {role, updatedBy: req.user._id},
  });
  return successResponse({res, data: {user}});
});
export const shareProfile = asyncHandler(async (req, res, next) => {
  const {profileId} = req.params;
  let user = null;
  if (profileId === req.user._id.toString()) {
    user = req.user;
  } else {
    user = await dbService.findOneAndUpdate({
      model: userModel,
      filter: {_id: profileId, isDeleted: false},
      data: {
        $push: {
          viewers: {
            $each: [{userId: req.user._id, time: Date.now()}],
            $position: 0,
            $slice: 5,
          },
        },
      },
      select: "userName email image",
    });
  }

  return user
    ? successResponse({res, data: {user}})
    : next(new Error("Invalid Account", {cause: 404}));
});

export const updateEmail = asyncHandler(async (req, res, next) => {
  const {email} = req.body;
  if (await dbService.findOne({model: userModel, filter: {email}})) {
    return next(new Error("Email Exist", {cause: 409}));
  }
  await dbService.UpdateOne({
    model: userModel,
    filter: {_id: req.user._id},
    data: {tempEmail: email},
  });
  emailEvent.emit("SendConfirmEmail", {
    id: req.user._id,
    email: req.user.email,
  });
  emailEvent.emit("updateEmail", {id: req.user._id, email});
  return successResponse({res});
});

export const resetEmail = asyncHandler(async (req, res, next) => {
  const {oldCode, newCode} = req.body;

  if (
    !compareHash({plainText: oldCode, hashValue: req.user.confirmEmailOTP}) ||
    !compareHash({plainText: newCode, hashValue: req.user.tempEmailOTP})
  ) {
    return next(new Error("Invalid Code", {cause: 400}));
  }
  await dbService.UpdateOne({
    model: userModel,
    filter: {_id: req.user._id},
    data: {email: req.user.tempEmail, changeTimeCredential: Date.now()},
  });
  return successResponse({res});
});

export const updatePassword = asyncHandler(async (req, res, next) => {
  const {oldPassword, Password} = req.body;
  if (!compareHash({plainText: oldPassword, hashValue: req.user.password})) {
    return next(new Error("Invalid Old Password", {cause: 400}));
  }

  await dbService.UpdateOne({
    model: userModel,
    filter: {_id: req.user._id},
    data: {
      password: generateHash({plainText: Password}),
      changeTimeCredential: Date.now(),
    },
  });
  return successResponse({res});
});

export const updateProfile = asyncHandler(async (req, res, ne) => {
  const user = await dbService.findOneAndUpdate({
    model: userModel,
    filter: {_id: req.user._id},
    data: req.body,
    options: {new: true},
  });
  return successResponse({res, data: {user}});
});

export const updateProfileImage = asyncHandler(async (req, res, next) => {
  const {secure_url, public_id} = await cloud.uploader.upload(req.file.path, {
    folder: `${process.env.APP_NAME}/user/${req.user._id}/profile`,
  });
  const user = await dbService.findOneAndUpdate({
    model: userModel,
    filter: {_id: req.user._id},
    data: {image: {secure_url, public_id}},
    options: {new: true},
  });

  return successResponse({res, data: {user}});
});
export const updateProfileCoverImage = asyncHandler(async (req, res, next) => {
  let images = [];
  for (const file of req.files) {
    const {secure_url, public_id} = await cloud.uploader.upload(file.path, {
      folder: `${process.env.APP_NAME}/user/${req.user._id}/profile/cover`,
    });
    images.push({secure_url, public_id});
  }
  const user = await dbService.findOneAndUpdate({
    model: userModel,
    filter: {_id: req.user._id},
    data: {coverImages: images},
    options: {new: true},
  });

  return successResponse({res, data: {user}});
});

export const sendFriendRequest = asyncHandler(async (req, res, next) => {
  const {friendId} = req.params;
  const checkUser = await dbService.findOne({
    model: userModel,
    filter: {_id: friendId, isDeleted: {$exists: false}},
  });
  if (!checkUser) {
    return next(new Error("User Not Found", {cause: 404}));
  }

  const friendRequest = await dbService.create({
    model: friendRequestModel,
    data: {friendId, createdBy: req.user._id},
  });
  return successResponse({res, status: 201, data: {friendRequest}});
});

export const acceptFriendRequest = asyncHandler(async (req, res, next) => {
  const {friendRequestId} = req.params;
  const friendRequest = await dbService.findOneAndDelete({
    model: friendRequestModel,
    filter: {_id: friendRequestId, status: false, friendId: req.user._id},
  });
  if (!friendRequest) {
    return next(new Error("Friend request not found ", {cause: 404}));
  }
  //   await userModel.updateOne(
  //     {_id: req.user._id},
  //     {$addToSet: {friends: friendRequest.createdBy}}
  //   );
  await dbService.UpdateOne({
    model: userModel,
    filter: {_id: req.user._id},
    data: {$AddToSet: {friends: friendRequest.createdBy}},
  });
  //   await userModel.updateOne(
  //     {_id: friendRequest.createdBy},
  //     {$addToSet: {friends: req.user._id}}
  //   );
  await dbService.UpdateOne({
    model: userModel,
    filter: {_id: friendRequest.createdBy},
    data: {$AddToSet: {friends: req.user._id}},
  });
  return successResponse({res, data: {friendRequest}});
});
