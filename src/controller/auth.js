const {userModel} = require("../models");
const  jwt = require("jsonwebtoken");
const {allConstants, allStatus} = require("../constant")
const {errorHandler, successHandler} = require("../helper/responseHandler")
const bcrypt = require("bcrypt")

const generateToken = (user) => {
    return jwt.sign({
        data: user
    }, process.env.SECRET_KEY, {expiresIn: process.env.EXPIRE_IN});
};

const login = async (req, res) => {
    try {
        const data = await userModel.findOne({email: req.body.email});
        if (! data) {
            return res.status(404).json({message: "Email not found"});
        } 
        const checkPassword = await bcrypt.compare(req.body.password, data.password)
        if (! checkPassword) {
            return errorHandler(res, allStatus.NOT_FOUND, allConstants.LOGIN_PASSWORD_ERR);
        }
        return successHandler(res, allStatus.OK, allConstants.LOGIN_SUCCESS_MSG, {
            token: generateToken(data),
            data
        });
    } catch (error) {
        console.log(error,"sofsjios");
        return errorHandler(res, allStatus.INTERNAL_SERVER_ERROR, allConstants.ERR_MSG);
    };
};

module.exports = {login}