const { check } = require("express-validator");
const { userModel } = require("../models");
const signUpValidationRule = () => {
  return [
    check("name")
      .trim()
      .notEmpty()
      .withMessage("name is required")
      .matches(/^[a-zA-Z ]*$/)
      .withMessage("Only Characters with white space are allowed"),
    check("email")
      .notEmpty()
      .withMessage("email is required")
      .normalizeEmail()
      .isEmail()
      .withMessage("must be a valid email")
      .custom(async (value) => {
        const data = await userModel.findOne({ email: value });
        if (data) {
          return Promise.reject("Email is already exist");
        }
      }),
    check("age").notEmpty().withMessage("age is required"),
    check("password")
      .trim()
      .notEmpty()
      .withMessage("Password required")
      .isLength({ min: 5 })
      .withMessage("password must be minimum 5 length")
      .matches(/(?=.*?[A-Z])/)
      .withMessage("At least one Uppercase")
      .matches(/(?=.*?[a-z])/)
      .withMessage("At least one Lowercase")
      .matches(/(?=.*?[0-9])/)
      .withMessage("At least one Number")
      .matches(/(?=.*?[#?!@$%^&*-])/)
      .withMessage("At least one special character")
      .not()
      .matches(/^$|\s+/)
      .withMessage("White space not allowed"),
    check("phone").notEmpty().withMessage("phone is required"),
    check("city").notEmpty().withMessage("city is required"),
  ];
};

const signUpValidation = signUpValidationRule();
module.exports = { signUpValidation };
