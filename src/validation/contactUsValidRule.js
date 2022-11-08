const {check} = require("express-validator");

const contactUsValidRule = function () {
    return [
        check('firstName').isAlpha('en-US', {ignore: ' '}),
        check('lastName').isAlpha('en-US', {ignore: ' '}),
        check('email'),
        check('phone').isLength(
            {max: 15, min: 10}
        ),
        check('message')
    ]
};

const validRule = contactUsValidRule()

module.exports = {
    validRule
};
