const Sequelize = require('sequelize');

const connection = require('./connection');

let database;

// console.info('NODE_ENV:', process.env.NODE_ENV || 'development');

switch ('development') {
  case 'development':
    database = new Sequelize({
      dialect: connection.development.dialect,
      storage: connection.development.storage,
    });
    break;
  default:
    database = new Sequelize({
      dialect: connection.development.dialect,
      storage: connection.development.storage,
    });
}

module.exports = database;
