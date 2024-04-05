const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const { validateRegisterRequestBody, validateRequest } = require('./validationMiddleware');

// Route for registering a new customer
router.post('/register', validateRegisterRequestBody, validateRequest, customerController.register);

module.exports = router;
