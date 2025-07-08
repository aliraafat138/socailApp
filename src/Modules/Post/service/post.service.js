import { asyncHandler } from "../../../utilis/error/error.js";
import { cloud } from "../../../utilis/multer/cloudinary.js";
import * as dbService from '../../../DB/db.service.js'
import { postModel } from "../../../DB/models/Post.model.js";
import { successResponse } from "../../../utilis/successResponse/response.js";
import { roleTypes } from "../../../DB/models/User.model.js";
import { pagination } from "../../../utilis/pagination.js";


export const createPost = asyncHandler(async(req, res, next) => {
    const { content } = req.body;
    let attachments = [];
    for (const file of req.files) {
        const { secure_url, public_id } = await cloud.uploader.upload(file.path, { folder: `${process.env.APP_NAME}/Post/${req.user._id}/profile` })
        attachments.push({ secure_url, public_id })
    }

    const post = await dbService.create({
        model: postModel,
        data: {
            createdBy: req.user._id,
            content,
            attachments
        }
    })
    return successResponse({ res, status: 201, data: { post } })
})


export const updatePost = asyncHandler(async(req, res, next) => {
    if (req.files.length) {
        let attachments = []
        for (const file of req.files) {
            const { secure_url, public_id } = await cloud.uploader.upload(file.path, { folder: `${process.env.APP_NAME}/Post/${req.user._id}/profile` })
            attachments.push({ secure_url, public_id })
        }
        req.body.attachments = attachments;
    }
    const post = await dbService.findOneAndUpdate({
        model: postModel,
        filter: {
            _id: req.params.postId,
            isDeleted: { $exists: false },
            createdBy: req.user._id
        },
        data: {...req.body, updatedBy: req.user._id },
        options: { new: true }
    })
    return successResponse({ res, data: { post } })
})

export const freezePost = asyncHandler(async(req, res, next) => {
    const owner = req.user.role === roleTypes.Admin ? {} : { createdBy: req.user._id }
    const post = await dbService.findOneAndUpdate({
        model: postModel,
        filter: { _id: req.params.postId, isDeleted: { $exists: false }, ...owner },
        data: {
            updatedBy: req.user._id,
            deletedBy: req.user._id,
            isDeleted: true
        },
        options: { new: true }
    })
    return successResponse({ res, data: { post } })
})
export const unfreezePost = asyncHandler(async(req, res, next) => {
    const post = await dbService.findOneAndUpdate({
        model: postModel,
        filter: { _id: req.params.postId, isDeleted: { $exists: true }, deletedBy: req.user._id },
        data: {
            $unset: { deletedBy: 0, isDeleted: 0 },

            updatedBy: req.user._id
        },
        options: { new: true }
    })
    return successResponse({ res, data: { post } })
})

export const likePost = asyncHandler(async(req, res, next) => {
    const data = req.query.action === 'unlike' ? { $pull: { likes: req.user._id } } : { $addToSet: { likes: req.user._id } }
    const post = await dbService.findOneAndUpdate({
        model: postModel,
        filter: { _id: req.params.postId, isDeleted: { $exists: false } },
        data,
        options: { new: true }
    })
    return successResponse({ res, data: { post } })
})

export const getPosts = asyncHandler(async(req, res, next) => {

    let { page, size } = req.query;

    const data = await pagination({
        page,
        size,
        model: postModel,
        filter: { isDeleted: { $exists: false }, createdBy: req.user._id },
        populate: {
            path: 'comments',
            match: { isDeleted: { $exists: false }, commentId: { $exists: false } },
            populate: [{
                path: 'reply',
                match: { isDeleted: { $exists: false } }

            }]
        },

    })
    return successResponse({ res, data })
})

export const archivePost = asyncHandler(async(req, res, next) => {
    const { postId } = req.params;
    const post = await dbService.findOne({
        model: postModel,
        filter: { _id: postId, isDeleted: { $exists: false }, createdBy: req.user._id }

    })
    if (!post) {
        return next(new Error('Post Not Found', { cause: 404 }));
    }
    const currentTime = Date.now();
    const CreatedAtTime = post.createdAt.getTime();
    const ArchiveTime = (currentTime - CreatedAtTime);

    if (ArchiveTime < 24 * 60 * 60 * 1000) {
        return next(new Error('You Cant Archive Post', { cause: 400 }))
    }
    const ArchivedPost = await dbService.findOneAndUpdate({
        model: postModel,
        filter: { _id: postId, isDeleted: { $exists: false }, createdBy: req.user._id },
        data: {
            isArchived: true,
            updatedBy: req.user._id
        }
    })
    return successResponse({ res, data: { ArchivedPost } })
})

export const undoPost = asyncHandler(async(req, res, next) => {
    const { postId } = req.params;
    const post = await dbService.findOne({
        model: postModel,
        filter: { _id: postId, isDeleted: { $exists: false }, createdBy: req.user._id }

    })
    if (!post) {
        return next(new Error('Post Not Found', { cause: 404 }));
    }
    const currentTime = Date.now();
    const CreatedAtTime = post.createdAt.getTime();
    const undoTime = (currentTime - CreatedAtTime);

    if (undoTime > 2 * 60 * 1000) {
        return next(new Error('You Cant Undo Post', { cause: 400 }))
    }
    const deletedPost = await dbService.DeleteOne({ model: postModel, filter: { _id: postId, createdBy: req.user._id } })

    return successResponse({ res, })
})