import { generalFields } from "../../middleWare/validation.js";
import Joi from "joi";
export const CreateComment = Joi.object().keys({
    postId: generalFields.id.required(),
    commentId: generalFields.id,
    content: Joi.string().min(2).max(5000).trim(),
    file: Joi.array().items(generalFields.file)
}).or('content', 'file')

export const UpdateComment = Joi.object().keys({
    postId: generalFields.id.required(),
    commentId: generalFields.id.required(),
    content: Joi.string().min(2).max(5000).trim(),
    file: Joi.array().items(generalFields.file)
}).or('content', 'file')

export const FreezeComment = Joi.object().keys({
    postId: generalFields.id.required(),
    commentId: generalFields.id.required()

}).required()

export const UnFreezeComment = Joi.object().keys({
    postId: generalFields.id.required(),
    commentId: generalFields.id.required()

}).required()


export const LikeComment = Joi.object().keys({
    postId: generalFields.id.required(),
    commentId: generalFields.id.required(),
    action: Joi.string().valid('like', 'unlike').required()

}).required()