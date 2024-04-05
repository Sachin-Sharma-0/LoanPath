const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loanController');

// Route for viewing statement of a particular loan
router.get('/view-statement/:customer_id/:loan_id', loanController.viewStatement);

module.exports = router;
