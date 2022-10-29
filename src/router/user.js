const express = require("express");
const router = express.Router();
const { userController } = require("../controller");
const { userAccess, auth } = require("../middleware");

router.post("/", userController.addUser);

router.delete(
  "/",
  auth.verifyToken,
  userAccess.verifyUserAccess,
  userController.deleteUserByAdmin
);

router.delete("/selfDelete", auth.verifyToken, userController.deleteUser);

router.get(
  "/",
  auth.verifyToken,
  userAccess.verifyUserAccess,
  userController.userDetail
);

router.get("/detail", auth.verifyToken, userController.getUserById);

module.exports = router;
