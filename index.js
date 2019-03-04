const express = require('express');
const path = require('path');
const proxy = require('http-proxy-middleware');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { signSync }  = require('./jwt');
const { password, token, passport, refresh } = require('./passport');
const config = require('./config');
const ms  = require('ms');
 
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

app.get('/logout', (req, res, next) => {
  res.cookie('access_token', '');
  res.redirect('/')
})


app.post('/login', password(), (req, res, next) => {
    const token = signSync(req.user.username, {expiresIn: config.expirationTime});
    res.cookie('access_token', token)
    res.redirect('/')
})
function onOpen(proxySocket) {
  let time;
  // listen for messages coming FROM the target here
  proxySocket.on('data', function(data) {
    if(data.length > 100){
      clearTimeout(time);
      time = setTimeout(() => {
        proxySocket.destroy();
      }, Math.round(ms(config.expirationTime)));
    }
  })
}

var wsProxy = proxy('/services', {
    target: 'http://0.0.0.0:3000',
    changeOrigin: true,
    ws: true, 
    logLevel: 'debug',
    onOpen: onOpen
})

app.use(wsProxy)
app.use('*', token(), proxy({ target: 'http://0.0.0.0:3000', changeOrigin: true }))
let server = app.listen(4000)
server.on('upgrade', wsProxy.upgrade)
