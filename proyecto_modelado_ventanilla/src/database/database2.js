const { Sequelize } = require('sequelize');
const sequelize2 = new Sequelize('Cajero3'
, 'postgres'
, '18062014', {
    host: 'localhost',
    dialect: 'postgres'
  });
  
  module.exports={sequelize2};