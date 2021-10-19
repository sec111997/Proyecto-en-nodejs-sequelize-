const { sequelize }= require('../database/database');
const { Sequelize } = require('sequelize');
const { cuentaBancaria } = require('../models/cuentaBancaria');
const tarjetaBancaria = sequelize.define('tarjeta',{
  id_tarjeta: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true // Automatically gets converted to SERIAL for postgres
  }
  ,
  id_cuentabancaria: {
    type: Sequelize.INTEGER,
    references: {
    model: cuentaBancaria ,

      // This is the column name of the referenced model
      key: 'id_cuentabancaria',

      // With PostgreSQL, it is optionally possible to declare when to check the foreign key constraint, passing the Deferrable type.
    }
  }
  ,
  contrasena_tarjeta: {
    type: Sequelize.STRING,
  },
  fechacreacion_tarjeta: {
    type: Sequelize.DATE,
  }

  
}, {
  timestamps: false
});

  sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully!');
  }).catch((err) => {
    console.log('Can\'t establish database connection:\n' + err);
  });

module.exports={ tarjetaBancaria }