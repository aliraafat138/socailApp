import Joi from "joi";
import { Types } from "mongoose";
import { genderTypes } from "../DB/models/User.model.js";

export const validateObjectId = (value, helper) => {
    return Types.ObjectId.isValid(value) ? value : helper.message("Invalid ID")
}
const fileOBJ = {
    fieldname: Joi.string().valid('attachment'),
    originalname: Joi.string(),
    encoding: Joi.string(),
    mimetype: Joi.string(),
    filePath: Joi.string(),
    destination: Joi.string(),
    filename: Joi.string(),
    path: Joi.string(),
    size: Joi.number()
}


export const generalFields = {
    userName: Joi.string().min(2).max(50),
    email: Joi.string().email({ minDomainSegments: 2, maxDomainSegments: 3, tlds: { allow: ['com', 'net'] } }),
    password: Joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)),
    confirmPassword: Joi.string(),
    phone: Joi.string().pattern(new RegExp(/^(002|\+2)?01[0125][0-9]{8}$/)),
    age: Joi.string().min(18).max(100),
    id: Joi.string().custom(validateObjectId),
    code: Joi.string().pattern(new RegExp(/^\d{4}$/)),
    gender: Joi.string().valid(...Object.values(genderTypes)),
    DOB: Joi.date().less('now'),
    address: Joi.string(),
    fileOBJ,
    file: Joi.object().keys(fileOBJ)
}

export const validation = (schema) => {
    return (req, res, next) => {
        const inputData = {...req.params, ...req.body, ...req.query }
        if (req.file || req.files && req.files.length) {
            inputData.file = req.file || req.files
        }
        const validationResult = schema.validate(inputData, { abortEarly: false })
        if (validationResult.error) {
            return res.status(400).json({ message: "Validation Error", details: validationResult.error.details })
        }
        return next()
    }

}