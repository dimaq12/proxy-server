
const jwt = require('jsonwebtoken');
const { promisify } = require("es6-promisify");
const config = require('../config');

const jwtSign = promisify(jwt.sign)

const sign = (user, options, method = jwtSign) =>
  method({ user }, config.jwtSecret, options)

exports.signSync = (user, options) => sign(user, options, jwt.sign)

