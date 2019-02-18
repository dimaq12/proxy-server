const express = require('express');
const path = require('path');
const proxy = require('http-proxy-middleware');
const bodyParser = require('body-parser');

require('dotenv').config({ path: 'credentials.env' });
 
const app = express();
 

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('*', proxy({ target: 'http://localhost:8080', changeOrigin: true }))
app.listen(3000)