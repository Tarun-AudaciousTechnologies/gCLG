const {body} = require("express-validator");

const faqValidateRule = function () {
    return [
        body('question').notEmpty().withMessage('question require'), 
    body('answers').notEmpty().withMessage('answers require')
]
}

const validRule = faqValidateRule()

module.exports = {
    validRule
};
