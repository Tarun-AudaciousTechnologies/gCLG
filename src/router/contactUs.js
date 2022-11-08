const express = require("express");
const router = express.Router();
const { contactUsValidRules, valid } = require('../validation');
const { contactUsController } = require('../controller');

router.post(
    '/',
    contactUsValidRules.validRule,
    valid.validate,
    contactUsController.addToContactUs
);

router.get(
    '/',
    contactUsController.getDetail
)

router.get(
    '/:id',
    contactUsController.getDetailById
)

module.exports = router
