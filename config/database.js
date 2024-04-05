const Sequelize = require('sequelize');

const sequelize = new Sequelize('Credit', 'Sachin', 'Sachin200215.', {
  dialect: 'mysql', // Change this to 'postgres' if you're using PostgreSQL
  host: 'localhost',
  logging: false
});

module.exports = sequelize;
