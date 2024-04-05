const Customer = require('../models/customer');

const customerController = {
  register: async (req, res) => {
    try {
      const { first_name, last_name, age, monthly_income, phone_number } = req.body;

      const approved_limit = Math.round(36 * monthly_income / 100000) * 100000;

      // Create a new customer record
      const customer = await Customer.create({
        first_name,
        last_name,
        age,
        monthly_income,
        phone_number,
        approved_limit,
        current_debt: 0 
      });

      // Send response
      res.status(201).json({
        customer_id: customer.id,
        name: `${customer.first_name} ${customer.last_name}`,
        age: customer.age,
        monthly_income: customer.monthly_income,
        approved_limit: customer.approved_limit,
        phone_number: customer.phone_number
      });
    } catch (error) {
      console.error('Error registering customer:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

module.exports = customerController;
