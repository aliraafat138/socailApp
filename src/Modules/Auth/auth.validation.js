import Joi from "joi";
import { generalFields } from "../../middleWare/validation.js";

export const Signup = Joi.object().keys({
    userName: generalFields.userName.required(),
    email: generalFields.email.required(),
    password: generalFields.password.required(),
    confirmPassword: generalFields.confirmPassword.required()
}).required()
export const ConfirmEmail = Joi.object().keys({
    email: generalFields.email.required(),
    code: generalFields.code.required(),
}).required()

export const Login = Joi.object().keys({
    email: generalFields.email.required(),
    password: generalFields.password.required()

}).required()
export const ForgetPassword = Joi.object().keys({
    email: generalFields.email.required()

}).required()
export const ResetPassword = Joi.object().keys({
    email: generalFields.email.required(),
    code: generalFields.code.required(),
    password: generalFields.password.required(),
    confirmPassword: generalFields.confirmPassword.valid(Joi.ref('password')).required()

}).required()