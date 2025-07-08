import { Router } from "express";
import { confirmEmail, signup } from "./service/registration.service.js";
import * as validators from './auth.validation.js'
import { validation } from "../../middleWare/validation.js";
import { forgetPassword, login, refreshToken, resetPassword } from "./service/login.service.js";
const router = Router()
router.post('/signup', validation(validators.Signup), signup)
router.patch('/confirmEmail', validation(validators.ConfirmEmail), confirmEmail)
router.post('/login', validation(validators.Login), login)
router.get('/refresh-token', refreshToken)
router.patch('/forgetPassword', validation(validators.ForgetPassword), forgetPassword)
router.patch('/resetPassword', validation(validators.ResetPassword), resetPassword)
export default router