const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loanController');

// Route for making payment towards an EMI
router.post('/make-payment/:customer_id/:loan_id', loanController.makePayment);

module.exports = router;
