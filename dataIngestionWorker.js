// In dataIngestionWorker.js

const excelParser = require('./utils/excelParser');
const Customer = require('./models/customer');
const Loan = require('./models/loan');

async function ingestData() {
    try {
        const customerData = excelParser('customer_data.xlsx');

        await Customer.bulkCreate(customerData);

        const loanData = excelParser('loan_data.xlsx');

        await Loan.bulkCreate(loanData);

        console.log('Data ingestion completed successfully');
    } catch (error) {
        console.error('Error ingesting data:', error);
    }
}

ingestData();
