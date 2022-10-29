/**
 * 
 * @param {*} res 
 * @param {*} statusCode 
 * @param {*} message 
 * @param {*} result 
 */
const successHandler = (res, statusCode, message, result) => {
    res.status(statusCode).json({message, result});
};

const errorHandler = (res, statusCode, message, error) => {
    res.status(statusCode).json({message, error});
}

module.exports = {
    successHandler,
    errorHandler
}
