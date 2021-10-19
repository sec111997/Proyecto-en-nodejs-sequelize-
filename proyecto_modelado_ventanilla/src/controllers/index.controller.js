const { usuarioModel } = require('../models/usuario');
var moment = require('moment');
const {Op} = require('sequelize');
const { cuentaBancaria } = require('../models/cuentaBancaria');
const { validationResult } = require('express-validator');
const { tarjetaBancaria } = require('../models/tarjeta');
const { retiroBancario } = require('../models/retiro');
const {verificacion, app }= require("../index");
const { sequelize } = require('../database/database');
const {session} = require('../index');


//*Se buscara un usuario
usuarioModel.hasMany(cuentaBancaria, {as: "cuentas", foreignKey: "id_cliente"});
cuentaBancaria.hasMany(tarjetaBancaria, {as: "tarjetas", foreignKey: "id_cuentabancaria"});
usuarioModel.hasMany(retiroBancario, {as: "retiros", foreignKey: "id_cliente"});
cuentaBancaria.hasMany(tarjetaBancaria, {as: "retiros", foreignKey: "id_cuentabancaria"});
const getUsers= async (req,res) => { 
    const{ cedula } =req.body
    await usuarioModel.findOne({attributes:["id_cliente"], where: { cedula_cliente: cedula } })
    .then(usuarios =>{
        const resultados = JSON.stringify(usuarios)
        console.log(usuarios.id_cliente)
        res.json(usuarios);
        //const resultados = usuarios.id_cliente;
       
    })
    .catch(error =>{
        console.log(error)
        res.json({
            message: "No existen usuarios",  
          })
    })
};

const createUsers= async (req,res) => { 
    const errors = validationResult(req);
    const { nombre, apellido, cedula, telefono, nacimiento,sexo}= req.body;
    if (!errors.isEmpty()) {
        const validaciones = errors.array()
        console.log(errors);
        return res.render("index",{moment: moment,validaciones: validaciones});
    }else{
        
    if(sexo=='Masculino' ||  tipo =='Femenino'){

        
     usuarioModel.create({nombre_cliente: nombre,
        apellido_cliente: apellido,
        cedula_cliente: cedula,
        telefono_cliente: telefono,
        fechanacimiento_cliente: nacimiento,
        sexo_cliente: sexo
    }, { fields: ['nombre_cliente','apellido_cliente',
                    'cedula_cliente','telefono_cliente',
                    'fechanacimiento_cliente',
                    'sexo_cliente'] })
     .then(() =>{
        res.locals.login = req.session.login;
        res.render("index",{msgcreacion: "usuario creado"});
     })
     .catch(error =>{
         console.log(error)
         res.json({
             message: "No crear usuario",  
           })
     })
    }else{
        return res.render("index",{
            registrado: 'Genero incorrecto'});
     }
     }
};

