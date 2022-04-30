const Sequelize = require('sequelize');

const sequelize = new Sequelize('node_mysql', 'root', 'ows@1234', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;