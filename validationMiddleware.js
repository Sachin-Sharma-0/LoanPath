// validationMiddleware.js

const { validationResult, body } = require('express-validator');

const validateRegisterRequestBody = [
    body('first_name').notEmpty().isString().withMessage('First name is required and must be a string.'),
    body('last_name').notEmpty().isString().withMessage('Last name is required and must be a string.'),
    body('age').isInt({ min: 18, max: 100 }).withMessage('Age must be an integer between 18 and 100.'),
    body('monthly_income').isNumeric().withMessage('Monthly income must be a number.'),
    body('phone_number').isMobilePhone().withMessage('Invalid phone number format.'),
];

const validateCheckEligibilityRequestBody = [
    body('customer_id').isInt(),
    body('loan_amount').isNumeric(),
    body('interest_rate').isNumeric(),
    body('tenure').isInt(),
];

const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = { validateRegisterRequestBody, validateCheckEligibilityRequestBody, validateRequest };