const createcuenta= async (req,res) => { 
    const errors = validationResult(req);
    const { cliente, tipo, fecha, saldo}= req.body;
    
    if (!errors.isEmpty()) {
        const validaciones = errors.array()
        console.log(errors);
        return res.render("cuenta",{moment: moment,validaciones: validaciones});
    }else{
    if(tipo=='Corriente' ||  tipo =='Ahorros'){
    const resultado=await usuarioModel.findOne({where: { cedula_cliente: cliente } });
    cuentaBancaria.create({
        id_cliente: resultado.id_cliente,
        tipo_cuentabancaria: tipo,
        fechacreacion_cuentabancaria: fecha,
        saldo_cuentabancaria: saldo
    }, { fields: ['id_cliente','tipo_cuentabancaria',
                    'fechacreacion_cuentabancaria','saldo_cuentabancaria',
                    
                    ] })
     .then(() =>{
        
        res.locals.login = req.session.login;
        res.render("cuenta",{
            moment: moment,registrado: 'cuenta registrada'});
     })
     .catch(error =>{
         console.log(error)
         res.json({
             message: "No crear cuenta"+ resultado.id_cliente,  
           })
     })  

   
     }else{
        return res.render("cuenta",{
            moment: moment,registrado: 'Tipo de cuenta incorrecta'});
     }
   
     
    }
     
}; 
const createtarjeta= async (req,res) => { 
    const errors = validationResult(req);
    const { cuenta, contrasena, fecha}= req.body;
    
    if (!errors.isEmpty()) {
        const validaciones = errors.array()
        console.log(errors);
        return res.render("tarjeta",{moment: moment,validaciones: validaciones});
    }else{
   
    const resultado=await cuentaBancaria.findOne({where: { id_cuentabancaria: cuenta } });
    console.log(resultado);
    tarjetaBancaria.create({
        id_cuentabancaria: resultado.id_cuentabancaria,
        contrasena_tarjeta: contrasena,
        fechacreacion_tarjeta: fecha
    }, { fields: ['id_cuentabancaria','contrasena_tarjeta',
                    'fechacreacion_tarjeta',
                    
                    ] })
     .then(() =>{
        res.locals.login = req.session.login;
        return res.render("tarjeta",{moment: moment,registrado: 'tarjeta registrada'});
     })
     .catch(error =>{
         console.log(error)
         res.json({
             message: "No crear cuenta"+ resultado.id_cuentabancaria,  
           })
     })  
     
    }
     
}; 
const getlogin= async (req,res) => { 
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const validaciones = errors.array()
      console.log(errors);
      res.render('login', {validaciones: validaciones, ahora:'mensaje'})
    }else{
    const { tarjeta, contrasena}= req.body;

    await tarjetaBancaria.findOne({attributes:["id_cuentabancaria", "id_tarjeta"], where: { id_tarjeta: tarjeta ,contrasena_tarjeta:contrasena} })
    .then(usuarios =>{
        req.session.login=true;
        //console.log(usuarios.id_cliente)
        //res.json(usuarios);
        //const resultados = usuarios.id_cliente;
        
        res.locals.login = req.session.login;
        return res.render("transaccion",{msgcuenta: usuarios.id_cuentabancaria,
            moment: moment});
       
    })
    .catch(error =>{
        console.log(error)
        res.json({
            message: "No existen usuarios",  
          })
    })
    }
}; 
const setRetiro= async (req,res) => { 
    const errors = validationResult(req);
    const { cuenta, cajero, saldo, fecha, tipo}= req.body;
    console.log("---------------------------------------------------")
    if (!errors.isEmpty()) {
        const validaciones = errors.array()
        console.log(errors);
        return res.render("transaccion",{msgcuenta: req.body.cuenta,
            moment: moment,validaciones: validaciones});
    }else{
    
    if(tipo=='Retiro' ||  tipo =='Deposito'){
    datos=(JSON.stringify(req.body));
    const resultado=await cuentaBancaria.findOne({where: { id_cuentabancaria: cuenta } });
    console.log("---------------------------------------------------")
    console.log(saldo);
    var currency = resultado.saldo_cuentabancaria;
    console.log(currency)

    var saldobancario = currency
    console.log(saldobancario);
    var saldo2=saldo;
    if(tipo!='Retiro'){
        saldo2=saldo * -1;
    }
    var resultadoa=1;
    await cuentaBancaria.update({ saldo_cuentabancaria: (saldobancario-saldo2) }, {
        where: {
            id_cuentabancaria: cuenta,
            saldo_cuentabancaria: {
            [Op.gte]: saldo2,
            }
        }
      })
    .then(result => {
        if(result==0){
        resultadoa=0;
        return res.render("transaccion",{msgcuenta: cuenta,
            moment: moment,registradoretiro: 'Lo lamentamos su retiro es mas alto de lo que tiene'});
        }
      }) 
    if(resultadoa==1){
    const cliente = resultado.id_cliente;
    await retiroBancario.create({
        id_cuentabancaria: cuenta,
        id_cliente: cliente,
        id_cajero: cajero,
        fecha_transaccion: fecha,
        tipo_transaccion: tipo,
        cantidad_transaccion:saldo
    }, { fields: ['id_cuentabancaria','id_cliente',
                    'id_cajero','fecha_transaccion',
                    'cantidad_transaccion','tipo_transaccion'
                    
                    ] })
     .then(() =>{
        return res.render("transaccion",{msgcuenta: cuenta,
            moment: moment,registradoretiro: 'Transaccion registrada'});
     })
     .catch(error =>{
         console.log(error)
         res.json({
             message: "No crear cuenta"+ resultado.id_cuentabancaria,  
           })
     }) 

     }
     }else{
        return res.render("transaccion",{msgcuenta: cuenta,
            moment: moment,registrado: 'Tipo de transaccion incorrecta'});
     }
     }
}; 
module.exports = {
    getUsers,
    createUsers,
    createcuenta,
    createtarjeta,
    getlogin,
    setRetiro
}