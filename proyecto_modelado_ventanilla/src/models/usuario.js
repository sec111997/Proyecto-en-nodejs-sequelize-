const { sequelize }= require('../database/database');
const { Sequelize } = require('sequelize');
const usuarioModel = sequelize.define('clientes',{
  id_cliente: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true // Automatically gets converted to SERIAL for postgres
  },
  nombre_cliente: {
    type: Sequelize.STRING,
  },
  apellido_cliente: {
    type: Sequelize.STRING,
  }
  ,
  cedula_cliente: {
    type: Sequelize.STRING,
  }
  ,
  telefono_cliente: {
    type: Sequelize.STRING,
  }
  ,
  fechanacimiento_cliente: {
    type: Sequelize.DATE,
  }
  ,
  sexo_cliente: {
    type: Sequelize.STRING,
  }
  
}, {
  timestamps: false
});

  sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully!');
  }).catch((err) => {
    console.log('Can\'t establish database connection:\n' + err);
  });

module.exports={ usuarioModel }