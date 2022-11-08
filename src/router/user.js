const express = require("express");
const router = express.Router();
const { userController } = require("../controller");
const { userAccess, auth } = require("../middleware");
const {valid, userValidation} = require("../validation")

router.post("/", userValidation.signUpValidation, valid.validate, userController.addUser);

router.delete(
  "/delete/:id",
  auth.verifyToken, 
  userAccess.verifyUserAccess,
  userController.deleteUserByAdmin
);

router.delete("/deleteYourId", auth.verifyToken, userController.deleteById);

router.get(
  "/",
  userAccess.verifyUserAccess,
  userController.userDetail
);

router.get("/detail", auth.verifyToken, userController.getUserById);

router.post("/addAdmin", auth.verifyToken, userValidation.signUpValidation, valid.validate, userController.addAdmin);

router.put("/forgetPassword", auth.verifyToken, userController.forgetPassword)

router.put("/", auth.verifyToken, userController.updateDetail);

module.exports = router;
