import { asyncHandler } from "../utilis/error/error.js";
import { decodedToken } from "../utilis/security/token.js";

export const authentication = () => {
    return asyncHandler(async(req, res, next) => {
        const { authorization } = req.headers;
        req.user = await decodedToken({ authorization, next })
        return next()
    })

}

export const authorization = (accessRoles = []) => {
    return asyncHandler(async(req, res, next) => {
        if (!accessRoles.includes(req.user.role)) {
            return next(new Error("You Are Not Authorized", { cause: 403 }));
        }
        return next()
    })
}