const Sequelize = require('sequelize');
const sequelize = require('../../config/database');

const Loan = sequelize.define('loan', {
  customer_id: Sequelize.INTEGER,
  loan_id: Sequelize.INTEGER,
  loan_amount: Sequelize.FLOAT,
  tenure: Sequelize.INTEGER,
  interest_rate: Sequelize.FLOAT,
  monthly_repayment: Sequelize.FLOAT,
  emis_paid_on_time: Sequelize.INTEGER,
  start_date: Sequelize.DATE,
  end_date: Sequelize.DATE
});

module.exports = Loan;
