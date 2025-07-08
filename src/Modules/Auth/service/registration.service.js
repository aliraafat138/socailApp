import { userModel } from "../../../DB/models/User.model.js";
import { emailEvent } from "../../../utilis/email/events/email.event.js";
import { asyncHandler } from "../../../utilis/error/error.js";
import { compareHash, generateHash } from "../../../utilis/security/hash.js";
import { successResponse } from "../../../utilis/successResponse/response.js";
import * as dbService from '../../../DB/db.service.js'



export const signup = asyncHandler(async(req, res, next) => {
    const { email, userName, password } = req.body;
    if (await dbService.findOne({ model: userModel, filter: { email } })) {
        return next(new Error("Email Exist", { cause: 409 }))
    }
    const hashPassword = generateHash({ plainText: password })
    const user = await dbService.create({ model: userModel, data: { email, userName, password: hashPassword } })
    emailEvent.emit("SendConfirmEmail", { id: user._id, email })
    return successResponse({ res, data: { user }, status: 201, message: "User Created Successfully" })
})

export const confirmEmail = asyncHandler(async(req, res, next) => {
    const { email, code } = req.body
    const user = await dbService.findOne({ model: userModel, filter: { email } })
    if (!user) {
        return next(new Error("User Not Found", { cause: 404 }))
    }
    if (user.confirmEmail) {
        return next(new Error("already confirmed", { cause: 409 }))
    }
    if (!compareHash({ plainText: code, hashValue: user.confirmEmailOTP })) {
        return next(new Error("Invalid  Code", { cause: 400 }))
    }
    await dbService.UpdateOne({ model: userModel, filter: { email }, data: { confirmEmail: true, $unset: { confirmEmailOTP: 0 } } })
    return successResponse({ res, data: { user } })
})