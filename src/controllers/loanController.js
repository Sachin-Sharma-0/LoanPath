const Loan = require('../models/loan');
const Customer = require('../models/customer');

function calculateCreditScore(customer) {
  let creditScore = 0;

  if (customer.past_loans.length === 0) {
      creditScore += 50;
  }

  if (customer.past_loans.every(loan => loan.emis_paid_on_time === loan.tenure)) {
      creditScore += 20;
  }

  if (customer.monthly_salary > 50000) {
      creditScore += 10;
  }

  if (customer.age < 25) {
      creditScore -= 10;
  }

  creditScore = Math.max(0, Math.min(100, creditScore));

  return creditScore;
}


function determineLoanApproval(creditScore, loanAmount, interestRate, monthlySalary, currentEMIs) {
  
  // If credit score <= 10, don't approve any loans
  if (creditScore <= 10) {
      return { canApprove: false, interestRate, correctedInterestRate: null, monthly_installment: null };
  }

  const totalCurrentEMIs = currentEMIs.reduce((total, emi) => total + emi, 0);

  // If sum of all current EMIs > 50% of monthly salary, don’t approve any loans
  if (totalCurrentEMIs > monthlySalary * 0.5) {
      return { canApprove: false, interestRate, correctedInterestRate: null, monthly_installment: null };
  }

  // Determine interest rate based on credit score
  let correctedInterestRate = interestRate; // Default corrected interest rate is the same as the requested interest rate

  if (creditScore > 50) {
      // If credit score > 50, approve loan
      return { canApprove: true, interestRate, correctedInterestRate, monthly_installment: calculateMonthlyRepayment(loanAmount, interestRate, loanAmount) };
  } else if (creditScore > 30) {
      // If 50 > credit score > 30, approve loans with interest rate > 12%
      if (interestRate <= 12) {
          correctedInterestRate = 12; // Correct the interest rate to 12%
      }
  } else if (creditScore > 10) {
      // If 30> credit score > 10, approve loans with interest rate > 16%
      if (interestRate <= 16) {
          correctedInterestRate = 16; // Correct the interest rate to 16%
      }
  }

  return { canApprove: true, interestRate, correctedInterestRate, monthly_installment: calculateMonthlyRepayment(loanAmount, correctedInterestRate, loanAmount) };
}


function calculateMonthlyRepayment(loanAmount, interestRate, tenure) {
  const monthlyInterestRate = interestRate / 12 / 100;

  const monthlyRepayment = (loanAmount * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -tenure));

  return parseFloat(monthlyRepayment.toFixed(2));
}

function calculateEndDate(startDate, tenure) {

  const endDate = new Date(startDate);

  endDate.setMonth(endDate.getMonth() + tenure);

  return endDate;
}


const loanController = {
  checkEligibility: async (req, res) => {
    try {
      const { customer_id, loan_amount, interest_rate, tenure } = req.body;
      
            const customer = await Customer.findByPk(customer_id);

            if (!customer) {
                return res.status(404).json({ error: 'Customer not found' });
            }

            const currentEMIs = [];

            const creditScore = calculateCreditScore(customer);

            const { canApprove, interestRate: approvedInterestRate, correctedInterestRate, monthly_installment } = determineLoanApproval(creditScore, loan_amount, interest_rate, customer.monthly_salary, currentEMIs);

            res.json({ customer_id, canApprove, interestRate: approvedInterestRate, correctedInterestRate, tenure, monthly_installment });
    } catch (error) {
      console.error('Error checking loan eligibility:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  createLoan: async (req, res) => {
    try {
      const { customer_id, loan_amount, interest_rate, tenure } = req.body;

      const customer = await Customer.findByPk(customer_id);

      if (!customer) {
        return res.status(404).json({ error: 'Customer not found' });
      }

      const currentEMIs = [];

      const creditScore = calculateCreditScore(customer);

      const { canApprove, interestRate: approvedInterestRate, correctedInterestRate, monthly_installment } = determineLoanApproval(creditScore, loan_amount, interest_rate, customer.monthly_salary, currentEMIs);

      if (!canApprove) {
          return res.json({ loan_id: null, customer_id, loan_approved: false, message: 'Loan cannot be approved' });
      }

      const loan = await Loan.create({
          customer_id,
          loan_amount,
          interest_rate: correctedInterestRate || approvedInterestRate,
          tenure,
          monthly_repayment: monthly_installment,
          emis_paid_on_time: 0,
          start_date: new Date(),
          end_date: calculateEndDate(new Date(), tenure) 
      });

      res.json({ loan_id: loan.id, customer_id, loan_approved: true, monthly_installment });
    } catch (error) {
      console.error('Error processing loan:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  viewLoan: async (req, res) => {
    try {
      const { loan_id } = req.params;

      const loan = await Loan.findByPk(loan_id, { include: [{ model: Customer }] });

      if (!loan) {
        return res.status(404).json({ error: 'Loan not found' });
      }

      res.json({
        loan_id: loan.id,
        customer: loan.customer,
        loan_amount: loan.loan_amount,
        interest_rate: loan.interest_rate,
        monthly_installment: loan.monthly_repayment,
        tenure: loan.tenure
      });
    } catch (error) {
      console.error('Error viewing loan details:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  makePayment: async (req, res) => {
    try {
        const { customer_id, loan_id } = req.params;
        const { amount } = req.body;

        const loan = await Loan.findByPk(loan_id);

        if (!loan) {
            return res.status(404).json({ error: 'Loan not found' });
        }

        const remainingEMIs = loan.tenure - loan.emis_paid_on_time;

        const totalEMIAmount = loan.monthly_repayment * remainingEMIs;

        if (amount < totalEMIAmount) {
            return res.status(400).json({ error: 'Insufficient amount to cover remaining EMIs' });
        }

        const updatedLoan = await Loan.update({
            emis_paid_on_time: loan.tenure,
            end_date: calculateEndDate(new Date(), loan.tenure)
        }, {
            where: {
                id: loan_id
            }
        });

        res.json({ message: 'Payment made successfully' });
    } catch (error) {
        console.error('Error making payment:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
},
  viewStatement: async (req, res) => {
    try {
      const { customer_id, loan_id } = req.params;

      const loan = await Loan.findOne({ where: { customer_id, id: loan_id } });

      if (!loan) {
        return res.status(404).json({ error: 'Loan not found' });
      }

      const repayments = await Repayment.findAll({ where: { loan_id } });

        const amountPaid = repayments.reduce((total, repayment) => total + repayment.amount_paid, 0);

        const repaymentsLeft = loan.tenure - repayments.length;

        res.json({
            customer_id: loan.customer_id,
            loan_id: loan.id,
            principal: loan.loan_amount,
            interest_rate: loan.interest_rate,
            amount_paid: amountPaid,
            monthly_installment: loan.monthly_repayment,
            repayments_left: repaymentsLeft
        });
    } catch (error) {
      console.error('Error viewing statement:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

module.exports = loanController;
