import Joi from "joi";
import { generalFields } from "../../middleWare/validation.js";

export const CreatePost = Joi.object().keys({
    content: Joi.string().min(2).max(5000).trim(),
    file: Joi.array().items(generalFields.file)
}).or('content', 'file')

export const UpdatePost = Joi.object().keys({
    postId: generalFields.id,
    content: Joi.string().min(2).max(5000).trim(),
    file: Joi.array().items(generalFields.file)
}).or('content', 'file')

export const FreezePost = Joi.object().keys({
    postId: generalFields.id,

}).required()

export const unFreezePost = Joi.object().keys({
    postId: generalFields.id,

}).required()

export const LikePost = Joi.object().keys({
    action: Joi.string().valid('like', 'unlike'),
    postId: generalFields.id,

}).required()

export const ArchivePost = Joi.object().keys({
    postId: generalFields.id.required(),
    content: Joi.string().min(2).max(5000).trim(),
    file: Joi.array().items(generalFields.file)
}).or('content', 'file')

export const UndoPost = Joi.object().keys({
    postId: generalFields.id.required(),

}).required()