const express = require('express');
const path = require('path');
const proxy = require('http-proxy-middleware');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { signSync }  = require('./jwt');
const { password, token, passport } = require('./passport');
const config = require('./config');
 
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(passport.initialize());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
 

app.get('/login', (req, res) => {
	res.render('login');
})

app.post('/login', password(), (req, res, next) => {
    const token = signSync(req.user.username, {expiresIn: config.expirationTime});
    res.cookie('access_token', token)
    res.redirect('/')
})

var wsProxy = proxy('/services', {
    target: 'http://0.0.0.0:3000',
    changeOrigin: true,
    ws: true, 
    logLevel: 'debug'
})

app.use(wsProxy)
app.use('*', token(), proxy({ target: 'http://0.0.0.0:3000', changeOrigin: true }))
app.listen(4000)