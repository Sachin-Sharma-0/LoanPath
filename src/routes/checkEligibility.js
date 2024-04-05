const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loanController');
const { validateCheckEligibilityRequestBody, validateRequest } = require('./validationMiddleware');

// Route for checking loan eligibility
router.post('/check-eligibility', validateCheckEligibilityRequestBody, validateRequest, loanController.checkEligibility);

module.exports = router;
