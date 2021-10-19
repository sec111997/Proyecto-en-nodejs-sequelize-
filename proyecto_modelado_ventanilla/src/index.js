const express=require('express');
const session = require('express-session');
const app = express();


//

app.use(express.urlencoded({extended:false}));

app.use(express.json());

//*routes
app.use(session({
    secret: "123",
    saveUninitialized: true,
    resave: true,

  }));
  app.use(function(req, res, next) {
    res.locals.login = req.session.login;
    next();
  });
app.use(require("./routes/routes"));

app.set('view engine','ejs');
app.set('views',__dirname+'/views');

// Access the session as req.session

  


app.use(express.static('public'));

app.listen(3000,()=>{
    console.log("servidor corriendo");
});

module.exports={
    app,
    session
}