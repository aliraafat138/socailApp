import {Router} from "express";
import {
  authentication,
  authorization,
} from "../../middleWare/auth.middleware.js";
import {endPoint} from "./post.authorization.js";
import commentController from "../Comment/comment.controller.js";
import {uploadCloudFile} from "../../utilis/multer/cloud.multer.js";
import {fileValidations} from "../../utilis/multer/cloud.multer.js";
import * as validators from "./post.validation.js";
import {
  archivePost,
  createPost,
  freezePost,
  getPosts,
  likePost,
  undoPost,
  unfreezePost,
  updatePost,
} from "./service/post.service.js";
import {validation} from "../../middleWare/validation.js";
const router = Router();
router.use("/:postId/comment", commentController);
router.post(
  "/createPost",
  authentication(),
  authorization(endPoint.createPost),
  uploadCloudFile(fileValidations.image).array("attachment", 3),
  validation(validators.CreatePost),
  createPost
);
router.patch(
  "/updatePost/:postId",
  authentication(),
  authorization(endPoint.createPost),
  uploadCloudFile(fileValidations.image).array("attachment", 3),
  validation(validators.UpdatePost),
  updatePost
);
router.delete(
  "/freezePost/:postId",
  authentication(),
  authorization(endPoint.freezePost),
  validation(validators.FreezePost),
  freezePost
);
router.patch(
  "/unfreezePost/:postId",
  authentication(),
  authorization(endPoint.freezePost),
  validation(validators.unFreezePost),
  unfreezePost
);
router.patch(
  "/likePost/:postId",
  authentication(),
  authorization(endPoint.likePost),
  validation(validators.LikePost),
  likePost
);
router.get("/getPosts", authentication(), getPosts);
router.patch(
  "/archivePost/:postId",
  authentication(),
  authorization(endPoint.archivepost),
  uploadCloudFile(fileValidations.image).array("attachment", 3),
  validation(validators.ArchivePost),
  archivePost
);
router.delete(
  "/undoPost/:postId",
  authentication(),
  authorization(endPoint.undopost),
  validation(validators.UndoPost),
  undoPost
);
export default router;
