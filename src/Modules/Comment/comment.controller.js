import { Router } from "express";
import { authentication, authorization } from "../../middleWare/auth.middleware.js";
import { createComment, freezeComment, likeComment, unfreezeComment, updateComment } from "./service/comment.service.js";
import { fileValidations } from "../../utilis/multer/local.multer.js";
import * as validators from './comment.validation.js'
import { validation } from "../../middleWare/validation.js";
import { endPoint } from "../Comment/comment.authorization.js";
import { uploadCloudFile } from "../../utilis/multer/cloud.multer.js";
const router = Router({
    mergeParams: true
})
router.post('/create/:commentId?', authentication(),
    uploadCloudFile(fileValidations.image).array('attachment', 3),
    validation(validators.CreateComment), authorization(endPoint.create), createComment)

router.patch('/update/:commentId', authentication(),
    uploadCloudFile(fileValidations.image).array('attachment', 3),
    validation(validators.UpdateComment), authorization(endPoint.update), updateComment)

router.delete('/freeze/:commentId', authentication(),
    validation(validators.UnFreezeComment), authorization(endPoint.Unfreeze), freezeComment)


router.patch('/unfreeze/:commentId', authentication(),
    validation(validators.UnFreezeComment), authorization(endPoint.Unfreeze), unfreezeComment)

router.patch('/like/:commentId', authentication(),
    uploadCloudFile(fileValidations.image).array('attachment', 3),
    validation(validators.LikeComment), authorization(endPoint.like), likeComment)

export default router;