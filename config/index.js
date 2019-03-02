require('dotenv').config({ path: '.env' });

const requireProcessEnv = (name) => {
    if (!process.env[name]) {
      throw new Error('You must set the ' + name + ' environment variable')
    }
    return process.env[name]
}

const config = {
    masterUsername: requireProcessEnv('MYUSER'),
    masterPassword: requireProcessEnv('PASSWORD'),
    expirationTime: requireProcessEnv('EXP_TIME'),
    timeBeforeExpiration: requireProcessEnv('PROPAGATE_EXP_TIME'),
    jwtSecret: 'elonMask'
}

module.exports = config;