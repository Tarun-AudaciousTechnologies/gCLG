const jwt = require("jsonwebtoken")
const {allConstants, allStatus} = require("../constant")
const {errorHandler} = require("../helper/responseHandler")

const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization
        const {data} = await jwt.verify(token, process.env.SECRET_KEY)
        req.userData = data
        next()
    } catch (error) {
        return errorHandler(res, allStatus.BAD_REQUEST, allConstants.INVALID_TOKEN, error)
    }
}

module.exports = {
    verifyToken
}
