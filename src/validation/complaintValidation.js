const { body } = require('express-validator')

const complaintValidateRule = () => {
  return [
    body('area').notEmpty().withMessage('area is required'),
    body('city').notEmpty().withMessage('city is required'),
    body('complaintType').notEmpty().withMessage('complaintType is required')
  ]
}

let compalintValidation = complaintValidateRule()

module.exports = {
  compalintValidation,
}
