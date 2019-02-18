require('dotenv').config({ path: 'credentials.env' });

const requireProcessEnv = (name) => {
    if (!process.env[name]) {
      throw new Error('You must set the ' + name + ' environment variable')
    }
    return process.env[name]
}

const config = {
    masterUsername: requireProcessEnv('USERNAME'),
    masterPassword: requireProcessEnv('PASSWORD')
}

module.exports = config;