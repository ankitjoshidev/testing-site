const Sequelize = require('sequelize');

const connection = require('./connection');
const database = new Sequelize({
  dialect: connection.development.dialect,
  storage: connection.development.storage,
});

module.exports = database;
