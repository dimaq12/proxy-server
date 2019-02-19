
const jwt = require('jsonwebtoken');
const {promisify} = require("es6-promisify");
const config = require('../config');

const jwtSign = promisify(jwt.sign)
const jwtVerify = promisify(jwt.verify)

exports.sign = (user, options, method = jwtSign) =>
  method({ user }, jwtSecret, options)

exports.signSync = (user, options) => sign(user, options, jwt.sign)

exports.verify = (token) => jwtVerify(token, config.jwtSecret)
