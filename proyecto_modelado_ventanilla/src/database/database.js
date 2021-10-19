const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('cajero'
, 'root'
, '', {
    host: '127.0.0.1',
    dialect: 'mariadb'
  });
  
  module.exports={sequelize};