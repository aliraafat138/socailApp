export const asyncHandler = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(error => {
            return next((error))
        })
    }
}

export const globalErrorHandling = (error, req, res, next) => {
    if (process.env.MOOD === 'DEV') {
        return res.status(error.status || 500).json({ error: error, msg: error.message, stack: error.stack })
    }
    return res.status(error.status || 500).json({ error: error, msg: error.message })
}