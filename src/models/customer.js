const Sequelize = require('sequelize');
const sequelize = require('../../config/database');

const Customer = sequelize.define('customer', {
  customer_id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  first_name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  last_name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  phone_number: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  monthly_salary: Sequelize.INTEGER,
  approved_limit: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  current_debt: {
    type: Sequelize.INTEGER,
    allowNull: false,
  }
});

module.exports = Customer;
