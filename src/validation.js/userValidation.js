const {userModel} = require("../models");
const {body} = require("express-validator");

const userValidationRule = () => {
    return [
        body("name").isAlpha('en-US', {ignore: ' '}).isLength({max: 20}),
        body("age").notEmpty().withMessage("Age is required"),
        body("email")
    ]
}