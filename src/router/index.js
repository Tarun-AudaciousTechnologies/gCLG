const express = require("express");
const router = express.Router();
const { auth } = require("../middleware");

router.use("/complaints", auth.verifyToken, require("./complaint"));

router.use("/auth", require("./auth"));

router.use("/user", require("./user"));

module.exports = router;
