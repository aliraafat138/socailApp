export const successResponse = ({ res, data = {}, status = 200, message = "Done" } = {}) => {
    return res.status(status).json({ data, message })
}