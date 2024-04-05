const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loanController');

// Route for viewing loan details
router.get('/view-loan/:loan_id', loanController.viewLoan);

module.exports = router;
