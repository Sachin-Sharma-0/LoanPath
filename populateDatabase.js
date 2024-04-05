const fs = require('fs');
const xlsx = require('xlsx');
const { Sequelize } = require('sequelize');
const Customer = require('./src/models/customer'); // Assuming you have defined the Customer model
const Loan = require('./src/models/loan'); // Assuming you have defined the Loan model

// Connect to database
const sequelize = new Sequelize('Credit', 'Sachin', 'Sachin200215.', {
  dialect: 'mysql',
  host: 'localhost'
});

// Read Excel files and populate database
async function populateDatabase() {
  try {
    const customerWorkbook = xlsx.readFile('./data/customer_data.xlsx');
    const customerWorksheet = customerWorkbook.Sheets[customerWorkbook.SheetNames[0]];
    const customerData = xlsx.utils.sheet_to_json(customerWorksheet);

    const loanWorkbook = xlsx.readFile('./data/loan_data.xlsx');
    const loanWorksheet = loanWorkbook.Sheets[loanWorkbook.SheetNames[0]];
    const loanData = xlsx.utils.sheet_to_json(loanWorksheet);

    await Customer.sync({ force: true });
    await Loan.sync({ force: true });

    // Insert customer data into database
    for (const row of customerData) {
      await Customer.create({
        first_name: row.first_name,
        last_name: row.last_name,
        age: row.age,
        monthly_income: row.monthly_income,
        phone_number: row.phone_number,
        approved_limit: row.approved_limit,
        current_debt: row.current_debt
      });
    }

    // Insert loan data into database
    for (const row of loanData) {
      await Loan.create({
        customer_id: row.customer_id,
        loan_id: row.loan_id,
        loan_amount: row.loan_amount,
        tenure: row.tenure,
        interest_rate: row.interest_rate,
        monthly_repayment: row.monthly_repayment,
        emis_paid_on_time: row.emis_paid_on_time,
        start_date: row.start_date,
        end_date: row.end_date
      });
    }

    console.log('Data inserted successfully!');
  } catch (error) {
    console.error('Error inserting data into database:', error);
  } finally {
    await sequelize.close();
  }
}

populateDatabase();
