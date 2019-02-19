
const jwt = require('jsonwebtoken');
const {promisify} = require("es6-promisify");
const { jwtSecret } = require('../../config');

const jwtSign = promisify(jwt.sign)
const jwtVerify = promisify(jwt.verify)

export const sign = (id, options, method = jwtSign) =>
  method({ id }, jwtSecret, options)

export const signSync = (id, options) => sign(id, options, jwt.sign)

export const verify = (token) => jwtVerify(token, jwtSecret)
