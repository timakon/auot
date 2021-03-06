const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const config = require('./config');
const mongoose = require('mongoose');
const routes = require('./routes');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

//database
var debuger = true;
mongoose.Promise = global.Promise;
    mongoose.set('debug', debuger);//TODO Переключить на false при продакшине

    mongoose.connection
        .on('error', error => console.log(error))
        .on('close', () => console.log('Database connection closed.'))
        .once('open', () => {
            const info = mongoose.connections[0];
            console.log(`Connected to ${info.host}:${info.port}/${info.name}`);
        });

    mongoose.connect(config.MONGO_URL, { useNewUrlParser: true﻿});
// express
 const app = express();

//session
 app.use(
     session({
         secret:config.SESSION_SECRET,
         resave: true,
         saveUninitialized:false,
         store: new MongoStore({ mongooseConnection: mongoose.connection
         })
     })
 )


//sets and uses
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/javascripts', express.static(path.join(__dirname, 'node_modules', 'jquery', 'dist')))

// routers
app.get('/', (req, res) =>{
    res.render('landing')
});
app.get('/user', (req, res) =>{
    const id = req.session.userId;
    const login = req.session.userLogin;
    if(id){
        res.render('user',{
            user:{
                id,
                login
            }
        })
    }else{
        res.render('error', {
            message: error.message,
            error: !debuger ? error : {}
        });
    }
});

app.get('/auth', (req, res) =>{
    const id = req.session.userId;
    const login = req.session.userLogin;
    res.render('input',{
        user:{
            id,
            login
        }
    })
});

app.use('/auth', routes.auth)
app.use('/landing', routes.landing)

 //catch 404 page
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    console.log(debuger )
    res.render('error', {
        message: error.message,
        error: !debuger ? error : {}
    });
});

app.listen(config.PORT, () =>
    console.log(`Example app listening on port ${config.PORT}!`)
);