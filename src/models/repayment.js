// In models/repayment.js

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Repayment = sequelize.define('Repayment', {
    repayment_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    customer_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    loan_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    amount_paid: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    repayment_date: {
        type: DataTypes.DATE,
        allowNull: false
    }
});

module.exports = Repayment;
