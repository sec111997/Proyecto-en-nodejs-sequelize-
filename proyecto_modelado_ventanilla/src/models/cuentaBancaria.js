const { sequelize }= require('../database/database');
const { Sequelize } = require('sequelize');
const { usuarioModel } = require('../models/usuario');
const cuentaBancaria = sequelize.define('cuenta_bancaria',{
  id_cuentabancaria: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true // Automatically gets converted to SERIAL for postgres
  }
  ,
  id_cliente: {
    type: Sequelize.INTEGER,
    references: {
    model: usuarioModel ,

      // This is the column name of the referenced model
      key: 'id_cliente',

      // With PostgreSQL, it is optionally possible to declare when to check the foreign key constraint, passing the Deferrable type.
    }
  }
  ,
  tipo_cuentabancaria: {
    type: Sequelize.STRING,
  },
  fechacreacion_cuentabancaria: {
    type: Sequelize.DATE,
  }
  ,
  saldo_cuentabancaria: {
    type: Sequelize.DOUBLE,
  }
  
}, {
  timestamps: false,
  freezeTableName: true
});

  sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully!');
  }).catch((err) => {
    console.log('Can\'t establish database connection:\n' + err);
  });

module.exports={ cuentaBancaria }