const express = require('express');
const path = require('path');
const proxy = require('http-proxy-middleware');
const bodyParser = require('body-parser');

const { password, token, passport } = require('./passport');
 
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(passport.initialize());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
 

app.get('/login', (req, res) => {
	res.render('login');
})

app.post('/login', password())


//app.use('*', token(), proxy({ target: 'http://localhost:8080', changeOrigin: true }))
app.listen(3000)