import { asyncHandler } from "../../../utilis/error/error.js";
import * as dbService from '../../../DB/db.service.js';
import { postModel } from "../../../DB/models/Post.model.js";
import { cloud } from "../../../utilis/multer/cloudinary.js";
import { commentModel } from "../../../DB/models/Comment.model.js";
import { successResponse } from "../../../utilis/successResponse/response.js";
import { roleTypes } from "../../../DB/models/User.model.js";
export const createComment = asyncHandler(async(req, res, next) => {
    const { postId, commentId } = req.params;
    const { content } = req.body;

    if (commentId && !await dbService.findOne({ model: commentModel, filter: { _id: commentId, isDeleted: { $exists: false } } })) {
        return next(new Error("Invalid Parent Comment", { cause: 404 }))
    }
    const post = await dbService.findOne({ model: postModel, filter: { _id: postId, isDeleted: { $exists: false } } })
    if (!post) {
        return next(new Error("Post Not Found ", { cause: 404 }));
    }


    if (req.files && req.files.length) {
        let attachments = []
        for (const file of req.files) {
            const { secure_url, public_id } = await cloud.uploader.upload(file.path, { folder: `${process.env.APP_NAME}/user/${post.createdBy}/post/${postId}/comment` })
            attachments.push({ secure_url, public_id })
            req.body.attachments = attachments
        }
    }
    const comment = await dbService.create({
        model: commentModel,
        data: {
            content,
            ...req.body,
            commentId,
            postId,
            createdBy: req.user._id
        }

    })
    return successResponse({ res, status: 201, data: { comment } })
})

export const updateComment = asyncHandler(async(req, res, next) => {
    const { postId, commentId } = req.params;
    const post = await dbService.findOne({ model: postModel, filter: { _id: postId, isDeleted: { $exists: false } } })
    if (!post) {
        return next(new Error("Post Not Found ", { cause: 404 }));
    }
    const comment = await dbService.findOne({
        model: commentModel,
        filter: { _id: commentId, postId, createdBy: req.user._id, isDeleted: { $exists: false } },
        populate: [{
            path: "postId"
        }]
    })
    if (!comment || comment.postId.isDeleted) {
        return next(new Error("Comment Not Found", { cause: 404 }))
    }
    if (req.files || req.files.length) {
        let attachments = [];
        for (const file of req.files) {
            const { secure_url, public_id } = await cloud.uploader.upload(file.path, { folder: `${process.env.APP_NAME}/user/${post.createdBy}/post/${postId}/comment` })
            attachments.push({ secure_url, public_id })
            req.body.attachments = attachments
        }
    }
    const updatedComment = await dbService.findOneAndUpdate({
        model: commentModel,
        filter: {
            createdBy: req.user._id,
            isDeleted: { $exists: false },
            _id: commentId,
            postId,

        },
        data: {
            ...req.body
        }
    })
    return successResponse({ res, data: { updatedComment } })
})

export const freezeComment = asyncHandler(async(req, res, next) => {
    const { postId, commentId } = req.params;
    const comment = await dbService.findOne({
        model: commentModel,
        filter: {
            _id: commentId,
            postId,
            isDeleted: { $exists: false },
            createdBy: req.user._id
        }
    })
    if (!comment && (comment.createdBy.toString() !== req.user._id.toString() &&
            comment.postId.createdBy.toString() !== req.user._id.toString() &&
            req.user.role !== roleTypes.Admin)) {
        return next(new Error('Invalid comment or You Are Not Authorized', { cause: 403 }))
    }

    const updatedComment = await dbService.findOneAndUpdate({
        model: commentModel,
        filter: {
            _id: commentId,
            createdBy: req.user._id,
            isDeleted: { $exists: false }
        },
        data: {
            isDeleted: Date.now(),
            deletedBy: req.user._id
        }
    })
    return successResponse({ res, data: { updatedComment } })
})

export const unfreezeComment = asyncHandler(async(req, res, next) => {
    const { postId, commentId } = req.params;


    const updatedComment = await dbService.findOneAndUpdate({
        model: commentModel,
        filter: {
            _id: commentId,
            postId,
            createdBy: req.user._id,
            isDeleted: { $exists: false }
        },
        data: {
            $unset: {
                isDeleted: 0,
                deletedBy: 0
            },
            updatedBy: req.user._id
        }
    })
    return successResponse({ res, data: { updatedComment } })
})

export const likeComment = asyncHandler(async(req, res, next) => {
    const { postId, commentId } = req.params;
    const data = req.query.action == 'like' ? { $addToSet: { likes: req.user._id } } : { $pull: { likes: req.user._id } }
    const comment = await dbService.findOneAndUpdate({
        model: commentModel,
        filter: {
            _id: commentId,
            postId,
            createdBy: req.user._id,
            isDeleted: { $exists: false }
        },
        data
    })
    return successResponse({ res, data: { comment } })
})