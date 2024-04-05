const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loanController');

// Route for processing a new loan
router.post('/create-loan', loanController.createLoan);

module.exports = router;
