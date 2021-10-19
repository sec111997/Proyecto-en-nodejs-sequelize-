const { sequelize }= require('../database/database');
const { Sequelize } = require('sequelize');
const { cuentaBancaria } = require('./cuentaBancaria');
const { usuarioModel } = require('../models/usuario');
const retiroBancario = sequelize.define('transaccion',{
  id_transaccion: {
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
  },
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
  id_cajero: {
    type: Sequelize.INTEGER,
  },
  fecha_transaccion: {
    type: Sequelize.DATE,
  },
  cantidad_transaccion: {
    type: Sequelize.DOUBLE,
  },
  tipo_transaccion: {
    type: Sequelize.Sequelize.STRING,
  }

  
}, {
  timestamps: false,
  freezeTableName: true,
});

  sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully!');
  }).catch((err) => {
    console.log('Can\'t establish database connection:\n' + err);
  });

module.exports={ retiroBancario }