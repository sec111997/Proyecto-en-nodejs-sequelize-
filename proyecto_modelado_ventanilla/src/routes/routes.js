const { Router } = require("express");
const router=Router();
const {session} = require('../index');
var moment = require('moment');
const app= require('../index');
const { body} = require('express-validator');
const { getUsers, createUsers, createcuenta, createtarjeta, getlogin, setRetiro } = require("../controllers/index.controller");



router.get('/',(req,res)=>{
    if (!req.session.login) {
    res.render("login",{msg:"esto es un mensaje"});
    }
});
router.get('/inicio',(req,res)=>{
    if (req.session.login) {
    res.render("index",{msg:"esto es un mensaje"});
    }else{
        res.redirect('/');
    }
});
router.get('/transaccion',(req,res)=>{
    if (req.session.login) {
    res.render("transaccion",{msg:"esto es un mensaje"});
    }else{
        res.redirect('/');
    }
});


//window.location
router.get('/registrarcuenta',(req,res)=>{
    if (req.session.login) {
        res.render("cuenta",{msg:"esto es un mensaje",moment:moment});
    }else{
        res.redirect('/');
    }
});
router.get('/registrartarjeta',(req,res)=>{
    if (req.session.login) {
    res.render("tarjeta",{msg:"esto es un mensaje",moment:moment});
    }else{
        res.redirect('/');
    }
});

  router.get('/logout',(req,res)=>{
    req.session.destroy(function (err) {
      res.redirect('/'); //Inside a callback… bulletproof!
     });
  })
  
    // redirect to homepage

  
router.post('/tarjeta', 
body('cuenta')
.isNumeric().withMessage('La cuenta debe ser numeros')
.notEmpty().withMessage('La cuenta no debe estar vacia')
,
body('contrasena')
.notEmpty().withMessage('La contraseña esta vacia')
,
createtarjeta);

router.post('/cuenta',
body('cliente')
.notEmpty().withMessage('La cedula no puede estar vacia')
.isNumeric().withMessage('La cedula solo pueden estar numeros')
,
body('saldo')
.notEmpty().withMessage('El campo saldo no puede estar vacia')
.isNumeric().withMessage('El saldo debe ser numeros')
,createcuenta);
router.get('/users', getUsers);
router.post('/users',
body('nombre')
.notEmpty().withMessage('El campo nombre no puede estar vacia')
,
body('apellido')
.notEmpty().withMessage('El campo apellido no puede estar vacia')
,
body('cedula')
.notEmpty().withMessage('El campo cedula no puede estar vacia')
.isNumeric().withMessage('El campo cedula solo puede ser numeros')
,//nacimiento
body('telefono')
.isNumeric().withMessage('El telefono solo puede ser numeros')
.notEmpty().withMessage('El campo telefono no puede estar vacia')
,
body('nacimiento')
.isDate().withMessage('No contiene un formato valido de fechas')
.notEmpty().withMessage('El campo nacimiento no puede estar vacia')
,createUsers);
router.post('/login',  
// validacion tarjeta
body('tarjeta')
.isNumeric().withMessage('El id de la tarjeta debe ser numeros')
.notEmpty().withMessage('El campo id de la tarjeta esta vacio')
,  // validacion contraseña
body('contrasena')
.notEmpty().withMessage('El campo de contraseña esta vacio')
, getlogin);
router.post('/transaccion',
body('saldo')
.isNumeric().withMessage('El retiro debe ser numeros')
.notEmpty().withMessage('El retiro esta vacio')
,setRetiro);

module.exports = router;