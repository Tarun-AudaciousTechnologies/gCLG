const express = require('express');
const router = express.Router()
const { faqValidRules, valid } = require('../validation')
const { faqController } = require('../controller')

router.post(
    '/',
    faqValidRules.validRule,
    valid.validate,
    faqController.addFaq
)
router.get(
    '/',
    faqController.showFaq
)
router.put(
    '/:id',
    faqController.updateFaq
)
router.delete(
    '/:id',
    faqController.deleteFaq
)
router.put(
    '/status/:id',
    faqController.updateStatus
)

module.exports = router;
