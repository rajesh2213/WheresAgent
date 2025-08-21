const errorHandler = (err, req, res, next) => {
    console.log(`[ERROR]: ${err}`)
    const statusCode = err.status || err.statusCode || 500
    const errMessage = err.message || 'Internal server error'

    res.status(statusCode).json({
        success: false,
        message: errMessage,
        status: statusCode
    })
}

module.exports = errorHandler