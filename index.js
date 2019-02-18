const express = require('express');
const proxy = require('http-proxy-middleware');

require('dotenv').config({ path: 'credentials.env' });
 
const app = express();
 
app.use('*', proxy({ target: 'http://localhost:8080', changeOrigin: true }))
app.listen(3000)