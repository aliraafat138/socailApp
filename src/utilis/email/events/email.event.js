import { EventEmitter } from 'events';
import { customAlphabet } from "nanoid";
import { generateHash } from "../../security/hash.js";
import { userModel } from "../../../DB/models/User.model.js";
import { confirmEmailTemplate } from "../template/confirmEmailTemplate.js";
import { sendEmail } from "../send.email.js";
export const emailEvent = new EventEmitter();
export const subjectTypes = { confirmEmail: 'confirm-email', resetPassword: 'reset-password', updateEmail: 'updateEmail' }
export const sendCode = async({ data = {}, subject = subjectTypes.confirmEmail } = {}) => {
    const { id, email } = data
    const OTP = customAlphabet("0123456789", 4)()
    const hashOTP = generateHash({ plainText: OTP })
    const html = confirmEmailTemplate({ code: OTP })
    let updateData = {}
    switch (subject) {
        case subjectTypes.confirmEmail:
            updateData = { confirmEmailOTP: hashOTP }
            break;
        case subjectTypes.resetPassword:
            updateData = { resetPasswordOTP: hashOTP }
            break;
        case subjectTypes.updateEmail:
            updateData = { tempEmailOTP: hashOTP }
            break;
        default:
            break;
    }
    await userModel.updateOne({ _id: id }, updateData)
    await sendEmail({ to: email, subject, html })
}
emailEvent.on("SendConfirmEmail", async(data) => {
    await sendCode({ data })
})

emailEvent.on('ForgetPassword', async(data) => {
    await sendCode({ data, subject: subjectTypes.resetPassword })
})

emailEvent.on('updateEmail', async(data) => {
    await sendCode({ data, subject: subjectTypes.updateEmail })
})