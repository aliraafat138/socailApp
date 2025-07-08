import Joi from "joi";
import { generalFields } from "../../middleWare/validation.js";

export const ShareProfile = Joi.object().keys({
    profileId: generalFields.id.required()
}).required()

export const UpdateEmail = Joi.object().keys({
    email: generalFields.email.required()
}).required()

export const ResetEmail = Joi.object().keys({
    oldCode: generalFields.code.required(),
    newCode: generalFields.code.required()
}).required()

export const UpdatePassword = Joi.object().keys({
    oldPassword: generalFields.password.not(Joi.ref('password')).required(),
    Password: generalFields.password.required(),
    confirmPassword: generalFields.confirmPassword.valid(Joi.ref('Password')).required()
}).required()

export const UpdateProfile = Joi.object().keys({
    userName: generalFields.userName.required(),
    phone: generalFields.phone.required(),
    DOB: generalFields.DOB.required()
}).required()

export const ProfileImage = Joi.object().keys({
    file: generalFields.file.required()
}).required()