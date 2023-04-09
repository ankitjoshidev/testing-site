const database = require('../config/database');
const fs = require('fs');
const sequelize = require("sequelize");
const normalizedPath = require('path').join(__dirname, '../models/models');
let models = {};
fs.readdirSync(normalizedPath).forEach((file) => {
    if (file.indexOf('.ts') >= 0) {
        models[file.replace('.ts', '')] = require(`${normalizedPath}/${file}`)(database, sequelize);
    }
});
const dbService = () => {
    const authenticateDB = () => database.authenticate();

    const syncDB = () => database.sync().then(async (res) => {
    }).catch((error) => {
        console.log(error);
    });

    const successfulDBStart = () => (
        console.info('connection to the database has been established successfully')
    );

    const errorDBStart = (err) => (
        console.info('unable to connect to the database:', err)
    );

    const startMigrateTrue = async () => {
        try {
            await syncDB();
            successfulDBStart();
        } catch (err) {
            errorDBStart(err);
        }
    };

    const startProd = async () => {
        try {
            await authenticateDB();
            await startMigrateTrue();
        } catch (err) {
            errorDBStart(err);
        }
    };

    const start = async () => {
        await startProd();
    };

    return {
        start,
    };
};

module.exports = dbService;
