import {Router} from "express";
import {
  authentication,
  authorization,
} from "../../middleWare/auth.middleware.js";
import {
  acceptFriendRequest,
  changeRole,
  dashboard,
  profile,
  resetEmail,
  sendFriendRequest,
  shareProfile,
  updateEmail,
  updatePassword,
  updateProfile,
  updateProfileCoverImage,
  updateProfileImage,
} from "./service/user.service.js";
import {validation} from "../../middleWare/validation.js";
import * as validators from "./user.validation.js";
import {
  fileValidations,
  uploadFileDisk,
} from "../../utilis/multer/local.multer.js";
import {uploadCloudFile} from "../../utilis/multer/cloud.multer.js";
import {endPoint} from "./user.authorization.js";
const router = Router({
  strict: true,
  caseSensitive: true,
});
router.get("/profile", authentication(), profile);
router.patch("/friends/:friendId", authentication(), sendFriendRequest);
router.patch(
  "/friends/:friendRequestId/accept",
  authentication(),
  acceptFriendRequest
);
router.get("/dashboard", authentication(), dashboard);
router.patch(
  "/changeRole/:userId",
  authentication(),
  authorization(endPoint.changeRoles),
  changeRole
);
router.get(
  "/profile/:profileId",
  validation(validators.ShareProfile),
  authentication(),
  shareProfile
);
router.patch(
  "/updateEmail",
  validation(validators.UpdateEmail),
  authentication(),
  updateEmail
);
router.patch(
  "/resetEmail",
  validation(validators.ResetEmail),
  authentication(),
  resetEmail
);
router.patch(
  "/updatePassword",
  validation(validators.UpdatePassword),
  authentication(),
  updatePassword
);
router.patch(
  "/updateProfile",
  validation(validators.UpdateProfile),
  authentication(),
  updateProfile
);
router.patch(
  "/updateProfileImage",
  authentication(),
  uploadCloudFile(fileValidations.image).single("attachment"),
  validation(validators.ProfileImage),
  updateProfileImage
);
router.patch(
  "/updateProfileCoverImage",
  authentication(),
  uploadCloudFile(fileValidations.image).array("image", 3),
  updateProfileCoverImage
);
export default router;
