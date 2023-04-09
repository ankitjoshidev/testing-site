const Sequelize = require('sequelize');

const sequelize = require('../config/database');

const normalizedPath = require('path').join(__dirname, 'models');

const models = {};
require('fs').readdirSync(normalizedPath).forEach((file) => {
  if (file.indexOf('.js') >= 0) {
    models[file.replace('.js', '')] = require(`${normalizedPath}/${file}`)(sequelize, Sequelize);
  }
});
module.exports = models;
